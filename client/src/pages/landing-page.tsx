import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RiUserSmileLine } from "react-icons/ri";

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


  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-full h-[40%] bg-[#f0f7ff] rounded-[50%] -z-10 translate-y-1/2 translate-x-1/4 scale-150"></div>

      <header className="bg-background py-4 relative z-10">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <RiUserSmileLine className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">Compare AI</h1>
          </div>
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-sm font-medium">Features</a>
              <a href="#how-it-works" className="text-sm font-medium">How It Works</a>
              <a href="#leaderboard" className="text-sm font-medium">Leaderboard</a>
            </nav>
            <Button onClick={handleLoginClick} className="bg-[#0084ff] hover:bg-[#0068cc]">Try Now</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="min-h-screen w-full flex items-center container mx-auto px-4 py-12 md:py-24">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 w-full">
          <div className="lg:w-1/2 px-6 md:px-10 py-8">
            <span className="flex items-center text-[#0084ff] text-lg mb-4">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
              AI-Powered Face Comparison
            </span>
            <h1 className="text-5xl font-bold mb-8 text-[#2d3748]">
            Roast or Toast?
              <br />
              <span className="text-[#0084ff]">Let AI Rate Your Squad’s Look</span>
            </h1>
            <p className="text-xl mb-12 max-w-2xl text-[#4a5568]">
              Compare facial features with friends, using advanced AI 
              technology. See who matches best and climb our global
              leaderboard.
            </p>
            <div className="flex space-x-4">
              <Button size="lg" onClick={handleLoginClick} className="bg-[#0084ff] hover:bg-[#0068cc] text-lg px-8 py-6">
                Try For Free <span className="ml-2">→</span>
              </Button>
              <Button size="lg" onClick={handleLoginClick} variant="outline" className="text-lg px-8 py-6 border-[#0084ff] text-[#0084ff]">
                Learn More
              </Button>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center">
            {/* Hidden on mobile, visible on larger screens */}
            <div className="hidden lg:block">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden max-w-xl" style={{ width: '44vh' }}>
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
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="min-h-screen w-full flex items-center py-16 bg-gray-50">
        <div className="container mx-auto px-4 w-full">
          <div className="text-center mb-16">
            <span className="text-[#0084ff] text-sm uppercase tracking-wider font-medium">FEATURES</span>
            <h2 className="text-4xl font-bold text-[#2d3748] mt-2">Advanced AI-Powered Face Comparison</h2>
            <p className="text-[#4a5568] text-lg mt-4 max-w-2xl mx-auto">
              Compare AI uses cutting-edge facial recognition technology to provide accurate, fun, and
              insightful comparisons.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-[#e6f2ff] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#0084ff]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 6H20M9 12H20M9 18H20M5 6V6.01M5 12V12.01M5 18V18.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Face Analysis</h3>
              <p className="text-[#4a5568]">
                Powered by Face++ API, our advanced AI technology analyzes facial features with remarkable precision.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-[#e6f2ff] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#0084ff]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 8C17 10.7614 14.7614 13 12 13C9.23858 13 7 10.7614 7 8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 21C3 16.0294 7.02944 12 12 12C16.9706 12 21 16.0294 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Face Comparison</h3>
              <p className="text-[#4a5568]">
                Compare your face with friends or anyone else to see who is more attractive.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-[#e6f2ff] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#0084ff]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 18L18 20L22 16M12 15H8C6.13623 15 5.20435 15 4.46927 15.3045C3.48915 15.7105 2.71046 16.4892 2.30448 17.4693C2 18.2044 2 19.1362 2 21M15.5 3.29076C16.9659 3.88415 18 5.32131 18 7C18 8.67869 16.9659 10.1159 15.5 10.7092M13.5 7C13.5 9.20914 11.7091 11 9.5 11C7.29086 11 5.5 9.20914 5.5 7C5.5 4.79086 7.29086 3 9.5 3C11.7091 3 13.5 4.79086 13.5 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Global Leaderboard</h3>
              <p className="text-[#4a5568]">
                Win comparison matches to increase your score and climb the rankings on our global leaderboard.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-[#e6f2ff] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#0084ff]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.9833 3.24167C12.8048 3.14467 12.6031 3.08333 12.3833 3.08333C11.9391 3.08333 11.5473 3.32584 11.3366 3.69167C11.2516 3.83308 11.2008 3.9985 11.2008 4.175C11.2008 4.82525 11.733 5.35 12.3833 5.35C13.0335 5.35 13.5658 4.82525 13.5658 4.175C13.5658 3.77558 13.3242 3.42674 12.9833 3.24167Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.5833 8.31667C13.5833 10.6167 15.4 10.6833 15.4 13.05C15.4 15.4167 10.7833 15.4167 10.7833 13.05V10.6833" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C13.5 3 14.9 3.4 16.1 4.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Continuous Innovation</h3>
              <p className="text-[#4a5568]">
                We're constantly adding new features to enhance your experience and provide more insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard Section */}
      <section id="leaderboard" className="min-h-screen w-full flex items-center py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-12">
            <div className="lg:w-1/2 text-center md:text-left">
              <span className="flex items-center text-[#0084ff] text-sm uppercase tracking-wider font-medium mx-auto md:mx-0 justify-center md:justify-start">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
                Global Rankings
              </span>
              <h2 className="text-4xl font-bold text-[#2d3748] mt-2 mb-6">Climb The Leaderboard</h2>
              <p className="text-lg mb-8 text-[#4a5568] max-w-xl mx-auto md:mx-0">
                Win comparison matches to increase your score and rise through the 
                ranks. Compete with friends and users worldwide for the top position.
              </p>
              <Button 
                onClick={() => {
                  if (user) {
                    setLocation("/leaderboard");
                  } else {
                    setLocation("/auth");
                  }
                }}
                className="inline-flex items-center px-6 py-3 bg-[#0084ff] hover:bg-[#0068cc] text-white font-medium rounded-md transition-colors"
              >
                View Full Leaderboard
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Button>
            </div>

            <div className="lg:w-2/5 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center mb-6">
                <svg className="w-5 h-5 text-[#0084ff] mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h3 className="text-lg font-semibold">Top Performers</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <div className="bg-[#0084ff] text-white w-7 h-7 rounded-full flex items-center justify-center mr-3">1</div>
                    <span className="font-medium">Alex Johnson</span>
                  </div>
                  <span className="text-[#0084ff] font-bold ml-8">2864 pts</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <div className="bg-gray-200 text-gray-700 w-7 h-7 rounded-full flex items-center justify-center mr-3">2</div>
                    <span className="font-medium">Jamie Smith</span>
                  </div>
                  <span className="text-[#0084ff] font-bold ml-8">2731 pts</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <div className="bg-gray-200 text-gray-700 w-7 h-7 rounded-full flex items-center justify-center mr-3">3</div>
                    <span className="font-medium">Taylor Wilson</span>
                  </div>
                  <span className="text-[#0084ff] font-bold ml-8">2603 pts</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <div className="bg-gray-200 text-gray-700 w-7 h-7 rounded-full flex items-center justify-center mr-3">4</div>
                    <span className="font-medium">Morgan Lee</span>
                  </div>
                  <span className="text-[#0084ff] font-bold ml-8">2547 pts</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <div className="bg-gray-200 text-gray-700 w-7 h-7 rounded-full flex items-center justify-center mr-3">5</div>
                    <span className="font-medium">Casey Brown</span>
                  </div>
                  <span className="text-[#0084ff] font-bold ml-8">2433 pts</span>
                </div>

                <div className="text-right mt-4">
                  <a href="/leaderboard" className="text-[#0084ff] text-sm font-medium inline-flex items-center">
                    See Your Ranking
                    <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-16 bg-[#0084ff]">
        <div className="container mx-auto px-4 text-center text-white">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <svg className="w-8 h-8 mx-auto text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
            <h2 className="text-4xl font-bold mb-4">Ready to See Who You Look Like?</h2>
            <p className="text-xl mb-8">
              Start comparing faces today. Upload your photo and discover fascinating similarities
              with friends, celebrities, or historical figures.
            </p>
            <Button 
              onClick={handleLoginClick} 
              className="bg-white text-[#0084ff] hover:bg-gray-100 px-6 py-3 rounded-full font-medium text-lg"
            >
              Get Started Free <span className="ml-1">→</span>
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-background border-t py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} Compare AI. All rights reserved.</p>
          <a href="/privacy-policy" className="text-sm text-primary hover:underline">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
}