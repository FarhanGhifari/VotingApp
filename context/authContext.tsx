import { ThemedText } from '@/components/themed-text';
import { auth, db } from '@/config/firebase';
import { storage } from '@/config/storage';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { User, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';

// Definisikan tipe untuk data user di Firestore
interface UserProfile {
  nama: string;
  nim: string;
  email: string;
  jurusan: string;
  angkatan: string;
}

// Definisikan tipe untuk state context
interface AuthContextType {
  user: User | null; // Dari Firebase Auth
  profile: UserProfile | null; // Dari Firestore
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, profileData: Omit<UserProfile, 'email'>) => Promise<void>;
  logout: () => Promise<void>;
}

// Kunci untuk menyimpan profil di MMKV
const PROFILE_STORAGE_KEY = 'userProfile';

// Buat Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Buat Provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [alertPopup, setAlertPopup] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadCache = async () => {
      try {
        const cachedProfile = await storage.getObject(PROFILE_STORAGE_KEY);
        if (cachedProfile !== null) {
          setProfile(cachedProfile as UserProfile);
        }
      } catch (e) {
        console.error("Gagal load cached profile:", e);
      }
    };
    
    loadCache(); 

    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      setLoading(true);
      if (userAuth) {
        setUser(userAuth);
        const userDocRef = doc(db, 'mahasiswa', userAuth.uid); 
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const profileData = docSnap.data() as UserProfile;
          setProfile(profileData);
          await storage.setObject(PROFILE_STORAGE_KEY, profileData);
        } else {
          console.warn("User terautentikasi tapi tidak ada data profil di Firestore.");
          setProfile(null);
          await storage.delete(PROFILE_STORAGE_KEY);
        }
      } else {
        setUser(null);
        setProfile(null);
        await storage.delete(PROFILE_STORAGE_KEY); 
      }
      setLoading(false);
    });

    return () => unsubscribe(); 
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      router.replace('/(tabs)/vote');
    } catch (e: any) {
      console.error("Login Gagal: ", e);
      setAlertPopup(e.message);
    }
  };

  const register = async (email: string, pass: string, profileData: Omit<UserProfile, 'email'>) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const newUser = userCredential.user;
      const fullProfile: UserProfile = { ...profileData, email: email };
      await setDoc(doc(db, 'mahasiswa', newUser.uid), fullProfile); 
      setAlertPopup('Registrasi berhasil!\nAnda akan diarahkan ke halaman vote.');
      router.replace('/(tabs)/vote');
    } catch (e: any) {
      console.error("Register Gagal: ", e);
      setAlertPopup(e.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      router.replace('/(tabs)/auth');
    } catch (e: any) {
      console.error("Logout Gagal: ", e);
      setAlertPopup(e.message); 
    }
  };

  const value = { user, profile, loading, login, register, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    
      {alertPopup && (
        <View style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.25)',
          zIndex: 9999,
        }}>
          <View style={{
            width: 280,
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 20,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.18,
            shadowRadius: 24,
            elevation: 12,
          }}>
            <ThemedText type="title" style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: Colors.light.tint }}>
              Info
            </ThemedText>
            <ThemedText style={{ fontSize: 14, textAlign: 'center', marginBottom: 16, color: '#222' }}>
              {alertPopup}
            </ThemedText>
            <Pressable style={{
              backgroundColor: Colors.light.tint,
              paddingVertical: 10,
              paddingHorizontal: 32,
              borderRadius: 8,
              alignItems: 'center',
            }} onPress={() => setAlertPopup(null)}>
              <ThemedText style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>OK</ThemedText>
            </Pressable>
          </View>
        </View>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return context;
};

