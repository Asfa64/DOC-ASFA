import React from 'react';
import { UserManagement } from '../components/UserManagement';
import { ButtonManagement } from '../components/ButtonManagement';
import { ProfileManagement } from '../components/ProfileManagement';

export const Admin: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-accent1 mb-8">Panneau d'Administration</h1>
        <ProfileManagement />
        <ButtonManagement />
        <UserManagement />
      </div>
    </div>
  );
};