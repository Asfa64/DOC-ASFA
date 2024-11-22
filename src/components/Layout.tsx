import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { ContactAdmin } from './ContactAdmin';
import { useUserStore } from '../store/userStore';

export const Layout: React.FC = () => {
  const currentUser = useUserStore((state) => state.currentUser);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3">
                <img
                  src="https://www.asfa64.fr/images/asfa64/logo-asfa.png"
                  alt="ASFA Logo"
                  className="h-10 w-auto"
                />
                <span className="text-xl font-bold text-accent1">Tableau de Bord</span>
              </Link>
            </div>
            <div className="flex items-center">
              <Link
                to="/admin"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-accent1 hover:bg-gray-50"
              >
                <Settings className="h-5 w-5 mr-2" />
                Administration
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      <main>
        <Outlet />
      </main>

      {currentUser && currentUser.role !== 'admin' && <ContactAdmin />}
    </div>
  );
};