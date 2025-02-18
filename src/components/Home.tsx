import React from "react";
import { Link } from "react-router-dom";
import InArticleAd from "components/InArticleAd";
import LoadingSpinner from "components/Spinner";
import useUrlParams from "utils/useUrlParams"; 
import { PATH, SORT as SORT_OPTIONS } from "consts";
import MailchimpForm from "components/MailchimpForm"; 

interface NewsProps {
  news: any[];
  search: string;
  isLoading: boolean;
}

const Home: React.FC<NewsProps> = ({ news, isLoading }) => {
  const { params, updateUrlParams } = useUrlParams(); // Destructure the hook
  // const searchString = params.search || ""; // Access search parameter from the URL
  const { search = "", sortBy = "title", sortDirection = "asc" } = params;
  const searchString = search.toLowerCase();
  const filteredNews = news.filter((data: any) =>
    data.title.toLowerCase().includes(searchString)
  );

  const compare = (a: any, b: any, sortBy: string, sortDirection: string) => {
    const getComparisonValue = (field: string) => {
      if (field === "title") {
        return a[field].localeCompare(b[field]);
      }
      if (field === "date") {
        return (
          new Date(a["publishedAt"]).getTime() -
          new Date(b["publishedAt"]).getTime()
        );
      }
      return 0;
    };

    const comparisonValue = getComparisonValue(sortBy);
    return sortDirection === "asc" ? comparisonValue : -comparisonValue;
  };
  filteredNews.sort((a, b) => compare(a, b, sortBy, sortDirection));

  const getImageUrl = (article: any) => {
    if (article.urlToImage) {
      return article.urlToImage;
    } else if (article.cover) {
      const baseUrl = process.env.REACT_APP_STRAPI_URL;
      const imageUrl =
        article.cover.formats?.small?.url ||
        article.cover.formats?.thumbnail?.url ||
        article.cover.url;

      return imageUrl ? `${baseUrl}${imageUrl}` : null;
    }
    return "https://thumb.ac-illust.com/01/01eac46286df4cb7141656e2acc61eef_t.jpeg";
  };
  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    const selectedOption = SORT_OPTIONS.find(
      (option) => option.value === selectedValue
    );
    if (selectedOption) {
      updateUrlParams([
        { key: "sortBy", value: selectedOption.sortBy },
        { key: "sortDirection", value: selectedOption.sortDirection },
      ]);
    }
  };
  return (
    <div className="container mx-auto px-4">
      <hr className="mt-5" />
      <h1 className="bg-red-600 w-10 h-1 ml-4">.</h1>
      <div className="flex justify-between">
        <h1 className="ml-4 font-bold text-sm">MORE TOP STORIES</h1>
        <select
          className="px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleSelectChange}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {isLoading ? (
        <LoadingSpinner />
      ) : filteredNews.length === 0 ? (
        <div className="flex items-center justify-center text-center min-h-[50vh]">
          <p className="text-lg font-semibold text-gray-700">
            No articles found. Please check back later!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-5">
          {filteredNews.map((data: any, index: number) => (
            <React.Fragment key={data.url || index}>
              {index > 0 && index % 5 === 0 && <InArticleAd />}
              <Link to={`${PATH.ARTICLE_LIST}/${data.slug}`} state={{ data }}>
                <div className="max-w-sm rounded overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200">
                  <img
                    src={getImageUrl(data)}
                    alt={data.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">{data.title}</div>
                    <p className="text-gray-700 text-base">
                      {data.description}
                    </p>
                  </div>
                </div>
              </Link>
            </React.Fragment>
          ))}
        </div>
      )}

    <MailchimpForm />

    </div>
  );
};

export default Home;
