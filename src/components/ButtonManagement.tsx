import React, { useState, useEffect } from 'react';
import { useButtonStore } from '../store/buttonStore';
import { useProfileStore } from '../store/profileStore';
import { CustomButton } from '../types';

export const ButtonManagement: React.FC = () => {
  const { buttons, fetchButtons, addButton, removeButton, loading } = useButtonStore();
  const { profiles, fetchProfiles } = useProfileStore();
  const [newButton, setNewButton] = useState<Omit<CustomButton, 'id'>>({
    title: '',
    color: '#67BEE8',
    shape: 'rounded',
    tooltip: '',
    link: {
      type: 'external',
      url: ''
    },
    profileIds: []
  });

  useEffect(() => {
    fetchButtons();
    fetchProfiles();
  }, [fetchButtons, fetchProfiles]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (buttons.length >= 9) {
      alert('Maximum 9 boutons autorisés');
      return;
    }

    if (!newButton.title || !newButton.link.url) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (newButton.profileIds.length === 0) {
      alert('Veuillez sélectionner au moins un profil');
      return;
    }
    
    await addButton(newButton);
    
    setNewButton({
      title: '',
      color: '#67BEE8',
      shape: 'rounded',
      tooltip: '',
      link: {
        type: 'external',
        url: ''
      },
      profileIds: []
    });
  };

  const handleProfileChange = (profileId: string) => {
    setNewButton(prev => ({
      ...prev,
      profileIds: prev.profileIds.includes(profileId)
        ? prev.profileIds.filter(id => id !== profileId)
        : [...prev.profileIds, profileId]
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Gestion des Boutons</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Titre *</label>
          <input
            type="text"
            required
            value={newButton.title}
            onChange={(e) => setNewButton({...newButton, title: e.target.value})}
            className="mt-1 block w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Couleur</label>
          <select
            value={newButton.color}
            onChange={(e) => setNewButton({...newButton, color: e.target.value})}
            className="mt-1 block w-full"
          >
            <option value="#67BEE8">Bleu Principal</option>
            <option value="#D4D800">Jaune Secondaire</option>
            <option value="#7B62A8">Violet Accent</option>
            <option value="#B24794">Fuchsia Accent</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Forme</label>
          <select
            value={newButton.shape}
            onChange={(e) => setNewButton({...newButton, shape: e.target.value as 'square' | 'rounded' | 'circle'})}
            className="mt-1 block w-full"
          >
            <option value="square">Carré</option>
            <option value="rounded">Arrondi</option>
            <option value="circle">Cercle</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">URL *</label>
          <input
            type="url"
            required
            value={newButton.link.url}
            onChange={(e) => setNewButton({...newButton, link: { ...newButton.link, url: e.target.value }})}
            className="mt-1 block w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Info-bulle (Optionnel)</label>
          <input
            type="text"
            value={newButton.tooltip || ''}
            onChange={(e) => setNewButton({...newButton, tooltip: e.target.value})}
            className="mt-1 block w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Attribuer aux profils *
          </label>
          <div className="space-y-2">
            {profiles.map((profile) => (
              <label key={profile.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={newButton.profileIds.includes(profile.id)}
                  onChange={() => handleProfileChange(profile.id)}
                  className="rounded border-gray-300 text-accent1 focus:ring-accent1"
                />
                <span className="ml-2 text-sm text-gray-700">{profile.name}</span>
              </label>
            ))}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent1 text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors"
        >
          {loading ? 'Ajout...' : 'Ajouter un Bouton'}
        </button>
      </form>

      <div className="mt-8 space-y-4">
        <h3 className="font-medium">Boutons Actuels</h3>
        {buttons.map((button) => (
          <div key={button.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
            <div>
              <span className="font-medium">{button.title}</span>
              <div className="text-sm text-gray-500 mt-1">
                Profils : {profiles
                  .filter(p => button.profileIds?.includes(p.id))
                  .map(p => p.name)
                  .join(', ') || 'Aucun profil'}
              </div>
            </div>
            <button
              onClick={() => removeButton(button.id)}
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