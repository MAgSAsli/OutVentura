import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Header from "./component/header";
import Footer from "./component/footer";

import Home from "./pages/home";
import Products from "./pages/product";
import ProductDetail from "./pages/productdetail";
import Cart from "./pages/cart";
import Checkout from "./pages/checkout";
import Login from "./pages/login";
import Register from "./pages/register";
import CheckoutSukses from "./pages/checkoutsukses";
import Riwayat from "./pages/riwayat";
import Admin from "./pages/admin";
import LoginAdmin from "./pages/loginadmin";
import PaymentFinish from "./pages/paymentfinish";

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
          {/* Header */}
          <Header />

          {/* Main Content */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/checkout/sukses" element={<CheckoutSukses />} />
              <Route path="/payment/finish" element={<PaymentFinish />} />
              <Route path="/riwayat" element={<Riwayat />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/login" element={<LoginAdmin />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
