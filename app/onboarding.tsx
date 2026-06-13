import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const slides = [
  {
    icon: 'school-outline',
    title: 'Belajar dengan Roadmap Terarah',
    desc: 'Ikuti kurikulum terstruktur dari dasar hingga mahir. Setiap langkah dirancang untuk membangun skill nyata.',
  },
  {
    icon: 'briefcase-outline',
    title: 'Bangun Portofolio Profesional',
    desc: 'Selesaikan proyek-proyek praktis yang bisa langsung kamu pamerkan ke perekrut dan klien.',
  },
  {
    icon: 'account-group-outline',
    title: 'Bergabung dengan Komunitas',
    desc: 'Diskusikan materi, tanya mentor, dan berkolaborasi dengan ribuan pembelajar lainnya.',
  },
];

export default function OnboardingScreen() {
  const [slideIndex, setSlideIndex] = useState(0);

  const handleNext = () => {
    if (slideIndex < slides.length - 1) {
      setSlideIndex(slideIndex + 1);
    } else {
      router.replace('/login');
    }
  };

  const handleSkip = () => {
    router.replace('/login');
  };

  const slide = slides[slideIndex];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name={slide.icon as any} size={100} color="#38BDF8" />
        </View>

        <View style={styles.dotContainer}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === slideIndex && styles.dotActive]}
            />
          ))}
        </View>

        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.desc}>{slide.desc}</Text>

        <TouchableOpacity style={styles.button} onPress={handleNext} activeOpacity={0.8}>
          <Text style={styles.buttonText}>
            {slideIndex < slides.length - 1 ? 'Lanjut' : 'Mulai Belajar'}
          </Text>
          <MaterialCommunityIcons name="arrow-right" size={20} color="#0F172A" />
        </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  skipBtn: {
    position: 'absolute',
    top: 16,
    right: 24,
    padding: 8,
  },
  skipText: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '600',
  },
  iconContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  dotContainer: {
    flexDirection: 'row',
    marginBottom: 40,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#334155',
  },
  dotActive: {
    width: 24,
    backgroundColor: '#38BDF8',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  desc: {
    fontSize: 15,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 48,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#38BDF8',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
  },
});
