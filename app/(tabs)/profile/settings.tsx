import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [sound, setSound] = useState(false);

  const SettingRow = ({ icon, label, value, onToggle }: { icon: string; label: string; value: boolean; onToggle: (v: boolean) => void }) => (
    <View style={styles.settingRow}>
      <View style={styles.settingLeft}>
        <MaterialCommunityIcons name={icon as any} size={22} color="#94A3B8" />
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#334155', true: '#38BDF880' }}
        thumbColor={value ? '#38BDF8' : '#64748B'}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pengaturan</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>PREFRENSI</Text>
        <View style={styles.sectionCard}>
          <SettingRow icon="bell-outline" label="Notifikasi" value={notifications} onToggle={setNotifications} />
          <SettingRow icon="weather-night" label="Mode Gelap" value={darkMode} onToggle={setDarkMode} />
          <SettingRow icon="volume-high" label="Suara" value={sound} onToggle={setSound} />
        </View>

        <Text style={styles.sectionTitle}>BAHASA</Text>
        <TouchableOpacity style={styles.sectionCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <MaterialCommunityIcons name="earth" size={22} color="#94A3B8" />
              <Text style={styles.settingLabel}>Bahasa</Text>
            </View>
            <View style={styles.languageSelector}>
              <Text style={styles.languageText}>Indonesia</Text>
              <MaterialCommunityIcons name="chevron-down" size={18} color="#64748B" />
            </View>
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>LAINNYA</Text>
        <View style={styles.sectionCard}>
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <MaterialCommunityIcons name="shield-check-outline" size={22} color="#94A3B8" />
              <Text style={styles.settingLabel}>Kebijakan Privasi</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#475569" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <MaterialCommunityIcons name="file-document-outline" size={22} color="#94A3B8" />
              <Text style={styles.settingLabel}>Syarat & Ketentuan</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#475569" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.settingRow, { borderBottomWidth: 0 }]}>
            <View style={styles.settingLeft}>
              <MaterialCommunityIcons name="delete-outline" size={22} color="#EF4444" />
              <Text style={[styles.settingLabel, { color: '#EF4444' }]}>Hapus Akun</Text>
            </View>
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
  sectionTitle: { fontSize: 12, fontWeight: '700', color: '#64748B', letterSpacing: 1, marginBottom: 10, marginTop: 8 },
  sectionCard: { backgroundColor: '#1E293B', borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#334155', marginBottom: 20 },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#0F172A' },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingLabel: { color: '#F1F5F9', fontSize: 15 },
  languageSelector: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  languageText: { color: '#64748B', fontSize: 14 },
});
