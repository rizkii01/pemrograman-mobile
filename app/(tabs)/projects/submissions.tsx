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
import { router } from 'expo-router';

const submissions = [
  {
    id: 1,
    title: 'Aplikasi Todo-List dengan DOM JavaScript',
    submittedAt: '12 Jun 2026',
    status: 'review',
    xp: 200,
    feedback: '',
  },
  {
    id: 2,
    title: 'Landing Page Sederhana',
    submittedAt: '8 Jun 2026',
    status: 'approved',
    xp: 150,
    feedback: 'Bagus! Coba tambahkan animasi pada tombol.',
  },
  {
    id: 3,
    title: 'Kalkulator Sederhana',
    submittedAt: '1 Jun 2026',
    status: 'revision',
    xp: 100,
    feedback: 'Ada bug pada operasi pembagian. Perbaiki dan kirim ulang.',
  },
];

export default function SubmissionsScreen() {
  const statusIcon = (status: string) => {
    switch (status) {
      case 'review': return { icon: 'clock-outline', color: '#F59E0B' };
      case 'approved': return { icon: 'check-circle', color: '#10B981' };
      case 'revision': return { icon: 'alert-circle', color: '#EF4444' };
      default: return { icon: 'help-circle', color: '#64748B' };
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case 'review': return 'Dalam Review';
      case 'approved': return 'Disetujui';
      case 'revision': return 'Revisi';
      default: return status;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Riwayat Pengumpulan</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {submissions.map((sub) => {
          const si = statusIcon(sub.status);
          return (
            <View key={sub.id} style={styles.subCard}>
              <View style={styles.subHeader}>
                <View style={[styles.statusDot, { backgroundColor: si.color }]} />
                <Text style={[styles.statusLabel, { color: si.color }]}>{statusLabel(sub.status)}</Text>
              </View>
              <Text style={styles.subTitle}>{sub.title}</Text>
              <View style={styles.subMeta}>
                <MaterialCommunityIcons name="calendar" size={14} color="#64748B" />
                <Text style={styles.subMetaText}>{sub.submittedAt}</Text>
                <MaterialCommunityIcons name="sword-cross" size={14} color="#F59E0B" />
                <Text style={styles.subMetaText}>+{sub.xp} XP</Text>
              </View>
              {sub.feedback && (
                <View style={styles.feedbackCard}>
                  <Text style={styles.feedbackLabel}>Feedback Mentor:</Text>
                  <Text style={styles.feedbackText}>{sub.feedback}</Text>
                </View>
              )}
              {sub.status === 'revision' && (
                <TouchableOpacity style={styles.revisionBtn}>
                  <Text style={styles.revisionBtnText}>Kirim Ulang</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  scrollContent: { padding: 24, paddingBottom: 40 },
  subCard: { backgroundColor: '#1E293B', padding: 16, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#334155' },
  subHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusLabel: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  subTitle: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 8 },
  subMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  subMetaText: { fontSize: 12, color: '#64748B' },
  feedbackCard: { backgroundColor: '#0F172A', padding: 12, borderRadius: 8, marginBottom: 12 },
  feedbackLabel: { fontSize: 12, color: '#94A3B8', fontWeight: '600', marginBottom: 4 },
  feedbackText: { fontSize: 13, color: '#CBD5E1', lineHeight: 18 },
  revisionBtn: { backgroundColor: '#F59E0B', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  revisionBtnText: { color: '#0F172A', fontSize: 14, fontWeight: '700' },
});
