import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-primary-500">TestPro</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <Link to="/tests" className="text-gray-700 hover:text-primary-500 px-3 py-2 rounded-md">
              Tests
            </Link>
            <Link to="/results" className="text-gray-700 hover:text-primary-500 px-3 py-2 rounded-md">
              Results
            </Link>
            <Button variant="outline" asChild>
              <Link to="/login">Login</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-500 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/tests"
              className="block px-3 py-2 text-gray-700 hover:text-primary-500"
              onClick={() => setIsOpen(false)}
            >
              Tests
            </Link>
            <Link
              to="/results"
              className="block px-3 py-2 text-gray-700 hover:text-primary-500"
              onClick={() => setIsOpen(false)}
            >
              Results
            </Link>
            <Link
              to="/login"
              className="block px-3 py-2 text-gray-700 hover:text-primary-500"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};