// src/components/Main.tsx
import React, { useEffect, useRef, useState } from "react";
import Navbar from "components/Navbar";
import Home from "components/Home";
import Menubar from "components/Menubar";
import Breaking from "components/Breaking";
import Footer from "components/Footer";
import useNewsStore from "store/newsStore";

const Main: React.FC = () => {
  // const setNews = useNewsStore((state) => state.setNews);
  // const news = useNewsStore((state) => state.news);
  const { news, timestamp, setNews, setTimestamp } = useNewsStore();

  const [menu, setMenu] = useState<string>("Politics");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const searchRef = useRef<HTMLInputElement | null>(null);
  const getNews = async () => {
    try {
      !news.length && setIsLoading(true);
      const strapiResponse = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/articles`
      );
      const strapiData = await strapiResponse.json();

      const strapiArticles = strapiData.data.map((item: any) => {
        const attributes = item || {};
        const blocks = attributes.blocks
          .map((block: any) => {
            if (block.__component === "shared.quote") {
              return { type: "quote", title: block.title, body: block.body };
            } else if (block.__component === "shared.rich-text") {
              return { type: "rich-text", body: block.body };
            } else if (block.__component === "shared.you-tube-video") {
              return {
                type: "you-tube-video",
                url: block.URL,
                description: block.Description,
              };
            }

            return null;
          })
          .filter(Boolean); // to remove any null values

        return {
          id: attributes.id,
          title: attributes.title || "No title available",
          description: attributes.description || "No description available",
          slug: attributes.slug || extractSlug(attributes.url),
          cover: attributes.cover,
          blocks: blocks,
          publishedAt: attributes.publishedAt,
        };
      });

      const externalResponse = await fetch(
        `https://newsapi.org/v2/everything?q=${
          menu ? menu : "politics"
        }&sortBy=popularity&apiKey=7c73bb31409f4f66958cadb605ae0bce`
      );
      const externalData = await externalResponse.json();
      const externalArticles = externalData.articles || [];

      // filter out articles where title is "[Removed]"
      const filteredExternalArticles = externalArticles
        .filter((article: any) => article.title !== "[Removed]")
        .map((item) => ({ ...item, slug: extractSlug(item.url) }));

      setNews([...strapiArticles, ...filteredExternalArticles]);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.error("Error fetching news:", err);
    }
  };
  const extractSlug = (url: any) => {
    const urlParts = new URL(url); // Parse the URL
    return urlParts.pathname.slice(1); // Remove leading "/
  };

  useEffect(() => {
    const fiveMinutesInMillis = 5 * 60 * 1000; // 5 minutes in milliseconds
    const currentTime = Date.now();

    // Check if news is empty or if the timestamp is too old
    if (
      !news.length ||
      (timestamp && currentTime - timestamp > fiveMinutesInMillis)
    ) {
      setTimestamp(Date.now());
      getNews(); // Fetch news if needed
    }

    // eslint-disable-next-line
  }, [news, timestamp]);

  return (
    <>
      <Navbar searchRef={searchRef} />
      <Menubar news={news} />
      {/* main Content with margins on large screens */}
      <div className="main-content">
        <div className="px-4">
          <Breaking news={news} menu={menu} isLoading={isLoading} />
          <Home news={news} isLoading={isLoading} />
        </div>
      </div>

      <Footer setMenu={setMenu} />
    </>
  );
};

export default Main;
