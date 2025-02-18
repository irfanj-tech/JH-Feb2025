// src/App.tsx
import React from "react";
import PopupAd from "./components/PopupAd";
import TopAd from "./components/TopAd";
import Routes from './routes';
import { Helmet } from "react-helmet";
import config from 'config';

import "App.css"; // Ensure this import exists

const App: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>{config.siteName}</title>
        <meta name="description" content={config.siteDescription} />
      </Helmet>
      {/* Ad at the top before the navbar */}
      <TopAd />
      {/* Popup Ads */}
      <PopupAd
        position="bottomRight"
        initialDelay={10000}
        reopenDelay={30000}
      />
      <Routes/>
    </>
  );
};

export default App;
