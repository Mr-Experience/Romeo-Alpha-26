import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { TranslationProvider } from './context/TranslationContext';
import { NotificationProvider } from './context/NotificationContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';

import Careers from './components/Careers';
import Contact from './components/Contact';
import Marketplace from './components/Marketplace';
import MarketplaceDetail from './components/MarketplaceDetail';
import MarketplaceInquiry from './components/MarketplaceInquiry';
import Certifications from './components/Certifications';
import OperationDetail from './components/OperationDetail';
import ServiceMaritime from './components/ServiceMaritime';
import ServiceCharter from './components/ServiceCharter';
import ServiceOffshore from './components/ServiceOffshore';
import ServiceSecurity from './components/ServiceSecurity';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import Team from './components/Team';
import NotFound from './components/NotFound';
import PrivacyPolicy from './components/PrivacyPolicy';
import Terms from './components/Terms';
import CookieConsent from './components/CookieConsent';
import WhatsAppButton from './components/WhatsAppButton';
import { startAnalytics, trackPageView } from './lib/analytics';
// Import legacy styles (now in src/styles)
import './styles/styles.css';
import './styles/footer_styles.css';


function App() {
  return (
    <TranslationProvider>
      <NotificationProvider>
        <Router>
          <AppContentWithLocation />
        </Router>
      </NotificationProvider>
    </TranslationProvider>
  );
}

// Helper to get location access safely
const AppContentWithLocation = () => {
  const location = useLocation();
  const isDashboard = location.pathname === '/admin-dashboard';
  const isLogin = location.pathname === '/admin-login' || location.pathname === '/login';
  const isMarketplaceDetail = location.pathname.startsWith('/marketplace/');
  const isMarketplaceInquiry = location.pathname.startsWith('/marketplace-inquiry/');

  // Analytics: start once (only if consent was given earlier), then log each SPA navigation.
  useEffect(() => { startAnalytics(); }, []);
  useEffect(() => { trackPageView(location.pathname + location.search); }, [location.pathname, location.search]);

  return (
    <div className="page-wrapper">
      {!isDashboard && !isMarketplaceDetail && !isMarketplaceInquiry && <Header />}
      <main id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/certifications" element={<Certifications />} />


          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/marketplace/:id" element={<MarketplaceDetail />} />

          <Route path="/operation-detail" element={<OperationDetail />} />
          <Route path="/service/maritime" element={<ServiceMaritime />} />
          <Route path="/service/charter" element={<ServiceCharter />} />
          <Route path="/service/offshore" element={<ServiceOffshore />} />
          <Route path="/service/security" element={<ServiceSecurity />} />
          <Route path="/login" element={<Navigate to="/admin-login" replace />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/team" element={<Team />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isLogin && !isDashboard && !isMarketplaceDetail && !isMarketplaceInquiry && <Footer />}
      {!isLogin && !isDashboard && <WhatsAppButton />}
      {!isLogin && !isDashboard && <CookieConsent />}
    </div>

  );
};

export default App;
