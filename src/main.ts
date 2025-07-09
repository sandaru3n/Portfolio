// Portfolio functionality with typing effect
class Portfolio {
  private typingText: HTMLElement;
  private currentIndex = 0;
  private currentTextIndex = 0;
  private isDeleting = false;
  private typingSpeed = 100;
  private deletingSpeed = 50;
  private pauseTime = 2000;
  private currentSectionIndex = 0;

  private typingTexts: string[] = [
    "Full Stack Developer",
    "UI/UX Enthusiast",
    "Problem Solver",
    "Tech Explorer",
    "Creative Coder"
  ];

  private sections: string[] = [
    "hero-section",
    "about-section",
    "projects-section",
    "skills-section",
    "contact-section"
  ];

  constructor() {
    this.typingText = document.getElementById('typing-text') as HTMLElement;
    this.init();
  }

  private init(): void {
    this.setupEventListeners();
    this.startTypingEffect();
    this.animateSkillBars();
    this.setupNavigation();
    this.setupContactForm();
    this.setupScrollIndicator();
    this.setupWheelScrolling();
  }

  private setupEventListeners(): void {
    // Navigation toggle for mobile
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    navToggle?.addEventListener('click', () => {
      navLinks?.classList.toggle('active');
    });

    // Navigation links
    document.querySelectorAll('[data-section]').forEach(element => {
      element.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = (e.target as HTMLElement).getAttribute('data-section') ||
                         (e.target as HTMLElement).closest('[data-section]')?.getAttribute('data-section');
        if (sectionId) {
          const sectionIndex = this.sections.indexOf(sectionId);
          if (sectionIndex !== -1) {
            this.currentSectionIndex = sectionIndex;
          }
          this.showSection(sectionId);
          this.updateScrollIndicator();
          // Close mobile menu if open
          navLinks?.classList.remove('active');
        }
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.nav-menu')) {
        navLinks?.classList.remove('active');
      }
    });

    // Handle keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        navLinks?.classList.remove('active');
      } else if (e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        this.scrollToNextSection();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.scrollToPreviousSection();
      }
    });
  }

  private setupWheelScrolling(): void {
    let isScrolling = false;

    document.addEventListener('wheel', (e) => {
      if (isScrolling) return;

      const delta = e.deltaY;
      if (Math.abs(delta) > 10) { // Threshold to prevent small scrolls
        isScrolling = true;

        if (delta > 0) {
          // Scrolling down
          this.scrollToNextSection();
        } else {
          // Scrolling up
          this.scrollToPreviousSection();
        }

        setTimeout(() => {
          isScrolling = false;
        }, 1000); // Debounce scrolling
      }
    }, { passive: false });
  }

  private scrollToNextSection(): void {
    if (this.currentSectionIndex < this.sections.length - 1) {
      this.currentSectionIndex++;
      this.showSection(this.sections[this.currentSectionIndex]);
      this.updateScrollIndicator();
    }
  }

  private scrollToPreviousSection(): void {
    if (this.currentSectionIndex > 0) {
      this.currentSectionIndex--;
      this.showSection(this.sections[this.currentSectionIndex]);
      this.updateScrollIndicator();
    }
  }

  private updateScrollIndicator(): void {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const scrollText = scrollIndicator?.querySelector('span');

    if (scrollIndicator && scrollText) {
      if (this.currentSectionIndex < this.sections.length - 1) {
        const nextSection = this.sections[this.currentSectionIndex + 1];
        const sectionNames = {
          'about-section': 'About Me',
          'projects-section': 'Projects',
          'skills-section': 'Skills',
          'contact-section': 'Contact'
        };

        scrollText.textContent = `Scroll to ${sectionNames[nextSection as keyof typeof sectionNames]}`;
        scrollIndicator.classList.remove('hidden');
      } else {
        scrollText.textContent = 'End of portfolio';
        setTimeout(() => {
          scrollIndicator.classList.add('hidden');
        }, 2000);
      }
    }
  }

  private startTypingEffect(): void {
    if (!this.typingText) return;

    this.typeText();
  }

  private typeText(): void {
    const currentText = this.typingTexts[this.currentTextIndex];

    if (this.isDeleting) {
      this.typingText.textContent = currentText.substring(0, this.currentIndex - 1);
      this.currentIndex--;
    } else {
      this.typingText.textContent = currentText.substring(0, this.currentIndex + 1);
      this.currentIndex++;
    }

    let speed = this.isDeleting ? this.deletingSpeed : this.typingSpeed;

    if (!this.isDeleting && this.currentIndex === currentText.length) {
      speed = this.pauseTime;
      this.isDeleting = true;
    } else if (this.isDeleting && this.currentIndex === 0) {
      this.isDeleting = false;
      this.currentTextIndex = (this.currentTextIndex + 1) % this.typingTexts.length;
      speed = 500;
    }

    setTimeout(() => this.typeText(), speed);
  }

  private showSection(sectionId: string): void {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    for (const section of sections) {
      section.classList.remove('active');
    }

    // Show the requested section with animation
    setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.classList.add('active');
        // Don't scroll if it's the hero section
        if (sectionId !== 'hero-section') {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 300);
  }

  private animateSkillBars(): void {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const skillBars = entry.target.querySelectorAll('.skill-progress');
          for (const bar of skillBars) {
            const level = (bar as HTMLElement).getAttribute('data-level');
            if (level) {
              setTimeout(() => {
                (bar as HTMLElement).style.width = `${level}%`;
              }, 500);
            }
          }
        }
      }
    });

    const skillsSection = document.getElementById('skills-section');
    if (skillsSection) {
      observer.observe(skillsSection);
    }
  }

  private setupNavigation(): void {
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    for (const anchor of anchorLinks) {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const href = (e.target as HTMLAnchorElement).getAttribute('href');
        if (href) {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth'
            });
          }
        }
      });
    }
  }

  private setupContactForm(): void {
    const contactForm = document.getElementById('contact-form') as HTMLFormElement;
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data (for potential future use)
        // const name = (document.getElementById('name') as HTMLInputElement).value;
        // const email = (document.getElementById('email') as HTMLInputElement).value;
        // const message = (document.getElementById('message') as HTMLTextAreaElement).value;

        // Simulate form submission
        this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');

        // Reset form
        contactForm.reset();
      });
    }
  }

  private setupScrollIndicator(): void {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
      scrollIndicator.addEventListener('click', () => {
        this.scrollToNextSection();
      });
    }

    // Update scroll indicator based on current section
    this.updateScrollIndicator();

    // Watch for section changes
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          const sectionIndex = this.sections.indexOf(sectionId);
          if (sectionIndex !== -1) {
            this.currentSectionIndex = sectionIndex;
            this.updateScrollIndicator();
          }
        }
      }
    }, { threshold: 0.6 });

    // Observe all sections
    for (const sectionId of this.sections) {
      const section = document.getElementById(sectionId);
      if (section) {
        observer.observe(section);
      }
    }
  }

  private showNotification(message: string, type: 'success' | 'error' = 'success'): void {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: ${type === 'success' ? 'var(--accent-neon)' : 'var(--accent-pink)'};
      color: var(--bg-primary);
      padding: 1rem 2rem;
      border-radius: 8px;
      font-weight: 600;
      z-index: 10000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    // Animate out and remove
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
}

