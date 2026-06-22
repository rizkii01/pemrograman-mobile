import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { projectApi } from '@/src/api/project.api';

export default function SubmitProjectScreen() {
  const { id } = useLocalSearchParams();
  const [link, setLink] = useState('');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!link) {
      alert('Harap masukkan link proyek kamu!');
      return;
    }
    try {
      setSubmitting(true);
      setError(null);
      await projectApi.submit(Number(id), link, note || undefined);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Gagal mengirim proyek');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <MaterialCommunityIcons name="check-circle" size={80} color="#10B981" />
          </View>
          <Text style={styles.successTitle}>Proyek Terkirim!</Text>
          <Text style={styles.successDesc}>
            Proyek kamu akan direview oleh mentor. Kamu akan mendapat notifikasi setelah penilaian selesai.
          </Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/(tabs)/projects')}>
            <Text style={styles.backBtnText}>Kembali ke Proyek</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kumpulkan Proyek</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {error && (
          <View style={{ backgroundColor: '#7F1D1D', padding: 12, borderRadius: 8, marginBottom: 16 }}>
            <Text style={{ color: '#FCA5A5', fontSize: 13 }}>{error}</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Link Proyek</Text>
        <Text style={styles.hint}>
          Upload proyekmu ke GitHub Pages, Netlify, atau platform hosting lainnya.
        </Text>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="link-variant" size={20} color="#64748B" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="https://github.com/username/proyek"
            placeholderTextColor="#64748B"
            value={link}
            onChangeText={setLink}
            autoCapitalize="none"
            keyboardType="url"
          />
        </View>

        <Text style={styles.sectionTitle}>Catatan untuk Mentor</Text>
        <View style={styles.noteContainer}>
          <TextInput
            style={styles.noteInput}
            placeholder="Ceritakan apa yang kamu buat, tantangan, atau hal yang ingin didiskusikan..."
            placeholderTextColor="#64748B"
            multiline
            numberOfLines={5}
            value={note}
            onChangeText={setNote}
          />
        </View>

        <TouchableOpacity style={[styles.submitBtn, submitting && { opacity: 0.6 }]} onPress={handleSubmit} activeOpacity={0.8} disabled={submitting}>
          {submitting ? (
            <ActivityIndicator size="small" color="#0F172A" />
          ) : (
            <MaterialCommunityIcons name="send" size={20} color="#0F172A" />
          )}
          <Text style={styles.submitBtnText}>{submitting ? 'Mengirim...' : 'Kirim Proyek'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  scrollContent: { padding: 24, paddingBottom: 40 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#CBD5E1', marginBottom: 8, marginTop: 8 },
  hint: { fontSize: 13, color: '#64748B', marginBottom: 12, lineHeight: 18 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', borderRadius: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: '#334155', height: 56, marginBottom: 24 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: '#FFFFFF', fontSize: 15 },
  noteContainer: { backgroundColor: '#1E293B', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#334155', marginBottom: 32 },
  noteInput: { color: '#FFFFFF', fontSize: 14, minHeight: 100, textAlignVertical: 'top' },
  submitBtn: { flexDirection: 'row', backgroundColor: '#38BDF8', paddingVertical: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', gap: 8 },
  submitBtnText: { color: '#0F172A', fontSize: 16, fontWeight: '700' },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  successIcon: { marginBottom: 24 },
  successTitle: { fontSize: 24, fontWeight: '800', color: '#FFFFFF', marginBottom: 12 },
  successDesc: { fontSize: 14, color: '#94A3B8', textAlign: 'center', lineHeight: 20, marginBottom: 32 },
  backBtn: { backgroundColor: '#1E293B', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 12, borderWidth: 1, borderColor: '#334155' },
  backBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
});
