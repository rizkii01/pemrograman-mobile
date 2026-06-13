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

const projects = [
  {
    id: 1,
    title: 'Membuat Landing Page Responsive',
    desc: 'Gunakan HTML semantik dan CSS Flexbox/Grid agar tampilan rapi di mobile & desktop.',
    xp: 150,
    due: 'Besok',
    status: 'active',
    color: '#F59E0B',
  },
  {
    id: 2,
    title: 'Aplikasi Todo-List dengan DOM JavaScript',
    desc: 'Manipulasi DOM untuk menambah, menghapus, dan mencentang tugas.',
    xp: 200,
    due: '3 hari lagi',
    status: 'submitted',
    color: '#3B82F6',
  },
  {
    id: 3,
    title: 'Website Portofolio Pribadi',
    desc: 'Bangun website portofolio responsif dengan HTML, CSS, dan JavaScript.',
    xp: 250,
    due: '1 minggu lagi',
    status: 'active',
    color: '#10B981',
  },
  {
    id: 4,
    title: 'API Sederhana dengan Node.js',
    desc: 'Buat REST API dengan Express.js dan hubungkan ke database.',
    xp: 300,
    due: '2 minggu lagi',
    status: 'locked',
    color: '#64748B',
  },
];

export default function ProjectListScreen() {
  const renderBadge = (status: string) => {
    if (status === 'submitted') {
      return <Text style={[styles.badge, { backgroundColor: '#1E3A8A', color: '#93C5FD' }]}>UNDER REVIEW</Text>;
    }
    if (status === 'locked') {
      return <Text style={[styles.badge, { backgroundColor: '#1E293B', color: '#64748B' }]}>TERKUNCI</Text>;
    }
    return <Text style={[styles.badge, { backgroundColor: '#7F1D1D', color: '#FCA5A5' }]}>DUE {projects.find(p => p.status === 'active')?.due?.toUpperCase()}</Text>;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tugas & Proyek</Text>
        <Text style={styles.subtitle}>Selesaikan proyek untuk portofolio kerjamu</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Aktif</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>2</Text>
            <Text style={styles.statLabel}>Review</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Selesai</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>950</Text>
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
            <Text style={styles.projectDesc}>{project.desc}</Text>
            <View style={styles.cardFooter}>
              <View style={styles.xpInfo}>
                <MaterialCommunityIcons name="sword-cross" size={16} color="#F59E0B" />
                <Text style={styles.xpText}>+{project.xp} XP</Text>
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
