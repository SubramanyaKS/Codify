import { useState } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function NewsletterSubscribeInput({ isDark }) {
  const {API}=useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!EMAIL_REGEX.test(email)) {
      toast.error("Please enter a valid email.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(
        `${API}/api/newsletter/subscribe`,
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
      if(data?.message=="Already subscribed")
      toast.info(data?.message || "Subscribed!" )
      else
      toast.success(data?.message || "Subscribed!" )
      setEmail("");
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
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
        className={`bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors shadow-md ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Subscribing..." : "Subscribe"}
      </button>
    </div>
  );
}

NewsletterSubscribeInput.propTypes = {
  isDark: PropTypes.bool.isRequired,
};

export default NewsletterSubscribeInput;
