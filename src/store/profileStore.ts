import { create } from 'zustand';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Profile } from '../types';

interface ProfileState {
  profiles: Profile[];
  loading: boolean;
  error: string | null;
  fetchProfiles: () => Promise<void>;
  addProfile: (profile: Omit<Profile, 'id'>) => Promise<void>;
  updateProfile: (id: string, profile: Partial<Profile>) => Promise<void>;
  removeProfile: (id: string) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profiles: [],
  loading: false,
  error: null,

  fetchProfiles: async () => {
    set({ loading: true, error: null });
    try {
      const querySnapshot = await getDocs(collection(db, 'profiles'));
      const profiles = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Profile[];
      set({ profiles });
    } catch (error) {
      set({ error: 'Échec du chargement des profils' });
    } finally {
      set({ loading: false });
    }
  },

  addProfile: async (profileData) => {
    set({ loading: true, error: null });
    try {
      const docRef = await addDoc(collection(db, 'profiles'), profileData);
      const newProfile = { id: docRef.id, ...profileData };
      set(state => ({ profiles: [...state.profiles, newProfile] }));
    } catch (error) {
      set({ error: 'Échec de l\'ajout du profil' });
    } finally {
      set({ loading: false });
    }
  },

  updateProfile: async (id, profileData) => {
    set({ loading: true, error: null });
    try {
      const docRef = doc(db, 'profiles', id);
      await updateDoc(docRef, profileData);
      set(state => ({
        profiles: state.profiles.map(profile =>
          profile.id === id ? { ...profile, ...profileData } : profile
        )
      }));
    } catch (error) {
      set({ error: 'Échec de la mise à jour du profil' });
    } finally {
      set({ loading: false });
    }
  },

  removeProfile: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteDoc(doc(db, 'profiles', id));
      set(state => ({
        profiles: state.profiles.filter(profile => profile.id !== id)
      }));
    } catch (error) {
      set({ error: 'Échec de la suppression du profil' });
    } finally {
      set({ loading: false });
    }
  },
}));