// Particle animation
class ParticleAnimation {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];

  constructor() {
    this.canvas = document.createElement('canvas');
    const context = this.canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get 2D context');
    }
    this.ctx = context;
    this.init();
  }

  private init(): void {
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '-1';

    const backgroundDiv = document.getElementById('background-particles');
    if (backgroundDiv) {
      backgroundDiv.appendChild(this.canvas);
    }

    this.resize();
    this.createParticles();
    this.animate();

    window.addEventListener('resize', () => this.resize());
  }

  private resize(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private createParticles(): void {
    const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 15000);

    for (let i = 0; i < particleCount; i++) {
      this.particles.push(new Particle(this.canvas.width, this.canvas.height));
    }
  }

  private animate(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const particle of this.particles) {
      particle.update();
      particle.draw(this.ctx);
    }

    requestAnimationFrame(() => this.animate());
  }
}

class Particle {
  private x: number;
  private y: number;
  private vx: number;
  private vy: number;
  private size: number;
  private color: string;
  private opacity: number;
  private canvasWidth: number;
  private canvasHeight: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.size = Math.random() * 2 + 1;

    const colors = ['#00ff88', '#ff006e', '#00d4ff', '#8b5cf6'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.opacity = Math.random() * 0.5 + 0.2;
  }

  update(): void {
    this.x += this.vx;
    this.y += this.vy;

    // Wrap around edges
    if (this.x < 0) this.x = this.canvasWidth;
    if (this.x > this.canvasWidth) this.x = 0;
    if (this.y < 0) this.y = this.canvasHeight;
    if (this.y > this.canvasHeight) this.y = 0;

    // Pulsing effect
    this.opacity += Math.sin(Date.now() * 0.001) * 0.01;
    this.opacity = Math.max(0.1, Math.min(0.7, this.opacity));
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  new Portfolio();
  new ParticleAnimation();

  // Add some startup animations
  setTimeout(() => {
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.classList.add('animate-in');
    }
  }, 500);
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
  .hero {
    transform: translateY(50px);
    opacity: 0;
    transition: all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .hero.animate-in {
    transform: translateY(0);
    opacity: 1;
  }

  .hidden {
    opacity: 0;
    pointer-events: none;
  }

  .notification {
    font-family: var(--font-sans);
  }

  /* Smooth section transitions */
  .section {
    scroll-margin-top: 70px;
  }

  /* Disable default scroll behavior */
  html {
    scroll-behavior: auto;
  }
`;
document.head.appendChild(style);
