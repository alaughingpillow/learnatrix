import { Link } from "react-router-dom";
import { useSession } from "@/hooks/use-session";
import { supabase } from "@/integrations/supabase/client";

export const Navigation = () => {
  const { session } = useSession();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-xl font-semibold text-primary hover:text-primary/90"
            >
              Logo
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/"
                  className="text-foreground/70 hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/tests"
                  className="text-foreground/70 hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Tests
                </Link>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Link
                  to="/profile"
                  className="text-foreground/70 hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-foreground/70 hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-foreground/70 hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};