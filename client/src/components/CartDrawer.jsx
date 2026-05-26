import { useState, useRef } from 'react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalPrice,
  } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [popup, setPopup] = useState(null);
  const [activeErrorField, setActiveErrorField] = useState(null);

  const customerNameInputRef = useRef(null);
  const phoneInputRef = useRef(null);

  const showPopup = (type, title, message, buttonText = "Mengerti") => {
    setPopup({ type, title, message, buttonText });
  };

  const closePopup = () => {
    setPopup(null);
    if (activeErrorField === 'phone') {
      setTimeout(() => phoneInputRef.current?.focus(), 50);
    } else if (activeErrorField === 'customer_name') {
      setTimeout(() => customerNameInputRef.current?.focus(), 50);
    }
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!customerName || !phone) {
      showPopup(
        "error",
        "Data Tidak Lengkap",
        "Silakan isi nama dan nomor telepon terlebih dahulu."
      );
      return;
    }

    if (/[^a-zA-Z\s]/.test(customerName)) {
      showPopup(
        "error",
        "Nama Pelanggan Tidak Valid",
        "Nama hanya boleh berisi huruf (A-Z, a-z) dan spasi. Angka atau simbol tidak diperbolehkan.",
        "Perbaiki Nama"
      );
      setActiveErrorField("customer_name");
      return;
    }

    if (!/^08/.test(phone) || phone.length < 9) {
      showPopup(
        "error",
        "Nomor WhatsApp Tidak Valid",
        "Pastikan nomor hanya berisi angka, diawali 08, dan minimal 9 digit.\nContoh: 081234567890",
        "Cek Lagi"
      );
      setActiveErrorField("phone");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://api-pawcare.rifkydevs.my.id/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_name: customerName,
          phone: phone,
          cartItems,
          totalPrice,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Data tidak valid.");
      }

      showPopup(
        "success",
        "Checkout Berhasil",
        "Pesanan Anda berhasil dikirim. Tim PawCare akan segera menghubungi Anda."
      );
      setSuccess(true);
      setOrderId(result.order_id);
      clearCart();
      setCustomerName('');
      setPhone('');
    } catch (error) {
      const errMsg = error.message.toLowerCase();
      const isPhoneErr = errMsg.includes('nomor') || errMsg.includes('phone') || errMsg.includes('whatsapp');
      const isNameErr = errMsg.includes('nama') || errMsg.includes('customer') || errMsg.includes('pelanggan');
      
      let field = null;
      if (isPhoneErr) field = 'phone';
      else if (isNameErr) field = 'customer_name';

      showPopup(
        "error",
        isPhoneErr ? "Nomor WhatsApp Tidak Valid" : isNameErr ? "Nama Tidak Valid" : "Checkout Gagal",
        error.message || "Periksa kembali data yang Anda isi.",
        isPhoneErr ? "Cek Lagi" : isNameErr ? "Perbaiki Nama" : "Mengerti"
      );
      if (field) {
        setActiveErrorField(field);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccess = () => {
    setSuccess(false);
    setOrderId(null);
    setIsCartOpen(false);
  };

  return (
    <>
      {/* Dark Blur Backdrop Overlay */}
      <div 
        className={`cart-overlay ${isCartOpen ? 'active' : ''}`} 
        onClick={() => {
          if (!success) setIsCartOpen(false);
        }}
      />

      {/* Cart Drawer Panel */}
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        
        {/* Drawer Header */}
        <div className="cart-header">
          <h2>Keranjang Belanja</h2>
          <button 
            className="btn-close" 
            onClick={() => setIsCartOpen(false)} 
            aria-label="Tutup Keranjang"
          >
            <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Dynamic Panel Content */}
        {success ? (
          /* Premium Success State */
          <div className="cart-success-state">
            <div className="success-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="success-check-icon">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3>Pesanan Dikirim!</h3>
            <p className="success-desc">
              Terima kasih telah berbelanja di PawCare, <strong>{customerName || 'Kak'}</strong>. Pesanan Anda berhasil disimpan.
            </p>
            {orderId && (
              <div className="success-badge-order">
                ID Pesanan: <span>#{orderId}</span>
              </div>
            )}
            <p className="success-info">
              Tim kami akan segera menghubungi nomor WhatsApp Anda untuk konfirmasi pembayaran dan pengiriman produk.
            </p>
            <button className="btn btn-primary btn-block" onClick={handleCloseSuccess}>
              Lanjut Belanja
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          /* Empty State */
          <div className="cart-empty-state">
            <span className="empty-emoji">🛒</span>
            <h3>Keranjang Kosong</h3>
            <p>
              Hewan kesayangan Anda menunggu produk terbaik! Yuk, isi keranjang dengan pilihan produk premium kami.
            </p>
            <button className="btn btn-secondary" onClick={() => setIsCartOpen(false)}>
              Mulai Belanja
            </button>
          </div>
        ) : (
          /* Active Cart Items List & Checkout Form */
          <>
            <div className="cart-items-container">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  
                  {/* Info Column */}
                  <div className="cart-item-details">
                    <span className="item-category">{item.category}</span>
                    <h4 className="item-name">{item.name}</h4>
                    <span className="item-price">{formatPrice(item.price)}</span>
                  </div>

                  {/* Right Actions Column */}
                  <div className="cart-item-actions">
                    
                    {/* Quantity Selector */}
                    <div className="qty-selector">
                      <button 
                        className="qty-btn" 
                        onClick={() => updateQuantity(item.id, -1)}
                        aria-label="Kurang quantity"
                      >
                        -
                      </button>
                      <span className="qty-val">{item.quantity}</span>
                      <button 
                        className="qty-btn" 
                        onClick={() => updateQuantity(item.id, 1)}
                        aria-label="Tambah quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal & Delete Actions */}
                    <div className="subtotal-del-box">
                      <span className="item-subtotal">{formatPrice(item.price * item.quantity)}</span>
                      <button 
                        className="btn-delete" 
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Hapus dari keranjang"
                      >
                        Hapus
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* Checkout & Summary Footer */}
            <div className="cart-footer">
              <div className="cart-summary">
                <span className="summary-label">Total Harga:</span>
                <span className="summary-val">{formatPrice(totalPrice)}</span>
              </div>

              {/* Checkout Form */}
              <form onSubmit={handleCheckout} className="cart-checkout-form">
                <div className="form-group small-group">
                  <label htmlFor="cart-name" className="form-label">Nama Lengkap</label>
                  <input
                    type="text"
                    id="cart-name"
                    className={`form-input ${activeErrorField === 'customer_name' ? 'is-invalid' : ''}`}
                    ref={customerNameInputRef}
                    placeholder="Contoh: Jokowi"
                    value={customerName}
                    onChange={(e) => {
                      if (activeErrorField === 'customer_name') setActiveErrorField(null);
                      setCustomerName(e.target.value);
                    }}
                    required
                  />
                </div>
                
                <div className="form-group small-group">
                  <label htmlFor="cart-phone" className="form-label">Nomor WhatsApp</label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={15}
                    id="cart-phone"
                    className={`form-input ${activeErrorField === 'phone' ? 'is-invalid' : ''}`}
                    ref={phoneInputRef}
                    placeholder="Contoh: 08571234567"
                    value={phone}
                    onChange={(e) => {
                      if (activeErrorField === 'phone') setActiveErrorField(null);
                      setPhone(e.target.value.replace(/\D/g, ""));
                    }}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary btn-block btn-checkout"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loader-box">
                      <span className="loader-dot"></span>
                      Memproses...
                    </span>
                  ) : 'Selesaikan Pesanan →'}
                </button>
              </form>
            </div>
          </>
        )}
      </div>

      <style>{`
        /* Overlay Backdrop styling */
        .cart-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(35, 27, 21, 0.4);
          backdrop-filter: blur(0px);
          opacity: 0;
          pointer-events: none;
          z-index: 1050;
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        }

        .cart-overlay.active {
          opacity: 1;
          pointer-events: auto;
          backdrop-filter: blur(8px);
        }

        /* Cart Sidebar Drawer Panel */
        .cart-drawer {
          position: fixed;
          top: 0;
          right: 0;
          width: 100%;
          max-width: 480px;
          height: 100%;
          background-color: var(--card-bg);
          box-shadow: var(--shadow-lg);
          border-left: 1px solid var(--border);
          z-index: 1060;
          display: flex;
          flex-direction: column;
          transform: translateX(100%);
          transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        }

        .cart-drawer.open {
          transform: translateX(0);
        }

        /* Drawer Header */
        .cart-header {
          padding: 1.5rem 2rem;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .cart-header h2 {
          font-size: 1.4rem;
          margin-bottom: 0;
        }

        .cart-header h2::after {
          display: none;
        }

        .btn-close {
          background: none;
          border: none;
          color: var(--text);
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .btn-close:hover {
          background-color: rgba(var(--secondary-rgb), 0.05);
          color: var(--primary);
          transform: scale(1.1);
        }

        /* Scrollable items container */
        .cart-items-container {
          flex-grow: 1;
          overflow-y: auto;
          padding: 1.5rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .cart-item {
          display: flex;
          justify-content: space-between;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid rgba(var(--secondary-rgb), 0.05);
          align-items: flex-start;
          gap: 1rem;
        }

        .cart-item-details {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          flex-grow: 1;
        }

        .item-category {
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.25rem;
        }

        .item-name {
          font-size: 1rem;
          color: var(--text-h);
          margin-bottom: 0.25rem;
          font-weight: 600;
        }

        .item-price {
          font-size: 0.9rem;
          color: var(--text);
          opacity: 0.85;
        }

        /* Action elements (Qty + Subtotal) */
        .cart-item-actions {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.75rem;
          flex-shrink: 0;
        }

        /* Qty selector buttons */
        .qty-selector {
          display: flex;
          align-items: center;
          background-color: rgba(var(--secondary-rgb), 0.03);
          border: 1px solid var(--border);
          border-radius: 50px;
          padding: 0.2rem 0.5rem;
          gap: 0.75rem;
        }

        .qty-btn {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: none;
          background: none;
          color: var(--text-h);
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .qty-btn:hover {
          background-color: var(--primary);
          color: #ffffff;
        }

        .qty-val {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--text-h);
          min-width: 16px;
          text-align: center;
        }

        .subtotal-del-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .item-subtotal {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--text-h);
        }

        .btn-delete {
          background: none;
          border: none;
          color: #ff4d4f;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .btn-delete:hover {
          background-color: rgba(255, 77, 79, 0.08);
          transform: translateY(-1px);
        }

        /* Cart Empty State */
        .cart-empty-state {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 2rem;
          text-align: center;
          gap: 1.25rem;
        }

        .empty-emoji {
          font-size: 3.5rem;
          animation: floatSlow 3s ease-in-out infinite alternate;
        }

        @keyframes floatSlow {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-8px) scale(1.05); }
        }

        .cart-empty-state p {
          font-size: 0.95rem;
          color: var(--text);
          opacity: 0.8;
          max-width: 320px;
          line-height: 1.6;
        }

        /* Cart Footer (Summary & Form) */
        .cart-footer {
          border-top: 1px solid var(--border);
          padding: 1.5rem 2rem;
          background-color: rgba(var(--secondary-rgb), 0.01);
          box-shadow: 0 -4px 12px rgba(74, 59, 50, 0.02);
        }

        .cart-summary {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }

        .summary-label {
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text);
        }

        .summary-val {
          font-family: var(--font-heading);
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--primary);
        }

        .cart-checkout-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .small-group {
          gap: 0.35rem;
        }

        .small-group label {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-h);
        }

        .form-input {
          padding: 0.65rem 1rem;
          border-radius: 12px;
          border: 1px solid var(--border);
          background-color: var(--card-bg);
          font-family: var(--font-sans);
          font-size: 0.9rem;
          color: var(--text-h);
          transition: all 0.3s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(255, 122, 69, 0.1);
        }

        .btn-checkout {
          padding: 0.8rem 1.5rem !important;
          border-radius: 14px !important;
          font-size: 0.95rem !important;
          margin-top: 0.5rem;
        }

        /* Loader inside checkout */
        .loader-box {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          justify-content: center;
        }

        .loader-dot {
          width: 8px;
          height: 8px;
          background-color: #ffffff;
          border-radius: 50%;
          display: inline-block;
          animation: scalePulse 1.2s infinite ease-in-out;
        }

        @keyframes scalePulse {
          0%, 100% { transform: scale(0.6); opacity: 0.4; }
          50% { transform: scale(1.2); opacity: 1; }
        }

        /* Success State View styling */
        .cart-success-state {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 2rem;
          text-align: center;
          gap: 1.25rem;
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
          margin-bottom: 0.5rem;
          animation: popScale 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        .success-check-icon {
          width: 32px;
          height: 32px;
        }

        @keyframes popScale {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .cart-success-state h3 {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-h);
        }

        .success-desc {
          font-size: 0.95rem;
          color: var(--text);
          line-height: 1.5;
        }

        .success-badge-order {
          background-color: rgba(var(--secondary-rgb), 0.04);
          border: 1px dashed var(--border);
          padding: 0.5rem 1.25rem;
          border-radius: 12px;
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--text-h);
        }

        .success-badge-order span {
          color: var(--primary);
        }

        .success-info {
          font-size: 0.85rem;
          color: var(--text);
          opacity: 0.75;
          line-height: 1.5;
          margin-bottom: 1rem;
        }

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
      `}</style>

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
              ) : activeErrorField === 'customer_name' ? (
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
    </>
  );
}
