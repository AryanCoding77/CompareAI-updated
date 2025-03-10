
import React from "react";
import { Link } from "react-router-dom";
import { scrollToElement } from "./scrollUtils";
import { Button } from "./ui/button";

export function NavBar() {
  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    scrollToElement(id);
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="font-bold text-xl">
            Compare AI
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" onClick={(e) => handleNavigation(e, 'features')} className="text-sm font-medium transition-colors hover:text-primary">
              Features
            </a>
            <a href="#leaderboard" onClick={(e) => handleNavigation(e, 'leaderboard')} className="text-sm font-medium transition-colors hover:text-primary">
              Leaderboard
            </a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/auth/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/auth/register">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
