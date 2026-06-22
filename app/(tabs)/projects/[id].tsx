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
import { router, useLocalSearchParams } from 'expo-router';
import { projectApi, Project } from '@/src/api/project.api';

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectApi.getById(Number(id));
      setProject(data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat detail proyek');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detail Proyek</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#38BDF8" />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !project) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detail Proyek</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text style={{ color: '#EF4444', marginTop: 12, textAlign: 'center' }}>{error || 'Proyek tidak ditemukan'}</Text>
          <TouchableOpacity style={{ marginTop: 16, backgroundColor: '#1E293B', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }} onPress={loadProject}>
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
        <Text style={styles.headerTitle}>Detail Proyek</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroSection}>
          <Text style={styles.title}>{project.title}</Text>
          <Text style={styles.desc}>{project.description}</Text>
          <View style={styles.xpBadge}>
            <MaterialCommunityIcons name="sword-cross" size={16} color="#0F172A" />
            <Text style={styles.xpText}>+{project.xp_reward} XP</Text>
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
