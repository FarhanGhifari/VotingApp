import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/authContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Image, Pressable, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

const logoHimpunan = require('../../assets/images/hmif-border.png');

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [nama, setNama] = useState('');
  const [nim, setNim] = useState('');
  const [jurusan, setJurusan] = useState('');
  const [angkatan, setAngkatan] = useState('');
  const [alertPopup, setAlertPopup] = useState<{ message: string | null }>({ message: null });

  const { login, register, logout, user, profile, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.screen}><ActivityIndicator size="large" /></ThemedView>
      </SafeAreaView>
    );
  }

  if (user && profile) {
    return (
      <ThemedView style={styles.screen}>
        {/* Logo dan judul */}
        <Image source={logoHimpunan} style={styles.logo} />
        <ThemedText style={styles.appTitle}>VotingApp by HMIF</ThemedText>
        <View style={styles.container}>
          <ThemedText type="title" style={styles.title}>Halo, {profile.nama}!</ThemedText>
          <ThemedText style={styles.subtitle}>Anda sudah login.</ThemedText>
          <Pressable style={styles.button} onPress={() => {
            logout();
            setEmail('');
            setPassword('');
            setNama('');
            setNim('');
            setJurusan('');
            setAngkatan('');
            setConfirmPassword('');
            setAlertPopup({ message: null });
          }}>
            <ThemedText style={styles.buttonText}>Logout</ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.screen}>
      {/* Logo dan judul */}
      <Image source={logoHimpunan} style={styles.logo} />
      <ThemedText style={styles.appTitle}>VotingApp by HMIF</ThemedText>
      <View style={styles.container}>
        <ThemedText type="title" style={styles.title}>{isLogin ? 'Login' : 'Register'}</ThemedText>
        {!isLogin && (
                      /* REGISTER */
          <>
            <TextInput style={styles.input} placeholder="Nama Lengkap" value={nama} onChangeText={setNama} placeholderTextColor="#888" />
            <TextInput style={styles.input} placeholder="NIM" value={nim} onChangeText={setNim} placeholderTextColor="#888" />
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" placeholderTextColor="#888"
            />
            <TextInput style={styles.input} placeholder="Jurusan" value={jurusan} onChangeText={setJurusan} placeholderTextColor="#888" />
            <TextInput style={styles.input} placeholder="Angkatan (cth: 2022)" value={angkatan} onChangeText={setAngkatan} keyboardType="numeric" placeholderTextColor="#888" />
            <View style={styles.passwordContainer}>
              <TextInput style={styles.inputPassword} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} placeholderTextColor="#888"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#888" />
              </TouchableOpacity>
            </View>
            <View style={styles.passwordContainer}>
              <TextInput style={styles.inputPassword} placeholder="Konfirmasi Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!showConfirmPassword} placeholderTextColor="#888"
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={22} color="#888" />
              </TouchableOpacity>
            </View>
          </>
        )}
        {isLogin && (
                     /* LOGIN */
          <>
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" placeholderTextColor="#888"/>
            <View style={styles.passwordContainer}>
              <TextInput style={styles.inputPassword} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} placeholderTextColor="#888"/>
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#888" />
              </TouchableOpacity>
            </View>
          </>
        )}
        <Pressable 
          style={styles.button} 
          onPress={async () => {
            if (isLogin) {
              try {
                await login(email, password);
              } catch {
              }
            } else {
              if (password.length < 6) {
                setAlertPopup({ message: 'Password minimal 6 karakter.' });
                return;
              }
              if (password !== confirmPassword) {
                setAlertPopup({ message: 'Password dan konfirmasi password tidak sama!' });
                return;
              }
              try {
                await register(email, password, { nama, nim, jurusan, angkatan });
                setAlertPopup({ message: 'Registrasi berhasil!\nAnda akan diarahkan ke halaman vote.' });
              } catch {
              }
            }
          }}>
          <ThemedText style={styles.buttonText}>{isLogin ? 'LOG IN' : 'REGISTER'}</ThemedText>
        </Pressable>
        <Pressable style={styles.toggleButton} onPress={() => setIsLogin(!isLogin)}>
          <ThemedText style={styles.toggleText}>
            {isLogin ? 'Belum punya akun? Register di sini' : 'Sudah punya akun? Login di sini'}
          </ThemedText>
        </Pressable>
        {!isLogin && (
          <ThemedText style={{ fontSize: 12, color: '#888', textAlign: 'center', marginTop: 4 }}>
            Password minimal 6 karakter
          </ThemedText>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f7fa',
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7fa',
  },
  container: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 6,
    alignSelf: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 12,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 12,
    color: '#555',
  },
  input: {
    height: 40, 
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 7,
    paddingHorizontal: 12,
    marginVertical: 6,
    fontSize: 14, 
    backgroundColor: '#fff',
    color: '#222',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 7,
    marginVertical: 6,
    backgroundColor: '#fff',
    paddingHorizontal: 6,
    height: 40, 
  },
  inputPassword: {
    flex: 1,
    fontSize: 14, 
    color: '#222',
    backgroundColor: '#fff',
    paddingHorizontal: 6,
  },
  button: {
    backgroundColor: Colors.light.tint,
    padding: 12, 
    borderRadius: 7,
    alignItems: 'center',
    marginVertical: 12,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  toggleButton: {
    marginTop: 6,
    alignItems: 'center',
  },
  toggleText: {
    color: Colors.light.tint,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 13, 
  },
  logo: {
    width: 110,
    height: 110,
    alignSelf: 'center',
    marginBottom: 8,
    marginTop: 8,
  },
  appTitle: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
  topLogoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avoidingView: {
    flex: 1,
    width: '100%',
  },
  popupOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 1000,
  },
  popupCard: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 8,
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#222',
  },
  popupText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
    color: '#333',
  },
  popupButton: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 7,
    alignItems: 'center',
    elevation: 2,
  },
  popupButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});