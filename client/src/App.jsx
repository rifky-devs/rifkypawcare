import { useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import Services from './pages/Services';
import Members from './pages/Members';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import './App.css';

function App() {
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -8% 0px',
      threshold: 0.12
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        } else {
          entry.target.classList.remove('active');
        }
      });
    }, observerOptions);

    // Dynamic observation function
    const observeElements = () => {
      const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
      revealElements.forEach(el => observer.observe(el));
    };

    // Initial run
    observeElements();

    // MutationObserver to watch for asynchronously loaded elements (like Products/Services from APIs)
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <CartProvider>
      <div className="app-container">
        {/* Sticky top navigation menu */}
        <Navbar />

        {/* Main Single Page Sections */}
        <main>
          {/* Hero Welcome banner */}
          <Home />

          {/* Product Cards Collection */}
          <Products />

          {/* Service Cards Listing */}
          <Services />

          {/* Membership registration form */}
          <Members />
        </main>

        {/* Footer contacts & copyright */}
        <Footer />

        {/* Floating Right Shopping Cart Drawer */}
        <CartDrawer />
      </div>
    </CartProvider>
  );
}

export default App;
