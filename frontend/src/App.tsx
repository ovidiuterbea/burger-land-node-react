import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation/Navigation';
import LandingPage from './pages/LandingPage/LandingPage';
import Footer from './components/Footer/Footer';
import AuthenticationPage from './pages/AuthenticationPage/AuthenticationPage';
import TicketsPage from './pages/TicketsPage/TicketsPage';
import BookingsPage from './pages/BookingsPage/BookingsPage';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import LanguageSwitcher from './components/LanguageSwitcher/LanguageSwitcher';

function App() {
  return (
    <AuthProvider>
      <Router>
        <LanguageSwitcher>
          <Navigation />
          <main>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthenticationPage />} />

              <Route
                path="/tickets"
                element={
                  <PrivateRoute>
                    <TicketsPage />
                  </PrivateRoute>
                }
              />

              <Route
                path="/bookings"
                element={
                  <PrivateRoute>
                    <BookingsPage />
                  </PrivateRoute>
                }
              />

              <Route path="*" element={<h2>Page Not Found</h2>} />
            </Routes>
          </main>
          <Footer />
        </LanguageSwitcher>
      </Router>
    </AuthProvider>
  );
}

export default App;
