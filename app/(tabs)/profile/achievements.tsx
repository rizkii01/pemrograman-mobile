import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { userApi, Achievement } from '@/src/api/user.api';

const ACHIEVEMENT_MAP: Record<string, { icon: string; title: string; desc: string; color: string }> = {
  first_step: { icon: 'star-circle', title: 'First Step', desc: 'Selesaikan 1 kursus pertama', color: '#38BDF8' },
  on_fire: { icon: 'lightning-bolt-circle', title: 'On Fire', desc: '7 hari streak belajar', color: '#F59E0B' },
  html_master: { icon: 'certificate', title: 'HTML Master', desc: 'Selesaikan kursus HTML & CSS', color: '#10B981' },
  js_ninja: { icon: 'code-tags', title: 'JS Ninja', desc: 'Selesaikan kursus JavaScript', color: '#F59E0B' },
  mobile_dev: { icon: 'cellphone', title: 'Mobile Dev', desc: 'Selesaikan kursus React Native', color: '#6366F1' },
  top_performer: { icon: 'trophy', title: 'Top Performer', desc: 'Masuk 10 besar leaderboard', color: '#EC4899' },
  portfolio_ready: { icon: 'briefcase', title: 'Portofolio Siap', desc: 'Kumpulkan 5 proyek', color: '#A78BFA' },
  social_butterfly: { icon: 'handshake', title: 'Social Butterfly', desc: '20 diskusi di komunitas', color: '#06B6D4' },
};

export default function AchievementsScreen() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userApi.getAchievements();
      setAchievements(data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat pencapaian');
    } finally {
      setLoading(false);
    }
  };

  const earnedKeys = achievements.map(a => a.achievement_key);

  const allBadges = Object.entries(ACHIEVEMENT_MAP).map(([key, info]) => ({
    key,
    ...info,
    earned: earnedKeys.includes(key),
  }));

  const earnedCount = allBadges.filter(b => b.earned).length;
  const totalBadges = allBadges.length;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pencapaian</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#38BDF8" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pencapaian</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text style={{ color: '#EF4444', marginTop: 12, textAlign: 'center' }}>{error}</Text>
          <TouchableOpacity style={{ marginTop: 16, backgroundColor: '#1E293B', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }} onPress={loadAchievements}>
            <Text style={{ color: '#38BDF8', fontWeight: '600' }}>Coba Lagi</Text>
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
        <Text style={styles.headerTitle}>Pencapaian</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.statsBanner}>
          <View style={styles.statCol}>
            <Text style={styles.statsBig}>{earnedCount}/{totalBadges}</Text>
            <Text style={styles.statsLabel}>Badge</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <Text style={styles.statsBig}>{achievements.length}</Text>
            <Text style={styles.statsLabel}>Sertifikat</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <Text style={styles.statsBig}>{achievements.length * 100}</Text>
            <Text style={styles.statsLabel}>Total XP</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Badge</Text>
        <View style={styles.badgeGrid}>
          {allBadges.map((ach, i) => (
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
        {achievements.map((cert, i) => (
          <TouchableOpacity key={i} style={styles.certCard} activeOpacity={0.8}>
            <View style={styles.certIcon}>
              <MaterialCommunityIcons name="certificate" size={32} color="#38BDF8" />
            </View>
            <View style={styles.certInfo}>
              <Text style={styles.certTitle}>{cert.achievement_key}</Text>
              <Text style={styles.certDate}>{cert.earned_at}</Text>
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
