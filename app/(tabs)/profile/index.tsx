import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { userApi, UserProfile, UserStats } from '@/src/api/user.api';
import { AuthContext } from '@/src/context/AuthContext';

interface MenuLinkProps {
  icon: string;
  label: string;
  onPress: () => void;
  color?: string;
}

const MenuLink: React.FC<MenuLinkProps> = ({ icon, label, onPress, color = '#94A3B8' }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuLeft}>
      <MaterialCommunityIcons name={icon as any} size={22} color={color} />
      <Text style={styles.menuLabel}>{label}</Text>
    </View>
    <MaterialCommunityIcons name="chevron-right" size={22} color="#475569" />
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const { logout } = useContext(AuthContext);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const [profileData, statsData] = await Promise.all([
        userApi.getProfile(),
        userApi.getStats(),
      ]);
      setProfile(profileData);
      setStats(statsData);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat profil');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#38BDF8" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text style={{ color: '#EF4444', marginTop: 12, textAlign: 'center' }}>{error}</Text>
          <TouchableOpacity style={{ marginTop: 16, backgroundColor: '#1E293B', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }} onPress={loadProfile}>
            <Text style={{ color: '#38BDF8', fontWeight: '600' }}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <MaterialCommunityIcons name="account" size={56} color="#475569" />
            </View>
            <TouchableOpacity style={styles.editBadge} onPress={() => router.push('/(tabs)/profile/edit')}>
              <MaterialCommunityIcons name="pencil" size={14} color="#0F172A" />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{profile?.name || '-'}</Text>
          <Text style={styles.email}>{profile?.email || '-'}</Text>
          <View style={styles.levelBadge}>
            <MaterialCommunityIcons name="star" size={14} color="#F59E0B" />
            <Text style={styles.levelText}>{profile?.level || '-'}</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats?.courses ?? 0}</Text>
            <Text style={styles.statLabel}>Kursus</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats?.projects ?? 0}</Text>
            <Text style={styles.statLabel}>Proyek</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats?.certificates ?? 0}</Text>
            <Text style={styles.statLabel}>Sertifikat</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats?.xp ?? 0}</Text>
            <Text style={styles.statLabel}>XP</Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          <MenuLink icon="account-outline" label="Edit Profil" onPress={() => router.push('/(tabs)/profile/edit')} />
          <MenuLink icon="trophy-outline" label="Pencapaian" onPress={() => router.push('/(tabs)/profile/achievements')} color="#F59E0B" />
          <MenuLink icon="cog-outline" label="Pengaturan" onPress={() => router.push('/(tabs)/profile/settings')} />
          <MenuLink icon="help-circle-outline" label="Pusat Bantuan" onPress={() => router.push('/(tabs)/profile/help')} color="#38BDF8" />
          <MenuLink icon="information-outline" label="Tentang SkillUps" onPress={() => {}} />
        </View>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
        >
          <MaterialCommunityIcons name="logout" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Keluar</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Versi 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  scrollContent: { paddingBottom: 40 },
  profileSection: { alignItems: 'center', paddingVertical: 32, paddingHorizontal: 24 },
  avatarContainer: { position: 'relative', marginBottom: 16 },
  avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#1E293B', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#334155' },
  editBadge: { position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: '#38BDF8', alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', marginBottom: 4 },
  email: { fontSize: 14, color: '#64748B', marginBottom: 12 },
  levelBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16, gap: 4, borderWidth: 1, borderColor: '#334155' },
  levelText: { fontSize: 12, color: '#F59E0B', fontWeight: '600' },
  statsGrid: { flexDirection: 'row', marginHorizontal: 24, marginBottom: 24, gap: 8 },
  statItem: { flex: 1, backgroundColor: '#1E293B', padding: 14, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  statNumber: { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  statLabel: { fontSize: 11, color: '#64748B', marginTop: 2 },
  menuSection: { paddingHorizontal: 24, marginBottom: 24 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  menuLabel: { color: '#F1F5F9', fontSize: 15, marginLeft: 12, fontWeight: '400' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, marginHorizontal: 24, borderRadius: 12, borderWidth: 1, borderColor: '#450A0A' },
  logoutText: { color: '#EF4444', fontSize: 15, fontWeight: '600' },
  version: { textAlign: 'center', color: '#475569', fontSize: 12, marginTop: 32 },
});
