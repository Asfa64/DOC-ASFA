import React, { useEffect } from 'react';
import ButtonGrid from '../components/ButtonGrid';
import { useButtonStore } from '../store/buttonStore';

export const Home: React.FC = () => {
  const { fetchButtons, loading, error } = useButtonStore();

  useEffect(() => {
    fetchButtons();
  }, [fetchButtons]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600 text-center">
          <p className="text-xl font-semibold">Erreur de chargement du tableau de bord</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12">
        <h1 className="text-4xl font-bold text-center mb-12 text-[#6762A8]">
          Bienvenue sur votre Tableau de Bord
        </h1>
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent1"></div>
          </div>
        ) : (
          <ButtonGrid />
        )}
      </div>
    </div>
  );
};