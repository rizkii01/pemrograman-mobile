import React, { useState } from 'react';
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

export default function CreatePostScreen() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('');

  const categories = ['Diskusi', 'Tips & Trik', 'Showcase', 'Tanya Jawab', 'Karir'];

  const handlePost = () => {
    if (!title || !body || !category) {
      alert('Harap isi semua kolom!');
      return;
    }
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Buat Diskusi</Text>
        <TouchableOpacity style={styles.postBtn} onPress={handlePost}>
          <Text style={styles.postBtnText}>Kirim</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.titleInput}
            placeholder="Judul diskusi"
            placeholderTextColor="#64748B"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <Text style={styles.label}>Kategori</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryChip, category === cat && styles.categoryChipActive]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.categoryText, category === cat && styles.categoryTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.bodyContainer}>
          <TextInput
            style={styles.bodyInput}
            placeholder="Tulis konten diskusi di sini... Jelaskan detail pertanyaan atau topik yang ingin dibahas."
            placeholderTextColor="#64748B"
            multiline
            value={body}
            onChangeText={setBody}
          />
        </View>

        <View style={styles.tipsCard}>
          <MaterialCommunityIcons name="lightbulb-outline" size={20} color="#F59E0B" />
          <View style={styles.tipsContent}>
            <Text style={styles.tipsTitle}>Tips menulis diskusi yang baik</Text>
            <Text style={styles.tipsText}>
              • Gunakan judul yang spesifik dan jelas{'\n'}
              • Sertakan detail yang cukup agar mudah dipahami{'\n'}
              • Bersikap sopan dan hormat kepada sesama
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  postBtn: { backgroundColor: '#38BDF8', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  postBtnText: { color: '#0F172A', fontWeight: '700', fontSize: 14 },
  scrollContent: { padding: 24, paddingBottom: 40 },
  inputContainer: { backgroundColor: '#1E293B', borderRadius: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: '#334155', marginBottom: 20 },
  titleInput: { color: '#FFFFFF', fontSize: 16, height: 52, fontWeight: '600' },
  label: { fontSize: 14, fontWeight: '600', color: '#CBD5E1', marginBottom: 10 },
  categoryScroll: { marginBottom: 20, marginLeft: -24, paddingLeft: 24 },
  categoryChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#1E293B', marginRight: 8, borderWidth: 1, borderColor: '#334155' },
  categoryChipActive: { backgroundColor: '#38BDF8', borderColor: '#38BDF8' },
  categoryText: { fontSize: 13, color: '#94A3B8', fontWeight: '500' },
  categoryTextActive: { color: '#0F172A', fontWeight: '700' },
  bodyContainer: { backgroundColor: '#1E293B', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#334155', marginBottom: 20, minHeight: 160 },
  bodyInput: { color: '#FFFFFF', fontSize: 15, minHeight: 140, textAlignVertical: 'top', lineHeight: 22 },
  tipsCard: { flexDirection: 'row', backgroundColor: '#1E293B', padding: 16, borderRadius: 12, gap: 12, borderWidth: 1, borderColor: '#334155' },
  tipsContent: { flex: 1 },
  tipsTitle: { fontSize: 14, fontWeight: '600', color: '#F59E0B', marginBottom: 6 },
  tipsText: { fontSize: 13, color: '#94A3B8', lineHeight: 20 },
});
