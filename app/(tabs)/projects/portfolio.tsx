import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const portfolioItems = [
  {
    id: 1,
    title: 'Landing Page Responsive',
    desc: 'HTML & CSS',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    xp: 150,
  },
  {
    id: 2,
    title: 'Todo List App',
    desc: 'JavaScript DOM',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop',
    xp: 200,
  },
  {
    id: 3,
    title: 'Kalkulator Sederhana',
    desc: 'JavaScript',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=300&fit=crop',
    xp: 100,
  },
];

export default function PortfolioScreen() {
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
              <Text style={styles.cardDesc}>{item.desc}</Text>
              <View style={styles.cardMeta}>
                <MaterialCommunityIcons name="sword-cross" size={14} color="#F59E0B" />
                <Text style={styles.cardXp}>+{item.xp} XP</Text>
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
