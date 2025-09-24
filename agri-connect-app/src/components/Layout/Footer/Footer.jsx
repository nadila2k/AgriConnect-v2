import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={footerStyles.footer}>
      <div style={footerStyles.backgroundPattern}></div>
      
      <div style={footerStyles.container}>
        <div style={footerStyles.mainContent}>
          {/* Brand */}
          <div style={footerStyles.brandSection}>
            <div style={footerStyles.brandContainer}>
              <span style={footerStyles.logo}>🌱</span>
              <h3 style={footerStyles.brandName}>AgriConnect</h3>
            </div>
            <p style={footerStyles.tagline}>Transforming Sri Lankan agriculture digitally</p>
          </div>

          {/* Quick Links */}
          <div style={footerStyles.section}>
            <div style={footerStyles.linkGroup}>
              {['Home', 'About', 'Features', 'Services', 'Contact'].map(link => (
                <a 
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  style={footerStyles.link}
                  onMouseEnter={(e) => e.target.style.color = '#81C784'}
                  onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Contact & Social */}
          <div style={footerStyles.section}>
            <div style={footerStyles.contactGroup}>
              <a 
                href="mailto:NadilaNawod@gmail.com"
                style={footerStyles.contactLink}
                onMouseEnter={(e) => e.target.style.color = '#81C784'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.9)'}
              >
                ✉️ NadilaNawod@gmail.com
              </a>
              <span style={footerStyles.contactText}>📞 +94 71 716 2335</span>
            </div>
            
            <div style={footerStyles.socialIcons}>
              <a 
                href="https://facebook.com" 
                style={footerStyles.socialIcon}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.1)';
                  e.target.style.backgroundColor = '#1877F2';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                }}
              >
                📘
              </a>
              <a 
                href="https://twitter.com" 
                style={footerStyles.socialIcon}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.1)';
                  e.target.style.backgroundColor = '#1DA1F2';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                }}
              >
                🐦
              </a>
              <a 
                href="https://instagram.com" 
                style={footerStyles.socialIcon}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.1)';
                  e.target.style.backgroundColor = '#E4405F';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                }}
              >
                📷
              </a>
              <a 
                href="https://linkedin.com" 
                style={footerStyles.socialIcon}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.1)';
                  e.target.style.backgroundColor = '#0077B5';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                }}
              >
                💼
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div style={footerStyles.copyrightSection}>
            <p style={footerStyles.copyright}>
              © {currentYear} AgriConnect. All rights reserved.
            </p>
            <div style={footerStyles.legalLinks}>
              <a 
                href="#privacy"
                style={footerStyles.legalLink}
                onMouseEnter={(e) => e.target.style.color = '#81C784'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}
              >
                Privacy
              </a>
              <a 
                href="#terms"
                style={footerStyles.legalLink}
                onMouseEnter={(e) => e.target.style.color = '#81C784'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}
              >
                Terms
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const footerStyles = {
  footer: {
    background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
    marginTop: 'auto'
  },
  
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v20h20z'/%3E%3C/g%3E%3C/svg%3E")`,
    opacity: 0.3
  },
  
  container: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px'
  },
  
  mainContent: {
    display: 'grid',
    gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr',
    gap: '30px',
    alignItems: 'center',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: '20px',
      textAlign: 'center'
    }
  },
  
  brandSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  
  brandContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  
  logo: {
    fontSize: '24px'
  },
  
  brandName: {
    fontSize: '20px',
    fontWeight: 'bold',
    margin: 0,
    background: 'linear-gradient(45deg, #ffffff, #81C784)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    color: 'transparent'
  },
  
  tagline: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '12px',
    margin: 0,
    lineHeight: '1.4'
  },
  
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  
  linkGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px'
  },
  
  link: {
    color: 'rgba(255, 255, 255, 0.8)',
    textDecoration: 'none',
    fontSize: '13px',
    transition: 'color 0.3s ease',
    cursor: 'pointer'
  },
  
  contactGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  
  contactLink: {
    color: 'rgba(255, 255, 255, 0.9)',
    textDecoration: 'none',
    fontSize: '12px',
    transition: 'color 0.3s ease'
  },
  
  contactText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '12px'
  },
  
  socialIcons: {
    display: 'flex',
    gap: '8px',
    marginTop: '8px'
  },
  
  socialIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: '50%',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  
  copyrightSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '8px',
    textAlign: 'right'
  },
  
  copyright: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '11px',
    margin: 0
  },
  
  legalLinks: {
    display: 'flex',
    gap: '12px'
  },
  
  legalLink: {
    color: 'rgba(255, 255, 255, 0.6)',
    textDecoration: 'none',
    fontSize: '11px',
    transition: 'color 0.3s ease',
    cursor: 'pointer'
  }
};

// Add responsive behavior
const style = document.createElement('style');
style.textContent = `
  @media (max-width: 768px) {
    .footer-main-content {
      grid-template-columns: 1fr !important;
      text-align: center !important;
    }
    .footer-copyright-section {
      align-items: center !important;
      text-align: center !important;
    }
    .footer-link-group {
      justify-content: center !important;
    }
    .footer-social-icons {
      justify-content: center !important;
    }
  }
`;
document.head.appendChild(style);

export default Footer;