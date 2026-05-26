import { useEffect, useState } from "react";

const SERVICE_LIST = [
  {
    id: 1,
    title: 'Professional Grooming',
    tagline: 'Pemandian & Cukur Bulu Rapi',
    price: 'Rp 75.000',
    description: 'Pemandian air hangat menggunakan sampo organik anti-kutu, pengeringan higienis, cukur bulu estetis, potong kuku, serta pembersihan telinga.',
    accentColor: 'rgba(255, 122, 69, 0.08)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="srv-icon">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="M8 11h8"/>
        <path d="M12 7v8"/>
      </svg>
    )
  },
  {
    id: 2,
    title: 'Cozy Pet Hotel',
    tagline: 'Penitipan Mewah Ber-AC',
    price: 'Rp 50.000 / hari',
    description: 'Penitipan hewan ber-AC dengan kasur tidur nyaman, jadwal bermain interaktif, makanan super-premium terjadwal, dan pengawasan kamera CCTV 24 jam.',
    accentColor: 'rgba(255, 213, 145, 0.15)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="srv-icon">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    )
  },
  {
    id: 3,
    title: 'Veterinary Consultation',
    tagline: 'Konsultasi Medis & Vaksin',
    price: 'Rp 120.000',
    description: 'Pemeriksaan kesehatan, pemberian vaksinasi berkala, pengobatan infeksi, saran nutrisi, serta penanganan darurat langsung oleh dokter hewan berlisensi.',
    accentColor: 'rgba(74, 59, 50, 0.05)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="srv-icon">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        <path d="M12 11v6" />
        <path d="M9 14h6" />
      </svg>
    )
  },
  {
    id: 4,
    title: 'Obedience Pet Training',
    tagline: 'Pelatihan Hewan Terarah',
    price: 'Rp 200.000',
    description: 'Program kepatuhan dasar (duduk, diam, datang saat dipanggil, jabat tangan) yang dibimbing oleh pelatih profesional berpengalaman dengan sistem kasih sayang.',
    accentColor: 'rgba(82, 196, 26, 0.08)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="srv-icon">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8l4 4-4 4" />
        <path d="M8 12h8" />
      </svg>
    )
  }
];

export default function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/services")
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((err) => console.error("Gagal ambil layanan:", err));
  }, []);

  return (
    <section id="services" className="section bg-warm-cozy">
      <div className="section-title-wrapper">
        <span className="section-subtitle font-heading">Layanan Kami</span>
        <h2>Perawatan Profesional Hewan</h2>
        <p className="section-description">
          Kami berkomitmen memberikan kenyamanan dan rasa aman terbaik untuk hewan kesayangan Anda layaknya keluarga sendiri.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-2 services-grid">
        {services.map((service) => (
          <div key={service.id} className="premium-card service-card card-layanan-kamu">
            {/* Header: Icon & Title */}
            <div className="service-header">
              <div className="service-icon-box" style={{ backgroundColor: (SERVICE_LIST.find(s => s.id === service.id) || SERVICE_LIST[0])?.accentColor || 'rgba(255, 122, 69, 0.08)' }}>
                {(SERVICE_LIST.find(s => s.id === service.id) || SERVICE_LIST[0])?.icon}
              </div>
              <div className="service-title-info">
                <h3 className="service-title-text">{service.name}</h3>
                <span className="service-tagline">{service.subtitle}</span>
              </div>
            </div>

            {/* Description */}
            <p className="service-desc">{service.description}</p>

            {/* Footer: Pricing & Booking Action */}
            <div className="service-footer">
              <div className="service-price">
                <span className="price-label">Estimasi Biaya</span>
                <span className="price-val">Rp {Number(service.price).toLocaleString("id-ID")}</span>
              </div>
              <a href="#member" className="btn btn-secondary btn-book">
                Booking →
              </a>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .bg-warm-cozy {
          background-color: var(--bg);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }

        .services-grid {
          margin-top: 1rem;
        }

        .service-card {
          padding: 2.25rem;
          height: 100%;
          justify-content: space-between;
          border-radius: 24px;
        }

        .service-header {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          margin-bottom: 1.5rem;
        }

        .service-icon-box {
          width: 60px;
          height: 60px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .srv-icon {
          width: 30px;
          height: 30px;
          color: var(--primary);
          transition: transform 0.3s ease;
        }

        .service-card:hover .service-icon-box {
          transform: scale(1.05) rotate(-5deg);
        }

        .service-title-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }

        .service-title-text {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--text-h);
        }

        .service-tagline {
          font-size: 0.85rem;
          color: var(--primary);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .service-desc {
          font-size: 0.95rem;
          color: var(--text);
          opacity: 0.85;
          text-align: left;
          line-height: 1.6;
          margin-bottom: 2rem;
          flex-grow: 1;
        }

        .service-footer {
          border-top: 1px solid var(--border);
          padding-top: 1.25rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .service-price {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .price-label {
          font-size: 0.75rem;
          color: var(--text);
          opacity: 0.6;
          text-transform: uppercase;
        }

        .price-val {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-h);
        }

        .btn-book {
          padding: 0.5rem 1.15rem !important;
          border-radius: 12px !important;
          font-size: 0.88rem !important;
          box-shadow: none !important;
        }

        .btn-book:hover {
          transform: translateX(3px) !important;
          background-color: rgba(var(--secondary-rgb), 0.08) !important;
        }

        @media (max-width: 768px) {
          .service-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .service-card {
            padding: 1.75rem;
          }
        }
      `}</style>
    </section>
  );
}
