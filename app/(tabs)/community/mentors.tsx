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

const mentors = [
  {
    id: 1,
    name: 'Ahmad Riza',
    role: 'Senior Frontend Engineer',
    expertise: ['React', 'TypeScript', 'CSS'],
    students: 234,
    rating: 4.9,
    available: true,
  },
  {
    id: 2,
    name: 'Diana Putri',
    role: 'UI/UX Designer',
    expertise: ['Figma', 'Design System', 'Prototyping'],
    students: 189,
    rating: 4.8,
    available: false,
  },
  {
    id: 3,
    name: 'Budi Santoso',
    role: 'Backend Developer',
    expertise: ['Node.js', 'PostgreSQL', 'AWS'],
    students: 156,
    rating: 4.7,
    available: true,
  },
  {
    id: 4,
    name: 'Citra Lestari',
    role: 'Mobile Developer',
    expertise: ['React Native', 'Flutter', 'Firebase'],
    students: 201,
    rating: 4.9,
    available: true,
  },
];

export default function MentorsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mentor</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.greeting}>
          Konsultasi dengan mentor berpengalaman untuk membantumu belajar.
        </Text>

        {mentors.map((mentor) => (
          <TouchableOpacity key={mentor.id} style={styles.mentorCard} activeOpacity={0.8}>
            <View style={styles.mentorHeader}>
              <View style={styles.avatarLarge}>
                <Text style={styles.avatarText}>
                  {mentor.name.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>
              <View style={styles.mentorInfo}>
                <Text style={styles.mentorName}>{mentor.name}</Text>
                <Text style={styles.mentorRole}>{mentor.role}</Text>
                <View style={styles.ratingRow}>
                  <MaterialCommunityIcons name="star" size={14} color="#F59E0B" />
                  <Text style={styles.ratingText}>{mentor.rating}</Text>
                  <Text style={styles.studentCount}>• {mentor.students} siswa</Text>
                </View>
              </View>
              <View style={[styles.availabilityDot, mentor.available ? styles.available : styles.busy]} />
            </View>
            <View style={styles.expertiseRow}>
              {mentor.expertise.map((skill, i) => (
                <View key={i} style={styles.expertiseChip}>
                  <Text style={styles.expertiseText}>{skill}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.consultBtn}>
              <MaterialCommunityIcons name="chat" size={16} color="#0F172A" />
              <Text style={styles.consultBtnText}>Konsultasi</Text>
            </TouchableOpacity>
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
  scrollContent: { padding: 24, paddingBottom: 40 },
  greeting: { fontSize: 14, color: '#94A3B8', marginBottom: 20 },
  mentorCard: { backgroundColor: '#1E293B', padding: 16, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#334155' },
  mentorHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatarLarge: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#334155', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  avatarText: { fontSize: 16, fontWeight: '700', color: '#38BDF8' },
  mentorInfo: { flex: 1 },
  mentorName: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  mentorRole: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 },
  ratingText: { fontSize: 12, color: '#F59E0B', fontWeight: '600' },
  studentCount: { fontSize: 12, color: '#64748B' },
  availabilityDot: { width: 10, height: 10, borderRadius: 5 },
  available: { backgroundColor: '#10B981' },
  busy: { backgroundColor: '#64748B' },
  expertiseRow: { flexDirection: 'row', gap: 6, marginBottom: 14, flexWrap: 'wrap' },
  expertiseChip: { backgroundColor: '#0F172A', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  expertiseText: { fontSize: 12, color: '#38BDF8', fontWeight: '500' },
  consultBtn: { flexDirection: 'row', backgroundColor: '#38BDF8', paddingVertical: 10, borderRadius: 8, alignItems: 'center', justifyContent: 'center', gap: 6 },
  consultBtnText: { color: '#0F172A', fontSize: 14, fontWeight: '700' },
});
