import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import ReCAPTCHA from "react-google-recaptcha";
import { ToastContainer, toast } from "react-toastify";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { IoArrowBackSharp } from "react-icons/io5";
import { IoMdShare } from "react-icons/io";
import { FaGoogle, FaTwitter, FaFacebook, FaLink } from "react-icons/fa";
import YouTubeEmbed from "components/YouTubeEmbeded";
import {
  API_BASE_URL,
  CAPTCHA_SITEKEY,
  COMMENT_THRESHOLD,
  default as config,
} from "../config";
import "react-toastify/dist/ReactToastify.css";

const Details = () => {
  const location = useLocation();
  const article = location.state?.data;

  // Function to validate URLs
  const isValidURL = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Determine the article identifier (ID or URL)
  let articleIdentifier = article?.id;
  // console.log("Article Identifier:", articleIdentifier);

  if (!articleIdentifier) {
    if (article?.url && isValidURL(article.url)) {
      // Encode the URL to safely include it in the API endpoint
      articleIdentifier = encodeURIComponent(article.url);
    } else {
      console.error("Article ID and valid URL are missing.");
    }
  }

  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState<
    { username: string; text: string; fingerprint: any }[]
  >([]);
  const [usernameInput, setUsernameInput] = useState("");
  const [commentInput, setCommentInput] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  useEffect(() => {
    if (!articleIdentifier) return;

    console.log(`Fetching likes for article ID: ${articleIdentifier}`);

    // Fetch likes
    fetch(`${API_BASE_URL}/likes/${articleIdentifier}/likes`)
      .then((res) => {
        console.log("Response status:", res.status);
        if (!res.ok) {
          throw new Error("Failed to fetch likes");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Likes data received:", data);
        setLikes(data.likes || 0);
      })
      .catch((err) => console.error("Error loading likes:", err));

    // Fetch comments
    fetch(`${API_BASE_URL}/comments/${articleIdentifier}/comments`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setComments(data);
        } else {
          setComments([]);
          console.error("Error loading comments: Data is not an array");
        }
      })
      .catch((err) => console.error("Error loading comments:", err));
  }, [articleIdentifier]);

  const formatDate = (dateString) => {
    const date = dateString ? new Date(dateString) : new Date();
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
  };
  

  
  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const handleLike = async () => {
    if (!articleIdentifier) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/likes/${articleIdentifier}/like`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to like article");
      }

      // Refetch likes count after successful like
      fetch(`${API_BASE_URL}/likes/${articleIdentifier}/likes`)
        .then((res) => res.json())
        .then((data) => setLikes(data.likes || 0))
        .catch((err) => console.error("Error refetching likes:", err));
    } catch (error) {
      console.error("Error liking article:", error);
    }
  };

  const handleCopyLink = () => {
    const linkToCopy = window.location.href; // Current page URL
    navigator.clipboard.writeText(linkToCopy);
    toast.success("Link copied to clipboard!");
  };

  const handleSocialShare = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(article?.title || "Check this out!");

    let shareUrl = "";
    switch (platform) {
      case "google":
        shareUrl = `https://plus.google.com/share?url=${url}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      default:
        return;
    }
    setShowShareMenu(false);
    if (shareUrl) {
      window.open(shareUrl, "_blank");
    }
  };
  const generateRandomString = (length = 16) => {
    return [...Array(length)].map(() => Math.random().toString(36)[2]).join("");
  };

  const handleAddComment = async () => {
    let visitorId = localStorage.getItem("visitorId");
    if (!visitorId) {
      try {
        const fp = await FingerprintJS.load();
        const fingerprint = await fp.get();
        visitorId = fingerprint.visitorId;
      } catch (error) {
        console.error(
          "FingerprintJS failed, generating random visitorId:",
          error
        );
        visitorId = generateRandomString();
      }
      localStorage.setItem("visitorId", visitorId);
    }

    if (
      comments.filter((comment) => comment.fingerprint === visitorId).length >=
      COMMENT_THRESHOLD
    ) {
      toast.error(
        "Too many comments from this IP. Please wait before commenting again."
      );
      return;
    }
    if (!captchaToken) {
      toast.warning("Please complete the CAPTCHA.");
      return;
    }

    if (honeypot) {
      console.warn("Spam detected");
      return; // Don't submit if honeypot is filled
    }
    if (!articleIdentifier) return;
    setIsPosting(true);

    const response = await fetch(`${API_BASE_URL}/chaptcha/verify-captcha`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: captchaToken }),
    });

    const data = await response.json();

    if (response.ok) {
      if (commentInput.trim()) {
        try {
          const response = await fetch(
            `${API_BASE_URL}/comments/${articleIdentifier}/comment`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                username: usernameInput || "Anonymous",
                text: commentInput,
                fingerprint: visitorId,
              }),
            }
          );
          const newComment = await response.json();
          setComments([newComment, ...comments]);
          toast.success("Comment added successfully!");
          setUsernameInput("");
          setCommentInput("");
          setIsPosting(false);
        } catch (error) {
          console.error("Error adding comment:", error);
          setIsPosting(false);
        }
      } else {
        setIsPosting(false);

        toast.warning("Comment cannot be empty.");
      }
    } else {
      setIsPosting(false);

      toast.error(data.message);
    }
  };

  // Function to render article blocks or content
  const renderBlocks = () => {
    if (article?.blocks && article.blocks.length > 0) {
      return article.blocks.map((block, index) => {
        switch (block.type) {
          case "you-tube-video":
            return (
              <div key={block.id || index} className="my-4">
                <YouTubeEmbed videoURL={block.url} className="rounded-lg shadow-md"/>
              </div>
            );
          case "quote":
            return (
              <blockquote className="border-l-4 border-blue-500 pl-6 italic my-6 text-xl text-gray-800 bg-gray-100 rounded-lg p-4">
                {block.body}
              </blockquote>
            );
          case "rich-text":
            return (
              <div key={index} className="my-4">
                <p>{block.body}</p>
              </div>
            );
          default:
            return null;
        }
      });
    } else if (article?.content) {
      return (
        <div className="my-4">
          <p>{article.content}</p>
        </div>
      );
    } else {
      return <p>No content available.</p>;
    }
  };

  return (
    <div>
      <Helmet>
        <title>
          {config.siteName} | {article.title}{" "}
        </title>
        <meta name="description" content={article.description} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.description} />
        <meta property="og:type" content="article" />
      </Helmet>
      <div className="p-6 max-w-3xl mx-auto">
        <ToastContainer />
        <div className="flex justify-between items-center mb-1">
          <h1 className="flex-1 text-5xl font-extrabold text-gray-900 leading-tight mb-3">
            {article?.title || "No Title Available"}
          </h1>
          <div className="absolute top-4 left-4 flex items-center space-x-2 cursor-pointer text-gray-700 hover:text-gray-900 transition-transform transform hover:scale-105"
          onClick={() => window.history.back()}>
          <IoArrowBackSharp size={25} className="text-blue-600"/>
          <span className="text-lg font-medium">Go Back</span>
          </div>

        </div>
        <p className="text-gray-600 text-sm italic mb-6">
          By {article?.author || "Unknown Author"} • {formatDate(article?.date)}
        </p>
        {(article?.cover || article?.urlToImage) && (
        <figure className="relative">
          <img
            src={article.cover || article.urlToImage}
            alt={article?.title || "Article Image"}
            className="w-full h-auto mb-4 rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
          />
          {article.imageCaption && (
            <figcaption className="text-center text-gray-500 text-sm italic">
              {article.imageCaption}
            </figcaption>
          )}
        </figure>
      )}


        <div className="prose prose-lg prose-gray max-w-none leading-relaxed">
          {renderBlocks()}
        </div>


        {/* Likes Section */}
        <div className="flex items-center mt-8">
          <button
            onClick={handleLike}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-3 hover:bg-blue-600 transition duration-200"
          >
            Like
          </button>
          <p className="text-lg">
            {likes !== null
              ? `${likes} ${likes === 1 ? "like" : "likes"}`
              : "Loading likes..."}
          </p>
          <div className="relative ml-4">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="flex items-center text-blue-500 hover:text-blue-600"
            >
              <IoMdShare size={25} className="mr-2" />
              Share
            </button>
            {showShareMenu && (
              <div className="absolute top-[60px] left-0 transform -translate-y-1/2 bg-white rounded-lg shadow-lg px-6 py-3 flex gap-3 items-center z-10 border border-gray-200">
                {/* Google */}
                <button
                  className="w-9 h-9 flex justify-center items-center rounded-full bg-gray-100 hover:bg-gray-200 text-red-600 transition duration-200"
                  onClick={() => handleSocialShare("google")}
                >
                  <FaGoogle />
                </button>
                {/* Twitter */}
                <button
                  className="w-9 h-9 flex justify-center items-center rounded-full bg-gray-100 hover:bg-gray-200 text-blue-400 transition duration-200"
                  onClick={() => handleSocialShare("twitter")}
                >
                  <FaTwitter />
                </button>
                {/* Facebook */}
                <button
                  className="w-9 h-9 flex justify-center items-center rounded-full bg-gray-100 hover:bg-gray-200 text-blue-700 transition duration-200"
                  onClick={() => handleSocialShare("facebook")}
                >
                  <FaFacebook />
                </button>
                {/* Copy Link */}
                <button
                  className="w-9 h-9 flex justify-center items-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 transition duration-200"
                  onClick={handleCopyLink}
                >
                  <FaLink />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-12">
        <hr className="border-t-2 border-gray-400 my-8" />
        <h2 className="text-2xl font-bold mb-5 text-gray-900">Comments</h2>

        <div className="mb-6 w-full max-w-2xl mx-auto px-4">
            {/* Honeypot Field */}
            <input
              type="text"
              name="honeypot"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              style={{ display: "none" }} // Hide the honeypot field
            />
            {/* Visible Comment Input */}
            <input
              type="text"
              placeholder="Your Name"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 mb-2 focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Add a comment..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 mb-2 focus:ring-2 focus:ring-blue-500"
              rows={4}
              style={{ minHeight: "100px", maxHeight: "300px"}}
            />
            <ReCAPTCHA
              sitekey={CAPTCHA_SITEKEY} className="sm:w-auto mb-4"
              onChange={handleCaptchaChange}
            />
            <button
              onClick={handleAddComment}
              className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200 flex ${isPosting ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={isPosting}
            >
              Submit
              {isPosting && (
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  class="mr-2 animate-spin"
                  viewBox="0 0 1792 1792"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z"></path>
                </svg>
              )}
            </button>
          </div>

          <div className="space-y-6">
            {comments && comments?.length > 0 ? (
              comments?.map((comment, index) => (
                <div key={index} className="border border-gray-200 p-4 rounded-lg shadow-sm bg-gray-50">
                  <p className="font-semibold text-lg text-blue-600">{comment.username || "Anonymous"}</p>
                  <p className="text-gray-700 mt-2 leading-relaxed">{comment.text}</p>
                </div>
              ))
            ) : (
              <p>No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
