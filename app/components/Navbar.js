"use client";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { NAVIGATION_MENUS_QUERY, sanityClient, urlFor } from "../../lib/sanity";
import { companyInfo } from "../data";
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
  
  // Search functionality states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const fetchNavigationItems = async () => {
      try {
        const items = await sanityClient.fetch(NAVIGATION_MENUS_QUERY);
        setNavigationItems(items);
      } catch (error) {
        console.error("Error fetching navigation items:", error);
        // Fallback to static items if Sanity fetch fails
        setNavigationItems([
          { title: "Shoes", slug: "shoes" },
          { title: "Sandals", slug: "sandals" },
          { title: "Jackets", slug: "jackets" },
          { title: "Bags", slug: "bags" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchNavigationItems();
  }, []);

  // Search functionality
  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const query = `
          *[_type == "product" && (
            title match "*${searchQuery}*" ||
            brand match "*${searchQuery}*" ||
            summary match "*${searchQuery}*" ||
            "${searchQuery.toLowerCase()}" in tags[]
          )] | order(_createdAt desc) [0...8] {
            _id,
            title,
            slug,
            images,
            brand,
            price,
            originalPrice,
            onSale,
            salePercentage
          }
        `;
        
        const results = await sanityClient.fetch(query);
        setSearchResults(results);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const handleSearchResultClick = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <nav className="w-full bg-primary border-b border-gray-200 sticky top-0 z-50">
      <div className="w-full flex items-center h-16 px-1 sm:px-2">
        {/* Logo */}
        <div className="mr-8 select-none">
          <Link href="/" className="block">
            <img
              src={companyInfo.logo}
              alt={companyInfo.name}
              className="h-12 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200"
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
          {/* Search Section */}
          <div className="relative" ref={searchRef}>
            {/* Search Icon/Input */}
            {isSearchOpen ? (
              <div className="flex items-center bg-white rounded-md px-3 py-1 min-w-[250px]">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400"
                />
                <button
                  onClick={handleSearchToggle}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <button onClick={handleSearchToggle}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 text-white cursor-pointer hover:text-gray-300 transition-colors"
                >
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            )}

            {/* Search Results Dropdown */}
            {isSearchOpen && (searchQuery.length >= 2 || isSearching) && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50">
                {isSearching ? (
                  <div className="p-4 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                    Searching...
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="py-2">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b">
                      Search Results ({searchResults.length})
                    </div>
                    {searchResults.map((product) => (
                      <Link
                        key={product._id}
                        href={`/product/${product.slug.current}`}
                        onClick={handleSearchResultClick}
                        className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-md overflow-hidden mr-3">
                          {product.images?.[0] ? (
                            <img
                              src={urlFor(product.images[0]).width(48).height(48).url()}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">{product.title}</h4>
                          <p className="text-xs text-gray-500 truncate">{product.brand}</p>
                          <div className="flex items-center mt-1">
                            {product.onSale && product.originalPrice ? (
                              <>
                                <span className="text-sm font-semibold text-red-600">৳{product.price}</span>
                                <span className="text-xs text-gray-400 line-through ml-2">৳{product.originalPrice}</span>
                                {product.salePercentage && (
                                  <span className="text-xs bg-red-100 text-red-600 px-1 py-0.5 rounded ml-2">
                                    -{product.salePercentage}%
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="text-sm font-semibold text-gray-900">৳{product.price}</span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                    {searchResults.length === 8 && (
                      <div className="px-4 py-2 text-center border-t">
                        <Link
                          href={`/explore/all?search=${encodeURIComponent(searchQuery)}`}
                          onClick={handleSearchResultClick}
                          className="text-sm text-primary hover:text-primary-dark font-medium"
                        >
                          View all results →
                        </Link>
                      </div>
                    )}
                  </div>
                ) : searchQuery.length >= 2 ? (
                  <div className="p-4 text-center text-gray-500">
                    <svg className="mx-auto h-8 w-8 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p className="text-sm">No products found for &quot;{searchQuery}&quot;</p>
                    <p className="text-xs text-gray-400 mt-1">Try different keywords</p>
                  </div>
                ) : null}
              </div>
            )}
          </div>

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
              <line x1="4" y1="7" x2="20" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="4" y1="17" x2="20" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
