"use client";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-2">
        {/* Social Icons */}
        <div className="flex space-x-6 justify-center mb-8 text-black">
          {/* Placeholder SVGs for social icons */}
          <a href="#" aria-label="Facebook">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </a>
          <a href="#" aria-label="X">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M4 4l16 16M20 4L4 20" />
            </svg>
          </a>
          <a href="#" aria-label="Instagram">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="17" cy="7" r="1.5" />
            </svg>
          </a>
          <a href="#" aria-label="YouTube">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <rect x="2" y="6" width="20" height="12" rx="3" />
              <polygon points="10,9 16,12 10,15" fill="currentColor" />
            </svg>
          </a>
          <a href="#" aria-label="Spotify">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 15c2.5-1 5.5-1 8 0M7 12c3-1.5 7-1.5 10 0M6 9c3.5-2 8.5-2 12 0" />
            </svg>
          </a>
          <a href="#" aria-label="Discord">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
              <circle cx="9" cy="10" r="1" />
              <circle cx="15" cy="10" r="1" />
            </svg>
          </a>
          <a href="#" aria-label="TikTok">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M9 17a4 4 0 1 1 4-4V5h3a4 4 0 0 0 4 4" />
            </svg>
          </a>
        </div>
        {/* Links */}
        <div className="flex flex-col md:flex-row justify-center md:justify-between gap-8 mb-8">
          <div className="flex flex-col md:flex-row gap-16 justify-center">
            <div>
              <h4 className="font-bold text-sm mb-2 text-black">COMPANY</h4>
              <ul className="space-y-1 text-sm text-black">
                <li>
                  <a href="#">Fondazione Prada</a>
                </li>
                <li>
                  <a href="#">Prada Group</a>
                </li>
                <li>
                  <a href="#">Luna Rossa</a>
                </li>
                <li>
                  <a href="#">Sustainability</a>
                </li>
                <li>
                  <a href="#">Work with us</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-2 text-black">
                LEGAL TERMS AND CONDITIONS
              </h4>
              <ul className="space-y-1 text-sm text-black">
                <li>
                  <a href="#">Legal Notice</a>
                </li>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">Cookie Policy</a>
                </li>
                <li>
                  <a href="#">Cookie setting</a>
                </li>
                <li>
                  <a href="#">Sitemap</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-4 border-gray-200" />
        <div className="flex flex-col md:flex-row items-center justify-between text-xs text-black gap-4 pb-4">
          <div className="flex-1">
            ©PRADA 2007 - 2025 | VAT no. IT1015350158
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 border-r pr-8 border-gray-300">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M17.657 16.657L13.414 12.414a4 4 0 1 0-1.414 1.414l4.243 4.243a1 1 0 0 0 1.414-1.414z" />
                <circle cx="11" cy="11" r="8" />
              </svg>
              <span className="font-semibold">STORE LOCATOR</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a10 10 0 0 1 0 20" />
              </svg>
              <span className="font-semibold">
                LOCATION: REST OF THE WORLD/ENGLISH
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
