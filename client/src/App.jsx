import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import Services from './pages/Services';
import Members from './pages/Members';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import PawCursor from './components/PawCursor';
import useScrollReveal from './hooks/useScrollReveal';
import './App.css';

function App() {
  // Activate premium scroll reveal animations globally
  useScrollReveal();

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

        {/* Custom Animated Paw Cursor Follower */}
        <PawCursor />
      </div>
    </CartProvider>
  );
}

export default App;

