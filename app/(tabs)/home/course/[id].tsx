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
import { router, useLocalSearchParams } from 'expo-router';

const courseData: Record<string, { title: string; desc: string; color: string; modules: { title: string; duration: string; done: boolean }[] }> = {
  '1': {
    title: 'HTML & CSS Dasar',
    desc: 'Pelajari fundamental web development mulai dari struktur HTML hingga styling dengan CSS. Cocok untuk pemula yang ingin membangun website pertamanya.',
    color: '#38BDF8',
    modules: [
      { title: 'Pengenalan HTML', duration: '15 menit', done: true },
      { title: 'Tag & Elemen HTML', duration: '20 menit', done: true },
      { title: 'CSS Selectors & Properties', duration: '25 menit', done: true },
      { title: 'Flexbox & Grid', duration: '30 menit', done: true },
      { title: 'Responsive Design', duration: '25 menit', done: false },
      { title: 'Project: Landing Page', duration: '45 menit', done: false },
    ],
  },
  '2': {
    title: 'JavaScript Modern (ES6+)',
    desc: 'Kuasai JavaScript modern dari dasar hingga mahir. Materi mencakup ES6+, asynchronous programming, dan studi kasus nyata.',
    color: '#F59E0B',
    modules: [
      { title: 'Variabel & Tipe Data', duration: '15 menit', done: true },
      { title: 'Function & Arrow Function', duration: '20 menit', done: true },
      { title: 'Array & Object', duration: '25 menit', done: true },
      { title: 'DOM Manipulation', duration: '30 menit', done: true },
      { title: 'Async/Await & Fetch API', duration: '25 menit', done: true },
      { title: 'ES6 Modules', duration: '20 menit', done: false },
      { title: 'Studi Kasus: Todo App', duration: '40 menit', done: false },
      { title: 'Final Project', duration: '60 menit', done: false },
    ],
  },
};

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams();
  const course = courseData[id as string] || courseData['1'];

  const completedModules = course.modules.filter((m) => m.done).length;
  const totalModules = course.modules.length;
  const progress = Math.round((completedModules / totalModules) * 100);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={[styles.heroIcon, { backgroundColor: course.color + '20' }]}>
          <MaterialCommunityIcons name="book-open-variant" size={64} color={course.color} />
        </View>

        <Text style={styles.title}>{course.title}</Text>
        <Text style={styles.desc}>{course.desc}</Text>

        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Progress Belajar</Text>
            <Text style={[styles.progressPercent, { color: course.color }]}>{progress}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: (progress + '%') as any, backgroundColor: course.color }]} />
          </View>
          <Text style={styles.progressDetail}>{completedModules} dari {totalModules} materi selesai</Text>
        </View>

        <Text style={styles.sectionTitle}>Modul Pembelajaran</Text>

        {course.modules.map((module, i) => (
          <TouchableOpacity
            key={i}
            style={styles.moduleItem}
            activeOpacity={0.8}
            onPress={() => router.push(`/(tabs)/home/lesson/${id}?module=${i}`)}
          >
            <View style={[styles.moduleIcon, module.done ? styles.moduleDone : styles.modulePending]}>
              <MaterialCommunityIcons
                name={module.done ? 'check' : 'play'}
                size={16}
                color={module.done ? '#0F172A' : course.color}
              />
            </View>
            <View style={styles.moduleInfo}>
              <Text style={[styles.moduleTitle, module.done && styles.moduleTitleDone]}>
                {module.title}
              </Text>
              <Text style={styles.moduleDuration}>{module.duration}</Text>
            </View>
            {module.done && <MaterialCommunityIcons name="check-circle" size={20} color="#10B981" />}
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.startBtn, { backgroundColor: course.color }]}
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
