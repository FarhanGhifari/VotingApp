import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/authContext';
import React from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const logoHimpunan = require('../../assets/images/hmif-border.png');

export default function ProfileScreen() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}><ActivityIndicator size="large" /></View>
      </SafeAreaView>
    );
  }

  if (!user || !profile) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ThemedText type="title">Akses Ditolak</ThemedText>
          <ThemedText style={styles.subtitle}>
            Silakan login untuk melihat profil Anda.
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.pageContainer}>
        {/* Judul */}
        <View style={styles.titleCardRow}>
          <Image source={logoHimpunan} style={styles.logoSmall} />
          <View style={styles.titleTextContainer}>
            <ThemedText type="title" style={styles.titleText}>PROFIL MAHASISWA</ThemedText>
          </View>
        </View>

        {/* Data Profil */}
        <View style={styles.profileCard}>
          <ThemedText style={styles.profileCardTitle}>Data Mahasiswa</ThemedText>
          <View style={styles.profileLabelRow}>
            <ThemedText style={styles.profileLabel}>Nama: {profile.nama}</ThemedText>
            <ThemedText style={styles.profileLabel}>NIM: {profile.nim}</ThemedText>
          </View>
          <View style={styles.profileInputBox}>
            <ThemedText style={styles.profileInputLabel}>Nama</ThemedText>
            <ThemedText style={styles.profileInputValue}>{profile.nama}</ThemedText>
          </View>
          <View style={styles.profileInputBox}>
            <ThemedText style={styles.profileInputLabel}>NIM</ThemedText>
            <ThemedText style={styles.profileInputValue}>{profile.nim}</ThemedText>
          </View>
          <View style={styles.profileInputBox}>
            <ThemedText style={styles.profileInputLabel}>Email</ThemedText>
            <ThemedText style={styles.profileInputValue}>{profile.email}</ThemedText>
          </View>
          <View style={styles.profileInputBox}>
            <ThemedText style={styles.profileInputLabel}>Jurusan</ThemedText>
            <ThemedText style={styles.profileInputValue}>{profile.jurusan}</ThemedText>
          </View>
          <View style={styles.profileInputBox}>
            <ThemedText style={styles.profileInputLabel}>Angkatan</ThemedText>
            <ThemedText style={styles.profileInputValue}>{profile.angkatan}</ThemedText>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f7fa',
  },
  pageContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f7f7fa',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  titleCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  logoSmall: {
    width: 80,
    height: 80,
    marginRight: 16,
  },
  titleTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  profileCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: Colors.light.tint,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCardTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'left',
    marginBottom: 2,
    width: '100%',
  },
  profileLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: -10,
    paddingHorizontal: 4,
  },
  profileLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.light.tint,
    backgroundColor: 'transparent',
  },
  profileInputBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.tint,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
    width: '100%',
  },
  profileInputLabel: {
    fontSize: 13,
    color: Colors.light.tint,
    marginBottom: 2,
    fontWeight: '600',
  },
  profileInputValue: {
    fontSize: 16,
    color: '#222',
    fontWeight: 'bold',
  },
});