import React, { useState, useEffect } from 'react';
import { useButtonStore } from '../store/buttonStore';
import { useProfileStore } from '../store/profileStore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';
import { FileUp } from 'lucide-react';
import { CustomButton } from '../types';

export const ButtonManagement: React.FC = () => {
  const { buttons, fetchButtons, addButton, removeButton, loading } = useButtonStore();
  const { profiles, fetchProfiles } = useProfileStore();
  const [formError, setFormError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newButton, setNewButton] = useState<Omit<CustomButton, 'id'>>({
    title: '',
    color: '#67BEE8',
    shape: 'rounded',
    tooltip: '',
    link: {
      type: 'external',
      url: '',
      filename: ''
    },
    profileIds: []
  });

  useEffect(() => {
    fetchButtons();
    fetchProfiles();
  }, [fetchButtons, fetchProfiles]);

  const resetForm = () => {
    setNewButton({
      title: '',
      color: '#67BEE8',
      shape: 'rounded',
      tooltip: '',
      link: {
        type: 'external',
        url: '',
        filename: ''
      },
      profileIds: []
    });
    setSelectedFile(null);
    setFormError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        setNewButton(prev => ({
          ...prev,
          link: {
            type: 'pdf',
            url: '',
            filename: file.name
          }
        }));
      } else {
        setFormError('Veuillez sélectionner un fichier PDF');
      }
    }
  };

  const handleProfileChange = (profileId: string) => {
    setNewButton(prev => ({
      ...prev,
      profileIds: prev.profileIds.includes(profileId)
        ? prev.profileIds.filter(id => id !== profileId)
        : [...prev.profileIds, profileId]
    }));
  };

  const validateForm = () => {
    if (!newButton.title.trim()) {
      setFormError('Le titre est requis');
      return false;
    }

    if (newButton.profileIds.length === 0) {
      setFormError('Veuillez sélectionner au moins un profil');
      return false;
    }

    if (newButton.link.type === 'external' && !newButton.link.url.trim()) {
      setFormError('L\'URL est requise pour un lien externe');
      return false;
    }

    if (newButton.link.type === 'pdf' && !selectedFile) {
      setFormError('Veuillez sélectionner un fichier PDF');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let finalButton = { ...newButton };

      if (selectedFile && newButton.link.type === 'pdf') {
        const storageRef = ref(storage, `pdfs/${Date.now()}_${selectedFile.name}`);
        await uploadBytes(storageRef, selectedFile);
        const downloadUrl = await getDownloadURL(storageRef);
        finalButton.link.url = downloadUrl;
      }

      await addButton(finalButton);
      resetForm();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du bouton:', error);
      setFormError('Une erreur est survenue lors de l\'ajout du bouton');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Gestion des Boutons</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {formError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md">
            {formError}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Titre *</label>
          <input
            type="text"
            value={newButton.title}
            onChange={(e) => setNewButton({...newButton, title: e.target.value})}
            className="mt-1 block w-full"
            placeholder="Titre du bouton"
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
          <label className="block text-sm font-medium text-gray-700">Type de lien</label>
          <select
            value={newButton.link.type}
            onChange={(e) => setNewButton({
              ...newButton,
              link: { 
                type: e.target.value as 'pdf' | 'external',
                url: '',
                filename: ''
              }
            })}
            className="mt-1 block w-full"
          >
            <option value="external">Lien externe</option>
            <option value="pdf">Fichier PDF</option>
          </select>
        </div>

        {newButton.link.type === 'external' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700">URL *</label>
            <input
              type="url"
              value={newButton.link.url}
              onChange={(e) => setNewButton({
                ...newButton,
                link: { ...newButton.link, url: e.target.value }
              })}
              className="mt-1 block w-full"
              placeholder="https://"
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700">Fichier PDF *</label>
            <div className="mt-1 flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-2 bg-accent1 text-white rounded-md hover:bg-opacity-90 cursor-pointer">
                <FileUp className="h-5 w-5" />
                <span>Sélectionner un PDF</span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {selectedFile && (
                <span className="text-sm text-gray-600">
                  {selectedFile.name}
                </span>
              )}
            </div>
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Info-bulle (Optionnel)</label>
          <input
            type="text"
            value={newButton.tooltip || ''}
            onChange={(e) => setNewButton({...newButton, tooltip: e.target.value})}
            className="mt-1 block w-full"
            placeholder="Texte qui apparaît au survol"
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
          disabled={isSubmitting}
          className="w-full bg-accent1 text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Ajout en cours...' : 'Ajouter un Bouton'}
        </button>
      </form>

      <div className="mt-8 space-y-4">
        <h3 className="font-medium">Boutons Actuels</h3>
        {buttons.map((button) => (
          <div key={button.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
            <div>
              <span className="font-medium">{button.title}</span>
              <div className="text-sm text-gray-500">
                Type: {button.link.type === 'pdf' ? 'PDF' : 'Lien externe'}
              </div>
              <div className="text-sm text-gray-500">
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