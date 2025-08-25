"use client";
import { useState } from "react";
import { navigationItems, companyInfo } from "../data";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  return (
    <nav className="w-full bg-primary border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center h-16 px-2">
        {/* Logo */}
        <div className="mr-8 select-none">
          <img 
            src={companyInfo.logo} 
            alt={companyInfo.name}
            className="h-24 w-auto"
          />
        </div>
        {/* Menu - only visible on large screens */}
        <ul className="hidden lg:flex space-x-5 text-xs font-bold tracking-wide uppercase flex-1 justify-start text-white">
          {navigationItems.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        {/* Right icons */}
        <div className="flex items-center justify-end w-16 space-x-4 ml-auto">
          {/* Search Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 text-white"
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
            {navigationItems.map((item, index) => (
              <div 
                key={index} 
                className="text-white text-sm font-bold tracking-wide uppercase hover:text-gray-300 cursor-pointer transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
