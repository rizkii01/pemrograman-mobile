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
import { router, useLocalSearchParams } from 'expo-router';
import { communityApi, Post, Comment } from '@/src/api/community.api';

export default function DiscussionScreen() {
  const { id } = useLocalSearchParams();
  const [post, setPost] = useState<(Post & { comments: Comment[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await communityApi.getPostById(Number(id));
      setPost(data);
      setLiked(data.liked ?? false);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat diskusi');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!replyText.trim()) return;
    try {
      setSubmitting(true);
      const newComment = await communityApi.addComment(Number(id), replyText.trim());
      if (post) {
        setPost({ ...post, comments: [...post.comments, newComment] });
      }
      setReplyText('');
    } catch (err: any) {
      alert(err.message || 'Gagal menambahkan balasan');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleLike = async () => {
    try {
      const result = await communityApi.toggleLike(Number(id));
      setLiked(result.liked);
      if (post) {
        setPost({
          ...post,
          likes_count: result.liked ? post.likes_count + 1 : post.likes_count - 1,
        });
      }
    } catch (err: any) {
      alert(err.message || 'Gagal memberikan like');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Diskusi</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#38BDF8" />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !post) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Diskusi</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text style={{ color: '#EF4444', marginTop: 12, textAlign: 'center' }}>{error || 'Diskusi tidak ditemukan'}</Text>
          <TouchableOpacity style={{ marginTop: 16, backgroundColor: '#1E293B', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }} onPress={loadPost}>
            <Text style={{ color: '#38BDF8', fontWeight: '600' }}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
              <Text style={styles.authorName}>{post.author}</Text>
              <Text style={styles.postTime}>{post.created_at} • {post.role}</Text>
            </View>
          </View>
          <Text style={styles.postTitle}>{post.title}</Text>
          <Text style={styles.postBody}>{post.body}</Text>
          <TouchableOpacity style={styles.likeBtn} onPress={handleToggleLike}>
            <MaterialCommunityIcons
              name={liked ? 'thumb-up' : 'thumb-up-outline'}
              size={18}
              color={liked ? '#38BDF8' : '#64748B'}
            />
            <Text style={[styles.likeText, liked && { color: '#38BDF8' }]}>{post.likes_count}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.commentSectionTitle}>{post.comments.length} Balasan</Text>

        {post.comments.map((comment) => (
          <View key={comment.id} style={styles.commentCard}>
            <View style={styles.commentHeader}>
              <View style={styles.commentAvatar}>
                <MaterialCommunityIcons name="account" size={16} color="#64748B" />
              </View>
              <View>
                <Text style={styles.commentAuthor}>{comment.author}</Text>
                <Text style={styles.commentTime}>{comment.created_at}</Text>
              </View>
            </View>
            <Text style={styles.commentText}>{comment.body}</Text>
          </View>
        ))}

        <View style={styles.replyContainer}>
          <TextInput
            style={styles.replyInput}
            placeholder="Tulis balasan..."
            placeholderTextColor="#64748B"
            multiline
            value={replyText}
            onChangeText={setReplyText}
          />
          <TouchableOpacity style={[styles.replyBtn, submitting && { opacity: 0.6 }]} onPress={handleAddComment} disabled={submitting}>
            {submitting ? (
              <ActivityIndicator size="small" color="#0F172A" />
            ) : (
              <MaterialCommunityIcons name="send" size={18} color="#0F172A" />
            )}
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
  likeBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
  likeText: { color: '#64748B', fontSize: 13, fontWeight: '500' },
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
