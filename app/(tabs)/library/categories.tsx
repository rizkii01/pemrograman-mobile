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

const categories = [
  { name: 'HTML & CSS', icon: 'language-html5', color: '#38BDF8', count: 12 },
  { name: 'JavaScript', icon: 'language-javascript', color: '#F59E0B', count: 15 },
  { name: 'TypeScript', icon: 'language-typescript', color: '#3B82F6', count: 8 },
  { name: 'React', icon: 'react', color: '#10B981', count: 10 },
  { name: 'React Native', icon: 'cellphone', color: '#6366F1', count: 9 },
  { name: 'Node.js', icon: 'nodejs', color: '#84CC16', count: 7 },
  { name: 'Database', icon: 'database', color: '#06B6D4', count: 6 },
  { name: 'UI/UX Design', icon: 'palette', color: '#EC4899', count: 5 },
  { name: 'Git & GitHub', icon: 'git', color: '#F97316', count: 4 },
  { name: 'Tools & DevOps', icon: 'tools', color: '#A78BFA', count: 5 },
];

export default function CategoriesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kategori</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {categories.map((cat, i) => (
            <TouchableOpacity key={i} style={styles.categoryCard} activeOpacity={0.8}>
              <View style={[styles.categoryIcon, { backgroundColor: cat.color + '20' }]}>
                <MaterialCommunityIcons name={cat.icon as any} size={28} color={cat.color} />
              </View>
              <Text style={styles.categoryName}>{cat.name}</Text>
              <Text style={styles.categoryCount}>{cat.count} referensi</Text>
            </TouchableOpacity>
          ))}
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
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  categoryCard: { width: '47%', backgroundColor: '#1E293B', padding: 16, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  categoryIcon: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  categoryName: { fontSize: 14, fontWeight: '700', color: '#FFFFFF', textAlign: 'center' },
  categoryCount: { fontSize: 11, color: '#64748B', marginTop: 4 },
});
