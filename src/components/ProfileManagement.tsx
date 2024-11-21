import React, { useState, useEffect } from 'react';
import { useProfileStore } from '../store/profileStore';
import { Profile } from '../types';

export const ProfileManagement: React.FC = () => {
  const { profiles, fetchProfiles, addProfile, removeProfile, loading } = useProfileStore();
  const [newProfile, setNewProfile] = useState<Omit<Profile, 'id'>>({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfile.name.trim()) {
      alert('Le nom du profil est requis');
      return;
    }
    
    await addProfile(newProfile);
    setNewProfile({ name: '', description: '' });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Gestion des Profils</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom du profil *</label>
          <input
            type="text"
            required
            value={newProfile.name}
            onChange={(e) => setNewProfile({...newProfile, name: e.target.value})}
            className="mt-1 block w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={newProfile.description}
            onChange={(e) => setNewProfile({...newProfile, description: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent1 focus:ring focus:ring-accent1 focus:ring-opacity-50"
            rows={3}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent1 text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors"
        >
          {loading ? 'Création...' : 'Créer un Profil'}
        </button>
      </form>

      <div className="mt-8 space-y-4">
        <h3 className="font-medium">Profils Existants</h3>
        {profiles.map((profile) => (
          <div key={profile.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
            <div>
              <p className="font-medium">{profile.name}</p>
              {profile.description && (
                <p className="text-sm text-gray-500">{profile.description}</p>
              )}
            </div>
            <button
              onClick={() => removeProfile(profile.id)}
              className="text-red-600 hover:text-red-800"
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};