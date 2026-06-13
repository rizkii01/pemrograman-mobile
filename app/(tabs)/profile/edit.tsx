import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function EditProfileScreen() {
  const [name, setName] = useState('Rizki Pratama');
  const [email, setEmail] = useState('rizki@example.com');
  const [bio, setBio] = useState('Frontend developer pemula yang sedang belajar React Native.');

  const handleSave = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profil</Text>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Simpan</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="account" size={48} color="#475569" />
          </View>
          <TouchableOpacity style={styles.changePhotoBtn}>
            <Text style={styles.changePhotoText}>Ubah Foto</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Nama Lengkap</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholderTextColor="#64748B"
          />
        </View>

        <Text style={styles.label}>Email</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#64748B"
          />
        </View>

        <Text style={styles.label}>Bio</Text>
        <View style={styles.bioContainer}>
          <TextInput
            style={styles.bioInput}
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
            placeholderTextColor="#64748B"
          />
        </View>

        <Text style={styles.hint}>
          Bio akan tampil di profil publik dan diskusi komunitas.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  saveBtn: { backgroundColor: '#38BDF8', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  saveBtnText: { color: '#0F172A', fontWeight: '700', fontSize: 14 },
  scrollContent: { padding: 24, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', marginBottom: 32 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#1E293B', alignItems: 'center', justifyContent: 'center', marginBottom: 12, borderWidth: 2, borderColor: '#334155' },
  changePhotoBtn: { padding: 4 },
  changePhotoText: { color: '#38BDF8', fontSize: 14, fontWeight: '600' },
  label: { fontSize: 14, fontWeight: '600', color: '#CBD5E1', marginBottom: 8, marginTop: 8 },
  inputContainer: { backgroundColor: '#1E293B', borderRadius: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: '#334155', height: 52, justifyContent: 'center', marginBottom: 8 },
  input: { color: '#FFFFFF', fontSize: 15 },
  bioContainer: { backgroundColor: '#1E293B', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#334155', marginBottom: 8 },
  bioInput: { color: '#FFFFFF', fontSize: 14, minHeight: 80, textAlignVertical: 'top' },
  hint: { fontSize: 12, color: '#64748B', marginTop: 4 },
});
