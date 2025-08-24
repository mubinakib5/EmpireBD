"use client";
import { socialLinks, footerSections, companyInfo } from "../data";
import SocialIcon from "./SocialIcon";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-2">
        {/* Social Icons */}
        <div className="flex space-x-6 justify-center mb-8 text-primary">
          {socialLinks.map((social, index) => (
            <SocialIcon
              key={index}
              name={social.name}
              href={social.href}
              icon={social.icon}
            />
          ))}
        </div>
        {/* Links */}
        <div className="flex flex-col md:flex-row justify-center md:justify-between gap-8 mb-8">
          <div className="flex flex-col md:flex-row gap-16 justify-center">
            {Object.values(footerSections).map((section, index) => (
              <div key={index}>
                <h4 className="font-bold text-sm mb-2 text-primary">{section.title}</h4>
                <ul className="space-y-1 text-sm text-primary">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href="#">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <hr className="my-4 border-gray-200" />
        <div className="flex flex-col md:flex-row items-center justify-between text-xs text-primary gap-4 pb-4">
          <div className="flex-1">
            {companyInfo.copyright}
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
