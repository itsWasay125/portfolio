import React, { useState, useEffect, useMemo } from 'react';
import {
  personalInfo,
  categories,
  projects,
  aboutProfiles,
  skillsList,
  experiences,
  testimonials,
  photos
} from './portfolioData';
import { TechIcon } from './components/TechIcons';
import {
  Mail,
  ExternalLink,
  Search,
  Check,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ArrowUpRight,
  Sparkles,
  Send,
  Eye,
  Star,
  MapPin,
  Building,
  PhoneCall
} from 'lucide-react';

// Crisp official LinkedIn SVG
const LinkedInIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
  >
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45c-.9 0-1.63.73-1.63 1.63s.73 1.63 1.63 1.63 1.63-.73 1.63-1.63c0-.9-.73-1.63-1.63-1.63Z" />
  </svg>
);

// WhatsApp SVG
const WhatsAppIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
  >
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm0 18.14c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.17 8.17 0 0 1-1.25-4.37c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.22-8.23 8.22zm4.52-6.17c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.98-.14.17-.29.19-.54.07-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.84-.86 2.05s.88 2.38 1 2.54c.12.17 1.73 2.64 4.19 3.7.59.25 1.05.4 1.41.51.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.18-.47-.3z" />
  </svg>
);

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  // Default hero pose is the suit jacket adjustment pose as requested
  const [testIndex, setTestIndex] = useState(0);
  const [isTestimonialTransitioning, setIsTestimonialTransitioning] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(9);

  // Agency CMS Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'WordPress & WooCommerce',
    budget: '$1,000 - $3,000',
    timeline: 'Standard (2-4 Weeks)',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Section observer for active indicator dot
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'projects', 'skills', 'testimonials', 'contact'];
      const scrollY = window.scrollY;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop - 180;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter projects by category and search query
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.platform.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Handle contact copy email
  const copyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  // Handle contact submit
  const handleContactSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 6000);
    }, 700);
  };

  // Testimonial single-card slider handlers with fluid transition
  const nextTestimonial = () => {
    setIsTestimonialTransitioning(true);
    setTimeout(() => {
      setTestIndex((prev) => (prev + 1) % testimonials.length);
      setIsTestimonialTransitioning(false);
    }, 180);
  };

  const prevTestimonial = () => {
    setIsTestimonialTransitioning(true);
    setTimeout(() => {
      setTestIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
      setIsTestimonialTransitioning(false);
    }, 180);
  };

  const handleDotClick = (idx) => {
    if (idx === testIndex) return;
    setIsTestimonialTransitioning(true);
    setTimeout(() => {
      setTestIndex(idx);
      setIsTestimonialTransitioning(false);
    }, 180);
  };

  const currentTest = testimonials[testIndex];

  return (
    <div className="app">
      {/* =========================================================
          NAVBAR
         ========================================================= */}
      <nav className="app__navbar" id="navbar">
        <div className="app__navbar-logo">
          <a href="#home" className="app__navbar-logo-container">
            abdul <span>wasay</span>
          </a>
        </div>

        <ul className="app__navbar-links">
          {['home', 'about', 'projects', 'skills', 'testimonials', 'contact'].map((item) => (
            <li
              key={`link-${item}`}
              className={activeSection === item ? 'active' : ''}
            >
              <a href={`#${item}`}>{item}</a>
            </li>
          ))}
        </ul>

        <div className="app__navbar-actions">
          <a href="#contact" className="app__navbar-btn">
            <span>Let's Talk</span>
            <ArrowUpRight size={15} />
          </a>

          <div
            className="app__navbar-menu"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open mobile menu"
          >
            <Menu size={20} />
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <>
          <div
            className="app__navbar-drawer-backdrop"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="app__navbar-drawer">
            <div className="app__navbar-drawer-header">
              <div className="app__navbar-logo-container">
                abdul <span>wasay</span>
              </div>
              <div
                className="app__navbar-drawer-close"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X size={20} />
              </div>
            </div>

            <ul>
              {['home', 'about', 'projects', 'skills', 'testimonials', 'contact'].map((item) => (
                <li
                  key={`mobile-${item}`}
                  className={activeSection === item ? 'active' : ''}
                >
                  <a
                    href={`#${item}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
              <a
                href={personalInfo.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="app__navbar-btn"
                style={{ width: '100%', justifyContent: 'center', background: '#25D366' }}
              >
                WhatsApp: {personalInfo.phone}
              </a>
            </div>
          </div>
        </>
      )}

      {/* =========================================================
          FIXED SIDE SOCIALS (Left) - Git removed as requested
         ========================================================= */}
      <div className="app__social">
        <a
          href={personalInfo.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="app__social-link whatsapp-social"
          aria-label="Chat on WhatsApp (03112299947)"
          title="WhatsApp: 03112299947"
        >
          <WhatsAppIcon size={18} />
        </a>

        <a
          href={personalInfo.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="app__social-link"
          aria-label="LinkedIn Profile"
          title="LinkedIn"
        >
          <LinkedInIcon size={17} />
        </a>

        <a
          href={`mailto:${personalInfo.email}`}
          className="app__social-link"
          aria-label="Send Email"
          title="Email"
        >
          <Mail size={17} />
        </a>

        <a
          href={`tel:${personalInfo.phone}`}
          className="app__social-link"
          aria-label="Call Direct"
          title={`Call: ${personalInfo.phone}`}
        >
          <PhoneCall size={16} />
        </a>

        <div className="app__social-line" />
      </div>

      {/* =========================================================
          FIXED SIDE DOT NAVIGATION (Right)
         ========================================================= */}
      <div className="app__navigation">
        {['home', 'about', 'projects', 'skills', 'testimonials', 'contact'].map((item) => (
          <a
            key={`dot-${item}`}
            href={`#${item}`}
            className={`app__navigation-dot ${activeSection === item ? 'active' : ''}`}
            aria-label={`Jump to ${item}`}
          >
            <span className="app__navigation-tooltip">{item}</span>
          </a>
        ))}
      </div>

      {/* =========================================================
          HERO SECTION (#home)
         ========================================================= */}
      <section id="home" className="app__container">
        <div className="app__header">
          {/* Left Column: Greeting, Badge, CTAs, Pose Switcher */}
          <div className="app__header-info">
            <div className="app__header-badge">
              <div className="badge-cmp">
                <span className="badge-wave">👋</span>
                <div className="badge-text-col">
                  <p className="badge-greeting">Hello, I am</p>
                  <h1 className="badge-name">Abdul Wasay</h1>
                </div>
              </div>

              <div className="tag-cmp">
                <p className="tag-primary">Front-End Developer &amp; CMS Specialist</p>
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Building size={14} style={{ color: 'var(--secondary-color)' }} />
                  <span>1.5+ Years Experience @ Opus Geeks</span>
                </p>
                <p style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>
                  ● 70+ Delivered Client Stores &amp; Portals
                </p>
              </div>

              <div className="hero-cta-row">
                <a href="#projects" className="btn-primary-hero">
                  <span>Explore My Work</span>
                  <ArrowUpRight size={17} />
                </a>

                <a 
                  href={personalInfo.whatsapp}
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn-whatsapp-hero"
                >
                  <WhatsAppIcon size={18} />
                  <span>0311 2299947</span>
                </a>
              </div>
            </div>
          </div>

          {/* Left Floating Circles (Shopify & WordPress with crisp official SVGs) */}
          <div className="app__header-circles2">
            <div className="circle-cmp circle-lg float-1" title="Shopify & Liquid">
              <div className="circle-icon-box">
                <TechIcon name="shopify" size={54} />
              </div>
              <span className="circle-label" style={{ color: '#5e8e3e' }}>Shopify</span>
            </div>

            <div className="circle-cmp circle-sm float-2" title="WordPress & WooCommerce">
              <div className="circle-icon-box">
                <TechIcon name="wordpress" size={44} />
              </div>
              <span className="circle-label" style={{ color: '#21759b' }}>WordPress</span>
            </div>
          </div>

          {/* Center Column: Portrait in Arched Frame + Glow Circle */}
          <div className="app__header-img">
            <div className="app__header-img-wrapper">
              {/* Background circular overlay ring */}
              <img
                src="/circle.svg"
                alt="Backdrop Circle"
                className="overlay_circle"
              />

              {/* Portrait Frame using suit jacket adjustment pose */}
              <div className="hero-portrait-frame">
                <img
                  src={photos.portrait}
                  alt="Abdul Wasay - Front-End & CMS Specialist at Opus Geeks"
                  loading="eager"
                />

                <div className="hero-live-badge">
                  <span className="status-dot-pulse" />
                  <span>Front-End Specialist @ Opus Geeks</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Floating Circles (Wix Studio, React, TypeScript) */}
          <div className="app__header-circles">
            <div className="circle-cmp circle-lg float-1" title="Wix Studio Builds">
              <div className="circle-icon-box">
                <TechIcon name="wix" size={52} />
              </div>
              <span className="circle-label" style={{ color: '#4f46e5' }}>Wix Studio</span>
            </div>

            <div className="circle-cmp circle-sm float-2" title="React.js Components">
              <div className="circle-icon-box">
                <TechIcon name="react" size={42} />
              </div>
              <span className="circle-label" style={{ color: '#0284c7' }}>React.js</span>
            </div>

            <div className="circle-cmp circle-sm float-3" title="TypeScript & Modern JS">
              <div className="circle-icon-box">
                <TechIcon name="typescript" size={40} />
              </div>
              <span className="circle-label" style={{ color: '#3178c6' }}>TypeScript</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          ABOUT SECTION (#about) - Poses removed from cards as requested
         ========================================================= */}
      <section id="about" className="app__container app__whitebg">
        <div className="app__wrapper">
          <h2 className="head-text">
            I Know that <span>Good Websites</span><br />means Good Business
          </h2>
          <p className="head-subtext">
            Specializing in high-performance CMS engineering, bespoke theme architectures, and pixel-perfect front-end execution at Opus Geeks.
          </p>

          {/* 4 Professional Service Cards with Tech Badges (NO pose photos on cards) */}
          <div className="app__profiles">
            {aboutProfiles.map((item) => (
              <div className="service-card" key={item.id}>
                <div 
                  className="service-card-header" 
                  style={{ 
                    background: `${item.color}12`, 
                    borderBottom: `2px solid ${item.color}35` 
                  }}
                >
                  <div 
                    className="service-card-icon-wrap" 
                    style={{ background: '#ffffff', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}
                  >
                    <TechIcon name={item.icon} size={36} />
                  </div>
                  <span className="service-tag-pill" style={{ color: item.color }}>
                    {item.tag}
                  </span>
                </div>

                <div className="service-card-body">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>

                  <ul className="service-highlights-list">
                    {item.highlights.map((h, i) => (
                      <li key={i}>
                        <Check size={14} style={{ color: item.color, flexShrink: 0, marginTop: '2px' }} />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* About Story & Credentials Highlight (Uses his single suit pose) */}
          <div className="about-story-card">
            <div className="about-story-photo">
              <img
                src={photos.suit}
                alt="Abdul Wasay - Opus Geeks"
                loading="lazy"
              />
            </div>

            <div className="about-story-content">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary-color)', fontWeight: 700, fontSize: '0.85rem' }}>
                <Sparkles size={16} />
                <span>ABOUT ABDUL WASAY • OPUS GEEKS</span>
              </div>

              <h3 className="about-story-title">
                Crafting High-Converting Websites with 1.5+ Years Dedicated Experience
              </h3>

              <p className="about-story-text">
                {personalInfo.bio}
              </p>

              {/* 4 Stats Grid */}
              <div className="about-stats-grid">
                {personalInfo.stats.map((s, idx) => (
                  <div className="stat-box" key={idx}>
                    <div className="stat-val">{s.value}</div>
                    <div className="stat-lbl">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          PORTFOLIO / PROJECTS SECTION (#projects)
         ========================================================= */}
      <section id="projects" className="app__container app__primarybg">
        <div className="app__wrapper">
          <h2 className="head-text">
            My Creative <span>Portfolio</span> Section
          </h2>
          <p className="head-subtext">
            Explore 70+ custom websites delivered for global clients across WordPress, WooCommerce, Shopify, Wix Studio, and Webflow.
          </p>

          {/* Filter Pills */}
          <div className="app__work-filter">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className={`app__work-filter-item ${activeCategory === cat.id ? 'item-active' : ''}`}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setVisibleCount(9);
                }}
              >
                {cat.label}
              </div>
            ))}
          </div>

          {/* Search Box */}
          <div className="projects-search-bar">
            <Search size={18} className="search-icon-inside" />
            <input
              type="text"
              placeholder="Search by name, platform (e.g. Shopify, Medical, Contractor, Cleaning)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Projects Grid */}
          <div className="app__work-portfolio">
            {filteredProjects.slice(0, visibleCount).map((project) => {
              const cleanDomain = project.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

              return (
                <article className="app__work-item" key={project.id}>
                  {/* Browser Mockup Top Bar */}
                  <div className="browser-mock-top">
                    <div className="browser-dots">
                      <span className="mock-dot red" />
                      <span className="mock-dot yellow" />
                      <span className="mock-dot green" />
                    </div>
                    <span className="browser-url-badge">🔒 {cleanDomain}</span>
                  </div>

                  {/* Screenshot with Hover Link */}
                  <div className="app__work-img">
                    <img
                      src={`/projects/${project.id}.webp`}
                      alt={project.title}
                      loading="lazy"
                    />

                    <div className="app__work-hover">
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover-icon-circle"
                        title="Visit Live Site"
                      >
                        <Eye size={22} />
                      </a>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover-icon-circle"
                        title="Open in New Tab"
                      >
                        <ExternalLink size={20} />
                      </a>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="app__work-content">
                    <span className="app__work-tag-badge">
                      {project.platform}
                    </span>

                    <span className="app__work-type">{project.type}</span>
                    <h3>{project.title}</h3>
                    <p className="app__work-desc">{project.description}</p>

                    <div className="app__work-chips">
                      {project.tags.map((t, idx) => (
                        <span key={idx} className="chip-tag">#{t}</span>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Show More / Show Less */}
          {filteredProjects.length > visibleCount && (
            <div style={{ marginTop: '2.5rem' }}>
              <button
                className="btn-primary-hero"
                onClick={() => setVisibleCount((prev) => prev + 9)}
                type="button"
              >
                <span>View More Projects ({filteredProjects.length - visibleCount} remaining)</span>
                <ArrowUpRight size={17} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          SKILLS & EXPERIENCE SECTION (#skills)
          (Tailored for 1.5+ years at Opus Geeks - Git removed)
         ========================================================= */}
      <section id="skills" className="app__container app__whitebg">
        <div className="app__wrapper">
          <h2 className="head-text">
            Skills &amp; <span>Experience</span>
          </h2>
          <p className="head-subtext">
            1.5+ years of dedicated professional growth at Opus Geeks, mastering CMS architectures, bespoke themes, and modern JavaScript.
          </p>

          <div className="app__skills-container">
            {/* Left: Circular Skills List (Git removed) */}
            <div className="app__skills-list">
              {skillsList.map((skill) => (
                <div className="app__skills-item" key={skill.key} title={`${skill.name} (${skill.level})`}>
                  <div className="app__skills-icon-wrap">
                    <TechIcon name={skill.key} size={46} />
                  </div>
                  <p>{skill.name}</p>
                  <span className="skill-level">{skill.level}</span>
                </div>
              ))}
            </div>

            {/* Right: Experience Timeline at Opus Geeks */}
            <div className="app__skills-exp">
              {experiences.map((exp, idx) => (
                <div className="app__skills-exp-item" key={idx}>
                  <div className="app__skills-exp-year">
                    <p className="exp-year-badge">{exp.year}</p>
                  </div>

                  <div className="app__skills-exp-work">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <h4>{exp.role}</h4>
                      <span className="exp-company-tag">
                        <Building size={13} style={{ marginRight: '4px' }} />
                        {exp.company}
                      </span>
                    </div>

                    <div className="exp-focus-row">
                      {exp.focus.split('•').map((item, i) => (
                        <span key={i} className="exp-focus-chip">{item.trim()}</span>
                      ))}
                    </div>

                    <p className="desc">{exp.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          TESTIMONIALS SECTION (#testimonials) - 12 Client Reviews
         ========================================================= */}
      <section id="testimonials" className="app__container app__primarybg">
        <div className="app__wrapper">
          <h2 className="head-text">
            Words that are <span>Trustable</span>
          </h2>
          <p className="head-subtext">
            Verified feedback from 12+ international founders, agency leads, and store owners who trusted Abdul Wasay with their web platforms.
          </p>

          {/* Single Testimonial Card */}
          <div className={`app__testimonial-item ${isTestimonialTransitioning ? 'fade-out' : 'fade-in'}`}>
            <div className="testimonial-avatar-box">
              <img
                src={currentTest.avatar}
                alt={currentTest.name}
                loading="lazy"
              />
            </div>

            <div className="app__testimonial-content">
              <div className="testimonial-top-row">
                {/* 5-Star Rating */}
                <div className="test-rating-stars">
                  {[...Array(currentTest.rating)].map((_, i) => (
                    <Star key={i} size={17} fill="#f59e0b" color="#f59e0b" />
                  ))}
                  <span style={{ marginLeft: '6px', fontSize: '0.85rem', fontWeight: 800, color: '#f59e0b' }}>
                    5.0 / 5.0
                  </span>
                </div>

                <div className="test-meta-pills">
                  <span className="test-project-badge">{currentTest.project}</span>
                  <span className="test-location-tag">
                    <MapPin size={12} style={{ marginRight: '3px' }} />
                    {currentTest.location}
                  </span>
                </div>
              </div>

              {/* Client Review Feedback */}
              <p className="testimonial-text">
                “{currentTest.feedback}”
              </p>

              <div className="testimonial-author">
                <h4>{currentTest.name}</h4>
                <h5>{currentTest.role} • <strong>{currentTest.company}</strong></h5>
              </div>
            </div>
          </div>

          {/* Testimonial Navigation Controls */}
          <div className="app__testimonial-btns">
            <button
              className="test-nav-btn"
              onClick={prevTestimonial}
              aria-label="Previous Testimonial"
              type="button"
            >
              <ChevronLeft size={22} />
            </button>

            <div className="test-counter-badge">
              <span>{testIndex + 1}</span> / <span>{testimonials.length}</span>
            </div>

            <button
              className="test-nav-btn"
              onClick={nextTestimonial}
              aria-label="Next Testimonial"
              type="button"
            >
              <ChevronRight size={22} />
            </button>
          </div>

          {/* Dots selector for all 12 reviews */}
          <div className="test-indicators" style={{ marginTop: '1.25rem' }}>
            {testimonials.map((t, idx) => (
              <span
                key={idx}
                className={`test-dot ${testIndex === idx ? 'active' : ''}`}
                onClick={() => handleDotClick(idx)}
                title={`${t.name} - ${t.company}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          CONTACT SECTION (#contact) - WhatsApp: 03112299947
         ========================================================= */}
      <section id="contact" className="app__container app__whitebg">
        <div className="app__wrapper">
          <h2 className="head-text">
            Take A Coffee &amp; <span>Chat With Me</span>
          </h2>
          <p className="head-subtext">
            Ready to build or revamp your next web project? Reach out directly via WhatsApp, Email, or LinkedIn!
          </p>

          {/* Contact Information Cards */}
          <div className="app__footer_cards">
            {/* WhatsApp Direct Card */}
            <a
              href={personalInfo.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="app__footer-card"
              style={{ borderColor: 'rgba(37, 211, 102, 0.4)' }}
            >
              <div className="app__footer-card-icon" style={{ background: '#25D366', color: '#fff' }}>
                <WhatsAppIcon size={22} />
              </div>
              <div className="app__footer-card-info">
                <span className="app__footer-card-lbl" style={{ color: '#16a34a' }}>WhatsApp Direct</span>
                <span className="app__footer-card-val" style={{ fontWeight: 800 }}>0311 2299947</span>
              </div>
            </a>

            {/* Email Card with click to copy */}
            <div
              className="app__footer-card"
              onClick={copyEmail}
              style={{ cursor: 'pointer' }}
              title="Click to copy email address"
            >
              <div className="app__footer-card-icon">
                {copiedEmail ? <Check size={20} color="#10b981" /> : <Mail size={20} />}
              </div>
              <div className="app__footer-card-info">
                <span className="app__footer-card-lbl">
                  {copiedEmail ? 'Copied to clipboard!' : 'Email Address'}
                </span>
                <span className="app__footer-card-val">{personalInfo.email}</span>
              </div>
            </div>

            {/* LinkedIn Card */}
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="app__footer-card"
            >
              <div className="app__footer-card-icon">
                <LinkedInIcon size={20} />
              </div>
              <div className="app__footer-card-info">
                <span className="app__footer-card-lbl">LinkedIn Profile</span>
                <span className="app__footer-card-val">Abdul Wasay</span>
              </div>
            </a>
          </div>

          {/* Interactive CMS Agency Form */}
          {submitted ? (
            <div className="contact-success-toast">
              <Check size={28} style={{ margin: '0 auto 0.5rem', display: 'block' }} />
              <h3>Thank you for reaching out!</h3>
              <p>Your project inquiry has been received. Abdul Wasay will respond within 24 hours.</p>
            </div>
          ) : (
            <form className="app__footer-form agency-cms-form" onSubmit={handleContactSubmit}>
              <div className="app__footer-form-row">
                <div className="form-input-wrap">
                  <label className="form-field-label">Your Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. David Miller"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-input-wrap">
                  <label className="form-field-label">Email Address *</label>
                  <input
                    type="email"
                    placeholder="e.g. david@company.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="app__footer-form-row">
                <div className="form-input-wrap">
                  <label className="form-field-label">Phone / WhatsApp Number *</label>
                  <input
                    type="tel"
                    placeholder="e.g. 0311 2299947 or +1 (555) 000-0000"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="form-input-wrap">
                  <label className="form-field-label">Platform / CMS Service *</label>
                  <select
                    className="form-select-field"
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  >
                    <option value="WordPress & WooCommerce">WordPress &amp; WooCommerce Custom Store</option>
                    <option value="Shopify & Liquid">Shopify Store Engineering &amp; Liquid</option>
                    <option value="Wix & Wix Studio">Wix &amp; Wix Studio Custom Build</option>
                    <option value="Webflow">Webflow Interactive Website</option>
                    <option value="React.js & Front-End">Custom Front-End (React.js &amp; TypeScript)</option>
                    <option value="Speed & Core Web Vitals">Speed Optimization &amp; Bug Fixing</option>
                    <option value="Full Redesign">Full Website Migration / Redesign</option>
                  </select>
                </div>
              </div>

              <div className="app__footer-form-row">
                <div className="form-input-wrap">
                  <label className="form-field-label">Estimated Budget</label>
                  <select
                    className="form-select-field"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  >
                    <option value="< $1,000">&lt; $1,000 USD</option>
                    <option value="$1,000 - $3,000">$1,000 – $3,000 USD (Recommended)</option>
                    <option value="$3,000 - $5,000">$3,000 – $5,000 USD</option>
                    <option value="$5,000+">$5,000+ USD (Enterprise)</option>
                    <option value="Retainer">Monthly Retainer / Ongoing Support</option>
                  </select>
                </div>

                <div className="form-input-wrap">
                  <label className="form-field-label">Desired Timeline</label>
                  <select
                    className="form-select-field"
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  >
                    <option value="Urgent (1-2 Weeks)">Urgent (Within 1–2 Weeks)</option>
                    <option value="Standard (2-4 Weeks)">Standard (2–4 Weeks)</option>
                    <option value="Flexible">Flexible Timeline</option>
                  </select>
                </div>
              </div>

              <div className="form-input-wrap">
                <label className="form-field-label">Project Requirements &amp; Scope *</label>
                <textarea
                  placeholder="Tell me about your project, goals, references, or existing website link..."
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="btn-submit-message"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span>Sending Inquiry...</span>
                ) : (
                  <>
                    <span>Submit Project Inquiry</span>
                    <Send size={16} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* =========================================================
          RICH AGENCY FOOTER WITH DIRECT WHATSAPP LINK
         ========================================================= */}
      <footer className="app__footer-main">
        <div className="footer-top-grid">
          {/* Brand Col */}
          <div className="footer-col-brand">
            <div className="app__navbar-logo-container" style={{ fontSize: '1.65rem' }}>
              abdul <span>wasay</span>
            </div>
            <p className="footer-brand-title">
              Front-End Developer &amp; CMS Specialist @ Opus Geeks
            </p>
            <p className="footer-brand-desc">
              Crafting high-converting eCommerce stores &amp; bespoke CMS architectures across WordPress, Shopify Liquid, Wix Studio, and React.js. 70+ commercial projects delivered worldwide.
            </p>
          </div>

          {/* Quick Links Col */}
          <div className="footer-col-links">
            <h4>Quick Navigation</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About &amp; Services</a></li>
              <li><a href="#projects">Creative Portfolio (70+)</a></li>
              <li><a href="#skills">Skills &amp; Experience</a></li>
              <li><a href="#testimonials">Client Testimonials</a></li>
              <li><a href="#contact">Contact &amp; Inquiries</a></li>
            </ul>
          </div>

          {/* Direct WhatsApp Col */}
          <div className="footer-col-contact">
            <h4>Direct WhatsApp Connection</h4>
            <p style={{ fontSize: '0.86rem', color: 'var(--gray-color)', marginBottom: '1rem' }}>
              Have an urgent question or project requirements? Connect immediately:
            </p>

            <a
              href={personalInfo.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-whatsapp-card"
            >
              <div className="footer-whatsapp-icon">
                <WhatsAppIcon size={24} />
              </div>
              <div className="footer-whatsapp-text">
                <span className="wa-label">Chat Directly on WhatsApp</span>
                <span className="wa-num">0311 2299947</span>
              </div>
            </a>

            <div className="footer-social-row">
              <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" title="LinkedIn Profile">
                <LinkedInIcon size={18} />
              </a>
              <a href={`mailto:${personalInfo.email}`} title="Email Abdul Wasay">
                <Mail size={18} />
              </a>
              <a href={`tel:${personalInfo.phone}`} title="Call Direct">
                <PhoneCall size={17} />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom-bar">
          <p className="copy-bold">© 2026 Abdul Wasay • Opus Geeks. All rights reserved.</p>
          <p className="footer-loc-badge">
            <MapPin size={13} style={{ marginRight: '4px', color: 'var(--secondary-color)' }} />
            Karachi, Pakistan • Available Worldwide
          </p>
          <p className="footer-tagline-small">Built for Speed, SEO &amp; Conversions</p>
        </div>
      </footer>
    </div>
  );
}
