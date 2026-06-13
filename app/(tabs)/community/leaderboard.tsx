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

const rankings = [
  { rank: 1, name: 'Rizki', xp: 4850, badge: 'gold', level: 'Expert' },
  { rank: 2, name: 'Sari Dewi', xp: 4200, badge: 'silver', level: 'Expert' },
  { rank: 3, name: 'Dimas Ardian', xp: 3980, badge: 'bronze', level: 'Advanced' },
  { rank: 4, name: 'Maya Putri', xp: 3650, badge: 'none', level: 'Advanced' },
  { rank: 5, name: 'Alex Supriadi', xp: 3210, badge: 'none', level: 'Intermediate' },
  { rank: 6, name: 'Bambang', xp: 2980, badge: 'none', level: 'Intermediate' },
  { rank: 7, name: 'Citra Lestari', xp: 2750, badge: 'none', level: 'Intermediate' },
  { rank: 8, name: 'Rina Wijaya', xp: 2420, badge: 'none', level: 'Beginner' },
];

const badgeIcon = (badge: string) => {
  switch (badge) {
    case 'gold': return { icon: 'trophy', color: '#F59E0B' };
    case 'silver': return { icon: 'trophy', color: '#94A3B8' };
    case 'bronze': return { icon: 'trophy', color: '#CD7F32' };
    default: return { icon: 'numeric-' + '0' + '-circle', color: '#64748B' };
  }
};

export default function LeaderboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Peringkat</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.podium}>
          {rankings.slice(0, 3).map((user) => (
            <View key={user.rank} style={[styles.podiumItem, user.rank === 1 && styles.podiumFirst]}>
              <MaterialCommunityIcons
                name={badgeIcon(user.badge).icon as any}
                size={user.rank === 1 ? 36 : 28}
                color={badgeIcon(user.badge).color}
              />
              <Text style={styles.podiumName}>{user.name.split(' ')[0]}</Text>
              <Text style={styles.podiumXp}>{user.xp} XP</Text>
            </View>
          ))}
        </View>

        {rankings.map((user) => {
          const bi = badgeIcon(user.badge);
          return (
            <View key={user.rank} style={styles.rankCard}>
              <View style={styles.rankBadge}>
                {user.rank <= 3 ? (
                  <MaterialCommunityIcons name={bi.icon as any} size={20} color={bi.color} />
                ) : (
                  <Text style={styles.rankNumber}>{user.rank}</Text>
                )}
              </View>
              <View style={styles.rankInfo}>
                <Text style={styles.rankName}>{user.name}</Text>
                <Text style={styles.rankLevel}>{user.level}</Text>
              </View>
              <Text style={styles.rankXp}>{user.xp.toLocaleString()} XP</Text>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  scrollContent: { padding: 24, paddingBottom: 40 },
  podium: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', gap: 16, marginBottom: 32, paddingTop: 16 },
  podiumItem: { alignItems: 'center', backgroundColor: '#1E293B', padding: 16, borderRadius: 16, width: 100, borderWidth: 1, borderColor: '#334155' },
  podiumFirst: { paddingBottom: 24, borderColor: '#F59E0B' },
  podiumName: { fontSize: 13, fontWeight: '700', color: '#FFFFFF', marginTop: 6 },
  podiumXp: { fontSize: 11, color: '#F59E0B', fontWeight: '600', marginTop: 2 },
  rankCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', padding: 14, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#334155' },
  rankBadge: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  rankNumber: { fontSize: 16, fontWeight: '700', color: '#64748B' },
  rankInfo: { flex: 1 },
  rankName: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
  rankLevel: { fontSize: 12, color: '#64748B', marginTop: 1 },
  rankXp: { fontSize: 14, fontWeight: '700', color: '#38BDF8' },
});
