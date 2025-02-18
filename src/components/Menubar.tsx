// src/components/Menubar.tsx
import React from "react";
import { Link } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { FaRegNewspaper } from "react-icons/fa";
import useCSSVariable from "utils/useCSSVariables";
import config from "config";

interface MenubarProps {
  news: any[];
}

const Menubar: React.FC<MenubarProps> = ({ news }) => {
  useCSSVariable('--secondary-color', config.colors.secondary);
  return (
    <div className="bg-[var(--secondary-color)] text-white sticky top-20 left-0 w-full z-40 shadow-md">
      <div className="container mx-auto flex items-center py-2">
        {/* "Latest News" Label with Icon */}
        <div className="flex items-center text-white mr-4">
          <FaRegNewspaper className="w-5 h-5 mr-2" />
          <span className="font-bold uppercase">Latest News</span>
        </div>

        {/* Marquee Component */}
        <div className="flex-1 overflow-hidden">
          <Marquee gradient={false} speed={50} pauseOnHover={true}>
            {news.slice(0, 10).map((article, index) => (
              <div key={index} className="flex items-center text-white">
                <Link
                  to="/details"
                  state={{ data: article }}
                  className="hover:underline"
                >
                  <span className="font-medium text-sm">{article.title}</span>
                </Link>
                {/* Separator */}
                {index !== news.slice(0, 10).length - 1 && (
                  <span className="mx-4 text-white">|</span>
                )}
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </div>
  );
};

export default Menubar;
