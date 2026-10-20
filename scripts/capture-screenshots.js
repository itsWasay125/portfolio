import { chromium } from 'playwright';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { projects } from '../src/portfolioData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.resolve(__dirname, '../public/projects');
const FORCE_RECAPTURE = process.argv.includes('--force');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Selectors for common cookie banners, GDPR notices, and popups
const DISMISS_SELECTORS = [
  '#onetrust-accept-btn-handler',
  'button#accept-cookies',
  'button.accept-cookies',
  'button[id*="cookie" i]',
  'button[class*="cookie" i]',
  'button[aria-label*="cookie" i]',
  'button:has-text("Accept All")',
  'button:has-text("Accept cookies")',
  'button:has-text("Accept All Cookies")',
  'button:has-text("Allow All")',
  'button:has-text("Allow all cookies")',
  'button:has-text("I Agree")',
  'button:has-text("Agree")',
  'button:has-text("Got it")',
  'button:has-text("Dismiss")',
  'button:has-text("Continue")',
  '[aria-label="Close"]',
  '[aria-label="close"]',
  '.modal-close',
  '.popup-close',
  '.close-button',
  '.cm__btn--accept'
];

async function dismissPopups(page) {
  try {
    for (const selector of DISMISS_SELECTORS) {
      const element = await page.$(selector);
      if (element) {
        const isVisible = await element.isVisible().catch(() => false);
        if (isVisible) {
          await element.click({ timeout: 1500 }).catch(() => {});
          await page.waitForTimeout(300);
          break;
        }
      }
    }
  } catch {
    // Non-critical, continue
  }
}

async function launchBrowser() {
  const launchOptions = [
    { channel: 'chrome', headless: true },
    { channel: 'msedge', headless: true },
    { headless: true }
  ];

  for (const opt of launchOptions) {
    try {
      const browser = await chromium.launch(opt);
      console.log(`Launched browser using: ${opt.channel || 'bundled chromium'}`);
      return browser;
    } catch {
      // try next
    }
  }
  throw new Error('Could not launch any Chromium-based browser.');
}

async function captureScreenshots() {
  console.log(`\n========================================`);
  console.log(`Starting Portfolio Screenshot Capture`);
  console.log(`Total projects: ${projects.length}`);
  console.log(`Force recapture: ${FORCE_RECAPTURE}`);
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log(`========================================\n`);

  const browser = await launchBrowser();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    deviceScaleFactor: 1
  });

  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    const slug = project.id;
    const outputPath = path.join(OUTPUT_DIR, `${slug}.webp`);
    const progress = `[${i + 1}/${projects.length}]`;

    if (fs.existsSync(outputPath) && !FORCE_RECAPTURE) {
      console.log(`${progress} [SKIP] ${slug}.webp already exists (use --force to recapture).`);
      skipCount++;
      continue;
    }

    console.log(`${progress} [PROCESSING] ${project.title} -> ${project.url}`);

    // Create a fresh page for each site to prevent cross-site navigation collisions
    const page = await context.newPage();

    try {
      page.setDefaultNavigationTimeout(25000);

      // Navigate with 'commit' so response streaming starts immediately
      await page.goto(project.url, {
        waitUntil: 'commit',
        timeout: 20000
      });

      // Allow DOM to build
      await page.waitForLoadState('domcontentloaded', { timeout: 8000 }).catch(() => {});

      // Allow network requests to settle if fast
      await page.waitForLoadState('networkidle', { timeout: 4000 }).catch(() => {});

      // 2 seconds buffer wait for dynamic renders/fonts/styles
      await page.waitForTimeout(2000);

      // Attempt to dismiss cookie banners and modals
      await dismissPopups(page);

      // Capture top-of-page screenshot (viewport height 900px)
      let pngBuffer;
      try {
        pngBuffer = await page.screenshot({
          fullPage: false,
          timeout: 8000,
          animations: 'disabled'
        });
      } catch {
        // Fallback to CDP capture if standard screenshot hangs on web fonts
        const client = await page.context().newCDPSession(page);
        const { data } = await client.send('Page.captureScreenshot', {
          format: 'png',
          clip: { x: 0, y: 0, width: 1440, height: 900, scale: 1 }
        });
        pngBuffer = Buffer.from(data, 'base64');
      }

      // Resize to 1200px width and convert to WebP
      await sharp(pngBuffer)
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(outputPath);

      console.log(`  ✓ Successfully captured and saved: /public/projects/${slug}.webp`);
      successCount++;
    } catch (err) {
      console.error(`  ✗ [FAILED] ${project.title} (${project.url}): ${err.message}`);
      failCount++;
    } finally {
      await page.close().catch(() => {});
    }
  }

  await browser.close();

  console.log(`\n========================================`);
  console.log(`Capture Summary:`);
  console.log(`  ✓ Captured: ${successCount}`);
  console.log(`  ↷ Skipped:  ${skipCount}`);
  console.log(`  ✗ Failed:   ${failCount}`);
  console.log(`========================================\n`);
}

captureScreenshots().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
