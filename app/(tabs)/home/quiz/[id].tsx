import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { courseApi, Quiz } from '@/src/api/course.api';

export default function QuizScreen() {
  const { id } = useLocalSearchParams();
  const courseId = Number(id);

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    courseApi.getQuiz(courseId)
      .then(setQuiz)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [courseId]);

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setAnswers((prev) => [...prev, idx]);
    if (quiz && idx === quiz.questions[currentQ].correct_index) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (!quiz) return;
    if (currentQ < quiz.questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
    } else {
      setShowResult(true);
      submitAnswers();
    }
  };

  const submitAnswers = async () => {
    setSubmitting(true);
    try {
      await courseApi.submitQuiz(courseId, answers);
    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
    }
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setShowResult(false);
    setAnswers([]);
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
          <Text style={{ color: '#EF4444', fontSize: 16, marginTop: 12 }}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (showResult) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.resultContainer}>
          {submitting && <ActivityIndicator size="small" color="#38BDF8" style={{ marginBottom: 16 }} />}
          <MaterialCommunityIcons
            name={score >= quiz!.questions.length / 2 ? 'trophy' : 'school-outline'}
            size={80}
            color={score >= quiz!.questions.length / 2 ? '#F59E0B' : '#38BDF8'}
          />
          <Text style={styles.resultTitle}>
            {score >= quiz!.questions.length / 2 ? 'Selamat!' : 'Terus Belajar!'}
          </Text>
          <Text style={styles.resultScore}>
            {score} / {quiz!.questions.length}
          </Text>
          <Text style={styles.resultDesc}>
            {score === quiz!.questions.length
              ? 'Sempurna! Kamu menguasai materi ini dengan baik.'
              : score >= quiz!.questions.length / 2
              ? 'Hasil yang bagus! Review kembali jawaban yang salah.'
              : 'Jangan menyerah! Pelajari ulang materi dan coba lagi.'}
          </Text>
          <TouchableOpacity style={styles.restartBtn} onPress={handleRestart}>
            <MaterialCommunityIcons name="refresh" size={20} color="#0F172A" />
            <Text style={styles.restartBtnText}>Ulangi Kuis</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>Kembali ke Kursus</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const question = quiz!.questions[currentQ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kuis</Text>
        <Text style={styles.headerCounter}>{currentQ + 1}/{quiz!.questions.length}</Text>
      </View>

      <View style={styles.progressStrip}>
        <View style={[styles.progressFillStrip, { width: (((currentQ + 1) / quiz!.questions.length) * 100 + '%') as any }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.questionText}>{question.question_text}</Text>

        {question.options.map((opt, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.optionBtn,
              selected === i && i === question.correct_index && styles.optionCorrect,
              selected === i && i !== question.correct_index && styles.optionWrong,
              selected !== null && selected !== i && styles.optionDim,
            ]}
            onPress={() => handleAnswer(i)}
            disabled={selected !== null}
          >
            <View style={[styles.optionCircle, selected === i && styles.optionCircleSelected]}>
              <Text style={[styles.optionLetter, selected === i && { color: '#0F172A' }]}>
                {String.fromCharCode(65 + i)}
              </Text>
            </View>
            <Text style={[styles.optionText, selected === i && { color: '#FFFFFF' }]}>{opt}</Text>
            {selected === i && (
              <MaterialCommunityIcons
                name={i === question.correct_index ? 'check-circle' : 'close-circle'}
                size={20}
                color={i === question.correct_index ? '#10B981' : '#EF4444'}
              />
            )}
          </TouchableOpacity>
        ))}

        {selected !== null && (
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextBtnText}>
              {currentQ < quiz!.questions.length - 1 ? 'Soal Selanjutnya' : 'Lihat Hasil'}
            </Text>
            <MaterialCommunityIcons name="arrow-right" size={20} color="#0F172A" />
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  headerCounter: { fontSize: 14, color: '#94A3B8' },
  progressStrip: { height: 4, backgroundColor: '#1E293B', marginHorizontal: 24, borderRadius: 2, overflow: 'hidden', marginBottom: 8 },
  progressFillStrip: { height: '100%', backgroundColor: '#38BDF8', borderRadius: 2 },
  scrollContent: { padding: 24, paddingTop: 16 },
  questionText: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', marginBottom: 28, lineHeight: 28 },
  optionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  optionCorrect: { borderColor: '#10B981', backgroundColor: '#064E3B' },
  optionWrong: { borderColor: '#EF4444', backgroundColor: '#450A0A' },
  optionDim: { opacity: 0.5 },
  optionCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#334155', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  optionCircleSelected: { backgroundColor: '#38BDF8' },
  optionLetter: { fontSize: 14, fontWeight: '700', color: '#94A3B8' },
  optionText: { flex: 1, fontSize: 15, color: '#CBD5E1', fontWeight: '500' },
  nextBtn: { flexDirection: 'row', backgroundColor: '#38BDF8', paddingVertical: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16 },
  nextBtnText: { color: '#0F172A', fontSize: 16, fontWeight: '700' },
  resultContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  resultTitle: { fontSize: 28, fontWeight: '800', color: '#FFFFFF', marginTop: 24, marginBottom: 8 },
  resultScore: { fontSize: 48, fontWeight: '800', color: '#38BDF8', marginBottom: 12 },
  resultDesc: { fontSize: 15, color: '#94A3B8', textAlign: 'center', lineHeight: 22, marginBottom: 40 },
  restartBtn: { flexDirection: 'row', backgroundColor: '#38BDF8', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 12, alignItems: 'center', gap: 8 },
  restartBtnText: { color: '#0F172A', fontSize: 16, fontWeight: '700' },
  backBtn: { marginTop: 16, paddingVertical: 12 },
  backBtnText: { color: '#94A3B8', fontSize: 14, fontWeight: '600' },
});
