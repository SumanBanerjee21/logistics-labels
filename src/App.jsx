import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Preview from './pages/Preview';
import Subscription from './pages/Subscription';
import Plans from './pages/Plans';
import Setup from './pages/Setup';
import Admin from './pages/Admin';

// Legal Pages
import Contact from './pages/legal/Contact';
import Terms from './pages/legal/Terms';
import Privacy from './pages/legal/Privacy';
import Refund from './pages/legal/Refund';
import Pricing from './pages/Pricing';

// Components
import Footer from './components/Footer';
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/plans" element={<Plans />} />
              <Route path="/setup" element={<Setup />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/preview" element={<Preview />} />
              <Route path="/subscription" element={<Subscription />} />
              
              {/* Legal Routes */}
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/refund" element={<Refund />} />
              <Route path="/pricing" element={<Pricing />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
