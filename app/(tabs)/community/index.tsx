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
import { communityApi, Post } from '@/src/api/community.api';

export default function CommunityFeedScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await communityApi.getPosts();
      setPosts(data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat postingan');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
          <View>
            <Text style={styles.title}>Komunitas</Text>
            <Text style={styles.subtitle}>Diskusi dan berbagi ilmu</Text>
          </View>
          <TouchableOpacity style={styles.createBtn} onPress={() => router.push('/(tabs)/community/create')}>
            <MaterialCommunityIcons name="pencil" size={20} color="#0F172A" />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text style={{ color: '#EF4444', marginTop: 12, textAlign: 'center' }}>{error}</Text>
          <TouchableOpacity style={{ marginTop: 16, backgroundColor: '#1E293B', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }} onPress={loadPosts}>
            <Text style={{ color: '#38BDF8', fontWeight: '600' }}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
                <Text style={styles.postTime}>{post.created_at} • {post.role}</Text>
              </View>
            </View>
            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postBody} numberOfLines={2}>{post.body}</Text>
            <View style={styles.postFooter}>
              <View style={styles.interaction}>
                <MaterialCommunityIcons name="comment-text-outline" size={16} color="#64748B" />
                <Text style={styles.interactionText}>{post.replies_count} balasan</Text>
              </View>
              <View style={styles.interaction}>
                <MaterialCommunityIcons name="thumb-up-outline" size={16} color="#64748B" />
                <Text style={styles.interactionText}>{post.likes_count}</Text>
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
