import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const features = [
  {
    icon: 'school-outline',
    title: '12+ Kursus Terstruktur',
    desc: 'Materi belajar dari dasar hingga mahir dengan roadmap terarah.',
    color: '#38BDF8',
  },
  {
    icon: 'briefcase-outline',
    title: 'Proyek Praktis',
    desc: 'Bangun portofolio nyata dengan proyek yang relevan industri.',
    color: '#F59E0B',
  },
  {
    icon: 'account-group-outline',
    title: 'Komunitas Aktif',
    desc: 'Diskusi, tanya mentor, dan kolaborasi sesama pembelajar.',
    color: '#10B981',
  },
];

export default function LandingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.heroSection}>
          <View style={styles.logoContainer}>
            <MaterialCommunityIcons name="book-open-page-variant" size={48} color="#38BDF8" />
          </View>
          <Text style={styles.appName}>SkillUps</Text>
          <Text style={styles.tagline}>
            Belajar Pemrograman{'\n'}Jadi Lebih Menyenangkan
          </Text>
        </View>

        <View style={styles.featuresSection}>
          {features.map((feature, i) => (
            <View key={i} style={styles.featureCard}>
              <View style={[styles.featureIcon, { backgroundColor: feature.color + '15' }]}>
                <MaterialCommunityIcons name={feature.icon as any} size={24} color={feature.color} />
              </View>
              <View style={styles.featureInfo}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDesc}>{feature.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.ctaSection}>
          <TouchableOpacity
            style={styles.primaryBtn}
            activeOpacity={0.8}
            onPress={() => router.push('/register')}
          >
            <Text style={styles.primaryBtnText}>Mulai Belajar</Text>
            <MaterialCommunityIcons name="arrow-right" size={20} color="#0F172A" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            activeOpacity={0.8}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.secondaryBtnText}>Sudah punya akun? Masuk</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.guestLink}
            activeOpacity={0.7}
            onPress={() => router.replace('/(tabs)/home')}
          >
            <Text style={styles.guestText}>Jelajahi sebagai Tamu</Text>
            <MaterialCommunityIcons name="chevron-right" size={16} color="#64748B" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresSection: {
    gap: 12,
    marginBottom: 40,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 18,
  },
  ctaSection: {
    gap: 12,
  },
  primaryBtn: {
    flexDirection: 'row',
    backgroundColor: '#38BDF8',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  primaryBtnText: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#1E293B',
  },
  secondaryBtnText: {
    color: '#CBD5E1',
    fontSize: 15,
    fontWeight: '600',
  },
  guestLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 4,
  },
  guestText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
  },
});
