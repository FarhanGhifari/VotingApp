import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/authContext';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../config/firebase';

const logoHimpunan = require('../../assets/images/hmif-border.png');
const imgKandidat1 = require('../../assets/images/kandidat1.jpg');
const imgKandidat2 = require('../../assets/images/kandidat2.jpg');

export default function VoteScreen() {
  const { user, profile, loading } = useAuth();
  const [showDetail, setShowDetail] = useState(false);
  const [confirmVote, setConfirmVote] = useState<{ nama: string | null }>({ nama: null });
  const [showThanks, setShowThanks] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [alertPopup, setAlertPopup] = useState<{ message: string | null }>({ message: null });
  const [detailData, setDetailData] = useState<any | null>(null);

  const fetchDetailKandidat = async (uid: string) => {
    try {
      const docRef = doc(db, 'Kadidat', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setDetailData({
          angkatan: data.Angkatan ?? '',
          nama: data.Nama ?? '',
          nomor_urut: data['Nomor Urut'] ?? '',
          visi: data.Visi ?? '',
        });
      } else {
        setDetailData({ nama: 'Data tidak ditemukan', angkatan: '', nomor_urut: '', visi: '' });
      }
    } catch {
      setDetailData({ nama: 'Gagal mengambil data', angkatan: '', nomor_urut: '', visi: '' });
    }
  };

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
            Silakan login untuk memvoting kandidat.
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.pageContainer}>
          {/* Judul */}
          <View style={styles.titleCardRow}>
            <Image source={logoHimpunan} style={styles.logoSmall} />
            <View style={styles.titleTextContainer}>
              <ThemedText type="title" style={styles.titleText}>PEMILIHAN KAHIM</ThemedText>
              <ThemedText type="subtitle" style={styles.subtitleText}>KPI 2025</ThemedText>
            </View>
          </View>

          {/* Data Pemilih */}
          <View style={styles.voterCard}>
            <ThemedText style={styles.voterCardTitle}>Data Pemilih</ThemedText>
            <View style={styles.voterInputBox}>
              <ThemedText style={styles.voterInputLabel}>Nama</ThemedText>
              <ThemedText style={styles.voterInputValue}>{profile.nama}</ThemedText>
            </View>
            <View style={styles.voterInputBox}>
              <ThemedText style={styles.voterInputLabel}>NIM</ThemedText>
              <ThemedText style={styles.voterInputValue}>{profile.nim}</ThemedText>
            </View>
            <View style={styles.voterInputBox}>
              <ThemedText style={styles.voterInputLabel}>Angkatan</ThemedText>
              <ThemedText style={styles.voterInputValue}>{profile.angkatan}</ThemedText>
            </View>
          </View>

          {/* Pilihan Kandidat dan Card Kandidat */}
          {!hasVoted && (
            <>
              {/* <ThemedText style={styles.pilihKandidatTitle}>~~ PILIH KANDIDAT ~~</ThemedText> */}
              <View style={styles.cardRow}>
                {/* Kandidat 1 */}
                <View style={styles.candidateCard}>
                  <Image source={imgKandidat1} style={styles.candidateImage} />
                  <ThemedText style={styles.candidateNumber}>No. 1</ThemedText>
                  <ThemedText style={styles.candidateName}>Andi Wijaya</ThemedText>
                  <Pressable
                    style={styles.voteButton}
                    onPress={() => setConfirmVote({ nama: "Andi Wijaya" })}
                  >
                    <ThemedText style={styles.buttonText}>VOTE</ThemedText>
                  </Pressable>
                  <Pressable style={styles.detailButton} onPress={() => {
                    fetchDetailKandidat('kandidat 1');
                    setShowDetail(true);
                  }}>
                    <ThemedText style={styles.buttonText}>DETAIL</ThemedText>
                  </Pressable>
                </View>
                {/* Kandidat 2 */}
                <View style={styles.candidateCard}>
                  <Image source={imgKandidat2} style={styles.candidateImage} />
                  <ThemedText style={styles.candidateNumber}>No. 2</ThemedText>
                  <ThemedText style={styles.candidateName}>Budi Santoso</ThemedText>
                  <Pressable
                    style={styles.voteButton}
                    onPress={() => setConfirmVote({ nama: "Budi Santoso" })}
                  >
                    <ThemedText style={styles.buttonText}>VOTE</ThemedText>
                  </Pressable>
                  <Pressable style={styles.detailButton} onPress={() => {
                    fetchDetailKandidat('kandidat 2');
                    setShowDetail(true);
                  }}>
                    <ThemedText style={styles.buttonText}>DETAIL</ThemedText>
                  </Pressable>
                </View>
              </View>
              <ThemedText style={styles.hakSuaraText}>
                Gunakan hak suara Anda dengan bijak dan bertanggung jawab.
              </ThemedText>
            </>
          )}

          {/* Setelah vote, menampilkan pesan afirmasi positif */}
          {hasVoted && (
            <View style={styles.terimakasihContainer}>
              <ThemedText type="title" style={styles.thanksTitle}>Terima Kasih!</ThemedText>
              <ThemedText style={styles.thanksText}>
                Terima kasih telah menggunakan hak suara Anda dengan baik.
                {"\n\n"}
                Pilihan Anda telah direkam. Semoga kandidat terpilih dapat membawa HMIF lebih baik ke depannya.
              </ThemedText>
            </View>
          )}

          {/* Popup Detail Kandidat */}
          {showDetail && (
            <View style={styles.popupOverlay}>
              <View style={[styles.popupCard, { alignItems: 'flex-start', overflow: 'hidden' }]}>
                <ThemedText type="title" style={[styles.popupTitle, { textAlign: 'left', alignSelf: 'flex-start' }]}>Detail Kandidat</ThemedText>
                {detailData ? (
                  <View style={{ width: '100%' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6, flexWrap: 'nowrap' }}>
                      <ThemedText style={{ fontWeight: 'bold', width: 100, color: '#222' }}>Nomor Urut</ThemedText>
                      <ThemedText style={{ color: '#222', fontWeight: 'normal', marginLeft: 0 }}> : </ThemedText>
                      <ThemedText style={{ marginLeft: 8, flexShrink: 1, color: '#222', fontWeight: 'normal' }}>{detailData.nomor_urut}</ThemedText>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6, flexWrap: 'nowrap' }}>
                      <ThemedText style={{ fontWeight: 'bold', width: 100, color: '#222' }}>Nama</ThemedText>
                      <ThemedText style={{ color: '#222', fontWeight: 'normal', marginLeft: 0 }}> : </ThemedText>
                      <ThemedText style={{ marginLeft: 8, flexShrink: 1, color: '#222', fontWeight: 'normal' }}>{detailData.nama}</ThemedText>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6, flexWrap: 'nowrap' }}>
                      <ThemedText style={{ fontWeight: 'bold', width: 100, color: '#222' }}>Angkatan</ThemedText>
                      <ThemedText style={{ color: '#222', fontWeight: 'normal', marginLeft: 0 }}> : </ThemedText>
                      <ThemedText style={{ marginLeft: 8, flexShrink: 1, color: '#222', fontWeight: 'normal' }}>{detailData.angkatan}</ThemedText>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6, flexWrap: 'nowrap' }}>
                      <ThemedText style={{ fontWeight: 'bold', width: 100, color: '#222' }}>Visi</ThemedText>
                      <ThemedText style={{ color: '#222', fontWeight: 'normal', marginLeft: 0 }}> : </ThemedText>
                      <ThemedText style={{ marginLeft: 8, flex: 1, flexShrink: 1, color: '#222', fontWeight: 'normal' }}>{detailData.visi}</ThemedText>
                    </View>
                  </View>
                ) : (
                  <ThemedText style={[styles.popupText, { textAlign: 'left', alignSelf: 'flex-start' }]}>Memuat data...</ThemedText>
                )}
                <Pressable style={[styles.popupButton, { alignSelf: 'stretch' }]} onPress={() => {
                  setShowDetail(false);
                  setDetailData(null);
                }}>
                  <ThemedText style={styles.popupButtonText}>Tutup</ThemedText>
                </Pressable>
              </View>
            </View>
          )}
          {/* Popup Konfirmasi Vote */}
          {confirmVote.nama && (
            <View style={styles.popupOverlay}>
              <View style={styles.popupCard}>
                <ThemedText type="title" style={styles.popupTitle}>Konfirmasi Pilihan</ThemedText>
                <ThemedText style={styles.popupText}>
                  Apakah Anda yakin memilih <ThemedText style={{fontWeight:'bold', color: Colors.light.tint}}>{confirmVote.nama}</ThemedText> sebagai Kahim?
                </ThemedText>
                <View style={styles.popupButtonRow}>
                  <Pressable
                    style={[styles.popupButton, styles.cancelButton]}
                    onPress={() => setConfirmVote({ nama: null })}
                  >
                    <ThemedText style={styles.popupButtonText}>Batal</ThemedText>
                  </Pressable>
                  <Pressable
                    style={styles.popupButton}
                    onPress={async () => {
                      try {
                        await addDoc(collection(db, 'votes'), {
                          userId: user.uid,
                          nama: profile.nama,
                          nim: profile.nim,
                          angkatan: profile.angkatan,
                          kandidat: confirmVote.nama,
                          waktu: new Date().toISOString(),
                        });
                      } catch (err) {
                        setAlertPopup({ message: 'Gagal menyimpan vote. Silakan coba lagi.' });
                        setConfirmVote({ nama: null });
                        return;
                      }
                      setConfirmVote({ nama: null });
                      setHasVoted(true);
                      setShowThanks(true);
                    }}
                  >
                    <ThemedText style={styles.popupButtonText}>Konfirmasi</ThemedText>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
          {/* Popup Alert Umum */}
          {alertPopup.message && (
            <View style={styles.popupOverlay}>
              <View style={styles.popupCard}>
                <ThemedText type="title" style={styles.popupTitle}>Info</ThemedText>
                <ThemedText style={styles.popupText}>{alertPopup.message}</ThemedText>
                <Pressable style={styles.popupButton} onPress={() => setAlertPopup({ message: null })}>
                  <ThemedText style={styles.popupButtonText}>Tutup</ThemedText>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
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
    width: 80,    // sebelumnya 64
    height: 80,   // sebelumnya 64
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
  subtitleText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  voterCard: {
    width: '100%',
    maxWidth: 400, // Ubah dari 4000 ke 400 agar tidak overflow dan error
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
  voterCardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'left',
    marginBottom: 10, // Ubah dari 10 ke 2 agar jarak lebih dekat
    width: '100%',
    marginLeft: 23,
  },
  voterLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: -10, // Ubah dari 8 ke 4 agar lebih dekat
    paddingHorizontal: 4,
  },
  voterLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.light.tint,
    backgroundColor: 'transparent',
  },
  voterInputBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.tint,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
    width: '100%',
  },
  voterInputLabel: {
    fontSize: 13,
    color: Colors.light.tint,
    marginBottom: 3,
    marginTop: -5,
    fontWeight: '600',
  },
  voterInputValue: {
    fontSize: 16,
    color: '#222',
    fontWeight: 'bold',
    marginTop: -5,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    width: '100%',
    maxWidth: 400,
    marginTop: 8,
    gap: 12,
    // Hapus zIndex di sini
  },
  candidateCard: {
    flex: 1,
    flexBasis: '48%',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 3,
    marginHorizontal: 0,
    minWidth: 0,
    maxWidth: '48%',
    // Hapus zIndex di sini
  },
  candidateImage: {
    width: 90,
    height: 90,
    borderRadius: 0, // Ubah dari 45 ke 0 agar gambar jadi persegi
    backgroundColor: '#eee',
    marginBottom: 10,
  },
  candidateNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.tint,
    marginBottom: 4,
  },
  candidateName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#222',
    textAlign: 'center',
  },
  voteButton: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailButton: {
    backgroundColor: '#888',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  popupOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
  popupCard: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
  popupTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: Colors.light.tint,
  },
  popupText: {
    fontSize: 15,
    color: '#222',
    textAlign: 'center',
    marginBottom: 24,
  },
  popupButton: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
  },
  popupButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  pilihKandidatTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.tint,
    marginBottom: 12,
    alignSelf: 'center',
    marginLeft: 4,
    letterSpacing: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  popupButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 12,
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  terimakasihContainer: {
    marginTop: 32,
    marginBottom: 24,
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 4,
  },
  thanksTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.tint,
    marginBottom: 10,
    textAlign: 'center',
  },
  thanksText: {
    fontSize: 16,
    color: '#222',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 8,
    lineHeight: 20,
  },
  hakSuaraText: {
    fontSize: 15,
    color: Colors.light.tint,
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 8,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});