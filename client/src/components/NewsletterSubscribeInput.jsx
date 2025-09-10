import { useState } from "react";
import PropTypes from "prop-types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function NewsletterSubscribeInput({ isDark }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!EMAIL_REGEX.test(email)) {
      setStatus({ type: "error", message: "Please enter a valid email." });
      return;
    }
    try {
      setLoading(true);
      setStatus({ type: "idle", message: "" });
      const res = await fetch(
        "http://localhost:5050/api/newsletter/subscribe",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();
      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || "Subscription failed");
      }
      setStatus({ type: "success", message: data?.message || "Subscribed!" });
      setEmail("");
    } catch (err) {
      setStatus({
        type: "error",
        message: err.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:flex gap-2">
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={`
          flex-1 px-4 py-2 rounded-lg backdrop-blur-sm
          ${
            isDark
              ? "bg-gray-800/50 text-dark-text-primary border-gray-600/30"
              : "bg-white/50 text-light-text-primary border-white/30"
          } border focus:outline-none focus:ring-2 focus:ring-primary
        `}
      />
      <button
        onClick={handleSubscribe}
        disabled={loading}
        className={`bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors my-3 mx-1 shadow-md ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Subscribing..." : "Subscribe"}
      </button>
      {status.message && (
        <div
          className={`text-sm my-auto ${
            status.type === "error" ? "text-red-500" : "text-green-500"
          }`}
        >
          {status.message}
        </div>
      )}
    </div>
  );
}

NewsletterSubscribeInput.propTypes = {
  isDark: PropTypes.bool.isRequired,
};

export default NewsletterSubscribeInput;
