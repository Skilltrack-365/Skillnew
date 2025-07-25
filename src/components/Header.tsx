import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './auth/AuthModal';
import UserProfile from './UserProfile';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  const { user, profile, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showUserMenu && !target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  const scrollToSection = (sectionId: string) => {
    if (!isHomePage) {
      // If not on home page, navigate to home first
      window.location.href = `/#${sectionId}`;
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleSignOut = async () => {
    try {
      console.log('Starting signout process...');
      await signOut();
      setShowUserMenu(false);
      setShowUserProfile(false);
      console.log('Signout successful, navigating to home...');
      // Use navigate instead of window.location for better React Router integration
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Signout error:', error);
      // Still try to redirect even if there's an error
      navigate('/', { replace: true });
    }
  };

  return (
    <>
      <header className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled || !isHomePage ? 'bg-white shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ST</span>
              </div>
              <span className={`text-xl font-bold transition-colors ${
                isScrolled || !isHomePage ? 'text-gray-900' : 'text-white'
              }`}>
                Skilltrack-365 Labs
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to="/"
                className={`hover:text-blue-600 transition-colors ${
                  isScrolled || !isHomePage ? 'text-gray-700' : 'text-white'
                }`}
              >
                Home
              </Link>
              <button 
                onClick={() => scrollToSection('services')}
                className={`hover:text-blue-600 transition-colors ${
                  isScrolled || !isHomePage ? 'text-gray-700' : 'text-white'
                }`}
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className={`hover:text-blue-600 transition-colors ${
                  isScrolled || !isHomePage ? 'text-gray-700' : 'text-white'
                }`}
              >
                About
              </button>
              <Link 
                to="/labs"
                className={`hover:text-blue-600 transition-colors ${
                  isScrolled || !isHomePage ? 'text-gray-700' : 'text-white'
                }`}
              >
                Labs
              </Link>
              
              {user ? (
                <div className="relative user-menu-container">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>{profile?.full_name || 'User'}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">{profile?.full_name}</p>
                        <p className="text-xs text-gray-500 capitalize">{profile?.role}</p>
                      </div>
                      <button
                        onClick={() => {
                          console.log('Navigating to dashboard...');
                          setShowUserMenu(false);
                          navigate('/dashboard');
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Dashboard
                      </button>
                      <button
                        onClick={() => {
                          setShowUserProfile(true);
                          setShowUserMenu(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Profile Settings
                      </button>
                      {profile?.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => {
                    console.log('Opening auth modal...');
                    setShowAuthModal(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Sign In
                </button>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className={`w-6 h-6 ${isScrolled || !isHomePage ? 'text-gray-900' : 'text-white'}`} />
              ) : (
                <Menu className={`w-6 h-6 ${isScrolled || !isHomePage ? 'text-gray-900' : 'text-white'}`} />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-4">
                <Link 
                  to="/"
                  className="text-gray-700 hover:text-blue-600 transition-colors text-left"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <button 
                  onClick={() => scrollToSection('services')}
                  className="text-gray-700 hover:text-blue-600 transition-colors text-left"
                >
                  Services
                </button>
                <button 
                  onClick={() => scrollToSection('about')}
                  className="text-gray-700 hover:text-blue-600 transition-colors text-left"
                >
                  About
                </button>
                <Link 
                  to="/labs"
                  className="text-gray-700 hover:text-blue-600 transition-colors text-left"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Labs
                </Link>
                
                {user ? (
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm font-medium text-gray-900 mb-2">{profile?.full_name}</p>
                    <button
                      onClick={() => {
                        console.log('Mobile: Navigating to dashboard...');
                        setIsMenuOpen(false);
                        navigate('/dashboard');
                      }}
                      className="block text-gray-700 hover:text-blue-600 transition-colors mb-2 text-left"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        setShowUserProfile(true);
                        setIsMenuOpen(false);
                      }}
                      className="block text-gray-700 hover:text-blue-600 transition-colors mb-2"
                    >
                      Profile Settings
                    </button>
                    {profile?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="block text-gray-700 hover:text-blue-600 transition-colors mb-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="text-gray-700 hover:text-blue-600 transition-colors text-left"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      console.log('Mobile: Opening auth modal...');
                      setShowAuthModal(true);
                      setIsMenuOpen(false);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors text-left"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
      />
      
      <UserProfile
        isOpen={showUserProfile}
        onClose={() => setShowUserProfile(false)}
      />
    </>
  );
};

export default Header;