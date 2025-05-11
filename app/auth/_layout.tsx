import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function AuthLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,          // This completely hides the header
          // contentStyle: { backgroundColor: '#FBFBFB' },
          // animation: 'slide_from_right',
        }}
      >
        <Stack.Screen 
          name="login" 
          options={{ 
            headerShown: false,
            title: 'test',      // Ensure no title text
          }} 
        />
        <Stack.Screen 
          name="register" 
          options={{ 
            headerShown: false,
            title: '',      // Ensure no title text
          }} 
        />
      </Stack>
    </>
  );
}
