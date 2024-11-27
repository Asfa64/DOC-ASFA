import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CustomButton } from '../types';
import { deletePDF } from '../utils/fileUtils';

interface ButtonState {
  buttons: CustomButton[];
  loading: boolean;
  error: string | null;
  lastFetch: number;
  fetchButtons: () => Promise<void>;
  addButton: (button: Omit<CustomButton, 'id'>) => Promise<void>;
  updateButton: (id: string, button: Partial<CustomButton>) => Promise<void>;
  removeButton: (id: string) => Promise<void>;
}

export const useButtonStore = create<ButtonState>()(
  persist(
    (set, get) => ({
      buttons: [],
      loading: false,
      error: null,
      lastFetch: 0,

      fetchButtons: async () => {
        // Since we're using local storage, just return the current state
        return Promise.resolve();
      },

      addButton: async (buttonData) => {
        set({ loading: true, error: null });
        try {
          const newButton = {
            id: Date.now().toString(),
            ...buttonData,
            profileIds: buttonData.profileIds || []
          };
          
          set(state => ({ 
            buttons: [...state.buttons, newButton],
            lastFetch: Date.now()
          }));
        } catch (error) {
          console.error('Error adding button:', error);
          set({ error: 'Failed to add button' });
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      updateButton: async (id, buttonData) => {
        set({ loading: true, error: null });
        try {
          set(state => ({
            buttons: state.buttons.map(button =>
              button.id === id ? { ...button, ...buttonData } : button
            ),
            lastFetch: Date.now()
          }));
        } catch (error) {
          set({ error: 'Failed to update button' });
          console.error('Error updating button:', error);
        } finally {
          set({ loading: false });
        }
      },

      removeButton: async (id) => {
        set({ loading: true, error: null });
        try {
          const button = get().buttons.find(b => b.id === id);
          if (button?.link.type === 'pdf') {
            await deletePDF(button.link.filename || '');
          }
          
          set(state => ({
            buttons: state.buttons.filter(button => button.id !== id),
            lastFetch: Date.now()
          }));
        } catch (error) {
          set({ error: 'Failed to remove button' });
          console.error('Error removing button:', error);
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'button-store',
      partialize: (state) => ({ 
        buttons: state.buttons,
        lastFetch: state.lastFetch 
      })
    }
  )
);