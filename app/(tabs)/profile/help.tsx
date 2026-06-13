import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const faqs = [
  { q: 'Bagaimana cara memulai kursus?', a: 'Pilih kursus dari halaman Home atau Library, lalu klik "Mulai Belajar" untuk mengakses materi pertama.' },
  { q: 'Apakah sertifikat bisa diunduh?', a: 'Ya, sertifikat bisa diunduh dalam format PDF setelah menyelesaikan 100% materi kursus.' },
  { q: 'Bagaimana cara mengumpulkan tugas?', a: 'Buka tab Projects, pilih tugas yang aktif, lalu klik "Kumpulkan Proyek" dan unggah link hasil kerja kamu.' },
  { q: 'Berapa lama waktu review tugas?', a: 'Mentor akan mereview tugas dalam 1-3 hari kerja. Kamu akan mendapat notifikasi setelah selesai.' },
  { q: 'Apakah aplikasi ini gratis?', a: 'Ya, semua materi dasar bisa diakses gratis. Ada opsi premium untuk fitur tambahan seperti konsultasi mentor.' },
];

export default function HelpScreen() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pusat Bantuan</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.greeting}>
          Punya pertanyaan? Temukan jawabannya di sini.
        </Text>

        <Text style={styles.sectionTitle}>FAQ</Text>
        {faqs.map((faq, i) => (
          <TouchableOpacity
            key={i}
            style={styles.faqCard}
            onPress={() => setOpenIndex(openIndex === i ? null : i)}
            activeOpacity={0.8}
          >
            <View style={styles.faqHeader}>
              <Text style={styles.faqQuestion}>{faq.q}</Text>
              <MaterialCommunityIcons
                name={openIndex === i ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#64748B"
              />
            </View>
            {openIndex === i && (
              <Text style={styles.faqAnswer}>{faq.a}</Text>
            )}
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionTitle}>Kontak Kami</Text>
        <View style={styles.contactCard}>
          <TouchableOpacity style={styles.contactRow}>
            <MaterialCommunityIcons name="email-outline" size={20} color="#38BDF8" />
            <Text style={styles.contactText}>support@skillups.com</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.contactRow, { borderBottomWidth: 0 }]}>
            <MaterialCommunityIcons name="whatsapp" size={20} color="#10B981" />
            <Text style={styles.contactText}>+62 812-3456-7890</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialBtn}>
            <MaterialCommunityIcons name="instagram" size={22} color="#EC4899" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialBtn}>
            <MaterialCommunityIcons name="youtube" size={22} color="#EF4444" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialBtn}>
            <MaterialCommunityIcons name="github" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  scrollContent: { padding: 24, paddingBottom: 40 },
  greeting: { fontSize: 14, color: '#94A3B8', marginBottom: 24, lineHeight: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#CBD5E1', marginBottom: 16, marginTop: 8 },
  faqCard: { backgroundColor: '#1E293B', padding: 16, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#334155' },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQuestion: { fontSize: 14, fontWeight: '600', color: '#FFFFFF', flex: 1, marginRight: 8 },
  faqAnswer: { fontSize: 13, color: '#94A3B8', lineHeight: 20, marginTop: 12, borderTopWidth: 1, borderTopColor: '#334155', paddingTop: 12 },
  contactCard: { backgroundColor: '#1E293B', borderRadius: 12, borderWidth: 1, borderColor: '#334155', marginBottom: 24 },
  contactRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12, borderBottomWidth: 1, borderBottomColor: '#334155' },
  contactText: { color: '#CBD5E1', fontSize: 14 },
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
  socialBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#1E293B', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#334155' },
});
