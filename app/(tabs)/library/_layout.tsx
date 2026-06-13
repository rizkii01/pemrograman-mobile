import { Stack } from 'expo-router';

export default function LibraryLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="categories" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="bookmarks" />
      <Stack.Screen name="search" />
    </Stack>
  );
}
