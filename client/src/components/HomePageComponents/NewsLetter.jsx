import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import { FaPaperPlane } from "react-icons/fa";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const NewsLetter = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [email, setEmail] = useState("");
  const sectionRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the newsletter subscription
    alert(`Thank you for subscribing with: ${email}`);
    setEmail("");
  };

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.set(sectionRef.current, { x: -100, opacity: 0 });
    gsap.to(sectionRef.current, {
      x: 0,
      opacity: 1,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        once: true,
      },
    });
  }, []);


  return (
    <section ref={sectionRef} className="py-20 px-4">
      <div
        className={`
          max-w-5xl mx-auto rounded-2xl p-12 sm:p-16 ${isDark ? 'bg-gradient-to-br from-gray-800 to-secondary-1000 border border-dark-border' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-light-border'}
          shadow-lg relative overflow-hidden
        `}
      >
        <div className="relative z-10 text-center">
          <h2 className={`text-4xl font-righteous tracking-wider mb-6 ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
            Stay Updated with <span className="text-primary">Latest Courses</span>
          </h2>

          <p className={`text-lg mb-8 max-w-2xl mx-auto ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
            Subscribe to our newsletter and never miss new courses and learning opportunities
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`
                flex-grow px-5 py-3 rounded-2xl shadow-md bg-transparent border-none outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                ${isDark ? 'text-dark-text-primary placeholder-dark-text-secondary' : 'text-light-text-primary placeholder-light-text-secondary'}
                transition-all duration-300
              `}
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-lg"
            >
              <span>Subscribe</span>
              <FaPaperPlane />
            </motion.button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default NewsLetter;