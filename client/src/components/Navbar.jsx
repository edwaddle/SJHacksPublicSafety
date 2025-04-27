import { Home, MessageSquare, Newspaper } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const getNavItemClass = (path) => {
    const baseClasses = "flex flex-col items-center justify-center flex-1 py-2 text-sm transition-colors";
    
    return currentPath === path
      ? `${baseClasses} text-amber-500`
      : `${baseClasses} text-gray-500 hover:text-amber-400`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-800 border-t border-slate-700 shadow-lg">
      <nav className="flex items-center justify-around h-16">
        <Link to="/" className={getNavItemClass("/")}>
          <Home className="h-6 w-6 mb-1" />
          <span>Home</span>
        </Link>

        <Link to="/chat" className={getNavItemClass("/chat")}>
          <MessageSquare className="h-6 w-6 mb-1" />
          <span>Chat</span>
        </Link>

        <Link to="/news" className={getNavItemClass("/news")}>
          <Newspaper className="h-6 w-6 mb-1" />
          <span>News</span>
        </Link>
      </nav>
    </div>
  );
};

export default Navbar;
