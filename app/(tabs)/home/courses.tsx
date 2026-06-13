import React from 'react';
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

const categories = ['Semua', 'Frontend', 'Backend', 'Mobile', 'UI/UX', 'Database'];
const courses = [
  { id: 1, title: 'HTML & CSS Dasar', desc: 'Fundamental web development', lessons: 12, progress: '100%', color: '#38BDF8' },
  { id: 2, title: 'JavaScript Modern (ES6+)', desc: 'Dari var ke arrow function', lessons: 8, progress: '62%', color: '#F59E0B' },
  { id: 3, title: 'React Native Pemula', desc: 'Membangun aplikasi mobile', lessons: 10, progress: '30%', color: '#10B981' },
  { id: 4, title: 'Node.js & Express', desc: 'Backend API development', lessons: 8, progress: '15%', color: '#A78BFA' },
  { id: 5, title: 'UI/UX Design Dasar', desc: 'Prinsip desain & prototyping', lessons: 6, progress: '0%', color: '#EC4899' },
  { id: 6, title: 'Database dengan PostgreSQL', desc: 'SQL & database design', lessons: 7, progress: '0%', color: '#06B6D4' },
];

export default function CoursesScreen() {
  const [activeCategory, setActiveCategory] = React.useState('Semua');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Semua Kursus</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari kursus..."
            placeholderTextColor="#64748B"
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryChip, activeCategory === cat && styles.categoryChipActive]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.categoryText, activeCategory === cat && styles.categoryTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {courses.map((course) => (
          <TouchableOpacity
            key={course.id}
            style={styles.courseCard}
            activeOpacity={0.8}
            onPress={() => router.push(`/(tabs)/home/course/${course.id}`)}
          >
            <View style={[styles.courseAccent, { backgroundColor: course.color }]} />
            <View style={styles.courseInfo}>
              <Text style={styles.courseTitle}>{course.title}</Text>
              <Text style={styles.courseDesc}>{course.desc}</Text>
              <View style={styles.courseMeta}>
                <MaterialCommunityIcons name="play-box-multiple" size={16} color="#64748B" />
                <Text style={styles.courseMetaText}>{course.lessons} materi</Text>
              </View>
            </View>
            <View style={styles.courseProgress}>
              <Text style={[styles.courseProgressText, { color: course.color }]}>{course.progress}</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: course.progress as any, backgroundColor: course.color }]} />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  scrollContent: { padding: 24, paddingTop: 0 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', borderRadius: 12, paddingHorizontal: 16, height: 48, borderWidth: 1, borderColor: '#334155', marginBottom: 20 },
  searchInput: { flex: 1, color: '#FFFFFF', fontSize: 15, marginLeft: 10 },
  categoryScroll: { marginBottom: 20, marginLeft: -24, paddingLeft: 24 },
  categoryChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#1E293B', marginRight: 8, borderWidth: 1, borderColor: '#334155' },
  categoryChipActive: { backgroundColor: '#38BDF8', borderColor: '#38BDF8' },
  categoryText: { fontSize: 13, color: '#94A3B8', fontWeight: '500' },
  categoryTextActive: { color: '#0F172A', fontWeight: '700' },
  courseCard: { flexDirection: 'row', backgroundColor: '#1E293B', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#334155', overflow: 'hidden' },
  courseAccent: { width: 4, borderRadius: 2, marginRight: 14 },
  courseInfo: { flex: 1 },
  courseTitle: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  courseDesc: { fontSize: 13, color: '#94A3B8', marginBottom: 8 },
  courseMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  courseMetaText: { fontSize: 12, color: '#64748B' },
  courseProgress: { alignItems: 'flex-end', justifyContent: 'center', marginLeft: 12 },
  courseProgressText: { fontSize: 14, fontWeight: '700', marginBottom: 6 },
  progressBar: { width: 60, height: 4, backgroundColor: '#334155', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
});
