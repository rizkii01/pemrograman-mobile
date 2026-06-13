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
import { router, useLocalSearchParams } from 'expo-router';

const discussionData: Record<string, {
  author: string; role: string; time: string; title: string; body: string;
  comments: { author: string; role: string; time: string; text: string }[]
}> = {
  '1': {
    author: 'Alex Supriadi',
    role: 'UI/UX Design',
    time: '2 jam yang lalu',
    title: 'Ada yang tahu kombinasi font bagus untuk portofolio?',
    body: 'Lagi bikin portofolio studi kasus nih. Bagusnya pakai Inter + Playfair Display atau Montserrat + Roboto ya? Butuh saran dari teman-teman yang sudah berpengalaman di UI/UX.',
    comments: [
      { author: 'Rina', role: 'UI/UX Designer', time: '1 jam lalu', text: 'Inter + Playfair Display lebih aman untuk portofolio. Inter untuk body text, Playfair untuk heading. Memberikan kesan profesional dan elegan.' },
      { author: 'Dimas', role: 'Frontend Dev', time: '45 menit lalu', text: 'Setuju sama Rina. Atau kalau mau lebih modern, coba Manrope + DM Sans. Light weight-nya bagus.' },
      { author: 'Sari', role: 'Graphic Designer', time: '30 menit lalu', text: 'Jangan lupa perhatikan pairing contrast-nya ya. Tes di Google Fonts dulu sebelum apply.' },
    ],
  },
};

export default function DiscussionScreen() {
  const { id } = useLocalSearchParams();
  const data = discussionData[id as string] || discussionData['1'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Diskusi</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.postCard}>
          <View style={styles.postHeader}>
            <View style={styles.avatar}>
              <MaterialCommunityIcons name="account" size={20} color="#94A3B8" />
            </View>
            <View>
              <Text style={styles.authorName}>{data.author}</Text>
              <Text style={styles.postTime}>{data.time} • {data.role}</Text>
            </View>
          </View>
          <Text style={styles.postTitle}>{data.title}</Text>
          <Text style={styles.postBody}>{data.body}</Text>
        </View>

        <Text style={styles.commentSectionTitle}>{data.comments.length} Balasan</Text>

        {data.comments.map((comment, i) => (
          <View key={i} style={styles.commentCard}>
            <View style={styles.commentHeader}>
              <View style={styles.commentAvatar}>
                <MaterialCommunityIcons name="account" size={16} color="#64748B" />
              </View>
              <View>
                <Text style={styles.commentAuthor}>{comment.author}</Text>
                <Text style={styles.commentTime}>{comment.time}</Text>
              </View>
            </View>
            <Text style={styles.commentText}>{comment.text}</Text>
          </View>
        ))}

        <View style={styles.replyContainer}>
          <TextInput
            style={styles.replyInput}
            placeholder="Tulis balasan..."
            placeholderTextColor="#64748B"
            multiline
          />
          <TouchableOpacity style={styles.replyBtn}>
            <MaterialCommunityIcons name="send" size={18} color="#0F172A" />
          </TouchableOpacity>
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
  postCard: { backgroundColor: '#1E293B', padding: 16, borderRadius: 16, marginBottom: 24, borderWidth: 1, borderColor: '#334155' },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#334155', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  authorName: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  postTime: { color: '#64748B', fontSize: 11, marginTop: 2 },
  postTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', marginBottom: 8 },
  postBody: { color: '#CBD5E1', fontSize: 14, lineHeight: 22 },
  commentSectionTitle: { fontSize: 16, fontWeight: '700', color: '#CBD5E1', marginBottom: 16 },
  commentCard: { backgroundColor: '#1E293B', padding: 14, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#334155' },
  commentHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  commentAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#334155', justifyContent: 'center', alignItems: 'center' },
  commentAuthor: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  commentTime: { color: '#64748B', fontSize: 11 },
  commentText: { color: '#CBD5E1', fontSize: 14, lineHeight: 20 },
  replyContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', borderRadius: 12, padding: 8, marginTop: 16, borderWidth: 1, borderColor: '#334155' },
  replyInput: { flex: 1, color: '#FFFFFF', fontSize: 14, marginRight: 8, maxHeight: 80 },
  replyBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#38BDF8', alignItems: 'center', justifyContent: 'center' },
});
