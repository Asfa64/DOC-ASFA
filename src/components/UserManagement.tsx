import React, { useState, useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import { useProfileStore } from '../store/profileStore';
import { User } from '../types';

export const UserManagement: React.FC = () => {
  const { users, addUser, removeUser, loading } = useUserStore();
  const { profiles, fetchProfiles } = useProfileStore();
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({
    name: '',
    email: '',
    password: '',
    role: 'user',
    profileId: undefined
  });

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newUser.role === 'user' && !newUser.profileId) {
      alert('Veuillez sélectionner un profil pour l\'utilisateur');
      return;
    }

    await addUser(newUser);
    setNewUser({
      name: '',
      email: '',
      password: '',
      role: 'user',
      profileId: undefined
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-8">
      <h2 className="text-xl font-semibold mb-4">Gestion des Utilisateurs</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom</label>
          <input
            type="text"
            required
            value={newUser.name}
            onChange={(e) => setNewUser({...newUser, name: e.target.value})}
            className="mt-1 block w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            required
            value={newUser.email}
            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
            className="mt-1 block w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Mot de passe (JJMMAAAA)</label>
          <input
            type="text"
            required
            pattern="\d{8}"
            value={newUser.password}
            onChange={(e) => setNewUser({...newUser, password: e.target.value})}
            className="mt-1 block w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Rôle</label>
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({...newUser, role: e.target.value as 'admin' | 'user'})}
            className="mt-1 block w-full"
          >
            <option value="user">Utilisateur</option>
            <option value="admin">Administrateur</option>
          </select>
        </div>

        {newUser.role === 'user' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Profil *</label>
            <select
              required
              value={newUser.profileId || ''}
              onChange={(e) => setNewUser({...newUser, profileId: e.target.value})}
              className="mt-1 block w-full"
            >
              <option value="">Sélectionner un profil</option>
              {profiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.name}
                </option>
              ))}
            </select>
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent1 text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors"
        >
          {loading ? 'Ajout...' : 'Ajouter un Utilisateur'}
        </button>
      </form>
      
      <div className="space-y-4">
        <h3 className="font-medium">Utilisateurs Actuels</h3>
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-xs text-gray-400">
                {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                {user.profileId && ` - ${profiles.find(p => p.id === user.profileId)?.name}`}
              </p>
            </div>
            <button
              onClick={() => removeUser(user.id)}
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