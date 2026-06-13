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

const achievements = [
  { icon: 'star-circle', title: 'First Step', desc: 'Selesaikan 1 kursus pertama', earned: true, color: '#38BDF8' },
  { icon: 'lightning-bolt-circle', title: 'On Fire', desc: '7 hari streak belajar', earned: true, color: '#F59E0B' },
  { icon: 'certificate', title: 'HTML Master', desc: 'Selesaikan kursus HTML & CSS', earned: true, color: '#10B981' },
  { icon: 'code-tags', title: 'JS Ninja', desc: 'Selesaikan kursus JavaScript', earned: false, color: '#F59E0B' },
  { icon: 'cellphone', title: 'Mobile Dev', desc: 'Selesaikan kursus React Native', earned: false, color: '#6366F1' },
  { icon: 'trophy', title: 'Top Performer', desc: 'Masuk 10 besar leaderboard', earned: false, color: '#EC4899' },
  { icon: 'briefcase', title: 'Portofolio Siap', desc: 'Kumpulkan 5 proyek', earned: false, color: '#A78BFA' },
  { icon: 'handshake', title: 'Social Butterfly', desc: '20 diskusi di komunitas', earned: false, color: '#06B6D4' },
];

const certificates = [
  { title: 'Dasar-dasar HTML & CSS', date: '10 Jun 2026', xp: 150 },
  { title: 'JavaScript Modern (ES6+)', date: '15 Jun 2026', xp: 200 },
];

export default function AchievementsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pencapaian</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.statsBanner}>
          <View style={styles.statCol}>
            <Text style={styles.statsBig}>3/8</Text>
            <Text style={styles.statsLabel}>Badge</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <Text style={styles.statsBig}>2</Text>
            <Text style={styles.statsLabel}>Sertifikat</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <Text style={styles.statsBig}>350</Text>
            <Text style={styles.statsLabel}>Total XP</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Badge</Text>
        <View style={styles.badgeGrid}>
          {achievements.map((ach, i) => (
            <View key={i} style={[styles.badgeCard, !ach.earned && styles.badgeLocked]}>
              <MaterialCommunityIcons
                name={ach.icon as any}
                size={32}
                color={ach.earned ? ach.color : '#334155'}
              />
              <Text style={[styles.badgeTitle, !ach.earned && { color: '#475569' }]}>{ach.title}</Text>
              <Text style={[styles.badgeDesc, !ach.earned && { color: '#334155' }]}>{ach.desc}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Sertifikat</Text>
        {certificates.map((cert, i) => (
          <TouchableOpacity key={i} style={styles.certCard} activeOpacity={0.8}>
            <View style={styles.certIcon}>
              <MaterialCommunityIcons name="certificate" size={32} color="#38BDF8" />
            </View>
            <View style={styles.certInfo}>
              <Text style={styles.certTitle}>{cert.title}</Text>
              <Text style={styles.certDate}>{cert.date}</Text>
            </View>
            <MaterialCommunityIcons name="download" size={20} color="#64748B" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  scrollContent: { padding: 24, paddingBottom: 40 },
  statsBanner: { flexDirection: 'row', backgroundColor: '#1E293B', padding: 20, borderRadius: 16, justifyContent: 'space-around', marginBottom: 28, borderWidth: 1, borderColor: '#334155' },
  statCol: { alignItems: 'center' },
  statsBig: { fontSize: 28, fontWeight: '800', color: '#FFFFFF' },
  statsLabel: { fontSize: 12, color: '#64748B', marginTop: 2 },
  statDivider: { width: 1, backgroundColor: '#334155' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#CBD5E1', marginBottom: 16 },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 28 },
  badgeCard: { width: '47%', backgroundColor: '#1E293B', padding: 16, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  badgeLocked: { opacity: 0.5 },
  badgeTitle: { fontSize: 13, fontWeight: '700', color: '#FFFFFF', marginTop: 8, textAlign: 'center' },
  badgeDesc: { fontSize: 11, color: '#64748B', textAlign: 'center', marginTop: 2 },
  certCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', padding: 14, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#334155' },
  certIcon: { marginRight: 14 },
  certInfo: { flex: 1 },
  certTitle: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
  certDate: { fontSize: 12, color: '#64748B', marginTop: 2 },
});
