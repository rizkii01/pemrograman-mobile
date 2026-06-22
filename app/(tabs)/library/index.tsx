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
import { libraryApi, Resource } from '@/src/api/library.api';

const typeIcon: Record<string, string> = {
  Ebook: 'book-open-variant',
  PDF: 'file-pdf-box',
  Link: 'link-variant',
  File: 'file',
  Guide: 'bookmark-check',
};

export default function LibraryScreen() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await libraryApi.getResources();
      setResources(data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat referensi');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Perpustakaan</Text>
          <Text style={styles.subtitle}>Referensi dan sumber belajar</Text>
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
          <Text style={styles.title}>Perpustakaan</Text>
          <Text style={styles.subtitle}>Referensi dan sumber belajar</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text style={{ color: '#EF4444', marginTop: 12, textAlign: 'center' }}>{error}</Text>
          <TouchableOpacity style={{ marginTop: 16, backgroundColor: '#1E293B', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }} onPress={loadResources}>
            <Text style={{ color: '#38BDF8', fontWeight: '600' }}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Perpustakaan</Text>
        <Text style={styles.subtitle}>Referensi dan sumber belajar</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => router.push('/(tabs)/library/search')}
        >
          <MaterialCommunityIcons name="magnify" size={20} color="#64748B" />
          <Text style={styles.searchPlaceholder}>Cari referensi...</Text>
        </TouchableOpacity>

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => router.push('/(tabs)/library/categories')}
          >
            <MaterialCommunityIcons name="format-list-bulleted" size={24} color="#38BDF8" />
            <Text style={styles.quickActionText}>Kategori</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => router.push('/(tabs)/library/bookmarks')}
          >
            <MaterialCommunityIcons name="bookmark" size={24} color="#F59E0B" />
            <Text style={styles.quickActionText}>Tersimpan</Text>
          </TouchableOpacity>
        </View>

        {resources.map((resource) => (
          <TouchableOpacity
            key={resource.id}
            style={styles.resourceCard}
            activeOpacity={0.8}
            onPress={() => router.push(`/(tabs)/library/${resource.id}`)}
          >
            <View style={[styles.resourceIcon, { backgroundColor: (resource.color || '#38BDF8') + '20' }]}>
              <MaterialCommunityIcons name={(typeIcon[resource.type] || 'file') as any} size={24} color={resource.color || '#38BDF8'} />
            </View>
            <View style={styles.resourceInfo}>
              <Text style={styles.resourceTitle}>{resource.title}</Text>
              <Text style={styles.resourceMeta}>{resource.type} • {resource.author}</Text>
              <View style={styles.downloadRow}>
                <MaterialCommunityIcons name="download" size={14} color="#64748B" />
                <Text style={styles.downloadText}>{resource.downloads} unduhan</Text>
              </View>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#475569" />
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
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', borderRadius: 12, paddingHorizontal: 16, height: 48, borderWidth: 1, borderColor: '#334155', marginBottom: 20 },
  searchPlaceholder: { color: '#64748B', fontSize: 15, marginLeft: 10 },
  quickActions: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  quickAction: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', padding: 14, borderRadius: 12, gap: 8, borderWidth: 1, borderColor: '#334155' },
  quickActionText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  resourceCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', padding: 14, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#334155' },
  resourceIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  resourceInfo: { flex: 1 },
  resourceTitle: { fontSize: 14, fontWeight: '600', color: '#FFFFFF', marginBottom: 2 },
  resourceMeta: { fontSize: 12, color: '#64748B' },
  downloadRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 },
  downloadText: { fontSize: 11, color: '#475569' },
});
