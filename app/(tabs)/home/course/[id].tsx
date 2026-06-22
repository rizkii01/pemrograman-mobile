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
import { router, useLocalSearchParams } from 'expo-router';
import { courseApi, Course, Module } from '@/src/api/course.api';

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams();
  const courseId = Number(id);

  const [course, setCourse] = useState<(Course & { modules: Module[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completingModule, setCompletingModule] = useState<number | null>(null);

  useEffect(() => {
    courseApi.getById(courseId)
      .then(setCourse)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [courseId]);

  const handleCompleteModule = async (module: Module) => {
    setCompletingModule(module.id);
    try {
      await courseApi.updateProgress(module.id);
      setCourse((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          modules: prev.modules.map((m) =>
            m.id === module.id ? m : m
          ),
        };
      });
    } catch {
      // silently fail or show error
    } finally {
      setCompletingModule(null);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#38BDF8" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text style={{ color: '#EF4444', fontSize: 16, marginTop: 12 }}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const courseData = course!;
  const color = courseData.color || '#38BDF8';
  const completedModules = courseData.modules.filter((m) => (m as any).done).length;
  const totalModules = courseData.modules.length;
  const progress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={[styles.heroIcon, { backgroundColor: color + '20' }]}>
          <MaterialCommunityIcons name="book-open-variant" size={64} color={color} />
        </View>

        <Text style={styles.title}>{courseData.title}</Text>
        <Text style={styles.desc}>{courseData.description}</Text>

        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Progress Belajar</Text>
            <Text style={[styles.progressPercent, { color }]}>{progress}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: (progress + '%') as any, backgroundColor: color }]} />
          </View>
          <Text style={styles.progressDetail}>{completedModules} dari {totalModules} materi selesai</Text>
        </View>

        <Text style={styles.sectionTitle}>Modul Pembelajaran</Text>

        {courseData.modules.map((module, i) => {
          const isDone = (module as any).done || false;
          const isCompleting = completingModule === module.id;
          return (
            <TouchableOpacity
              key={module.id}
              style={styles.moduleItem}
              activeOpacity={0.8}
              onPress={() => {
                if (!isDone) {
                  handleCompleteModule(module);
                } else {
                  router.push(`/(tabs)/home/lesson/${id}?module=${i}`);
                }
              }}
            >
              <View style={[styles.moduleIcon, isDone ? styles.moduleDone : styles.modulePending]}>
                {isCompleting ? (
                  <ActivityIndicator size="small" color={isDone ? '#0F172A' : color} />
                ) : (
                  <MaterialCommunityIcons
                    name={isDone ? 'check' : 'play'}
                    size={16}
                    color={isDone ? '#0F172A' : color}
                  />
                )}
              </View>
              <View style={styles.moduleInfo}>
                <Text style={[styles.moduleTitle, isDone && styles.moduleTitleDone]}>
                  {module.title}
                </Text>
                <Text style={styles.moduleDuration}>{module.duration}</Text>
              </View>
              {isDone && <MaterialCommunityIcons name="check-circle" size={20} color="#10B981" />}
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={[styles.startBtn, { backgroundColor: color }]}
          activeOpacity={0.8}
          onPress={() => router.push(`/(tabs)/home/lesson/${id}?module=${completedModules}`)}
        >
          <MaterialCommunityIcons name="play" size={20} color="#0F172A" />
          <Text style={styles.startBtnText}>
            {progress === 100 ? 'Ulangi Kursus' : 'Lanjutkan Belajar'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  scrollContent: { padding: 24, paddingBottom: 40 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1E293B', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  heroIcon: { width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '800', color: '#FFFFFF', textAlign: 'center', marginBottom: 8 },
  desc: { fontSize: 14, color: '#94A3B8', textAlign: 'center', lineHeight: 20, marginBottom: 28 },
  progressCard: { backgroundColor: '#1E293B', padding: 16, borderRadius: 12, marginBottom: 28, borderWidth: 1, borderColor: '#334155' },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  progressTitle: { fontSize: 14, fontWeight: '600', color: '#CBD5E1' },
  progressPercent: { fontSize: 16, fontWeight: '800' },
  progressBar: { height: 8, backgroundColor: '#334155', borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', borderRadius: 4 },
  progressDetail: { fontSize: 12, color: '#64748B' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#CBD5E1', marginBottom: 16 },
  moduleItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', padding: 14, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#334155' },
  moduleIcon: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  moduleDone: { backgroundColor: '#10B981' },
  modulePending: { backgroundColor: '#334155' },
  moduleInfo: { flex: 1 },
  moduleTitle: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
  moduleTitleDone: { color: '#94A3B8', textDecorationLine: 'line-through' },
  moduleDuration: { fontSize: 12, color: '#64748B', marginTop: 2 },
  startBtn: { flexDirection: 'row', paddingVertical: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16 },
  startBtnText: { color: '#0F172A', fontSize: 16, fontWeight: '700' },
});
