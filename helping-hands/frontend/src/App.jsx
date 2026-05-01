import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LiveChat from './components/LiveChat';
import Newsletter from './components/Newsletter';
import Home from './pages/Home';
import Volunteer from './pages/Volunteer';
import Donate from './pages/Donate';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import Testimonials from './pages/Testimonials';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import PaymentSuccess from './pages/PaymentSuccess';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/admin/AdminPanel';
import About from './pages/About';
import Leaderboard from './pages/Leaderboard';
import FoodDonation from "./pages/FoodDonation";

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen transition-colors duration-300">
          <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/volunteer" element={<Volunteer />} />
              <Route path="/events" element={<Events />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/about" element={<About />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/food-donation" element={<FoodDonation />} />
            </Routes>
          </main>
          <Newsletter />
          <Footer />
          <LiveChat />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: { fontFamily: 'DM Sans, sans-serif', borderRadius: '12px' },
              success: { iconTheme: { primary: '#e11d48', secondary: 'white' } },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}
