import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useEffect, useRef } from "react";
import { RiUserSmileLine } from "react-icons/ri";
import { scrollToElement } from "@/components/scrollUtils";

export function ArcadeEmbed() {
  return (
    <div style={{ position: 'relative', paddingBottom: 'calc(51.90972222222222% + 41px)', height: 0, width: '100%' }}>
      <iframe
        src="https://demo.arcade.software/li1SHERcINudwadZ7ift?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true"
        title="Compare AI"
        frameBorder="0"
        loading="lazy"
        allowFullScreen
        allow="clipboard-write"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', colorScheme: 'light' }}
      />
    </div>
  )
}

export default function LandingPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  const handleLoginClick = () => {
    setLocation("/auth");
  };

  const handleHomeClick = () => {
    setLocation("/home");
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const featureItem = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <motion.div
        className="absolute bottom-0 right-0 w-full h-[40%] bg-[#f0f7ff] rounded-[50%] -z-10 translate-y-1/2 translate-x-1/4 scale-150"
        initial={{ scale: 1.3 }}
        animate={{
          scale: [1.3, 1.4, 1.3],
          translateY: ["50%", "48%", "50%"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      ></motion.div>

      <header className="bg-background py-4 relative z-10">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <motion.div
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <RiUserSmileLine className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">Compare AI</h1>
          </motion.div>
          <motion.div
            className="flex items-center space-x-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <nav className="hidden md:flex items-center space-x-6">
            </nav>
            {user ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={handleHomeClick} className="bg-[#0084ff] hover:bg-[#0068cc]">
                  Go to Dashboard
                </Button>
              </motion.div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleLoginClick}
                  className="bg-[#0084ff] hover:bg-[#0068cc]"
                >
                  Try Now
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <main id="hero-section" className="min-h-screen w-full flex items-center container mx-auto px-4 py-12 md:py-24">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 w-full">
          <motion.div
            className="lg:w-1/2 px-6 md:px-10 py-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.span
              className="flex items-center text-[#0084ff] text-lg mb-4"
              variants={fadeIn}
            >
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
              AI-Powered Face Comparison
            </motion.span>
            <motion.h1
              className="text-5xl font-bold mb-8 text-[#2d3748]"
              variants={fadeIn}
            >
              Roast or Toast?
              <br />
              <span className="text-[#0084ff]">
                Let AI Rate Your Squad's Look
              </span>
            </motion.h1>
            <motion.p
              className="text-xl mb-12 max-w-2xl text-[#4a5568]"
              variants={fadeIn}
            >
              Compare facial features with friends, using advanced AI
              technology. See who matches best and climb our global leaderboard.
            </motion.p>
            <motion.div className="flex space-x-4" variants={fadeIn}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  onClick={handleLoginClick}
                  className="bg-[#0084ff] hover:bg-[#0068cc] text-lg px-8 py-6"
                >
                  Try For Free{" "}
                  <motion.span
                    className="ml-2 inline-block"
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                  >
                    →
                  </motion.span>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  onClick={handleLoginClick}
                  variant="outline"
                  className="text-lg px-8 py-6 border-[#0084ff] text-[#0084ff]"
                >
                  Learn More
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
          <div className="lg:w-1/2 flex justify-center">
            {/* Hidden on mobile, visible on larger screens */}
            <div className="hidden lg:block">
              <motion.div
                className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden max-w-xl"
                style={{ width: "44vh" }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.5,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{
                  y: -10,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              >
                {/* Mockup UI similar to the screenshot */}
                <div className="p-6 bg-[#f8fafc]">
                  <div className="flex justify-between mb-6">
                    <div className="w-[47%] h-40 bg-gray-100 rounded-md"></div>
                    <div className="w-[47%] h-40 bg-gray-100 rounded-md"></div>
                  </div>
                  <div className="w-full h-6 bg-[#e6f2ff] rounded-full mb-6"></div>
                  <div className="flex justify-between items-center mt-8">
                    <div className="w-24 h-9 bg-[#0084ff] rounded-md"></div>
                    <div className="w-24 h-9 bg-gray-200 rounded-md"></div>
                  </div>
                </div>
                <div className="p-6 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="h-5 w-28 bg-gray-200 rounded mb-3"></div>
                      <div className="h-4 w-36 bg-gray-100 rounded"></div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-[#0084ff] flex items-center justify-center text-white font-bold">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section
        id="features-section"
        className="min-h-screen w-full flex items-center py-16 bg-gray-50"
      >
        <div className="container mx-auto px-4 w-full">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <span className="text-[#0084ff] text-sm uppercase tracking-wider font-medium">
              FEATURES
            </span>
            <h2 className="text-4xl font-bold text-[#2d3748] mt-2">
              Advanced AI-Powered Face Comparison
            </h2>
            <p className="text-[#4a5568] text-lg mt-4 max-w-2xl mx-auto">
              Compare AI uses cutting-edge facial recognition technology to
              provide accurate, fun, and insightful comparisons.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            variants={staggerContainer}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              variants={featureItem}
              whileHover={{
                y: -10,
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div className="w-12 h-12 bg-[#e6f2ff] rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-[#0084ff]"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 6H20M9 12H20M9 18H20M5 6V6.01M5 12V12.01M5 18V18.01"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Face Analysis</h3>
              <p className="text-[#4a5568]">
                Powered by Face++ API, our advanced AI technology analyzes
                facial features with remarkable precision.
              </p>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              variants={featureItem}
              whileHover={{
                y: -10,
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div className="w-12 h-12 bg-[#e6f2ff] rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-[#0084ff]"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17 8C17 10.7614 14.7614 13 12 13C9.23858 13 7 10.7614 7 8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 21C3 16.0294 7.02944 12 12 12C16.9706 12 21 16.0294 21 21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Face Comparison</h3>
              <p className="text-[#4a5568]">
                Compare your face with friends or anyone else to see who is more
                attractive.
              </p>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              variants={featureItem}
              whileHover={{
                y: -10,
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div className="w-12 h-12 bg-[#e6f2ff] rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-[#0084ff]"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 18L18 20L22 16M12 15H8C6.13623 15 5.20435 15 4.46927 15.3045C3.48915 15.7105 2.71046 16.4892 2.30448 17.4693C2 18.2044 2 19.1362 2 21M15.5 3.29076C16.9659 3.88415 18 5.32131 18 7C18 8.67869 16.9659 10.1159 15.5 10.7092M13.5 7C13.5 9.20914 11.7091 11 9.5 11C7.29086 11 5.5 9.20914 5.5 7C5.5 4.79086 7.29086 3 9.5 3C11.7091 3 13.5 4.79086 13.5 7Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Global Leaderboard</h3>
              <p className="text-[#4a5568]">
                Win comparison matches to increase your score and climb the
                rankings on our global leaderboard.
              </p>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              variants={featureItem}
              whileHover={{
                y: -10,
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div className="w-12 h-12 bg-[#e6f2ff] rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-[#0084ff]"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 10V3L4 14H11V21L20 10H13Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Results</h3>
              <p className="text-[#4a5568]">
                Get immediate feedback on your comparisons with detailed
                analysis and fun insights.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-16 bg-gradient-to-b from-white to-[#f8fafc]">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <span className="text-[#0084ff] text-sm uppercase tracking-wider font-medium">
              HOW IT WORKS
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-[#2d3748] mt-2">
              Compare Your Face in Three Steps
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="relative bg-white rounded-xl p-6 shadow-lg border border-gray-100"
            >
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#0084ff] rounded-full text-lg font-bold text-white flex items-center justify-center">
                1
              </div>
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-[#e6f2ff] rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-[#0084ff]"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M15 8V16H5V8H15ZM16 6H4C3.44772 6 3 6.44772 3 7V17C3 17.5523 3.44772 18 4 18H16C16.5523 18 17 17.5523 17 17V7C17 6.44772 16.5523 6 16 6ZM21 6H19V18H21V6Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-center text-[#2d3748] mb-2">
                Upload Photo
              </h3>
              <p className="text-[#4a5568] text-center">
                Take a selfie or upload your best photo
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative bg-white rounded-xl p-6 shadow-lg border border-gray-100"
            >
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#0084ff] rounded-full text-lg font-bold text-white flex items-center justify-center">
                2
              </div>
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-[#e6f2ff] rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-[#0084ff]"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M9 15L11 17L15 13M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-center text-[#2d3748] mb-2">
                AI Analysis
              </h3>
              <p className="text-[#4a5568] text-center">
                Our AI analyzes your facial features
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="relative bg-white rounded-xl p-6 shadow-lg border border-gray-100"
            >
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#0084ff] rounded-full text-lg font-bold text-white flex items-center justify-center">
                3
              </div>
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-[#e6f2ff] rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-[#0084ff]"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M13 10V3L4 14H11V21L20 10H13Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-center text-[#2d3748] mb-2">
                Get Results
              </h3>
              <p className="text-[#4a5568] text-center">
                See how you compare and rank globally
              </p>
            </motion.div>
          </div>

          {/* ArcadeEmbed component - hidden on mobile, visible on md screens and above */}
          <div className="mt-16 hidden md:block">
            <ArcadeEmbed />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <span className="text-[#0084ff] text-sm uppercase tracking-wider font-medium">
              TESTIMONIALS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#2d3748] mt-2">
              What Our Users Say
            </h2>
            <p className="text-[#4a5568] text-lg mt-4 max-w-2xl mx-auto">
              See how Compare AI is changing the way people connect and compete with friends.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{
                y: -10,
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#e6f2ff] rounded-full flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-[#0084ff]" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6h-3V4c0-1.103-.897-2-2-2H9c-1.103 0-2 .897-2 2v2H4c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V8c0-1.103-.897-2-2-2zM9 4h6v2H9V4zM4 18V8h16l.001 10H4z" fill="currentColor"/>
                    <path d="M13 14h-2v-4h2v4z" fill="currentColor"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Mike T.</h4>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-[#4a5568] mb-4">
                "Compare AI is addictive! Myfriends and I have weekly competitions to see who can get the highest attractiveness score. It's become our favorite game night activity!"
              </p>
              <span className="text-sm text-gray-500">3 weeks ago</span>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{
                y: -10,
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#e6f2ff] rounded-full flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-[#0084ff]" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" fill="currentColor"/>
                    <path d="M13 7h-2v6h6v-2h-4z" fill="currentColor"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Sarah K.</h4>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-[#4a5568] mb-4">
                "The facial analysis is surprisingly accurate! I love seeing the detailed breakdowns of facial features and how they compare. It's both fun and fascinating at the same time."
              </p>
              <span className="text-sm text-gray-500">1 month ago</span>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{
                y: -10,
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#e6f2ff] rounded-full flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-[#0084ff]" viewBox="0 0 24 24" fill="none">
                    <path d="M19 2H5c-1.103 0-2 .897-2 2v16c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zM5 20V4h14l.002 16H5z" fill="currentColor"/>
                    <path d="M7 12h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2zm-8-4h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z" fill="currentColor"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-lg">David R.</h4>
                  <div className="flex">
                    {[...Array(4)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                    <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  </div>
                </div>
              </div>
              <p className="text-[#4a5568] mb-4">
                "I've been trying to climb the leaderboard for weeks! The competitive aspect is what keeps me coming back. It's a fun way to engage with friends and see how we all rank."
              </p>
              <span className="text-sm text-gray-500">2 months ago</span>
            </motion.div>
          </div>

          <motion.div 
            className="text-center mt-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <a href="#" className="inline-flex items-center text-[#0084ff] font-medium hover:underline">
              See more testimonials
              <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Leaderboard Section */}
      <section
        id="leaderboard-section"
        className="min-h-screen w-full flex items-center py-16"
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <span className="text-[#0084ff] text-sm uppercase tracking-wider font-medium">
              LEADERBOARD
            </span>
            <h2 className="text-4xl font-bold text-[#2d3748] mt-2">
              See Who's Leading the Pack
            </h2>
            <p className="text-[#4a5568] text-lg mt-4 max-w-2xl mx-auto">
              Join thousands of users competing for the top spots on our global
              leaderboard.
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <motion.div
              className="lg:w-1/2 relative"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              {/* Background decorative elements */}
              <div className="absolute -z-10 top-10 -left-10 w-20 h-20 bg-[#e6f2ff] rounded-full opacity-50"></div>
              <div className="absolute -z-10 bottom-10 -right-10 w-16 h-16 bg-[#e6f2ff] rounded-full opacity-30"></div>

              <motion.h3
                className="text-3xl font-bold mb-8 text-[#2d3748] relative inline-block"
                whileInView={{
                  backgroundPosition: ["0% 0%", "100% 0%"],
                  transition: {
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                  },
                }}
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #2d3748, #0084ff, #2d3748)",
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                How Scoring Works
              </motion.h3>

              <div className="space-y-8 relative">
                {/* Vertical line connecting steps */}
                <div className="absolute left-4 top-4 w-0.5 h-[calc(100%-32px)] bg-gradient-to-b from-[#0084ff] to-[#00d2ff] rounded-full"></div>

                <motion.div
                  className="flex items-start relative z-10"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    className="bg-gradient-to-r from-[#0084ff] to-[#00a3ff] rounded-full w-9 h-9 flex items-center justify-center text-white font-bold mr-5 flex-shrink-0 shadow-lg"
                    whileHover={{
                      scale: 1.1,
                      boxShadow: "0 0 15px rgba(0, 132, 255, 0.5)",
                    }}
                  >
                    1
                  </motion.div>
                  <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 w-[85%] transform transition-all hover:-translate-y-1 hover:shadow-lg">
                    <div className="flex items-center mb-2">
                      <svg
                        className="w-5 h-5 text-[#0084ff] mr-2"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4 16L8.586 11.414C8.96106 11.0391 9.46967 10.8284 10 10.8284C10.5303 10.8284 11.0389 11.0391 11.414 11.414L16 16M14 14L15.586 12.414C15.9611 12.0391 16.4697 11.8284 17 11.8284C17.5303 11.8284 18.0389 12.0391 18.414 12.414L20 14M14 8H14.01M6 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V6C20 5.46957 19.7893 4.96086 19.4142 4.58579C19.0391 4.21071 18.5304 4 18 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <h4 className="font-bold text-lg text-[#2d3748]">
                        Upload Your Photo
                      </h4>
                    </div>
                    <p className="text-[#4a5568] ml-7">
                      Start by uploading a clear photo of your face to begin the
                      comparison process.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start relative z-10"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    className="bg-gradient-to-r from-[#0084ff] to-[#00a3ff] rounded-full w-9 h-9 flex items-center justify-center text-white font-bold mr-5 flex-shrink-0 shadow-lg"
                    whileHover={{
                      scale: 1.1,
                      boxShadow: "0 0 15px rgba(0, 132, 255, 0.5)",
                    }}
                  >
                    2
                  </motion.div>
                  <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 w-[85%] transform transition-all hover:-translate-y-1 hover:shadow-lg">
                    <div className="flex items-center mb-2">
                      <svg
                        className="w-5 h-5 text-[#0084ff] mr-2"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <h4 className="font-bold text-lg text-[#2d3748]">
                        Win Comparisons
                      </h4>
                    </div>
                    <p className="text-[#4a5568] ml-7">
                      Each time your photo wins in a comparison, you earn points
                      based on the match quality.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start relative z-10"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    className="bg-gradient-to-r from-[#0084ff] to-[#00a3ff] rounded-full w-9 h-9 flex items-center justify-center text-white font-bold mr-5 flex-shrink-0 shadow-lg"
                    whileHover={{
                      scale: 1.1,
                      boxShadow: "0 0 15px rgba(0, 132, 255, 0.5)",
                    }}
                  >
                    3
                  </motion.div>
                  <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 w-[85%] transform transition-all hover:-translate-y-1 hover:shadow-lg">
                    <div className="flex items-center mb-2">
                      <svg
                        className="w-5 h-5 text-[#0084ff] mr-2"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13 7H21M13 17H21M13 12H21M6 7V17M6 7L3 10M6 7L9 10"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <h4 className="font-bold text-lg text-[#2d3748]">
                        Climb the Ranks
                      </h4>
                    </div>
                    <p className="text-[#4a5568] ml-7">
                      As you accumulate points, you'll rise through the ranks on
                      our global leaderboard.
                    </p>
                  </div>
                </motion.div>
              </div>

              <motion.div
                className="mt-8 flex justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                viewport={{ once: true }}
              >
                <motion.button
                  className="bg-gradient-to-r from-[#0084ff] to-[#00a3ff] text-white px-6 py-3 rounded-full font-medium flex items-center shadow-md"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 15px -3px rgba(0, 132, 255, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLoginClick}
                >
                  Start Earning Points
                  <svg
                    className="ml-2 w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.button>
              </motion.div>
            </motion.div>

            <motion.div
              className="lg:w-1/2 bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">Top Ranked Users</h3>
                  <span className="text-sm text-[#0084ff]">This Week</span>
                </div>

                <div className="space-y-3">
                  <motion.div
                    className="flex items-center justify-between p-3 bg-[#f0f7ff] rounded-md"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="flex items-center">
                      <div className="bg-[#0084ff] text-white w-7 h-7 rounded-full flex items-center justify-center mr-3">
                        1
                      </div>
                      <span className="font-medium">Alex Johnson</span>
                    </div>
                    <span className="text-[#0084ff] font-bold ml-8">
                      3842 pts
                    </span>
                  </motion.div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <div className="bg-gray-200 text-gray-700 w-7 h-7 rounded-full flex items-center justify-center mr-3">
                        2
                      </div>
                      <span className="font-medium">Jamie Smith</span>
                    </div>
                    <span className="text-[#0084ff] font-bold ml-8">
                      2731 pts
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <div className="bg-gray-200 text-gray-700 w-7 h-7 rounded-full flex items-center justify-center mr-3">
                        3
                      </div>
                      <span className="font-medium">Taylor Wilson</span>
                    </div>
                    <span className="text-[#0084ff] font-bold ml-8">
                      2603 pts
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <div className="bg-gray-200 text-gray-700 w-7 h-7 rounded-full flex items-center justify-center mr-3">
                        4
                      </div>
                      <span className="font-medium">Morgan Lee</span>
                    </div>
                    <span className="text-[#0084ff] font-bold ml-8">
                      2547 pts
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <div className="bg-gray-200 text-gray-700 w-7 h-7 rounded-full flex items-center justify-center mr-3">
                        5
                      </div>
                      <span className="font-medium">Casey Brown</span>
                    </div>
                    <span className="text-[#0084ff] font-bold ml-8">
                      2433 pts
                    </span>
                  </div>

                  <div className="text-right mt-4">
                    <a
                      href="/leaderboard"
                      className="text-[#0084ff] text-sm font-medium inline-flex items-center"
                    >
                      See Your Ranking
                      <svg
                        className="ml-1 w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-16 bg-[#0084ff]">
        <motion.div
          className="container mx-auto px-4 text-center text-white"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="max-w-3xl mx-auto">
            <motion.div
              className="mb-6"
              animate={{
                rotate: [0, 10, 0, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <svg
                className="w-8 h-8 mx-auto text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 17.77 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </motion.div>
            <h2 className="text-4xl font-bold mb-4">
              Ready to See Do You Look Best In Your Squad?
            </h2>
            <p className="text-xl mb-8">
              Start comparing faces today. Upload your photo and see who look
              better in friends.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleLoginClick}
                className="bg-white text-[#0084ff] hover:bg-gray-100 px-6 py-3 rounded-full font-medium text-lg"
              >
                Get Started Free{" "}
                <motion.span
                  className="ml-1 inline-block"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
                >
                  →
                </motion.span>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <footer className="bg-background py-8 border-t">
        <div className="container mx-auto px-4">
          <motion.div
            className="flex flex-col md:flex-row justify-between items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <RiUserSmileLine className="w-6 h-6 text-primary" />
              <span className="text-lg font-bold">Compare AI</span>
            </div>
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              <a
                href="/privacy-policy"
                className="text-sm text-muted-foreground"
              >
                Privacy Policy
              </a>
            </div>
          </motion.div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Compare AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}