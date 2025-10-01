import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const CallToAction = () => {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const sectionRef = useRef(null);

    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    useEffect(() => {
        if (!sectionRef.current) return;
        gsap.set(sectionRef.current, { scale: 0.9, opacity: 0 });
        gsap.to(sectionRef.current, {
            scale: 1,
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
        <section
            ref={sectionRef}
            className="py-16 px-4 sm:py-24 sm:px-6 relative"
        >
            <div className="max-w-7xl mx-auto relative">
                <div
                    className={`relative rounded-2xl sm:rounded-3xl p-6 sm:p-16 border shadow-lg overflow-hidden ${isDark
                            ? 'bg-gradient-to-br from-gray-800 to-secondary-1000 border-dark-border'
                            : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-light-border'
                        } text-white`}
                >
                    <div className="relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/30 backdrop-blur-sm border border-white/50 mb-6 sm:mb-8 shadow-lg">
                            <span className="w-2 h-2  bg-white rounded-full animate-pulse"></span>
                            <span className={`text-xs sm:text-sm font-bold ${isDark? 'text-white':'text-black'} drop-shadow-sm`}>
                                🚀 Limited Time Offer
                            </span>
                        </div>
                        <h2 className="text-3xl sm:text-5xl md:text-6xl font-righteous tracking-wider mb-6 sm:mb-8 text-white leading-tight drop-shadow-lg">
                            Ready to Start Your
                            <span className="block text-primary font-righteous tracking-wider animate-pulse drop-shadow-lg">Learning Journey?</span>
                        </h2>
                        <p className={`text-base sm:text-xl mb-8 sm:mb-12 max-w-xl sm:max-w-3xl mx-auto ${isDark? 'text-white':'text-black'} leading-relaxed drop-shadow-md font-medium`}>
                            Join thousands of successful learners and transform your career
                            today with our comprehensive learning platform
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
                            <motion.a
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                href="/courses"
                                className="group py-3 sm:py-4 px-6 sm:px-10 bg-white text-primary font-semibold rounded-xl hover:shadow-2xl transition-all duration-300 inline-flex items-center gap-2 sm:gap-3 text-base sm:text-lg"
                            >
                                <span>Browse Courses</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 sm:h-5 sm:w-5 transform group-hover:translate-x-1 transition-transform"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </motion.a>

                            {!isLoggedIn &&
                                <motion.a
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    href="/signup"
                                    className={`group py-3 sm:py-4 px-6 sm:px-10 bg-transparent border-2 border-white ${isDark? 'text-white':'text-black'} font-semibold rounded-xl hover:bg-white hover:text-primary transition-all duration-300 inline-flex items-center gap-2 sm:gap-3 text-base sm:text-lg"
                                `}>
                                    <span>Sign Up Now</span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 sm:h-5 sm:w-5 transform group-hover:scale-110 transition-transform"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100-2h3.586l-1.293-1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </motion.a>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;
