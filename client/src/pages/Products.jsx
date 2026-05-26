import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

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

  useEffect(() => {
    fetch("https://api-pawcare.rifkydevs.my.id/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
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
      <div className="section-title-wrapper reveal">
        <span className="section-subtitle font-heading">Produk Unggulan</span>
        <h2>Koleksi Kebutuhan Hewan</h2>
        <p className="section-description">Hanya produk berkualitas tinggi dari brand terpercaya untuk menjamin kesehatan, kenyamanan, dan kebahagiaan hewan peliharaan Anda.</p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-4 product-grid">
        {products.map((product, idx) => (
          <div key={product.id} className={`premium-card product-card reveal reveal-delay-${(idx % 4) + 1}`}>
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
              <p className="product-desc">{product.description}</p>

              {/* Star Rating */}
              <div className="product-rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`star-icon ${i < product.rating ? "active" : ""}`} viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <span className="reviews">({product.review_count} ulasan)</span>
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

      {/* Interactive Toast Notification */}
      {toastMessage && (
        <div className="purchase-toast">
          <div className="toast-content">
            <span className="toast-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="var(--primary)" width="18" height="18" className="toast-paw-svg">
                <circle cx="6" cy="10" r="1.5" />
                <circle cx="10" cy="6" r="2" />
                <circle cx="15" cy="6" r="2" />
                <circle cx="19" cy="10" r="1.5" />
                <path d="M12 11c-2.5 0-3.5 1.5-3.5 3s1.5 3 3.5 3s3.5-1.5 3.5-3s-1-3-3.5-3z" />
              </svg>
            </span>
            <span className="toast-text-msg">{toastMessage.replace("🎉 ", "")}</span>
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

        /* Purchase Toast Styles */
        .purchase-toast {
          position: fixed;
          bottom: 24px;
          right: 24px;
          background: linear-gradient(135deg, rgba(30, 19, 16, 0.93) 0%, rgba(18, 9, 6, 0.96) 100%);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          color: #fbeee3;
          border: 1px solid rgba(255, 122, 69, 0.25);
          padding: 0.85rem 1.4rem;
          border-radius: 18px;
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.35), 0 0 20px rgba(255, 122, 69, 0.1);
          z-index: 1100;
          animation: slideInUp 0.4s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
        }

        @keyframes slideInUp {
          from { 
            transform: translateY(40px) scale(0.95); 
            opacity: 0; 
          }
          to { 
            transform: translateY(0) scale(1); 
            opacity: 1; 
          }
        }

        .toast-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .toast-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 122, 69, 0.1);
          padding: 0.35rem;
          border-radius: 50%;
          border: 1px solid rgba(255, 122, 69, 0.2);
          flex-shrink: 0;
        }

        .toast-paw-svg {
          animation: pawWiggle 1.5s ease-in-out infinite alternate;
        }

        @keyframes pawWiggle {
          0% { transform: rotate(-10deg) scale(1); }
          100% { transform: rotate(10deg) scale(1.15); }
        }

        .toast-text-msg {
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 0.92rem;
          color: #fbeee3;
          line-height: 1.3;
          text-align: left;
        }
      `}</style>
    </section>
  );
}
