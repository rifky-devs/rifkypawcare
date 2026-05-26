import { useState, useRef } from 'react';

const MEMBER_TIERS = [
  {
    id: 'silver',
    name: 'Silver Paw',
    price: 'Rp 50.000 / bln',
    benefits: ['Diskon 5% produk makanan', 'Diskon 5% grooming berkala', 'Akses berita & promo terbaru']
  },
  {
    id: 'gold',
    name: 'Gold Paw',
    price: 'Rp 99.000 / bln',
    benefits: ['Diskon 10% semua produk & grooming', 'Prioritas booking Pet Hotel', 'Free konsultasi Vet 1x / bln', 'Potongan harga aksesoris 5%']
  },
  {
    id: 'platinum',
    name: 'Platinum Paw',
    price: 'Rp 199.000 / bln',
    benefits: ['Diskon 20% all-inclusive', 'Gratis antar jemput grooming', 'Free konsultasi Vet tanpa batas', 'Layanan prioritas VIP 24 jam']
  }
];

export default function Members() {
  const [formData, setFormData] = useState({
    owner_name: "",
    pet_name: "",
    pet_type: "Kucing",
    phone: "",
    package_type: "Silver Paw",
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [popup, setPopup] = useState(null);
  const [activeErrorField, setActiveErrorField] = useState(null);

  const ownerNameInputRef = useRef(null);
  const petNameInputRef = useRef(null);
  const phoneInputRef = useRef(null);

  const showPopup = (type, title, message, buttonText = "Mengerti") => {
    setPopup({ type, title, message, buttonText });
  };

  const closePopup = () => {
    setPopup(null);
    if (activeErrorField === 'phone') {
      setTimeout(() => phoneInputRef.current?.focus(), 50);
    } else if (activeErrorField === 'owner_name') {
      setTimeout(() => ownerNameInputRef.current?.focus(), 50);
    } else if (activeErrorField === 'pet_name') {
      setTimeout(() => petNameInputRef.current?.focus(), 50);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (activeErrorField === name) {
      setActiveErrorField(null);
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { owner_name, pet_name, phone } = formData;
    if (!owner_name.trim() || !pet_name.trim() || !phone.trim()) {
      showPopup('error', 'Data Tidak Lengkap', 'Harap isi semua kolom formulir dengan benar.');
      return;
    }

    if (/[^a-zA-Z\s]/.test(owner_name)) {
      showPopup(
        'error',
        'Nama Pemilik Tidak Valid',
        'Nama pemilik hanya boleh berisi huruf (A-Z, a-z) dan spasi. Angka atau simbol tidak diperbolehkan.',
        'Perbaiki Nama'
      );
      setActiveErrorField('owner_name');
      return;
    }

    if (/[^a-zA-Z\s]/.test(pet_name)) {
      showPopup(
        'error',
        'Nama Hewan Tidak Valid',
        'Nama hewan hanya boleh berisi huruf (A-Z, a-z) dan spasi. Angka atau simbol tidak diperbolehkan.',
        'Perbaiki Nama'
      );
      setActiveErrorField('pet_name');
      return;
    }

    if (!/^08/.test(phone) || phone.length < 9) {
      showPopup(
        'error',
        'Nomor WhatsApp Tidak Valid',
        'Pastikan nomor hanya berisi angka, diawali 08, dan minimal 9 digit.\nContoh: 081234567890',
        'Cek Lagi'
      );
      setActiveErrorField('phone');
      return;
    }

    setErrorMsg('');

    try {
      const response = await fetch("https://api-pawcare.rifkydevs.my.id/api/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Data tidak valid.");
      }

      showPopup(
        "success",
        "Pendaftaran Berhasil",
        "Data member berhasil disimpan. Tim PawCare akan segera menghubungi Anda."
      );
      setSubmitted(true);
    } catch (error) {
      const errMsg = error.message.toLowerCase();
      const isPhoneErr = errMsg.includes('nomor') || errMsg.includes('phone') || errMsg.includes('whatsapp');
      const isOwnerErr = errMsg.includes('pemilik') || errMsg.includes('owner');
      const isPetErr = errMsg.includes('hewan') || errMsg.includes('pet');
      
      let field = null;
      if (isPhoneErr) field = 'phone';
      else if (isOwnerErr) field = 'owner_name';
      else if (isPetErr) field = 'pet_name';

      showPopup(
        "error",
        isPhoneErr ? "Nomor WhatsApp Tidak Valid" : (isOwnerErr || isPetErr) ? "Nama Tidak Valid" : "Format Data Belum Valid",
        error.message || "Periksa kembali data yang Anda isi.",
        isPhoneErr ? "Cek Lagi" : (isOwnerErr || isPetErr) ? "Perbaiki Nama" : "Mengerti"
      );
      if (field) {
        setActiveErrorField(field);
      }
    }
  };

  const handleReset = () => {
    setFormData({
      owner_name: "",
      pet_name: "",
      pet_type: "Kucing",
      phone: "",
      package_type: "Silver Paw",
    });
    setSubmitted(false);
  };

  const selectedTierData = MEMBER_TIERS.find(t => t.name === formData.package_type) || MEMBER_TIERS[0];

  return (
    <section id="member" className="section bg-warm-member">
      <div className="section-title-wrapper reveal">
        <span className="section-subtitle font-heading">Loyalty Program</span>
        <h2>Gabung Member PawCare</h2>
        <p className="section-description">
          Nikmati berbagai potongan harga eksklusif, prioritas penjadwalan layanan, dan keistimewaan tak terbatas bagi hewan kesayangan Anda.
        </p>
      </div>

      <div className="member-layout">
        {/* Left Side: Membership Perks Info */}
        <div className="member-info-column reveal-left">
          <div className="premium-card perks-card">
            <h3 className="perks-title">Keuntungan Eksklusif Member</h3>
            <p className="perks-subtitle">Dapatkan fasilitas bintang lima untuk hewan kesayangan Anda:</p>
            
            <ul className="perks-list">
              <li className="perks-item">
                <span className="perk-icon">🎁</span>
                <div className="perk-text">
                  <strong>Diskon Pembelian Produk</strong>
                  <span>Potongan harga khusus member untuk makanan premium & mainan edukatif.</span>
                </div>
              </li>
              <li className="perks-item">
                <span className="perk-icon">⚡</span>
                <div className="perk-text">
                  <strong>Prioritas Booking Antrean</strong>
                  <span>Bebas antre untuk grooming di akhir pekan dan jaminan slot Pet Hotel saat libur panjang.</span>
                </div>
              </li>
              <li className="perks-item">
                <span className="perk-icon">🩺</span>
                <div className="perk-text">
                  <strong>Akses Medis Utama</strong>
                  <span>Konsultasi kesehatan berkala dengan dokter hewan profesional.</span>
                </div>
              </li>
            </ul>

            {/* Dynamic Card showcasing current tier perks */}
            <div className="tier-preview-box">
              <span className="preview-label">Paket Dipilih:</span>
              <h4 className="preview-name">{selectedTierData.name}</h4>
              <span className="preview-price">{selectedTierData.price}</span>
              <div className="preview-divider"></div>
              <ul className="preview-benefits">
                {selectedTierData.benefits.map((benefit, i) => (
                  <li key={i}>✓ {benefit}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Side: The Interactive Registration Form */}
        <div className="member-form-column reveal-right reveal-delay-1">
          {!submitted ? (
            <form className="premium-card member-form" onSubmit={handleSubmit}>
              <h3 className="form-title">Formulir Pendaftaran</h3>
              <p className="form-subtitle">Lengkapi detail Anda & hewan kesayangan di bawah ini:</p>
              
              {errorMsg && <div className="form-error">{errorMsg}</div>}

              <div className="form-group">
                <label className="form-label" htmlFor="namaLengkap">Nama Lengkap Pemilik</label>
                <input 
                  type="text" 
                  id="namaLengkap" 
                  name="owner_name" 
                  className={`form-input ${activeErrorField === 'owner_name' ? 'is-invalid' : ''}`}
                  ref={ownerNameInputRef}
                  placeholder="Contoh: Prabowo"
                  value={formData.owner_name}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="namaHewan">Nama Hewan</label>
                  <input 
                    type="text" 
                    id="namaHewan" 
                    name="pet_name" 
                    className={`form-input ${activeErrorField === 'pet_name' ? 'is-invalid' : ''}`}
                    ref={petNameInputRef}
                    placeholder="Contoh: Teddy"
                    value={formData.pet_name}
                    onChange={handleChange}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="jenisHewan">Jenis Hewan</label>
                  <select 
                    id="jenisHewan" 
                    name="pet_type" 
                    className="form-select"
                    value={formData.pet_type}
                    onChange={handleChange}
                  >
                    <option value="Kucing">Kucing</option>
                    <option value="Anjing">Anjing</option>

                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="whatsapp">Nomor WhatsApp</label>
                <input 
                  type="tel" 
                  inputMode="numeric"
                  maxLength={15}
                  id="whatsapp" 
                  name="phone" 
                  className={`form-input ${activeErrorField === 'phone' ? 'is-invalid' : ''}`}
                  ref={phoneInputRef}
                  placeholder="Contoh: 08123456789"
                  value={formData.phone}
                  onChange={(e) => {
                    if (activeErrorField === 'phone') setActiveErrorField(null);
                    setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") });
                  }}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Pilih Paket Membership</label>
                <div className="tier-selector">
                  {MEMBER_TIERS.map((tier) => (
                    <button 
                      key={tier.id}
                      type="button" 
                      className={`tier-option-label ${formData.package_type === tier.name ? 'active' : ''}`}
                      onClick={() => setFormData({ ...formData, package_type: tier.name })}
                      style={{
                        border: formData.package_type === tier.name ? '1px solid var(--primary)' : '1px solid var(--border)',
                        backgroundColor: formData.package_type === tier.name ? 'rgba(255, 122, 69, 0.08)' : 'var(--card-bg)',
                        color: formData.package_type === tier.name ? 'var(--primary-hover)' : 'var(--text)'
                      }}
                    >
                      <span className="tier-option-name">{tier.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-submit-form">
                Kirim Pendaftaran →
              </button>
            </form>
          ) : (
            /* Celebrate Membership Success state */
            <div className="premium-card success-card animate-fade-in">
              <div className="success-icon-wrapper">
                <svg className="success-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="40" height="40">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              
              <h3 className="success-title">Pendaftaran Berhasil!</h3>
              <p className="success-msg">
                Selamat! Anda dan <strong>{formData.pet_name}</strong> kini resmi menjadi anggota dari keluarga besar Rifky PawCare.
              </p>
              
              <div className="card-receipt">
                <div className="receipt-row">
                  <span className="receipt-label">Nama Anggota:</span>
                  <span className="receipt-value">{formData.owner_name}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Nama Peliharaan:</span>
                  <span className="receipt-value">{formData.pet_name} ({formData.pet_type})</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Tipe Paket:</span>
                  <span className="receipt-value highlight">{selectedTierData.name}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">WhatsApp:</span>
                  <span className="receipt-value">{formData.phone}</span>
                </div>
                <div className="receipt-divider"></div>
                <p className="receipt-note">
                  Kartu member digital dan petunjuk aktivasi promo telah dikirimkan ke nomor WhatsApp Anda.
                </p>
              </div>

              <button className="btn btn-secondary btn-block" onClick={handleReset}>
                Daftar Member Lain
              </button>
            </div>
          )}
        </div>
      </div>

      {popup && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-card" onClick={(e) => e.stopPropagation()}>
            <div className={`popup-icon ${popup.type === "success" ? "success" : "error"}`}>
              {popup.type === "success" ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="36" height="36" className="animate-popScale">
                  <path d="M12 5c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5s1.5-.7 1.5-1.5S12.8 5 12 5zm-4 2c-.8 0-1.5.7-1.5 1.5S7.2 10 8 10s1.5-.7 1.5-1.5S8.8 7 8 7zm8 0c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5s1.5-.7 1.5-1.5S16.8 7 16 7zm-4 4c-2.2 0-4 1.8-4 4s1.8 4 4 4s4-1.8 4-4s-1.8-4-4-4z" fill="currentColor" opacity="0.2" stroke="none" />
                  <polyline points="20 6 9 17 4 12" stroke="var(--success)" strokeWidth="3" />
                </svg>
              ) : activeErrorField === 'phone' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32" className="animate-popScale">
                  <path d="M12 5c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5s1.5-.7 1.5-1.5S12.8 5 12 5zm-4 2c-.8 0-1.5.7-1.5 1.5S7.2 10 8 10s1.5-.7 1.5-1.5S8.8 7 8 7zm8 0c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5s1.5-.7 1.5-1.5S16.8 7 16 7zm-4 4c-2.2 0-4 1.8-4 4s1.8 4 4 4s4-1.8 4-4s-1.8-4-4-4z" fill="currentColor" opacity="0.15" stroke="none" />
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" strokeWidth="2.5" />
                  
                  {/* Circle Mask without outline stroke */}
                  <circle cx="18" cy="6" r="5" fill="#1b110d" stroke="none" />
                  {/* Cross lines */}
                  <line x1="15" y1="3" x2="21" y2="9" strokeWidth="2.5" />
                  <line x1="21" y1="3" x2="15" y2="9" strokeWidth="2.5" />
                </svg>
              ) : (activeErrorField === 'owner_name' || activeErrorField === 'pet_name') ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32" className="animate-popScale">
                  <path d="M12 5c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5s1.5-.7 1.5-1.5S12.8 5 12 5zm-4 2c-.8 0-1.5.7-1.5 1.5S7.2 10 8 10s1.5-.7 1.5-1.5S8.8 7 8 7zm8 0c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5s1.5-.7 1.5-1.5S16.8 7 16 7zm-4 4c-2.2 0-4 1.8-4 4s1.8 4 4 4s4-1.8 4-4s-1.8-4-4-4z" fill="currentColor" opacity="0.15" stroke="none" />
                  <path d="M18 21v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1" strokeWidth="2.5" />
                  <circle cx="11" cy="7" r="4" strokeWidth="2.5" />
                  
                  {/* Circle Mask without outline stroke */}
                  <circle cx="18" cy="6" r="5" fill="#1b110d" stroke="none" />
                  {/* Cross lines */}
                  <line x1="15" y1="3" x2="21" y2="9" strokeWidth="2.5" />
                  <line x1="21" y1="3" x2="15" y2="9" strokeWidth="2.5" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="36" height="36" className="animate-popScale">
                  <path d="M12 5c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5s1.5-.7 1.5-1.5S12.8 5 12 5zm-4 2c-.8 0-1.5.7-1.5 1.5S7.2 10 8 10s1.5-.7 1.5-1.5S8.8 7 8 7zm8 0c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5s1.5-.7 1.5-1.5S16.8 7 16 7zm-4 4c-2.2 0-4 1.8-4 4s1.8 4 4 4s4-1.8 4-4s-1.8-4-4-4z" fill="currentColor" opacity="0.2" stroke="none" />
                  <line x1="12" y1="8" x2="12" y2="13" stroke="var(--primary)" strokeWidth="3" />
                  <circle cx="12" cy="17" r="1.5" fill="var(--primary)" />
                </svg>
              )}
            </div>

            <h3 className="popup-title">
              {popup.title}
            </h3>

            <p className="popup-message" style={{ whiteSpace: 'pre-line' }}>
              {popup.message}
            </p>

            <button
              onClick={closePopup}
              className="popup-close-btn"
            >
              {popup.buttonText || "Mengerti"}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes popScale {
          0% {
            transform: scale(0) rotate(-180deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.15);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-popScale {
          animation: popScale 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          animation-delay: 0.1s;
        }

        .bg-warm-member {
          background: linear-gradient(180deg, rgba(255, 122, 69, 0.02) 0%, transparent 100%);
        }

        .member-layout {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 3rem;
          width: 100%;
          margin-top: 1rem;
        }

        /* Perks Column Styles */
        .perks-card {
          padding: 2.5rem;
          background-color: var(--card-bg);
          height: 100%;
          border-radius: 24px;
        }

        .perks-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--text-h);
          margin-bottom: 0.5rem;
        }

        .perks-subtitle {
          font-size: 0.95rem;
          color: var(--text);
          opacity: 0.8;
          margin-bottom: 2rem;
          text-align: left;
        }

        .perks-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .perks-item {
          display: flex;
          align-items: flex-start;
          gap: 1.25rem;
          text-align: left;
        }

        .perk-icon {
          font-size: 1.75rem;
          line-height: 1;
        }

        .perk-text {
          display: flex;
          flex-direction: column;
        }

        .perk-text strong {
          font-family: var(--font-heading);
          font-size: 1.05rem;
          color: var(--text-h);
          margin-bottom: 0.25rem;
        }

        .perk-text span {
          font-size: 0.9rem;
          color: var(--text);
          opacity: 0.85;
          line-height: 1.4;
        }

        .tier-preview-box {
          background-color: rgba(255, 122, 69, 0.04);
          border: 1px dashed var(--primary);
          border-radius: 16px;
          padding: 1.5rem;
          text-align: left;
        }

        .preview-label {
          font-size: 0.75rem;
          color: var(--text);
          opacity: 0.6;
          text-transform: uppercase;
          font-weight: 600;
        }

        .preview-name {
          font-size: 1.3rem;
          color: var(--primary);
          font-weight: 700;
        }

        .preview-price {
          font-family: var(--font-heading);
          font-size: 0.95rem;
          color: var(--text-h);
          font-weight: 600;
        }

        .preview-divider {
          height: 1px;
          background-color: var(--border);
          margin: 0.85rem 0;
        }

        .preview-benefits {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .preview-benefits li {
          font-size: 0.88rem;
          color: var(--text);
          font-weight: 500;
        }

        /* Member Form Column Styles */
        .member-form {
          padding: 2.5rem;
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--text-h);
        }

        .form-subtitle {
          font-size: 0.9rem;
          color: var(--text);
          opacity: 0.8;
          text-align: left;
          margin-top: -1rem;
        }

        .form-error {
          background-color: rgba(255, 122, 69, 0.08);
          border: 1px solid var(--primary);
          color: var(--primary-hover);
          padding: 0.75rem 1rem;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 600;
          text-align: left;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .tier-selector {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          width: 100%;
        }

        .tier-option-label {
          border: 1px solid var(--border);
          padding: 0.75rem 0.5rem;
          border-radius: 12px;
          cursor: pointer;
          font-family: var(--font-heading);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .tier-radio-input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
        }

        .tier-option-label:hover {
          border-color: var(--primary);
          background-color: rgba(255, 122, 69, 0.02);
        }

        .tier-option-label.active {
          border-color: var(--primary);
          background-color: rgba(255, 122, 69, 0.08);
          color: var(--primary-hover);
        }

        .btn-submit-form {
          width: 100%;
          margin-top: 1rem;
          padding: 0.9rem !important;
        }

        /* Success Card Styles */
        .success-card {
          padding: 3rem 2.5rem;
          border-radius: 24px;
          text-align: center;
          align-items: center;
        }

        .success-icon-wrapper {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background-color: rgba(82, 196, 26, 0.1);
          color: var(--success);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .success-title {
          font-size: 1.6rem;
          color: var(--text-h);
          margin-bottom: 0.75rem;
        }

        .success-msg {
          font-size: 1rem;
          color: var(--text);
          margin-bottom: 2rem;
        }

        .card-receipt {
          background-color: rgba(74, 59, 50, 0.02);
          border: 1px solid var(--border);
          border-radius: 16px;
          width: 100%;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 2rem;
          text-align: left;
        }

        .receipt-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
        }

        .receipt-label {
          color: var(--text);
          opacity: 0.7;
        }

        .receipt-value {
          font-weight: 600;
          color: var(--text-h);
        }

        .receipt-value.highlight {
          color: var(--primary);
          font-weight: 700;
        }

        .receipt-divider {
          height: 1px;
          background-color: var(--border);
          margin: 0.5rem 0;
        }

        .receipt-note {
          font-size: 0.8rem;
          color: var(--text);
          opacity: 0.75;
          line-height: 1.4;
          text-align: center;
        }

        @media (max-width: 1024px) {
          .member-layout {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
        }

        @media (max-width: 500px) {
          .form-row {
            grid-template-columns: 1fr;
          }

          .tier-selector {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }
        }
      `}</style>
    </section>
  );
}
