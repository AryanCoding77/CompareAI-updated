<nav className="hidden md:flex items-center space-x-6">
              <a 
                href="#hero" 
                className="text-sm font-medium" 
                onClick={(e) => {
                  e.preventDefault();
                  scrollToElement('hero-section');
                }}
              >
                Home
              </a>
            </nav>