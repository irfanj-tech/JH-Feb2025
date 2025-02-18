// src/components/Navbar.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import useCSSVariable from "utils/useCSSVariables";
import useUrlParams from "utils/useUrlParams";
import config from "config";
import { PATH } from "consts";

interface NavbarProps {
  searchRef: React.RefObject<HTMLInputElement>;
}

const Navbar: React.FC<NavbarProps> = ({ setMenu, searchRef }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { updateUrlParams } = useUrlParams(); 

  useEffect(() => {
    updateUrlParams([{key:"search", value:searchQuery}]);
  }, [searchQuery]);
  
  const menuItems = [
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
  ];

  const handleSearchToggle = () => {
    setIsSearchVisible(!isSearchVisible);
    if (!isSearchVisible) {
      // Focus the search input when it becomes visible
      setTimeout(() => {
        searchRef.current?.focus();
      }, 0);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  useCSSVariable('--primary-color', config.colors.primary);

  return (
    <nav className="bg-[var(--primary-color)] text-white sticky top-0 left-0 w-full z-50 shadow-md">
      <div className="relative container mx-auto flex items-center justify-center p-4 h-20">
        {/* Logo */}
        <img
          src={config.logo.src}
          alt={config.logo.alt}
          className="absolute top-4 left-0 w-16 cursor-pointer"
          onClick={() => updateUrlParams([{key:"topic", value:"Home"}])}
          //Replace this line after time
        />

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4">
          {menuItems.map((item) => (
            <button
              key={item}
              onClick={() => updateUrlParams([{key:"topic", value:item}])}
              className="hover:underline focus:outline-none capitalize"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Search and Mobile Menu Button */}
        <div
          className={`absolute bottom-6 right-0 flex items-center space-x-4 search-input  ${isSearchVisible ? "search-input-show" : ""}`}
        >
          {/* Search Icon */}
          <button
            onClick={handleSearchToggle}
            aria-label="Search"
            className="focus:outline-none"
          >
            🔍
          </button>

          {/* Search Input Field */}
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            className="rounded-md text-black"
            placeholder="Search..."
          />

          {/* Login Button */}
          {/* <Link to="/login" className="hidden md:block">
            <button className="bg-white text-blue-600 px-3 py-1 rounded">
              Log in
            </button>
          </Link> */}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? (
              <XIcon className="w-6 h-6" />
            ) : (
              <MenuIcon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-600">
          {menuItems.map((item) => (
            <button
              key={item}
              onClick={() => {
                setMenu(item);
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-blue-700 focus:outline-none capitalize"
            >
              {item}
            </button>
          ))}
          <Link
            to={PATH.LOGIN}
            className="block w-full text-left px-4 py-2 hover:bg-blue-700"
          >
            Log in
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
