import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { Mail } from 'lucide-react';
import { useUserStore } from '../store/userStore';

export const ContactAdmin: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const currentUser = useUserStore((state) => state.currentUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setStatus(null);

    try {
      await emailjs.send(
        'service_jv3fzyb',
        'template_zhbnj8f',
        {
          from_name: currentUser?.name,
          from_email: currentUser?.email,
          message: message,
          to_email: 'bolt@asfa64.fr',
        },
        'e_aYBJrhBOsAAPeDr'
      );

      setStatus({
        type: 'success',
        message: 'Message envoyé avec succès'
      });
      setMessage('');
      setTimeout(() => setIsOpen(false), 2000);
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Erreur lors de l\'envoi du message'
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-accent1 text-white p-3 rounded-full shadow-lg hover:bg-opacity-90 transition-colors"
        title="Contacter l'administrateur"
      >
        <Mail className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Contacter l'administrateur</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Votre message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={4}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-accent1 focus:ring focus:ring-accent1 focus:ring-opacity-50"
                  placeholder="Écrivez votre message ici..."
                />
              </div>

              {status && (
                <div className={`text-sm ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {status.message}
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="px-4 py-2 text-sm font-medium text-white bg-accent1 rounded-md hover:bg-opacity-90 disabled:opacity-50"
                >
                  {sending ? 'Envoi...' : 'Envoyer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};