import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

const API_URL = import.meta.env.VITE_API_URL || 'https://api-pawcare.rifkydevs.my.id';

const PRODUCT_LIST = [
  {
    id: 1,
    name: "Whiskas Premium Choice",
    category: "Makanan",
    description: "Makanan basah bergizi tinggi untuk kucing dewasa, menjaga bulu lebat dan sehat.",
    price: 185000,
    rating: 5,
    reviews: 120,
    svg: (
      <svg className="prod-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="55" r="30" fill="var(--primary-hover)" opacity="0.1" />
        {/* Cat Food Can */}
        <rect x="35" y="38" width="30" height="34" rx="4" fill="var(--primary)" />
        <rect x="33" y="34" width="34" height="4" rx="1" fill="var(--accent)" />
        <rect x="35" y="44" width="30" height="10" fill="var(--card-bg)" />
        <circle cx="50" cy="49" r="3" fill="var(--primary)" />
        {/* Decorative fish on label */}
        <path d="M47 49c1.5 0 3-1 3.5-1.5c-.5.5-2 1.5-3.5 1.5c-1 0-1.5-.5-2-1c-.5.5-1 1-2 1c-1.5 0-3-1-3.5-1.5c.5.5 2 1.5 3.5 1.5c1 0 1.5-.5 2-1c.5.5 1 1 2 1zm7-1.5l2-1.5v3l-2-1.5z" fill="var(--primary)" />
        <line x1="38" y1="62" x2="62" y2="62" stroke="var(--card-bg)" strokeWidth="2" strokeLinecap="round" />
        <line x1="42" y1="66" x2="58" y2="66" stroke="var(--card-bg)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 2,
    name: "Dino Cozy Cat Condo",
    category: "Aksesoris",
    description: "Rumah pohon kucing minimalis modern dengan tiang garukan dari serat kelapa alami.",
    price: 350000,
    rating: 5,
    reviews: 84,
    svg: (
      <svg className="prod-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="55" r="30" fill="var(--accent)" opacity="0.15" />
        {/* Cat Tree */}
        <rect x="47" y="35" width="6" height="45" fill="var(--secondary)" rx="1" />
        <line x1="47" y1="45" x2="53" y2="45" stroke="var(--border)" strokeWidth="2" />
        <line x1="47" y1="55" x2="53" y2="55" stroke="var(--border)" strokeWidth="2" />
        <line x1="47" y1="65" x2="53" y2="65" stroke="var(--border)" strokeWidth="2" />
        {/* Bottom Base */}
        <rect x="25" y="76" width="50" height="6" rx="2" fill="var(--secondary)" />
        {/* Middle Platform */}
        <rect x="30" y="55" width="20" height="4" rx="1" fill="var(--primary)" />
        {/* Top Bed */}
        <rect x="40" y="32" width="30" height="6" rx="2" fill="var(--primary)" />
        <path d="M43 32a7 7 0 0 1 14 0" fill="var(--accent)" opacity="0.4" />
      </svg>
    ),
  },
  {
    id: 3,
    name: "Dog Chew Bone Toy",
    category: "Mainan",
    description: "Mainan kunyah tulang karet TPR elastis food-grade, aman untuk merangsang gigi anjing.",
    price: 45000,
    rating: 4,
    reviews: 96,
    svg: (
      <svg className="prod-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="55" r="30" fill="var(--primary)" opacity="0.1" />
        {/* Bone */}
        <g transform="rotate(-30 50 50)">
          <rect x="32" y="46" width="36" height="8" rx="2" fill="var(--primary)" />
          <circle cx="31" cy="45" r="7" fill="var(--primary)" />
          <circle cx="31" cy="53" r="7" fill="var(--primary)" />
          <circle cx="69" cy="45" r="7" fill="var(--primary)" />
          <circle cx="69" cy="53" r="7" fill="var(--primary)" />

          <circle cx="31" cy="45" r="3" fill="var(--accent)" opacity="0.6" />
          <circle cx="69" cy="45" r="3" fill="var(--accent)" opacity="0.6" />
        </g>
      </svg>
    ),
  },
  {
    id: 4,
    name: "Organic Honey Shampoo",
    category: "Kesehatan",
    description: "Sampo organik dengan ekstrak lidah buaya, melembutkan bulu dan mencegah kutu.",
    price: 85000,
    rating: 5,
    reviews: 63,
    svg: (
      <svg className="prod-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="55" r="30" fill="var(--secondary)" opacity="0.1" />
        {/* Shampoo Bottle */}
        <path d="M38 35c0-4 4-7 12-7s12 3 12 7v38c0 3-3 6-6 6H44c-3 0-6-3-6-6V35z" fill="var(--secondary)" />
        <rect x="46" y="22" width="8" height="6" rx="1" fill="var(--primary)" />
        {/* Label */}
        <path d="M38 46h24v14H38V46z" fill="var(--accent)" />
        {/* Droplet icon on label */}
        <path d="M50 49c-2 0-3.5 1.5-3.5 3.5s3.5 4.5 3.5 4.5s3.5-2.5 3.5-4.5S52 49 50 49z" fill="var(--secondary)" />
      </svg>
    ),
  },
];

export default function Products() {
  const { addToCart } = useCart();
  const [toastMessage, setToastMessage] = useState("");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${API_URL}/api/products`)
      .then((res) => {
        if (!res.ok) throw new Error('API error');
        return res.json();
      })
      .then((data) => {
        // Gabungkan data API dengan metadata lokal (rating, svg, category)
        const enriched = data.map((apiItem) => {
          const local = PRODUCT_LIST.find((p) => p.id === apiItem.id);
          return { ...apiItem, ...local, ...apiItem }; // API data takes precedence for price/name
        });
        setProducts(enriched.length > 0 ? enriched : PRODUCT_LIST);
      })
      .catch(() => {
        // API mati — gunakan data lokal sebagai fallback
        console.warn('API tidak dapat dijangkau, menggunakan data lokal.');
        setProducts(PRODUCT_LIST);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const formatPrice = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handlePurchase = (product) => {
    addToCart(product);
    setToastMessage(`🎉 Berhasil memasukkan ${product.name} ke keranjang!`);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  return (
    <section id="products" className="section bg-light-gradient">
      <div className="section-title-wrapper reveal reveal-up">
        <span className="section-subtitle font-heading">Produk Unggulan</span>
        <h2>Koleksi Kebutuhan Hewan</h2>
        <p className="section-description">Hanya produk berkualitas tinggi dari brand terpercaya untuk menjamin kesehatan, kenyamanan, dan kebahagiaan hewan peliharaan Anda.</p>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-4 product-grid reveal-stagger">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="premium-card product-card reveal reveal-scale" style={{ minHeight: 320 }}>
              <div style={{ background: 'rgba(74,59,50,0.06)', borderRadius: 12, height: 180, marginBottom: '1.5rem', animation: 'shimmer 1.5s infinite' }} />
              <div style={{ background: 'rgba(74,59,50,0.06)', borderRadius: 8, height: 16, marginBottom: '0.75rem', width: '70%' }} />
              <div style={{ background: 'rgba(74,59,50,0.06)', borderRadius: 8, height: 12, width: '90%' }} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-4 product-grid reveal-stagger">
          {products.map((product) => (
            <div key={product.id} className="premium-card product-card reveal reveal-scale">
              {/* Category Tag */}
              <span className="product-tag">{product.category}</span>

              {/* Visual Vector Container */}
              <div className="product-visual">
                {product.svg || PRODUCT_LIST.find((p) => p.id === product.id)?.svg || (
                  <svg className="prod-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="55" r="30" fill="var(--primary)" opacity="0.1" />
                    <path d="M50 35c-8.3 0-15 6.7-15 15s6.7 15 15 15 15-6.7 15-15-6.7-15-15-15zm0 25c-5.5 0-10-4.5-10-10s4.5-10 10-10 10 4.5 10 10-4.5 10-10 10z" fill="var(--primary)" />
                  </svg>
                )}
              </div>

              {/* Product Meta */}
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-desc clickable-desc" onClick={() => setSelectedProduct(product)} title="Klik untuk membaca selengkapnya">
                  {product.description}
                </p>

                {/* Star Rating */}
                <div className="product-rating">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`star-icon ${i < (product.rating || 5) ? "active" : ""}`} viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <span className="reviews">({product.review_count || product.reviews || 0} ulasan)</span>
                </div>
              </div>

              {/* Price & Action */}
              <div className="product-footer">
                <div className="product-price">
                  <span className="price-label">Harga</span>
                  <span className="price-val">{formatPrice(product.price)}</span>
                </div>
                <button className="btn btn-primary btn-buy" onClick={() => handlePurchase(product)} aria-label={`Beli ${product.name}`}>
                  Beli
                  <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interactive Toast Notification */}
      {toastMessage && (
        <div className="purchase-toast">
          <div className="toast-content">{toastMessage}</div>
        </div>
      )}

      {/* Description Modal */}
      {selectedProduct && (
        <div className="desc-modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="desc-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="desc-modal-close" onClick={() => setSelectedProduct(null)} aria-label="Tutup">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M13 1L1 13M1 1l12 12" />
              </svg>
            </button>
            <h3 style={{ marginTop: 0, marginBottom: '0.25rem', color: 'var(--text-h)', fontSize: '1.25rem' }}>
              {selectedProduct.name}
            </h3>
            <div style={{ fontSize: '0.8rem', color: 'var(--primary)', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: 'bold' }}>
              {selectedProduct.category}
            </div>
            <p style={{ color: 'var(--text)', lineHeight: 1.6, margin: 0, fontSize: '0.95rem' }}>
              {selectedProduct.description}
            </p>
          </div>
        </div>
      )}

      <style>{`
        .bg-light-gradient {
          background: linear-gradient(180deg, transparent 0%, rgba(255, 122, 69, 0.02) 100%);
        }

        .product-grid {
          margin-top: 1rem;
        }

        .product-card {
          justify-content: space-between;
          padding: 1.5rem;
          height: 100%;
        }

        .product-tag {
          position: absolute;
          top: 1.25rem;
          left: 1.25rem;
          background-color: var(--primary);
          color: #ffffff;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.3rem 0.8rem;
          border-radius: 50px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          z-index: 5;
        }

        .product-visual {
          width: 100%;
          height: 180px;
          border-radius: 12px;
          background-color: rgba(74, 59, 50, 0.02);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          overflow: hidden;
          transition: background-color 0.3s ease;
          border: 1px solid var(--border);
        }

        .product-card:hover .product-visual {
          background-color: rgba(255, 122, 69, 0.04);
        }

        .prod-svg {
          width: 100px;
          height: 100px;
          transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .product-card:hover .prod-svg {
          transform: scale(1.15) rotate(5deg);
        }

        .product-info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          text-align: left;
          flex-grow: 1;
        }

        .product-name {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-h);
        }

        .product-desc {
          font-size: 0.88rem;
          color: var(--text);
          opacity: 0.8;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.5;
          margin-bottom: 0.5rem;
        }

        .product-rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .stars {
          display: flex;
          color: #d1d5db; /* Grey star color */
        }

        .star-icon.active {
          color: #fbbf24; /* Golden star color */
        }

        .reviews {
          font-size: 0.8rem;
          color: var(--text);
          opacity: 0.65;
        }

        .product-footer {
          border-top: 1px solid var(--border);
          padding-top: 1rem;
          margin-top: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .product-price {
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
          color: var(--primary);
        }

        .btn-buy {
          padding: 0.5rem 1rem !important;
          border-radius: 12px !important;
          font-size: 0.88rem !important;
          box-shadow: none !important;
        }

        .btn-buy:hover {
          transform: scale(1.05) translateY(-1px) !important;
        }

        /* Ultra-Premium Compact Toast Styles */
        .purchase-toast {
          position: fixed;
          bottom: 32px;
          right: 32px;
          background: rgba(30, 22, 18, 0.85); /* Sleek dark glass */
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          color: #fbeee3;
          border: 1px solid rgba(255, 122, 69, 0.4);
          padding: 0.75rem 1.25rem;
          border-radius: 100px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4), 0 0 12px rgba(255, 122, 69, 0.2) inset;
          z-index: 1100;
          transform-origin: bottom right;
          animation: premiumJellyPop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          max-width: calc(100vw - 64px);
          width: max-content;
        }

        @keyframes premiumJellyPop {
          0% { 
            transform: translateY(100px) scale(0.5) rotate(5deg); 
            opacity: 0; 
            filter: blur(5px);
          }
          40% { 
            transform: translateY(-10px) scale(1.02) rotate(-2deg); 
            opacity: 1; 
            filter: blur(0px);
          }
          70% { 
            transform: translateY(5px) scale(0.99) rotate(1deg); 
          }
          100% { 
            transform: translateY(0) scale(1) rotate(0); 
            opacity: 1; 
          }
        }

        .toast-content {
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 0.88rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          line-height: 1.3;
        }

        @media (max-width: 768px) {
          .purchase-toast {
            bottom: 24px;
            right: 50%;
            /* Use a separate animation for mobile to maintain the horizontal center */
            animation: premiumJellyPopMobile 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            transform-origin: bottom center;
          }
        }

        @keyframes premiumJellyPopMobile {
          0% { 
            transform: translate(50%, 100px) scale(0.5); 
            opacity: 0; 
          }
          40% { 
            transform: translate(50%, -10px) scale(1.02); 
            opacity: 1; 
          }
          70% { 
            transform: translate(50%, 5px) scale(0.99); 
          }
          100% { 
            transform: translate(50%, 0) scale(1); 
            opacity: 1; 
          }
        }

        .clickable-desc {
          cursor: pointer;
          transition: opacity 0.2s ease, color 0.2s ease;
        }
        .clickable-desc:hover {
          opacity: 1;
          color: var(--primary);
        }

        .desc-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(10, 8, 6, 0.85);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          animation: fadeIn 0.2s ease-out;
        }

        .desc-modal-content {
          background: #1e1612;
          border: 1px solid rgba(255, 122, 69, 0.3);
          padding: 2rem;
          border-radius: 20px;
          max-width: 450px;
          width: 100%;
          position: relative;
          text-align: left;
          animation: scaleUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 20px 40px rgba(0,0,0,0.6), 0 0 20px rgba(255, 122, 69, 0.05) inset;
        }

        .desc-modal-close {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          background: rgba(255,255,255,0.05);
          border: none;
          color: var(--text);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .desc-modal-close:hover {
          background: rgba(255, 122, 69, 0.2);
          color: #fff;
          transform: rotate(90deg);
        }

        @keyframes scaleUp {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </section>
  );
}
