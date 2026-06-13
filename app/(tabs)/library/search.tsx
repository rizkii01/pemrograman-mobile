import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const allResources = [
  { id: 1, title: 'Belajar HTML dalam 1 Jam', type: 'Ebook', color: '#38BDF8' },
  { id: 2, title: 'CSS Cheatsheet Lengkap', type: 'PDF', color: '#A78BFA' },
  { id: 3, title: 'JavaScript: The Good Parts', type: 'Ebook', color: '#F59E0B' },
  { id: 4, title: 'React Native Documentation', type: 'Link', color: '#10B981' },
  { id: 5, title: 'Desain Sistem Figma Kit', type: 'File', color: '#EC4899' },
  { id: 6, title: 'API Testing dengan Postman', type: 'Guide', color: '#06B6D4' },
  { id: 7, title: 'TypeScript Handbook', type: 'Ebook', color: '#3B82F6' },
  { id: 8, title: 'Node.js Best Practices', type: 'Guide', color: '#84CC16' },
];

export default function SearchScreen() {
  const [query, setQuery] = useState('');

  const filtered = allResources.filter(
    (r) => r.title.toLowerCase().includes(query.toLowerCase())
  );

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
        {query.length > 0 ? (
          filtered.length > 0 ? (
            filtered.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.resultCard}
                activeOpacity={0.8}
                onPress={() => router.push(`/(tabs)/library/${item.id}`)}
              >
                <View style={[styles.resultIcon, { backgroundColor: item.color + '20' }]}>
                  <MaterialCommunityIcons name="file-document-outline" size={20} color={item.color} />
                </View>
                <View style={styles.resultInfo}>
                  <Text style={styles.resultTitle}>{item.title}</Text>
                  <Text style={styles.resultType}>{item.type}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color="#475569" />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noResults}>
              <MaterialCommunityIcons name="file-search-outline" size={48} color="#334155" />
              <Text style={styles.noResultsText}>Tidak ditemukan untuk "{query}"</Text>
            </View>
          )
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
