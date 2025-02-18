// src/components/Footer.tsx
import React from "react";
import useUrlParams from "utils/useUrlParams";
import config from "config";

interface FooterProps {
  setMenu: (menuName: string) => void;
}

const Footer: React.FC<FooterProps> = ({ setMenu }) => {
  const { updateUrlParams } = useUrlParams();
  return (
    <footer className="bg-gray-900 text-white py-8 px-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Column 1: About */}
        <div>
          <h3 className="font-bold text-xl mb-4">About {config.siteName}</h3>
          <p>{config.siteDescription}</p>
        </div>
        {/* Column 2: Quick Links */}
        <div>
          <h3 className="font-bold text-xl mb-4">Quick Links</h3>
          <ul>
            {[
              "Home",
              "US",
              "World",
              "Politics",
              "Business",
              "Health",
              "Entertainment",
              "Sports",
              "Science",
              "Technology",
            ].map((menuItem) => (
              <li key={menuItem}>
                <button
                  onClick={() =>
                    updateUrlParams([{ key: "topic", value: menuItem }])
                  }
                  className="hover:underline focus:outline-none text-left"
                >
                  {menuItem}
                </button>
              </li>
            ))}
          </ul>
        </div>
        {/* Column 3: Follow Us */}
        {/* <div>
            <h3 className="font-bold text-xl mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href={config.social.facebook} aria-label="Facebook">
                <FaFacebookF size={24} />
              </a>
              <a href={config.social.twitter} aria-label="Twitter">
                <FaTwitter size={24} />
              </a>
              <a href={config.social.instagram} aria-label="Instagram">
                <FaInstagram size={24} />
              </a>
            </div>
          </div> */}
      </div>
      <div className="text-center mt-8">
        <p>
          © {new Date().getFullYear()} {config.siteName}. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
