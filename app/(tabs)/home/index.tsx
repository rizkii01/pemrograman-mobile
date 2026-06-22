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
import { useAuth } from '@/src/hooks/useAuth'; // ✅ BENAR
import { userApi, DashboardData } from '@/src/api/user.api';

export default function DashboardScreen() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    userApi.getDashboard()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#38BDF8" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text style={{ color: '#EF4444', fontSize: 16, marginTop: 12 }}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const dashboard = data!;
  const displayName = user?.name || dashboard.user.name || 'Scholar';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.greeting}>
          <View>
            <Text style={styles.greetText}>Halo, {displayName}! 👋</Text>
            <Text style={styles.greetSub}>Lanjutkan perjalanan belajarmu</Text>
          </View>
          <TouchableOpacity style={styles.profileBtn} onPress={() => router.push('/(tabs)/profile')}>
            <MaterialCommunityIcons name="account-circle" size={40} color="#38BDF8" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.continueCard} activeOpacity={0.8}>
          <View style={styles.continueInfo}>
            <Text style={styles.continueLabel}>Lanjutkan Belajar</Text>
            <Text style={styles.continueTitle}>{dashboard.courses[0]?.title || 'Mulai Belajar'}</Text>
            <View style={styles.continueProgress}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: dashboard.courses[0] ? `${dashboard.courses[0].completed ?? 0}%` : '0%' }]} />
              </View>
              <Text style={styles.progressText}>{dashboard.courses[0] ? `${dashboard.courses[0].completed ?? 0}%` : '0%'}</Text>
            </View>
          </View>
          <MaterialCommunityIcons name="play-circle" size={48} color="#38BDF8" />
        </TouchableOpacity>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="book-open-variant" size={24} color="#10B981" />
            <Text style={styles.statNumber}>{dashboard.stats.courses}</Text>
            <Text style={styles.statLabel}>Kursus</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="briefcase" size={24} color="#F59E0B" />
            <Text style={styles.statNumber}>{dashboard.stats.projects}</Text>
            <Text style={styles.statLabel}>Proyek</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="fire" size={24} color="#EF4444" />
            <Text style={styles.statNumber}>{dashboard.user.streak}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Kursus Rekomendasi</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/home/courses')}>
            <Text style={styles.seeAll}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.courseScroll}>
          {dashboard.courses.length > 0 ? dashboard.courses.map((course: any, i: number) => (
            <TouchableOpacity key={i} style={styles.courseCard} activeOpacity={0.8}
              onPress={() => router.push('/(tabs)/home/course/' + course.id)}>
              <View style={[styles.courseAccent, { backgroundColor: course.color || '#38BDF8' }]} />
              <Text style={styles.courseCardTitle}>{course.title}</Text>
              <Text style={styles.courseCardDesc}>{course.description}</Text>
              <View style={styles.courseCardProgress}>
                <View style={styles.courseBar}>
                  <View style={[styles.courseBarFill, { width: `${course.completed ?? 0}%`, backgroundColor: course.color || '#38BDF8' }]} />
                </View>
                <Text style={styles.courseBarText}>{course.completed ?? 0}%</Text>
              </View>
            </TouchableOpacity>
          )) : (
            <Text style={{ color: '#94A3B8', fontSize: 14 }}>Belum ada kursus. Mulai belajar sekarang!</Text>
          )}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Aktivitas Terbaru</Text>
        </View>

        {dashboard.activities.length > 0 ? dashboard.activities.map((item: any, i: number) => (
          <View key={i} style={styles.activityItem}>
              <MaterialCommunityIcons name={(item.icon || 'check-circle') as any} size={20} color={item.color || '#10B981'} />
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>{item.text}</Text>
              <Text style={styles.activityTime}>{item.time}</Text>
            </View>
          </View>
        )) : (
          <Text style={{ color: '#94A3B8', fontSize: 14, padding: 14 }}>Belum ada aktivitas terbaru.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  scrollContent: { padding: 24, paddingBottom: 40 },
  greeting: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  greetText: { fontSize: 24, fontWeight: '800', color: '#FFFFFF' },
  greetSub: { fontSize: 14, color: '#94A3B8', marginTop: 4 },
  profileBtn: { padding: 4 },
  continueCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', padding: 20, borderRadius: 16, marginBottom: 24, borderWidth: 1, borderColor: '#334155' },
  continueInfo: { flex: 1, marginRight: 16 },
  continueLabel: { fontSize: 12, color: '#38BDF8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  continueTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginBottom: 12 },
  continueProgress: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  progressBar: { flex: 1, height: 6, backgroundColor: '#334155', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#38BDF8', borderRadius: 3 },
  progressText: { fontSize: 12, color: '#94A3B8' },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  statCard: { flex: 1, backgroundColor: '#1E293B', padding: 16, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  statNumber: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', marginTop: 8 },
  statLabel: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#CBD5E1' },
  seeAll: { fontSize: 14, color: '#38BDF8', fontWeight: '600' },
  courseScroll: { marginBottom: 28, marginLeft: -24, paddingLeft: 24 },
  courseCard: { width: 200, backgroundColor: '#1E293B', borderRadius: 12, padding: 16, marginRight: 12, borderWidth: 1, borderColor: '#334155', overflow: 'hidden' },
  courseAccent: { height: 4, borderRadius: 2, marginBottom: 12, width: 40 },
  courseCardTitle: { fontSize: 15, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  courseCardDesc: { fontSize: 12, color: '#94A3B8', marginBottom: 12, lineHeight: 16 },
  courseCardProgress: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  courseBar: { flex: 1, height: 4, backgroundColor: '#334155', borderRadius: 2, overflow: 'hidden' },
  courseBarFill: { height: '100%', borderRadius: 2 },
  courseBarText: { fontSize: 11, color: '#64748B' },
  activityItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', padding: 14, borderRadius: 12, marginBottom: 8, gap: 12 },
  activityContent: { flex: 1 },
  activityText: { fontSize: 14, color: '#F1F5F9', fontWeight: '500' },
  activityTime: { fontSize: 12, color: '#64748B', marginTop: 2 },
});
