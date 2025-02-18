import React, { useState } from "react";

const MailchimpForm: React.FC = () => {
  const [email, setEmail] = useState("");

  // Replace with your Mailchimp form action URL
  const formActionUrl =
    "https://yahoo.us10.list-manage.com/subscribe/post?u=c42ae2fa03c51e0de01c45b6f&id=d38ef6fc8f&f_id=0009a7e3f0";

  return (
    <div className="flex justify-center my-8 px-4">
      <div className="bg-gray-900 text-white shadow-lg rounded-lg p-6 w-full max-w-screen-xl text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          Subscribe to Our Newsletter
        </h2>
        <p className="text-gray-300 text-sm mb-4">
          Get the latest news and updates delivered straight to your inbox.
        </p>
        <form
          action={formActionUrl}
          method="post"
          target="_blank"
          noValidate
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <input
            type="email"
            name="EMAIL"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full sm:w-auto flex-1 px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-[var(--primary-color)] text-white font-semibold rounded-md hover:bg-opacity-80 transition duration-300"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
};

export default MailchimpForm;
