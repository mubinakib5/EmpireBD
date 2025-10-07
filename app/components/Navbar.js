"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { companyInfo } from "../data";
import { sanityClient } from "../../lib/sanity";
import { NAVIGATION_MENUS_QUERY } from "../../lib/sanity";
import CartIcon from "./CartIcon";

function AuthSection() {
  return (
    <div className="flex items-center space-x-2">
      <Link
        href="/contact"
        className="text-white text-sm hover:text-gray-300 transition-colors"
      >
        Contact
      </Link>
    </div>
  );
}

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navigationItems, setNavigationItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNavigationItems = async () => {
      try {
        const items = await sanityClient.fetch(NAVIGATION_MENUS_QUERY);
        setNavigationItems(items);
      } catch (error) {
        console.error('Error fetching navigation items:', error);
        // Fallback to static items if Sanity fetch fails
        setNavigationItems([
          { title: 'Shoes', slug: 'shoes' },
          { title: 'Sandals', slug: 'sandals' },
          { title: 'Jackets', slug: 'jackets' },
          { title: 'Bags', slug: 'bags' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchNavigationItems();
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  return (
    <nav className="w-full bg-primary border-b border-gray-200 sticky top-0 z-50">
      <div className="w-full flex items-center h-12 px-1 sm:px-2">
        {/* Logo */}
        <div className="mr-8 select-none">
          <Link href="/" className="block">
            <img 
              src={companyInfo.logo} 
              alt={companyInfo.name}
              className="h-24 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200"
            />
          </Link>
        </div>
        {/* Menu - only visible on large screens */}
        <ul className="hidden lg:flex space-x-5 text-xs font-bold tracking-wide uppercase flex-1 justify-start text-white">
          {loading ? (
            <li className="text-gray-300">Loading...</li>
          ) : (
            navigationItems.map((item) => (
              <li key={item._id || item.slug}>
                <Link 
                  href={`/explore/${item.slug}`}
                  className="hover:text-gray-300 transition-colors duration-200 cursor-pointer"
                >
                  {item.title}
                </Link>
              </li>
            ))
          )}
        </ul>
        {/* Right icons */}
        <div className="flex items-center justify-end space-x-4 ml-auto">
          {/* Search Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 text-white cursor-pointer hover:text-gray-300 transition-colors"
          >
            <circle
              cx="11"
              cy="11"
              r="8"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <line
              x1="21"
              y1="21"
              x2="16.65"
              y2="16.65"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          
          {/* Cart Icon */}
          <div className="text-white">
            <CartIcon />
          </div>
          
          {/* Authentication */}
          <AuthSection />
          {/* Hamburger Icon - only visible on mobile/tablet */}
          <button 
            className="block lg:hidden focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              className="w-6 h-6 text-white"
            >
              <line
                x1="4"
                y1="7"
                x2="20"
                y2="7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="4"
                y1="12"
                x2="20"
                y2="12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="4"
                y1="17"
                x2="20"
                y2="17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-primary border-t border-gray-200">
          <div className="px-4 py-4 space-y-4">
            {loading ? (
              <div className="text-white text-sm">Loading...</div>
            ) : (
              navigationItems.map((item) => (
                <Link
                  key={item._id || item.slug}
                  href={`/explore/${item.slug}`}
                  className="block text-white text-sm font-bold tracking-wide uppercase hover:text-gray-300 cursor-pointer transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.title}
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
