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

const bookmarks = [
  { id: 1, title: 'JavaScript: The Good Parts', type: 'Ebook', savedAt: '2 hari lalu', color: '#F59E0B' },
  { id: 2, title: 'CSS Cheatsheet Lengkap', type: 'PDF', savedAt: '5 hari lalu', color: '#A78BFA' },
  { id: 3, title: 'React Native Documentation', type: 'Link', savedAt: '1 minggu lalu', color: '#10B981' },
];

export default function BookmarksScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tersimpan</Text>
        <TouchableOpacity>
          <MaterialCommunityIcons name="delete-outline" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {bookmarks.length > 0 ? (
          bookmarks.map((bm) => (
            <TouchableOpacity
              key={bm.id}
              style={styles.bookmarkCard}
              activeOpacity={0.8}
              onPress={() => router.push(`/(tabs)/library/${bm.id}`)}
            >
              <View style={[styles.bookmarkIcon, { backgroundColor: bm.color + '20' }]}>
                <MaterialCommunityIcons name="bookmark" size={20} color={bm.color} />
              </View>
              <View style={styles.bookmarkInfo}>
                <Text style={styles.bookmarkTitle}>{bm.title}</Text>
                <Text style={styles.bookmarkMeta}>{bm.type} • Disimpan {bm.savedAt}</Text>
              </View>
              <MaterialCommunityIcons name="close" size={18} color="#475569" />
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="bookmark-outline" size={64} color="#334155" />
            <Text style={styles.emptyTitle}>Belum ada yang tersimpan</Text>
            <Text style={styles.emptyDesc}>Simpan referensi untuk diakses nanti</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  scrollContent: { padding: 24, paddingBottom: 40 },
  bookmarkCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', padding: 14, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#334155' },
  bookmarkIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  bookmarkInfo: { flex: 1 },
  bookmarkTitle: { fontSize: 14, fontWeight: '600', color: '#FFFFFF', marginBottom: 2 },
  bookmarkMeta: { fontSize: 12, color: '#64748B' },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#64748B', marginTop: 16 },
  emptyDesc: { fontSize: 14, color: '#475569', marginTop: 4 },
});
