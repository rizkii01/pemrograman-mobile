import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

const projectData: Record<string, { title: string; desc: string; requirements: string[]; xp: number; tips: string[] }> = {
  '1': {
    title: 'Membuat Landing Page Responsive',
    desc: 'Bangun halaman landing page yang responsif menggunakan HTML semantik dan CSS modern. Halaman harus memiliki navigasi, hero section, fitur, dan footer.',
    xp: 150,
    requirements: [
      'Menggunakan HTML5 semantic tags (header, nav, main, section, footer)',
      'CSS Flexbox atau Grid untuk layout',
      'Responsif di mobile (min-width 320px) dan desktop',
      'Minimal 3 section: Hero, Features, Contact',
      'Warna dan font yang konsisten',
    ],
    tips: [
      'Gunakan mobile-first approach',
      'Manfaatkan CSS custom properties untuk warna',
      'Pastikan aksesibilitas dengan alt text pada gambar',
    ],
  },
};

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams();
  const project = projectData[id as string] || projectData['1'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Proyek</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroSection}>
          <Text style={styles.title}>{project.title}</Text>
          <Text style={styles.desc}>{project.desc}</Text>
          <View style={styles.xpBadge}>
            <MaterialCommunityIcons name="sword-cross" size={16} color="#0F172A" />
            <Text style={styles.xpText}>+{project.xp} XP</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Persyaratan</Text>
        {project.requirements.map((req, i) => (
          <View key={i} style={styles.requirementItem}>
            <MaterialCommunityIcons name="checkbox-blank-outline" size={20} color="#38BDF8" />
            <Text style={styles.requirementText}>{req}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Tips Pengerjaan</Text>
        {project.tips.map((tip, i) => (
          <View key={i} style={styles.tipItem}>
            <MaterialCommunityIcons name="lightbulb-outline" size={16} color="#F59E0B" />
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}

        <TouchableOpacity
          style={styles.submitBtn}
          activeOpacity={0.8}
          onPress={() => router.push(`/(tabs)/projects/submit/${id}`)}
        >
          <MaterialCommunityIcons name="upload" size={20} color="#0F172A" />
          <Text style={styles.submitBtnText}>Kumpulkan Proyek</Text>
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
  heroSection: { marginBottom: 28 },
  title: { fontSize: 24, fontWeight: '800', color: '#FFFFFF', marginBottom: 8 },
  desc: { fontSize: 14, color: '#94A3B8', lineHeight: 20, marginBottom: 16 },
  xpBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F59E0B', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, alignSelf: 'flex-start', gap: 4 },
  xpText: { color: '#0F172A', fontWeight: '700', fontSize: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#CBD5E1', marginBottom: 16, marginTop: 8 },
  requirementItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12, gap: 12 },
  requirementText: { flex: 1, fontSize: 14, color: '#F1F5F9', lineHeight: 20 },
  tipItem: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#1E293B', padding: 14, borderRadius: 12, marginBottom: 10, gap: 10, borderWidth: 1, borderColor: '#334155' },
  tipText: { flex: 1, fontSize: 13, color: '#CBD5E1', lineHeight: 18 },
  submitBtn: { flexDirection: 'row', backgroundColor: '#38BDF8', paddingVertical: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16 },
  submitBtnText: { color: '#0F172A', fontSize: 16, fontWeight: '700' },
});
