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
import { projectApi, Portfolio } from '@/src/api/project.api';

export default function PortfolioScreen() {
  const [portfolioItems, setPortfolioItems] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectApi.getPortfolio();
      setPortfolioItems(data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat portofolio');
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
          <Text style={styles.headerTitle}>Portofolio Saya</Text>
          <View style={{ width: 24 }} />
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
          <Text style={styles.headerTitle}>Portofolio Saya</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text style={{ color: '#EF4444', marginTop: 12, textAlign: 'center' }}>{error}</Text>
          <TouchableOpacity style={{ marginTop: 16, backgroundColor: '#1E293B', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }} onPress={loadPortfolio}>
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
        <Text style={styles.headerTitle}>Portofolio Saya</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.greeting}>
          Menampilkan {portfolioItems.length} proyek yang telah diselesaikan.
        </Text>

        {portfolioItems.map((item) => (
          <TouchableOpacity key={item.id} style={styles.portfolioCard} activeOpacity={0.8}>
            <View style={styles.cardImage}>
              <MaterialCommunityIcons name="image-outline" size={32} color="#334155" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.description}</Text>
              <View style={styles.cardMeta}>
                <MaterialCommunityIcons name="sword-cross" size={14} color="#F59E0B" />
                <Text style={styles.cardXp}>+{item.xp_reward} XP</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="plus-circle-outline" size={40} color="#334155" />
          <Text style={styles.emptyText}>Selesaikan proyek untuk menambah portofolio</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  scrollContent: { padding: 24, paddingBottom: 40 },
  greeting: { fontSize: 14, color: '#94A3B8', marginBottom: 20 },
  portfolioCard: { flexDirection: 'row', backgroundColor: '#1E293B', borderRadius: 16, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#334155' },
  cardImage: { width: 100, height: 100, backgroundColor: '#0F172A', alignItems: 'center', justifyContent: 'center' },
  cardContent: { flex: 1, padding: 14, justifyContent: 'center' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#FFFFFF', marginBottom: 2 },
  cardDesc: { fontSize: 13, color: '#94A3B8', marginBottom: 6 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardXp: { fontSize: 12, color: '#F59E0B', fontWeight: '600' },
  emptyState: { alignItems: 'center', paddingVertical: 40, opacity: 0.5 },
  emptyText: { color: '#475569', fontSize: 13, marginTop: 8, textAlign: 'center' },
});
