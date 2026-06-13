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

const lessons: Record<string, { title: string; content: string }[]> = {
  '1': [
    { title: 'Apa itu HTML?', content: 'HTML (HyperText Markup Language) adalah bahasa markup standar untuk membuat halaman web. HTML menggunakan tag-tag untuk mendefinisikan struktur konten seperti heading, paragraf, gambar, link, dan lainnya.\n\nSetiap halaman web yang kamu lihat di browser dibangun menggunakan HTML sebagai fondasi utamanya.' },
    { title: 'Tag & Elemen HTML', content: 'Elemen HTML terdiri dari tag pembuka, konten, dan tag penutup. Contoh: <p>Ini paragraf</p>. Beberapa elemen seperti <img> tidak memiliki tag penutup (self-closing).' },
    { title: 'CSS Styling Dasar', content: 'CSS digunakan untuk mempercantik tampilan HTML. Dengan CSS kamu bisa mengubah warna, font, layout, dan animasi. CSS bisa ditulis inline, internal, atau di file terpisah.' },
  ],
  '2': [
    { title: 'Variabel & Scope', content: 'Di JavaScript ES6, kita menggunakan let dan const untuk mendeklarasikan variabel. let untuk nilai yang bisa berubah, const untuk nilai tetap. Hindari menggunakan var karena masalah scope.' },
    { title: 'Arrow Function', content: 'Arrow function adalah cara singkat menulis function di ES6. Contoh: const add = (a, b) => a + b; Arrow function juga memiliki lexical this binding.' },
    { title: 'Array Methods', content: 'ES6 memperkenalkan banyak method array seperti map(), filter(), reduce(), dan forEach(). Method-method ini membuat manipulasi data lebih deklaratif dan mudah dibaca.' },
  ],
};

export default function LessonScreen() {
  const { id, module: moduleIndex } = useLocalSearchParams();
  const idx = parseInt(moduleIndex as string) || 0;
  const lessonList = lessons[id as string] || lessons['1'];
  const lesson = lessonList[idx] || lessonList[0];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{lesson.title}</Text>
        <Text style={styles.headerCounter}>{idx + 1}/{lessonList.length}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.videoPlaceholder}>
          <MaterialCommunityIcons name="play-circle-outline" size={64} color="#64748B" />
          <Text style={styles.videoText}>Video Pembelajaran</Text>
        </View>

        <Text style={styles.contentText}>{lesson.content}</Text>

        <View style={styles.codeBlock}>
          <Text style={styles.codeText}>
{`// Contoh kode
function greet(name) {
  return \`Halo, \${name}!\`;
}

console.log(greet("Scholar"));`}
          </Text>
        </View>

        <View style={styles.navButtons}>
          <TouchableOpacity
            style={[styles.navBtn, idx === 0 && styles.navBtnDisabled]}
            disabled={idx === 0}
            onPress={() => router.push(`/(tabs)/home/lesson/${id}?module=${idx - 1}`)}
          >
            <MaterialCommunityIcons name="chevron-left" size={20} color={idx === 0 ? '#475569' : '#FFFFFF'} />
            <Text style={[styles.navBtnText, idx === 0 && { color: '#475569' }]}>Sebelumnya</Text>
          </TouchableOpacity>
          {idx < lessonList.length - 1 ? (
            <TouchableOpacity
              style={styles.navBtnNext}
              onPress={() => router.push(`/(tabs)/home/lesson/${id}?module=${idx + 1}`)}
            >
              <Text style={styles.navBtnNextText}>Selanjutnya</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#0F172A" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.navBtnNext}
              onPress={() => router.push(`/(tabs)/home/quiz/${id}`)}
            >
              <Text style={styles.navBtnNextText}>Ikuti Kuis</Text>
              <MaterialCommunityIcons name="arrow-right" size={20} color="#0F172A" />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', flex: 1, textAlign: 'center', marginHorizontal: 12 },
  headerCounter: { fontSize: 14, color: '#64748B' },
  scrollContent: { padding: 24, paddingBottom: 40 },
  videoPlaceholder: { height: 200, backgroundColor: '#1E293B', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 24, borderWidth: 1, borderColor: '#334155' },
  videoText: { color: '#64748B', fontSize: 14, marginTop: 8 },
  contentText: { fontSize: 15, color: '#CBD5E1', lineHeight: 24, marginBottom: 24 },
  codeBlock: { backgroundColor: '#1E293B', padding: 16, borderRadius: 12, marginBottom: 24, borderWidth: 1, borderColor: '#334155' },
  codeText: { fontFamily: 'monospace', fontSize: 13, color: '#E2E8F0', lineHeight: 20 },
  navButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  navBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#1E293B', gap: 4 },
  navBtnDisabled: { opacity: 0.5 },
  navBtnText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
  navBtnNext: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, backgroundColor: '#38BDF8', gap: 4 },
  navBtnNextText: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
});
