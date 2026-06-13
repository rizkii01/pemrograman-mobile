import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);

  const handleRegister = () => {
    if (!name || !email || !password) {
      alert('Harap isi semua kolom!');
      return;
    }
    router.replace('/(tabs)/(home)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Buat Akun Baru</Text>
            <Text style={styles.subtitle}>Mulai perjalanan belajarmu dan bangun portofolio hebat.</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Nama Lengkap</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="account-outline" size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Masukkan nama lengkap"
                placeholderTextColor="#64748B"
                value={name}
                onChangeText={setName}
              />
            </View>

            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="email-outline" size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Masukkan email"
                placeholderTextColor="#64748B"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="lock-outline" size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Buat password minimal 6 karakter"
                placeholderTextColor="#64748B"
                secureTextEntry={secureText}
                autoCapitalize="none"
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                <MaterialCommunityIcons
                  name={secureText ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#64748B"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.buttonPrimary} onPress={handleRegister} activeOpacity={0.8}>
              <Text style={styles.buttonTextPrimary}>Daftar Akun</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Sudah punya akun? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.footerLink}>Masuk</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1E293B', justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  header: { marginTop: 32, marginBottom: 32 },
  title: { fontSize: 28, fontWeight: '800', color: '#FFFFFF', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#94A3B8', lineHeight: 20 },
  form: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', color: '#CBD5E1', marginBottom: 8, marginTop: 16 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', borderRadius: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: '#334155', height: 56 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: '#FFFFFF', fontSize: 15 },
  buttonPrimary: { backgroundColor: '#38BDF8', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 16, shadowColor: '#38BDF8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 6 },
  buttonTextPrimary: { color: '#0F172A', fontWeight: '700', fontSize: 16 },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  footerText: { color: '#94A3B8', fontSize: 14 },
  footerLink: { color: '#38BDF8', fontSize: 14, fontWeight: '700' },
});
