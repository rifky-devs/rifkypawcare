import heroImg from '../assets/pet.gif';

export default function Home() {
  return (
    <header id="home" className="hero-section">
      <div className="hero-container">
        {/* Left Text Column */}
        <div className="hero-content animate-fade-in">
          <div className="badge-welcome">
            <span className="badge-dot"></span>
            Selamat Datang di PawCare
          </div>
          <h1 className="hero-title">
            Rifky PawCare <span className="text-highlight">Petshop</span>
          </h1>
          <p className="hero-subtitle">
            Solusi lengkap untuk makanan, aksesoris, grooming, dan perawatan hewan peliharaan.
          </p>
          <p className="hero-description">
            Kami menyediakan produk kualitas terbaik dan layanan profesional untuk memastikan hewan kesayangan Anda selalu sehat, ceria, dan tampil menggemaskan setiap hari.
          </p>
          
          <div className="hero-actions">
            <a href="#products" className="btn btn-primary">
              Jelajahi Produk
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
              </svg>
            </a>
            <a href="#member" className="btn btn-secondary">
              Daftar Member
            </a>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">100+</span>
              <span className="stat-label">Pelanggan</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">4.9</span>
              <span className="stat-label">Rating Ulasan</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Cinta & Kasih</span>
            </div>
          </div>
        </div>

        {/* Right Graphic Column */}
        <div className="hero-graphic animate-fade-in">
          <div className="hero-image-wrapper">
            <div className="hero-bg-blob"></div>
            <img src={heroImg} alt="Cute Pets" className="hero-image" />
            
            {/* Interactive Float Badges */}
            <div className="float-badge badge-top-left">
              <span className="badge-icon">🐱</span>
              <div className="badge-text">
                <strong>Cat Care</strong>
                <span>Nutrisi Premium</span>
              </div>
            </div>
            <div className="float-badge badge-bottom-right">
              <span className="badge-icon">🐶</span>
              <div className="badge-text">
                <strong>Dog Grooming</strong>
                <span>Layanan Profesional</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hero-section {
          padding-top: 140px; /* Accounts for fixed navbar */
          padding-bottom: 5rem;
          min-height: 100vh;
          display: flex;
          align-items: center;
          background: radial-gradient(circle at 80% 20%, rgba(255, 122, 69, 0.05) 0%, transparent 40%);
          overflow: hidden;
          box-sizing: border-box;
        }

        .hero-container {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 4rem;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          align-items: center;
        }

        .hero-content {
          text-align: left;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .badge-welcome {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1.2rem;
          border-radius: 50px;
          background-color: rgba(255, 122, 69, 0.08);
          color: var(--primary);
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(255, 122, 69, 0.15);
        }

        .badge-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--primary);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 122, 69, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(255, 122, 69, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 122, 69, 0); }
        }

        .hero-title {
          font-size: clamp(2.8rem, 5vw, 4rem);
          margin-bottom: 1.5rem;
          line-height: 1.15;
        }

        .text-highlight {
          color: var(--primary);
          position: relative;
        }

        .text-highlight::after {
          content: '';
          position: absolute;
          bottom: 5px;
          left: 0;
          width: 100%;
          height: 8px;
          background-color: rgba(255, 122, 69, 0.15);
          z-index: -1;
          border-radius: 4px;
        }

        .hero-subtitle {
          font-size: clamp(1.15rem, 2.5vw, 1.4rem);
          font-weight: 600;
          color: var(--text-h);
          line-height: 1.4;
          margin-bottom: 1.25rem;
        }

        .hero-description {
          font-size: 1.05rem;
          color: var(--text);
          opacity: 0.85;
          margin-bottom: 2.5rem;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          margin-bottom: 3.5rem;
          flex-wrap: wrap;
        }

        .hero-actions .btn {
          padding: 0.9rem 2.2rem;
        }

        .hero-stats {
          display: flex;
          align-items: center;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
        }

        .stat-number {
          font-family: var(--font-heading);
          font-size: 2rem;
          font-weight: 800;
          color: var(--text-h);
          line-height: 1.2;
        }

        .stat-label {
          font-size: 0.9rem;
          color: var(--text);
          opacity: 0.75;
        }

        .stat-divider {
          width: 1px;
          height: 35px;
          background-color: var(--border);
        }

        /* Right Column Styles */
        .hero-graphic {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .hero-image-wrapper {
          position: relative;
          width: 100%;
          max-width: 460px;
          aspect-ratio: 1;
        }

        .hero-bg-blob {
          position: absolute;
          top: 10%;
          left: 10%;
          width: 80%;
          height: 80%;
          border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
          background: linear-gradient(135deg, rgba(255, 122, 69, 0.15) 0%, rgba(255, 213, 145, 0.2) 100%);
          z-index: 0;
          animation: blobby 12s ease-in-out infinite alternate;
        }

        @keyframes blobby {
          0% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
          100% { border-radius: 60% 40% 30% 70% / 50% 60% 40% 60%; }
        }

        .hero-image {
          position: relative;
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 24px;
          z-index: 1;
          box-shadow: var(--shadow-lg);
          border: 4px solid var(--card-bg);
          transform: rotate(1.5deg);
          transition: transform 0.5s ease;
        }

        .hero-image:hover {
          transform: rotate(0deg) scale(1.02);
        }

        /* Interactive Floating Badges */
        .float-badge {
          position: absolute;
          background-color: var(--card-bg);
          border: 1px solid var(--border);
          padding: 0.6rem 1rem;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          box-shadow: var(--shadow-md);
          z-index: 2;
          transition: all 0.3s ease;
        }

        .float-badge:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
        }

        .badge-top-left {
          top: 10%;
          left: -15%;
          animation: floatY 5s ease-in-out infinite alternate;
        }

        .badge-bottom-right {
          bottom: 12%;
          right: -10%;
          animation: floatY 5s ease-in-out infinite alternate-reverse;
        }

        .badge-icon {
          font-size: 1.5rem;
        }

        .badge-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }

        .badge-text strong {
          font-family: var(--font-heading);
          font-size: 0.85rem;
          color: var(--text-h);
        }

        .badge-text span {
          font-size: 0.75rem;
          color: var(--text);
          opacity: 0.8;
        }

        @keyframes floatY {
          0% { transform: translateY(0); }
          100% { transform: translateY(-10px); }
        }

        @media (max-width: 1024px) {
          .hero-container {
            gap: 2rem;
          }
        }

        @media (max-width: 768px) {
          .hero-section {
            padding-top: 110px;
            padding-bottom: 3.5rem;
          }

          .hero-container {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 3.5rem;
          }

          .hero-content {
            align-items: center;
            text-align: center;
          }

          .hero-actions {
            justify-content: center;
            margin-bottom: 2.5rem;
          }

          .hero-stats {
            justify-content: center;
          }

          .hero-image-wrapper {
            max-width: 320px;
          }

          .badge-top-left {
            left: -5%;
          }

          .badge-bottom-right {
            right: -5%;
          }
        }
      `}</style>
    </header>
  );
}
