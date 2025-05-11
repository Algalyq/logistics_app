import { useEffect } from 'react';
import { Redirect, useNavigation } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we figure out where to go
SplashScreen.preventAutoHideAsync();

export default function Index() {
  const navigation = useNavigation();
  
  useEffect(() => {
    // Hide the header when this screen is focused
    navigation.setOptions({
      headerShown: false,
      title: '',
    });
    
    // Hide the splash screen
    SplashScreen.hideAsync();
  }, [navigation]);

  // By default, redirect to the login screen
  // Later you can add logic to check if user is already logged in
  // and redirect to tabs directly
  return <Redirect href="/auth/login" />;
}
