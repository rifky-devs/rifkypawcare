import heroSvg from '../assets/hero.svg';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-section">
      <div className="footer-container">
        {/* Column 1: Brand Info */}
        <div className="footer-col footer-brand-col">
          <a href="#home" className="footer-logo">
            <img src={heroSvg} alt="Rifky PawCare Logo" className="footer-logo-img" style={{ height: '36px', width: 'auto', display: 'block' }} />
          </a>
          <p className="footer-about">
            Solusi lengkap, terpercaya, dan penuh kasih sayang untuk seluruh kebutuhan makanan, aksesoris, grooming, dan perawatan kesehatan hewan peliharaan Anda.
          </p>
          <div className="footer-socials">
            {/* Instagram */}
            <a href="https://www.instagram.com/rifkydevs/" target="_blank" rel="noreferrer" className="social-link" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            {/* Facebook */}
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-link" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            {/* WhatsApp */}
            <a href="https://wa.me/6285899444100" target="_blank" rel="noreferrer" className="social-link" aria-label="WhatsApp">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Column 2: Jam Operasional */}
        <div className="footer-col">
          <h4 className="footer-heading">Jam Operasional</h4>
          <ul className="footer-list">
            <li className="footer-list-item flex-between">
              <span className="day">Senin - Jumat</span>
              <span className="time">08.00 - 21.00</span>
            </li>
            <li className="footer-list-item flex-between">
              <span className="day">Sabtu</span>
              <span className="time">08.00 - 22.00</span>
            </li>
            <li className="footer-list-item flex-between">
              <span className="day">Minggu / Libur</span>
              <span className="time">09.00 - 20.00</span>
            </li>
            <li className="footer-divider"></li>
            <li className="footer-note">
              * Layanan UGD Dokter Hewan siaga 24 jam khusus member Platinum Paw.
            </li>
          </ul>
        </div>

        {/* Column 3: Quick Links */}
        <div className="footer-col">
          <h4 className="footer-heading">Tautan Pintas</h4>
          <ul className="footer-list">
            <li><a href="#home" className="footer-link">Beranda</a></li>
            <li><a href="#products" className="footer-link">Koleksi Produk</a></li>
            <li><a href="#services" className="footer-link">Layanan Perawatan</a></li>
            <li><a href="#member" className="footer-link">Daftar Membership</a></li>
          </ul>
        </div>

        {/* Column 4: Contact details */}
        <div className="footer-col">
          <h4 className="footer-heading">Hubungi Kami</h4>
          <ul className="footer-list">
            <li className="footer-contact-item">
              <span className="contact-icon">📍</span>
              <span className="contact-text">Jl. Kebahagiaan Hewan No. 88, Jakarta Selatan, Indonesia</span>
            </li>
            <li className="footer-contact-item">
              <span className="contact-icon">📞</span>
              <span className="contact-text">+62 858-9944-4100</span>
            </li>
            <li className="footer-contact-item">
              <span className="contact-icon">✉️</span>
              <span className="contact-text">rifkydevs@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Subfooter */}
      <div className="subfooter">
        <div className="subfooter-container">
          <p>© {currentYear} Rifky PawCare Petshop. Seluruh Hak Cipta Dilindungi.</p>
          <p className="credit">Designed with ❤️ for anabul tercinta.</p>
        </div>
      </div>

      <style>{`
        .footer-section {
          background-color: var(--secondary);
          color: #ffffff;
          border-top: 1px solid var(--border);
          padding: 5rem 0 0 0;
          font-size: 0.95rem;
        }

        @media (prefers-color-scheme: dark) {
          .footer-section {
            background-color: #0e0a08;
          }
        }

        .footer-container {
          display: grid;
          grid-template-columns: 1.2fr 1fr 0.8fr 1fr;
          gap: 3rem;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem 4rem 2rem;
          text-align: left;
        }

        .footer-col {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #ffffff;
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1.25rem;
        }

        .footer-logo .paw-logo {
          color: var(--primary);
        }

        .footer-logo .footer-title span {
          color: var(--primary);
        }

        .footer-about {
          opacity: 0.75;
          line-height: 1.6;
        }

        .footer-socials {
          display: flex;
          gap: 0.75rem;
        }

        .social-link {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .social-link:hover {
          background-color: var(--primary);
          color: #ffffff;
          transform: translateY(-3px);
        }

        .footer-heading {
          color: #ffffff;
          font-size: 1.15rem;
          font-weight: 700;
          position: relative;
          padding-bottom: 0.5rem;
        }

        .footer-heading::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 35px;
          height: 3px;
          background-color: var(--primary);
          border-radius: 2px;
        }

        .footer-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .footer-list-item {
          opacity: 0.8;
          border-bottom: 1px dashed rgba(255, 255, 255, 0.08);
          padding-bottom: 0.5rem;
        }

        .flex-between {
          display: flex;
          justify-content: space-between;
          width: 100%;
        }

        .footer-list-item .day {
          font-weight: 500;
        }

        .footer-list-item .time {
          color: var(--accent);
          font-weight: 600;
        }

        .footer-divider {
          height: 1px;
          background-color: rgba(255, 255, 255, 0.08);
          margin: 0.25rem 0;
        }

        .footer-note {
          font-size: 0.78rem;
          opacity: 0.6;
          line-height: 1.4;
        }

        .footer-link {
          opacity: 0.8;
          transition: all 0.2s ease;
          display: inline-block;
        }

        .footer-link:hover {
          color: var(--primary);
          opacity: 1;
          transform: translateX(3px);
        }

        .footer-contact-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          opacity: 0.8;
        }

        .footer-contact-item .contact-icon {
          font-size: 1.1rem;
          line-height: 1;
        }

        .footer-contact-item .contact-text {
          line-height: 1.4;
        }

        /* Subfooter Styles */
        .subfooter {
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding: 1.5rem 0;
          text-align: center;
        }

        .subfooter-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.55);
          letter-spacing: 0.04em;
          line-height: 1.6;
        }

        .subfooter-container .credit {
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7);
        }

        @media (max-width: 1024px) {
          .footer-container {
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
          }
        }

        @media (max-width: 600px) {
          .footer-container {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }

          .subfooter-container {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </footer>
  );
}
