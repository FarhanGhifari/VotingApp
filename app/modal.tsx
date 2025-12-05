import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, SafeAreaView, StyleSheet } from 'react-native';

export default function ModalScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Detail Kandidat</ThemedText>
        
        {/* TODO: Tampilkan Visi, Misi, dll. di sini */}
        <ThemedText style={styles.detailText}>
          Ini adalah halaman detail untuk kandidat.
          Anda bisa menambahkan visi, misi, dan informasi lainnya di sini.
        </ThemedText>

        <Pressable style={styles.button} onPress={() => router.back()}>
          <ThemedText style={styles.buttonText}>Tutup</ThemedText>
        </Pressable>

        {}
        <StatusBar style="auto" />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  detailText: {
    marginVertical: 24,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    backgroundColor: Colors.light.tint,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});