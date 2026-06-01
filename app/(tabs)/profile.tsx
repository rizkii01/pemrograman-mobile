import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// ─── Types ───────────────────────────────────────────────────────────────────

interface Stat {
  label: string;
  value: string;
}

interface Skill {
  name: string;
  level: number; // 0–100
}

interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const STATS: Stat[] = [
  { label: 'Projects', value: '48' },
  { label: 'Clients', value: '32' },
  { label: 'Awards', value: '12' },
];

const SKILLS: Skill[] = [
  { name: 'React Native', level: 95 },
  { name: 'TypeScript', level: 90 },
  { name: 'Node.js', level: 80 },
  { name: 'UI / UX Design', level: 75 },
  { name: 'GraphQL', level: 70 },
];

const EXPERIENCES: Experience[] = [
  {
    role: 'Senior Mobile Engineer',
    company: 'TechVerde Studio',
    period: '2023 – Present',
    description:
      'Leading mobile product development for fintech clients across SEA, managing a team of 6 engineers.',
  },
  {
    role: 'Mobile Developer',
    company: 'Griya Digital',
    period: '2021 – 2023',
    description:
      'Built cross-platform apps reaching 500 K+ downloads, reduced crash rate by 40%.',
  },
  {
    role: 'Frontend Engineer',
    company: 'Inovasi Labs',
    period: '2019 – 2021',
    description:
      'Developed React web dashboards and mentored junior developers in best practices.',
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

const SkillBar: React.FC<{ skill: Skill; delay: number }> = ({ skill, delay }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: skill.level,
      duration: 900,
      delay,
      useNativeDriver: false,
    }).start();
  }, []);

  const width = anim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.skillItem}>
      <View style={styles.skillHeader}>
        <Text style={styles.skillName}>{skill.name}</Text>
        <Text style={styles.skillPercent}>{skill.level}%</Text>
      </View>
      <View style={styles.skillTrack}>
        <Animated.View style={[styles.skillFill, { width }]} />
      </View>
    </View>
  );
};

const ExperienceCard: React.FC<{ exp: Experience; isLast: boolean }> = ({ exp, isLast }) => (
  <View style={styles.expRow}>
    {/* Timeline */}
    <View style={styles.timeline}>
      <View style={styles.timelineDot} />
      {!isLast && <View style={styles.timelineLine} />}
    </View>

    {/* Card */}
    <View style={[styles.expCard, isLast && { marginBottom: 0 }]}>
      <View style={styles.expCardHeader}>
        <Text style={styles.expRole}>{exp.role}</Text>
        <Text style={styles.expPeriod}>{exp.period}</Text>
      </View>
      <Text style={styles.expCompany}>{exp.company}</Text>
      <Text style={styles.expDesc}>{exp.description}</Text>
    </View>
  </View>
);

// ─── Main Screen ─────────────────────────────────────────────────────────────

