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
import { courseApi, Course } from '@/src/api/course.api';

const categories = ['Semua', 'Frontend', 'Backend', 'Mobile', 'UI/UX', 'Database'];

export default function CoursesScreen() {
  const [activeCategory, setActiveCategory] = React.useState('Semua');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const category = activeCategory === 'Semua' ? undefined : activeCategory;
    courseApi.getAll(category)
      .then(setCourses)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const getProgressPercent = (course: Course) => {
    if (course.completed != null && course.lesson_count) {
      return Math.round((course.completed / course.lesson_count) * 100);
    }
    return 0;
  };

  const getColor = (course: Course) => course.color || '#38BDF8';

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

        {loading ? (
          <ActivityIndicator size="large" color="#38BDF8" style={{ marginTop: 40 }} />
        ) : error ? (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#EF4444" />
            <Text style={{ color: '#EF4444', fontSize: 14, marginTop: 12 }}>{error}</Text>
          </View>
        ) : (
          courses.map((course) => {
            const progress = getProgressPercent(course);
            const color = getColor(course);
            return (
              <TouchableOpacity
                key={course.id}
                style={styles.courseCard}
                activeOpacity={0.8}
                onPress={() => router.push(`/(tabs)/home/course/${course.id}`)}
              >
                <View style={[styles.courseAccent, { backgroundColor: color }]} />
                <View style={styles.courseInfo}>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <Text style={styles.courseDesc}>{course.description}</Text>
                  <View style={styles.courseMeta}>
                    <MaterialCommunityIcons name="play-box-multiple" size={16} color="#64748B" />
                    <Text style={styles.courseMetaText}>{course.lesson_count} materi</Text>
                  </View>
                </View>
                <View style={styles.courseProgress}>
                  <Text style={[styles.courseProgressText, { color }]}>{progress}%</Text>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${progress}%` as any, backgroundColor: color }]} />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
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
