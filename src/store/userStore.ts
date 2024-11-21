import { create } from 'zustand';
import { collection, getDocs, addDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { User } from '../types';
import { formatDateString, isValidDate } from '../utils/dateUtils';

interface UserState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  removeUser: (id: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  currentUser: null,
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const users = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
      set({ users });
    } catch (error) {
      set({ error: 'Failed to fetch users' });
    } finally {
      set({ loading: false });
    }
  },

  addUser: async (userData) => {
    set({ loading: true, error: null });
    try {
      // Validate and format the password date
      if (!isValidDate(userData.password)) {
        throw new Error('Invalid date format for password');
      }
      const formattedPassword = formatDateString(userData.password);
      
      const docRef = await addDoc(collection(db, 'users'), {
        ...userData,
        password: formattedPassword
      });
      const newUser = { id: docRef.id, ...userData };
      set(state => ({ users: [...state.users, newUser] }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to add user' });
    } finally {
      set({ loading: false });
    }
  },

  removeUser: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteDoc(doc(db, 'users', id));
      set(state => ({
        users: state.users.filter(user => user.id !== id)
      }));
    } catch (error) {
      set({ error: 'Failed to remove user' });
    } finally {
      set({ loading: false });
    }
  },

  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      // Validate and format the password date
      if (!isValidDate(password)) {
        throw new Error('Invalid date format');
      }
      const formattedPassword = formatDateString(password);

      const q = query(
        collection(db, 'users'),
        where('email', '==', email),
        where('password', '==', formattedPassword)
      );
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error('Invalid credentials');
      }

      const user = {
        id: querySnapshot.docs[0].id,
        ...querySnapshot.docs[0].data()
      } as User;

      set({ currentUser: user });
      localStorage.setItem('currentUser', JSON.stringify(user));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Invalid email or password' });
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    set({ currentUser: null });
    localStorage.removeItem('currentUser');
  }
}));