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
import { libraryApi, Resource } from '@/src/api/library.api';

export default function ResourceDetailScreen() {
  const { id } = useLocalSearchParams();
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadResource();
  }, [id]);

  const loadResource = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await libraryApi.getResourceById(Number(id));
      setResource(data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat detail referensi');
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
          <Text style={styles.headerTitle}>Detail Referensi</Text>
          <TouchableOpacity>
            <MaterialCommunityIcons name="bookmark-outline" size={24} color="#94A3B8" />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#38BDF8" />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !resource) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detail Referensi</Text>
          <TouchableOpacity>
            <MaterialCommunityIcons name="bookmark-outline" size={24} color="#94A3B8" />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text style={{ color: '#EF4444', marginTop: 12, textAlign: 'center' }}>{error || 'Referensi tidak ditemukan'}</Text>
          <TouchableOpacity style={{ marginTop: 16, backgroundColor: '#1E293B', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }} onPress={loadResource}>
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
        <Text style={styles.headerTitle}>Detail Referensi</Text>
        <TouchableOpacity>
          <MaterialCommunityIcons name="bookmark-outline" size={24} color="#94A3B8" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.heroIcon, { backgroundColor: (resource.color || '#38BDF8') + '20' }]}>
          <MaterialCommunityIcons name="book-open-variant" size={56} color={resource.color || '#38BDF8'} />
        </View>

        <Text style={styles.title}>{resource.title}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{resource.type}</Text>
          <View style={styles.metaDot} />
          <Text style={styles.metaText}>{resource.author}</Text>
        </View>
        <Text style={styles.desc}>{resource.description}</Text>

        <TouchableOpacity style={styles.downloadBtn}>
          <MaterialCommunityIcons name="download" size={20} color="#0F172A" />
          <Text style={styles.downloadBtnText}>Unduh Referensi</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Detail</Text>
        <View style={styles.detailCard}>
          <Text style={styles.detailText}>{resource.content}</Text>
        </View>

        <TouchableOpacity style={styles.previewBtn}>
          <MaterialCommunityIcons name="eye-outline" size={20} color="#38BDF8" />
          <Text style={styles.previewBtnText}>Pratinjau Online</Text>
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
  heroIcon: { width: 100, height: 100, borderRadius: 24, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', textAlign: 'center', marginBottom: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16 },
  metaText: { fontSize: 13, color: '#64748B' },
  metaDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#475569' },
  desc: { fontSize: 14, color: '#94A3B8', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  downloadBtn: { flexDirection: 'row', backgroundColor: '#38BDF8', paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 28 },
  downloadBtnText: { color: '#0F172A', fontSize: 16, fontWeight: '700' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#CBD5E1', marginBottom: 12 },
  detailCard: { backgroundColor: '#1E293B', padding: 16, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#334155' },
  detailText: { fontSize: 14, color: '#CBD5E1', lineHeight: 22 },
  previewBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#38BDF8' },
  previewBtnText: { color: '#38BDF8', fontSize: 14, fontWeight: '600' },
});
