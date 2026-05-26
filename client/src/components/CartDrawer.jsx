import { useState } from 'react';
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
      alert("Silakan isi nama dan nomor telepon terlebih dahulu.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/orders", {
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

      if (response.ok) {
        setSuccess(true);
        setOrderId(result.order_id);
        clearCart();
        setCustomerName('');
        setPhone('');
      } else {
        alert(result.message || "Gagal mengirim pesanan");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan jaringan saat melakukan checkout.");
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
                    className="form-input"
                    placeholder="Contoh: Rifky Muslim"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group small-group">
                  <label htmlFor="cart-phone" className="form-label">Nomor WhatsApp</label>
                  <input
                    type="tel"
                    id="cart-phone"
                    className="form-input"
                    placeholder="Contoh: 08571234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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
      `}</style>
    </>
  );
}
