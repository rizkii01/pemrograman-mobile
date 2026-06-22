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
import { libraryApi, Bookmark } from '@/src/api/library.api';

export default function BookmarksScreen() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await libraryApi.getBookmarks();
      setBookmarks(data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat bookmark');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (resourceId: number) => {
    try {
      await libraryApi.removeBookmark(resourceId);
      setBookmarks(prev => prev.filter(bm => bm.id !== resourceId));
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus bookmark');
    }
  };

  if (loading) {
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
          <Text style={styles.headerTitle}>Tersimpan</Text>
          <TouchableOpacity>
            <MaterialCommunityIcons name="delete-outline" size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text style={{ color: '#EF4444', marginTop: 12, textAlign: 'center' }}>{error}</Text>
          <TouchableOpacity style={{ marginTop: 16, backgroundColor: '#1E293B', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }} onPress={loadBookmarks}>
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
              <View style={[styles.bookmarkIcon, { backgroundColor: (bm.color || '#38BDF8') + '20' }]}>
                <MaterialCommunityIcons name="bookmark" size={20} color={bm.color || '#38BDF8'} />
              </View>
              <View style={styles.bookmarkInfo}>
                <Text style={styles.bookmarkTitle}>{bm.title}</Text>
                <Text style={styles.bookmarkMeta}>{bm.type} • Disimpan {bm.saved_at}</Text>
              </View>
              <TouchableOpacity onPress={() => handleRemoveBookmark(bm.id)}>
                <MaterialCommunityIcons name="close" size={18} color="#475569" />
              </TouchableOpacity>
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
