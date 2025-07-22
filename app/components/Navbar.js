"use client";

export default function Navbar() {
  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center h-16 px-2">
        {/* Logo */}
        <div
          className="font-serif text-2xl font-extrabold tracking-widest mr-8 select-none text-black"
          style={{ letterSpacing: "0.1em" }}
        >
          EMPIREBD
        </div>
        {/* Menu - only visible on large screens */}
        <ul className="hidden lg:flex space-x-5 text-xs font-bold tracking-wide uppercase flex-1 justify-start text-black">
          <li>Gifts</li>
          <li>Women</li>
          <li>Men</li>
          <li>Bags</li>
          <li>Linea Rossa</li>
          <li>Fine Jewelry</li>
          <li>Home</li>
          <li>Beauty and Fragrances</li>
          <li>Empiresphere</li>
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
            className="w-5 h-5 text-black"
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
          <button className="block lg:hidden focus:outline-none">
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              className="w-6 h-6 text-black"
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
    </nav>
  );
}
