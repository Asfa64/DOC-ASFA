import { create } from 'zustand';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, limit, getDocsFromCache } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CustomButton } from '../types';
import { persist } from 'zustand/middleware';

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

const CACHE_TIME = 30 * 60 * 1000; // 30 minutes cache

export const useButtonStore = create<ButtonState>()(
  persist(
    (set, get) => ({
      buttons: [],
      loading: false,
      error: null,
      lastFetch: 0,

      fetchButtons: async () => {
        const now = Date.now();
        const cachedButtons = get().buttons;
        
        if (now - get().lastFetch < CACHE_TIME && cachedButtons.length > 0) {
          return;
        }

        set({ loading: true, error: null });
        
        try {
          const buttonsQuery = query(collection(db, 'buttons'), limit(9));
          
          try {
            const cachedDocs = await getDocsFromCache(buttonsQuery);
            if (!cachedDocs.empty) {
              const buttons = cachedDocs.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              })) as CustomButton[];
              set({ buttons, lastFetch: now, loading: false });
              return;
            }
          } catch (error) {
            console.log('Cache manqué, chargement depuis le serveur...');
          }

          const querySnapshot = await getDocs(buttonsQuery);
          const buttons = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as CustomButton[];
          
          set({ buttons, lastFetch: now });
        } catch (error) {
          set({ error: 'Échec du chargement des boutons' });
          console.error('Erreur lors du chargement des boutons:', error);
        } finally {
          set({ loading: false });
        }
      },

      addButton: async (buttonData) => {
        set({ loading: true, error: null });
        try {
          // Ensure profileIds is initialized as an array
          const button = {
            ...buttonData,
            profileIds: buttonData.profileIds || []
          };

          const docRef = await addDoc(collection(db, 'buttons'), button);
          const newButton = { id: docRef.id, ...button };
          
          set(state => ({ 
            buttons: [...state.buttons, newButton],
            lastFetch: Date.now()
          }));
        } catch (error) {
          console.error('Erreur lors de l\'ajout du bouton:', error);
          set({ error: 'Échec de l\'ajout du bouton' });
          throw error; // Propagate error to component
        } finally {
          set({ loading: false });
        }
      },

      updateButton: async (id, buttonData) => {
        set({ loading: true, error: null });
        try {
          const docRef = doc(db, 'buttons', id);
          await updateDoc(docRef, buttonData);
          
          set(state => ({
            buttons: state.buttons.map(button =>
              button.id === id ? { ...button, ...buttonData } : button
            ),
            lastFetch: Date.now()
          }));
        } catch (error) {
          set({ error: 'Échec de la mise à jour du bouton' });
          console.error('Erreur lors de la mise à jour du bouton:', error);
        } finally {
          set({ loading: false });
        }
      },

      removeButton: async (id) => {
        set({ loading: true, error: null });
        try {
          await deleteDoc(doc(db, 'buttons', id));
          set(state => ({
            buttons: state.buttons.filter(button => button.id !== id),
            lastFetch: Date.now()
          }));
        } catch (error) {
          set({ error: 'Échec de la suppression du bouton' });
          console.error('Erreur lors de la suppression du bouton:', error);
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