import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import heroSvg from '../assets/hero.svg';

export default function Navbar() {
  const { totalItems, setIsCartOpen } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Monitor scroll to add shadow and border effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Brand Logo */}
        <a href="#home" className="navbar-logo" onClick={closeMenu} style={{ padding: '0.25rem 0' }}>
          <img src={heroSvg} alt="Rifky PawCare Logo" className="navbar-logo-img" style={{ height: '38px', width: 'auto', display: 'block' }} />
        </a>

        {/* Desktop Menu Links */}
        <div className="navbar-menu-desktop">
          <a href="#home" className="nav-link">Beranda</a>
          <a href="#products" className="nav-link">Produk</a>
          <a href="#services" className="nav-link">Layanan</a>
          <a href="#member" className="nav-link">Member</a>
          
          {/* Shopping Cart Button */}
          <button className="cart-nav-btn" onClick={() => setIsCartOpen(true)} aria-label="Buka Keranjang">
            <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" width="21" height="21" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </button>
          
          <a href="#member" className="btn btn-primary nav-cta">Daftar Sekarang</a>
        </div>

        {/* Mobile Actions Container (Cart + Hamburger) */}
        <div className="navbar-mobile-actions">
          <button className="cart-nav-btn" onClick={() => setIsCartOpen(true)} aria-label="Buka Keranjang">
            <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" width="21" height="21" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </button>
          
          <button className="navbar-toggle" onClick={toggleMenu} aria-label="Toggle Menu">
            <span className={`hamburger ${isOpen ? 'open' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Menu */}
      <div className={`navbar-menu-mobile ${isOpen ? 'open' : ''}`}>
        <a href="#home" className="nav-link-mobile" onClick={closeMenu}>Beranda</a>
        <a href="#products" className="nav-link-mobile" onClick={closeMenu}>Produk</a>
        <a href="#services" className="nav-link-mobile" onClick={closeMenu}>Layanan</a>
        <a href="#member" className="nav-link-mobile" onClick={closeMenu}>Member</a>
        <a href="#member" className="btn btn-primary btn-block" onClick={closeMenu}>Daftar Sekarang</a>
      </div>

      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 80px;
          display: flex;
          align-items: center;
          background-color: transparent;
          border-bottom: 1px solid transparent;
          z-index: 1000;
          transition: all 0.3s ease;
        }
        
        .navbar-scrolled {
          background-color: var(--card-bg);
          backdrop-filter: blur(10px);
          height: 70px;
          border-bottom: 1px solid var(--border);
          box-shadow: var(--shadow-sm);
        }
        
        .navbar-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        
        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-h);
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1.25rem;
        }

        .paw-logo {
          color: var(--primary);
          transition: transform 0.3s ease;
        }

        .navbar-logo:hover .paw-logo {
          transform: rotate(15deg) scale(1.1);
        }

        .navbar-title span {
          color: var(--primary);
        }
        
        .navbar-menu-desktop {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        
        .nav-link {
          font-family: var(--font-heading);
          font-weight: 500;
          font-size: 0.95rem;
          color: var(--text);
          position: relative;
          padding: 0.25rem 0;
        }
        
        .nav-link:hover {
          color: var(--primary);
        }

        .nav-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: 0;
          left: 0;
          background-color: var(--primary);
          transition: width 0.3s ease;
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .nav-cta {
          padding: 0.5rem 1.25rem !important;
          font-size: 0.9rem !important;
        }
        
        /* Shopping Cart Navigation Trigger Button Styling */
        .cart-nav-btn {
          position: relative;
          background: none;
          border: none;
          color: var(--text-h);
          cursor: pointer;
          padding: 0.55rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
        }

        .cart-nav-btn:hover {
          background-color: rgba(var(--secondary-rgb), 0.05);
          color: var(--primary);
          transform: scale(1.08) translateY(-1px);
        }

        .cart-badge {
          position: absolute;
          top: -1px;
          right: -1px;
          background-color: var(--primary);
          color: #ffffff;
          font-size: 0.7rem;
          font-weight: 750;
          min-width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          box-shadow: 0 2px 8px rgba(255, 122, 69, 0.4);
          animation: badgePulse 2s infinite ease-in-out;
        }

        @keyframes badgePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); box-shadow: 0 2px 12px rgba(255, 122, 69, 0.6); }
        }
        
        .navbar-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
        }

        .navbar-mobile-actions {
          display: none;
          align-items: center;
          gap: 0.75rem;
        }
        
        .hamburger {
          display: block;
          width: 24px;
          height: 2px;
          background-color: var(--text-h);
          position: relative;
          transition: background-color 0.3s ease;
        }
        
        .hamburger::before, .hamburger::after {
          content: '';
          position: absolute;
          width: 24px;
          height: 2px;
          background-color: var(--text-h);
          transition: all 0.3s ease;
        }
        
        .hamburger::before {
          top: -6px;
        }
        
        .hamburger::after {
          top: 6px;
        }
        
        .hamburger.open {
          background-color: transparent;
        }
        
        .hamburger.open::before {
          transform: rotate(45deg);
          top: 0;
        }
        
        .hamburger.open::after {
          transform: rotate(-45deg);
          top: 0;
        }
        
        .navbar-menu-mobile {
          display: none;
          position: absolute;
          top: 80px;
          left: 0;
          right: 0;
          background-color: var(--card-bg);
          border-bottom: 1px solid var(--border);
          padding: 1.5rem 2rem;
          flex-direction: column;
          gap: 1.25rem;
          transform: translateY(-100%);
          opacity: 0;
          pointer-events: none;
          transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
          box-shadow: var(--shadow-md);
        }

        .navbar-menu-mobile.open {
          transform: translateY(0);
          opacity: 1;
          pointer-events: auto;
        }
        
        .nav-link-mobile {
          font-family: var(--font-heading);
          font-weight: 500;
          font-size: 1.1rem;
          color: var(--text-h);
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(var(--secondary-rgb), 0.05);
        }
        
        .btn-block {
          width: 100%;
          text-align: center;
        }
        
        @media (max-width: 768px) {
          .navbar-menu-desktop {
            display: none;
          }
          
          .navbar-toggle {
            display: none; /* Hide standalone toggle */
          }

          .navbar-mobile-actions {
            display: flex; /* Show mobile bar */
          }
          
          .navbar-menu-mobile {
            display: flex;
          }
          
          .navbar-scrolled {
            height: 64px;
          }
          
          .navbar-scrolled + .navbar-menu-mobile {
            top: 64px;
          }
        }
      `}</style>
    </nav>
  );
}
