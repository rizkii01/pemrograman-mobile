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

const posts = [
  {
    id: 1,
    author: 'Alex Supriadi',
    role: 'UI/UX Design',
    time: '2 jam yang lalu',
    title: 'Ada yang tahu kombinasi font bagus untuk portofolio?',
    body: 'Lagi bikin portofolio studi kasus. Bagusnya pakai Inter + Playfair Display atau Montserrat + Roboto ya?',
    replies: 12,
    likes: 24,
  },
  {
    id: 2,
    author: 'Sari Dewi',
    role: 'Frontend Dev',
    time: '5 jam yang lalu',
    title: 'Tips debugging React Native yang sering muncul',
    body: 'Setelah beberapa bulan pakai RN, ini dia error yang paling sering saya temui dan cara ngatasinnya. Semoga membantu teman-teman!',
    replies: 8,
    likes: 45,
  },
  {
    id: 3,
    author: 'Bambang',
    role: 'Backend Dev',
    time: '1 hari yang lalu',
    title: 'REST API vs GraphQL, mana yang harus dipelajari?',
    body: 'Untuk pemula yang baru mau belajar backend, lebih baik mulai dari REST API dulu atau langsung GraphQL?',
    replies: 19,
    likes: 32,
  },
  {
    id: 4,
    author: 'Maya Putri',
    role: 'Mobile Dev',
    time: '2 hari yang lalu',
    title: 'Berhasil deploy aplikasi pertama ke Play Store!',
    body: 'Setelah 3 bulan belajar, akhirnya aplikasi pertama saya terbit di Play Store. Terima kasih SkillUps!',
    replies: 30,
    likes: 67,
  },
];

export default function CommunityFeedScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Komunitas</Text>
          <Text style={styles.subtitle}>Diskusi dan berbagi ilmu</Text>
        </View>
        <TouchableOpacity style={styles.createBtn} onPress={() => router.push('/(tabs)/community/create')}>
          <MaterialCommunityIcons name="pencil" size={20} color="#0F172A" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {posts.map((post) => (
          <TouchableOpacity
            key={post.id}
            style={styles.postCard}
            activeOpacity={0.8}
            onPress={() => router.push(`/(tabs)/community/${post.id}`)}
          >
            <View style={styles.postHeader}>
              <View style={styles.avatar}>
                <MaterialCommunityIcons name="account" size={20} color="#94A3B8" />
              </View>
              <View>
                <Text style={styles.authorName}>{post.author}</Text>
                <Text style={styles.postTime}>{post.time} • {post.role}</Text>
              </View>
            </View>
            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postBody} numberOfLines={2}>{post.body}</Text>
            <View style={styles.postFooter}>
              <View style={styles.interaction}>
                <MaterialCommunityIcons name="comment-text-outline" size={16} color="#64748B" />
                <Text style={styles.interactionText}>{post.replies} balasan</Text>
              </View>
              <View style={styles.interaction}>
                <MaterialCommunityIcons name="thumb-up-outline" size={16} color="#64748B" />
                <Text style={styles.interactionText}>{post.likes}</Text>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 },
  title: { fontSize: 24, fontWeight: '800', color: '#FFFFFF' },
  subtitle: { fontSize: 14, color: '#94A3B8', marginTop: 2 },
  createBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#38BDF8', alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: 24, paddingTop: 16, paddingBottom: 40 },
  postCard: { backgroundColor: '#1E293B', padding: 16, borderRadius: 16, marginBottom: 14, borderWidth: 1, borderColor: '#334155' },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#334155', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  authorName: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
  postTime: { color: '#64748B', fontSize: 11, marginTop: 2 },
  postTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginBottom: 6 },
  postBody: { color: '#CBD5E1', fontSize: 14, lineHeight: 20, marginBottom: 14 },
  postFooter: { flexDirection: 'row', gap: 24, borderTopWidth: 1, borderTopColor: '#334155', paddingTop: 12 },
  interaction: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  interactionText: { color: '#64748B', fontSize: 13, fontWeight: '500' },
});
