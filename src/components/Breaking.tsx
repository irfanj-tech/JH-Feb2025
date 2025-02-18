// src/components/Breaking.tsx
import React from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "components/Spinner";
import { PATH } from "consts";

interface NewsProp {
  news: any[];
  menu: string;
  isLoading: boolean;
}

const Breaking: React.FC<NewsProp> = ({ news, menu, isLoading }) => {
  // Function to get the full image URL
  const getImageUrl = (article: any) => {
    if (article.urlToImage) {
      // External articles with 'urlToImage'
      return article.urlToImage;
    } else if (article.cover) {
      // Internal articles with 'cover' object
      const baseUrl = process.env.REACT_APP_STRAPI_URL; // Replace with your actual base URL
      const imageUrl =
        article?.cover?.url ||
        article?.cover.formats?.small?.url ||
        article?.cover?.formats?.thumbnail?.url;

      return imageUrl ? `${baseUrl}${imageUrl}` : null;
    }
    return "https://thumb.ac-illust.com/01/01eac46286df4cb7141656e2acc61eef_t.jpeg";
  };

  return (
    <section className="px-4 py-8 container mx-auto">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4">
        <Link to={PATH.INDEX} className="hover:underline">
          Home
        </Link>
        {menu && (
          <>
            <span> / </span>
            <span className="capitalize">{menu}</span>
          </>
        )}
      </nav>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {news[0] && (
            <div>
              <Link to={`${PATH.ARTICLE_LIST}/${news[0].slug}`} state={{ data: news[0] }}>
                <img
                  src={getImageUrl(news[0])}
                  alt={news[0]?.title}
                  className="w-full h-auto rounded-lg shadow-md object-cover"
                />
                <h1 className="text-2xl sm:text-4xl font-bold mt-4">
                  {news[0]?.title}
                </h1>
                <p className="mt-2 text-gray-700 text-sm sm:text-base">
                  {news[0]?.description}
                </p>
              </Link>
            </div>
          )}
          <div className="grid gap-4">
            {[news[1], news[2]].map(
              (article, index) =>
                article && (
                  <div
                    key={index}
                    className="md:flex md:flex-row md:items-start"
                  >
                    <Link
                      to={`${PATH.ARTICLE_LIST}/${article.slug}`}
                      state={{ data: article }}
                      className="w-full md:w-1/2"
                    >
                      <img
                        src={getImageUrl(article)}
                        alt={article.title}
                        className="w-full h-auto rounded-lg shadow-md object-cover"
                      />
                    </Link>
                    <div className="mt-2 sm:mt-0 sm:ml-4 w-full md:w-1/2">
                      <Link to={PATH.ARTICLE_LIST} state={{ data: article }}>
                        <h2 className="text-xl sm:text-2xl font-semibold">
                          {article.title}
                        </h2>
                        <p className="text-gray-700 text-sm sm:text-base">
                          {article.description}
                        </p>
                      </Link>
                    </div>
                  </div>
                )
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Breaking;
