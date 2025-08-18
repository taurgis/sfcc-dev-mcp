/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
// Modern interactions for SFCC Dev MCP documentation site

document.addEventListener('DOMContentLoaded', function() {
  // Create back to top button
  createBackToTopButton();
  
  // Add smooth scrolling for anchor links
  addSmoothScrolling();
  
  // Add loading states for external links
  addLoadingStates();
  
  // Enhance cards with interaction feedback
  enhanceCards();
});

function createBackToTopButton() {
  const button = document.createElement('button');
  button.className = 'back-to-top';
  button.innerHTML = '↑';
  button.setAttribute('aria-label', 'Back to top');
  button.title = 'Back to top';
  
  document.body.appendChild(button);
  
  // Show/hide button based on scroll position
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      button.classList.add('visible');
    } else {
      button.classList.remove('visible');
    }
  });
  
  // Scroll to top when clicked
  button.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

function addSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

function addLoadingStates() {
  const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])');
  
  externalLinks.forEach(link => {
    link.addEventListener('click', function() {
      const text = this.textContent;
      this.classList.add('loading');
      
      setTimeout(() => {
        this.classList.remove('loading');
      }, 2000);
    });
  });
}

function enhanceCards() {
  const cards = document.querySelectorAll('.card, .feature-item, .suggestion-card');
  
  cards.forEach(card => {
    // Add keyboard navigation
    if (card.querySelector('a')) {
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      
      card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const link = this.querySelector('a');
          if (link) {
            link.click();
          }
        }
      });
    }
    
    // Add ripple effect on click
    card.addEventListener('click', function(e) {
      if (e.target.tagName === 'A') return; // Don't add ripple if clicking a link directly
      
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 1;
      `;
      
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

// Add ripple animation keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(2);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Theme preference detection and handling
function initThemeHandling() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  
  function handleThemeChange(e) {
    if (e.matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }
  
  prefersDark.addEventListener('change', handleThemeChange);
  handleThemeChange(prefersDark);
}

// Initialize theme handling
initThemeHandling();

// Performance optimization: lazy load images if any
function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }
}

initLazyLoading();
