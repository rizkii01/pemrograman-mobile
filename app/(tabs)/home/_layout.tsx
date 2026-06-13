import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="courses" />
      <Stack.Screen name="course/[id]" />
      <Stack.Screen name="lesson/[id]" />
      <Stack.Screen name="quiz/[id]" />
    </Stack>
  );
}
