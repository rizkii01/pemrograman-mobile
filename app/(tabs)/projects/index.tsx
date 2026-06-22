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
import { projectApi, Project } from '@/src/api/project.api';

export default function ProjectListScreen() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectApi.getAll();
      setProjects(data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat proyek');
    } finally {
      setLoading(false);
    }
  };

  const renderBadge = (status: string) => {
    if (status === 'submitted') {
      return <Text style={[styles.badge, { backgroundColor: '#1E3A8A', color: '#93C5FD' }]}>UNDER REVIEW</Text>;
    }
    if (status === 'locked') {
      return <Text style={[styles.badge, { backgroundColor: '#1E293B', color: '#64748B' }]}>TERKUNCI</Text>;
    }
    return <Text style={[styles.badge, { backgroundColor: '#7F1D1D', color: '#FCA5A5' }]}>DUE {projects.find(p => p.status === 'active')?.due?.toUpperCase()}</Text>;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Tugas & Proyek</Text>
          <Text style={styles.subtitle}>Selesaikan proyek untuk portofolio kerjamu</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#38BDF8" />
          <Text style={{ color: '#94A3B8', marginTop: 12 }}>Memuat proyek...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Tugas & Proyek</Text>
          <Text style={styles.subtitle}>Selesaikan proyek untuk portofolio kerjamu</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text style={{ color: '#EF4444', marginTop: 12, textAlign: 'center' }}>{error}</Text>
          <TouchableOpacity style={{ marginTop: 16, backgroundColor: '#1E293B', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }} onPress={loadProjects}>
            <Text style={{ color: '#38BDF8', fontWeight: '600' }}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const activeCount = projects.filter(p => p.status === 'active').length;
  const reviewCount = projects.filter(p => p.status === 'submitted').length;
  const doneCount = projects.filter(p => p.status === 'completed').length;
  const totalXp = projects.reduce((sum, p) => sum + p.xp_reward, 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tugas & Proyek</Text>
        <Text style={styles.subtitle}>Selesaikan proyek untuk portofolio kerjamu</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{activeCount}</Text>
            <Text style={styles.statLabel}>Aktif</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{reviewCount}</Text>
            <Text style={styles.statLabel}>Review</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{doneCount}</Text>
            <Text style={styles.statLabel}>Selesai</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalXp}</Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </View>
        </View>

        {projects.map((project) => (
          <TouchableOpacity
            key={project.id}
            style={[styles.projectCard, project.status === 'locked' && { opacity: 0.6 }]}
            activeOpacity={0.8}
            onPress={() => {
              if (project.status !== 'locked') {
                router.push(`/(tabs)/projects/${project.id}`);
              }
            }}
            disabled={project.status === 'locked'}
          >
            <View style={styles.badgeRow}>
              {renderBadge(project.status)}
            </View>
            <Text style={styles.projectTitle}>{project.title}</Text>
            <Text style={styles.projectDesc}>{project.description}</Text>
            <View style={styles.cardFooter}>
              <View style={styles.xpInfo}>
                <MaterialCommunityIcons name="sword-cross" size={16} color="#F59E0B" />
                <Text style={styles.xpText}>+{project.xp_reward} XP</Text>
              </View>
              {project.status === 'active' && (
                <TouchableOpacity style={styles.actionBtn}>
                  <Text style={styles.actionBtnText}>Kerjakan</Text>
                </TouchableOpacity>
              )}
              {project.status === 'submitted' && (
                <Text style={styles.statusText}>Menunggu penilaian...</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 },
  title: { fontSize: 24, fontWeight: '800', color: '#FFFFFF' },
  subtitle: { fontSize: 14, color: '#94A3B8', marginTop: 4 },
  scrollContent: { padding: 24, paddingTop: 16, paddingBottom: 40 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: '#1E293B', padding: 12, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  statNumber: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  statLabel: { fontSize: 11, color: '#64748B', marginTop: 2 },
  projectCard: { backgroundColor: '#1E293B', padding: 20, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#334155' },
  badgeRow: { marginBottom: 12 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start', fontSize: 10, fontWeight: '700', overflow: 'hidden' },
  projectTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '700', marginBottom: 6 },
  projectDesc: { color: '#94A3B8', fontSize: 14, lineHeight: 20, marginBottom: 16 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  xpInfo: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  xpText: { color: '#F59E0B', fontSize: 14, fontWeight: '600' },
  actionBtn: { backgroundColor: '#38BDF8', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  actionBtnText: { color: '#0F172A', fontWeight: '700', fontSize: 14 },
  statusText: { color: '#64748B', fontSize: 13, fontStyle: 'italic' },
});
