import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { libraryApi, Resource } from '@/src/api/library.api';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (query.length > 0) {
      const timeout = setTimeout(() => {
        performSearch(query);
      }, 500);
      return () => clearTimeout(timeout);
    } else {
      setResults([]);
      setSearched(false);
    }
  }, [query]);

  const performSearch = async (q: string) => {
    try {
      setLoading(true);
      const data = await libraryApi.search(q);
      setResults(data);
      setSearched(true);
    } catch {
      setResults([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari referensi..."
            placeholderTextColor="#64748B"
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <MaterialCommunityIcons name="close-circle" size={18} color="#64748B" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <View style={{ paddingVertical: 60, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#38BDF8" />
            <Text style={{ color: '#94A3B8', marginTop: 12 }}>Mencari...</Text>
          </View>
        ) : query.length > 0 ? (
          searched && results.length > 0 ? (
            results.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.resultCard}
                activeOpacity={0.8}
                onPress={() => router.push(`/(tabs)/library/${item.id}`)}
              >
                <View style={[styles.resultIcon, { backgroundColor: (item.color || '#38BDF8') + '20' }]}>
                  <MaterialCommunityIcons name="file-document-outline" size={20} color={item.color || '#38BDF8'} />
                </View>
                <View style={styles.resultInfo}>
                  <Text style={styles.resultTitle}>{item.title}</Text>
                  <Text style={styles.resultType}>{item.type}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color="#475569" />
              </TouchableOpacity>
            ))
          ) : searched ? (
            <View style={styles.noResults}>
              <MaterialCommunityIcons name="file-search-outline" size={48} color="#334155" />
              <Text style={styles.noResultsText}>Tidak ditemukan untuk &quot;{query}&quot;</Text>
            </View>
          ) : null
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="magnify" size={48} color="#334155" />
            <Text style={styles.emptyTitle}>Cari referensi belajar</Text>
            <Text style={styles.emptyDesc}>Temukan ebook, PDF, dan panduan dari berbagai kategori</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 12, gap: 12 },
  searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', borderRadius: 12, paddingHorizontal: 14, height: 44, borderWidth: 1, borderColor: '#334155' },
  searchInput: { flex: 1, color: '#FFFFFF', fontSize: 15, marginLeft: 8 },
  scrollContent: { padding: 24, paddingBottom: 40 },
  resultCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', padding: 14, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#334155' },
  resultIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  resultInfo: { flex: 1 },
  resultTitle: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
  resultType: { fontSize: 12, color: '#64748B', marginTop: 2 },
  noResults: { alignItems: 'center', paddingVertical: 60 },
  noResultsText: { color: '#64748B', fontSize: 15, marginTop: 12 },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#64748B', marginTop: 16 },
  emptyDesc: { fontSize: 14, color: '#475569', marginTop: 4, textAlign: 'center' },
});