const ProfileScreen: React.FC = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();
  }, []);

  // Hero shrink on scroll
  const heroHeight = scrollY.interpolate({
    inputRange: [0, 180],
    outputRange: [260, 120],
    extrapolate: 'clamp',
  });

  const avatarScale = scrollY.interpolate({
    inputRange: [0, 180],
    outputRange: [1, 0.55],
    extrapolate: 'clamp',
  });

  const nameOpacity = scrollY.interpolate({
    inputRange: [120, 180],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* ── Sticky Hero ─────────────────────────────────────── */}
      <Animated.View style={[styles.hero, { height: heroHeight }]}>
        {/* Decorative circles */}
        <View style={styles.decorCircle1} />
        <View style={styles.decorCircle2} />

        {/* Top bar */}
        <View style={styles.heroBar}>
          <TouchableOpacity style={styles.iconBtn}>
            <Text style={styles.iconText}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Text style={styles.iconText}>⋯</Text>
          </TouchableOpacity>
        </View>

        {/* Avatar + name */}
        <Animated.View style={[styles.heroContent, { opacity: nameOpacity }]}>
          <Animated.View style={[styles.avatarWrap, { transform: [{ scale: avatarScale }] }]}>
            <View style={styles.avatarRing}>
              <View style={styles.avatarInner}>
                <Text style={styles.avatarInitials}>AR</Text>
              </View>
            </View>
            <View style={styles.onlineBadge} />
          </Animated.View>

          <Text style={styles.heroName}>Arif Ramadhan</Text>
          <Text style={styles.heroTitle}>Senior Mobile Engineer</Text>
        </Animated.View>
      </Animated.View>

      {/* ── Scrollable Body ──────────────────────────────────── */}
      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: false,
        })}
        scrollEventThrottle={16}
      >
        {/* Stats */}
        <Animated.View
          style={[
            styles.statsRow,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {STATS.map((s, i) => (
            <View key={i} style={[styles.statBox, i === 1 && styles.statBoxHighlight]}>
              <Text style={[styles.statValue, i === 1 && styles.statValueHighlight]}>{s.value}</Text>
              <Text style={[styles.statLabel, i === 1 && styles.statLabelHighlight]}>{s.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* About */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionTitle}>About</Text>
          </View>
          <Text style={styles.aboutText}>
            Passionate mobile engineer with 6+ years crafting high-performance apps for
            millions of users across Indonesia and Southeast Asia. I thrive at the
            intersection of clean architecture and delightful UX — turning complex
            requirements into elegant, scalable solutions.
          </Text>
          <View style={styles.tagRow}>
            {['Remote-friendly', 'Agile', 'Open Source'].map((t) => (
              <View key={t} style={styles.tag}>
                <Text style={styles.tagText}>{t}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionTitle}>Skills</Text>
          </View>
          {SKILLS.map((skill, i) => (
            <SkillBar key={skill.name} skill={skill} delay={i * 120} />
          ))}
        </View>

        {/* Experience */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionTitle}>Experience</Text>
          </View>
          {EXPERIENCES.map((exp, i) => (
            <ExperienceCard key={i} exp={exp} isLast={i === EXPERIENCES.length - 1} />
          ))}
        </View>

        {/* Contact CTA */}
        <View style={styles.ctaSection}>
          <View style={styles.ctaCard}>
            <Text style={styles.ctaEmoji}>🤝</Text>
            <Text style={styles.ctaTitle}>Let's work together</Text>
            <Text style={styles.ctaSub}>Open to freelance & full-time opportunities</Text>
            <TouchableOpacity style={styles.ctaBtn} activeOpacity={0.85}>
              <Text style={styles.ctaBtnText}>Get in Touch</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Social links */}
        <View style={styles.socialRow}>
          {['GitHub', 'LinkedIn', 'Dribbble'].map((s) => (
            <TouchableOpacity key={s} style={styles.socialBtn}>
              <Text style={styles.socialText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 32 }} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

// ─── Design Tokens ───────────────────────────────────────────────────────────

const COLORS = {
  primary: '#1A6B3C',       // deep forest green
  primaryLight: '#2E8B57',  // sea green
  primaryPale: '#E8F5EE',   // tint bg
  accent: '#4CAF78',        // mid green
  accentBright: '#6FCF97',  // highlight
  white: '#FFFFFF',
  offWhite: '#F7FAF8',
  text: '#1C2B22',
  textMid: '#4A6357',
  textLight: '#8BA99A',
  border: '#D4EAE0',
};

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },

  // ── Hero ──
  hero: {
    backgroundColor: COLORS.primary,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    paddingBottom: 16,
  },
  decorCircle1: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: COLORS.primaryLight,
    opacity: 0.35,
    top: -60,
    right: -50,
  },
  decorCircle2: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: COLORS.accentBright,
    opacity: 0.15,
    top: 30,
    left: -40,
  },
  heroBar: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 8 : 12,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { color: COLORS.white, fontSize: 18, fontWeight: '600' },

  heroContent: { alignItems: 'center', paddingBottom: 4 },

  avatarWrap: { alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: COLORS.accentBright,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInner: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: { fontSize: 28, fontWeight: '800', color: COLORS.white, letterSpacing: 2 },
  onlineBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4ADE80',
    borderWidth: 2.5,
    borderColor: COLORS.primary,
  },

  heroName: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 0.4,
  },
  heroTitle: {
    fontSize: 13,
    color: COLORS.accentBright,
    fontWeight: '500',
    marginTop: 2,
    letterSpacing: 0.6,
  },

  // ── Scroll ──
  scroll: { flex: 1, backgroundColor: COLORS.offWhite },
  scrollContent: { paddingTop: 8 },

  // ── Stats ──
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 4,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: COLORS.white,
  },
  statBoxHighlight: { backgroundColor: COLORS.primary },
  statValue: { fontSize: 26, fontWeight: '900', color: COLORS.primary },
  statValueHighlight: { color: COLORS.white },
  statLabel: { fontSize: 11, color: COLORS.textLight, marginTop: 3, letterSpacing: 0.5 },
  statLabelHighlight: { color: COLORS.accentBright },

  // ── Section ──
  section: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  sectionAccent: {
    width: 4,
    height: 20,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: 0.3,
  },

  // ── About ──
  aboutText: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.textMid,
  },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 14, gap: 8 },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: COLORS.primaryPale,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tagText: { fontSize: 12, color: COLORS.primaryLight, fontWeight: '600' },

  // ── Skills ──
  skillItem: { marginBottom: 14 },
  skillHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  skillName: { fontSize: 13, fontWeight: '600', color: COLORS.text },
  skillPercent: { fontSize: 12, color: COLORS.primaryLight, fontWeight: '700' },
  skillTrack: {
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.primaryPale,
    overflow: 'hidden',
  },
  skillFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },

  // ── Experience ──
  expRow: { flexDirection: 'row' },
  timeline: { width: 28, alignItems: 'center' },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    marginTop: 5,
    borderWidth: 2.5,
    borderColor: COLORS.primaryPale,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: COLORS.border,
    marginTop: 4,
    marginBottom: -4,
  },
  expCard: {
    flex: 1,
    marginLeft: 12,
    marginBottom: 20,
    padding: 14,
    backgroundColor: COLORS.offWhite,
    borderRadius: 14,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accentBright,
  },
  expCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  expRole: { fontSize: 14, fontWeight: '700', color: COLORS.text, flex: 1 },
  expPeriod: { fontSize: 11, color: COLORS.textLight, marginLeft: 8, marginTop: 1 },
  expCompany: { fontSize: 12, color: COLORS.primaryLight, fontWeight: '600', marginBottom: 6 },
  expDesc: { fontSize: 13, color: COLORS.textMid, lineHeight: 19 },

  // ── CTA ──
  ctaSection: { marginHorizontal: 16, marginTop: 20 },
  ctaCard: {
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    padding: 28,
    alignItems: 'center',
    overflow: 'hidden',
  },
  ctaEmoji: { fontSize: 36, marginBottom: 10 },
  ctaTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  ctaSub: {
    fontSize: 13,
    color: COLORS.accentBright,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  ctaBtn: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 36,
    paddingVertical: 13,
    borderRadius: 30,
  },
  ctaBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.4,
  },

  // ── Social ──
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 20,
  },
  socialBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  socialText: { fontSize: 13, fontWeight: '600', color: COLORS.primaryLight },
});

export default ProfileScreen;