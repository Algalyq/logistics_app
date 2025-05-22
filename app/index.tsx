import { useEffect, useState } from 'react';
import { Redirect, useNavigation } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import apiClient from '@/api/client';

// Keep the splash screen visible while we figure out where to go
SplashScreen.preventAutoHideAsync();

export default function Index() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Hide the header when this screen is focused
    navigation.setOptions({
      headerShown: false,
      title: '',
    });
    
    // Check authentication status and prepare redirect
    const checkAuthStatus = async () => {
      try {
        // Wait a bit to show splash screen
        await new Promise(resolve => setTimeout(resolve, 500));
      } finally {
        // Hide the splash screen
        await SplashScreen.hideAsync();
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
  }, [navigation]);
  
  // If still loading, don't redirect yet
  if (isLoading) {
    return null;
  }
  
  // Check if user is authenticated
  if (!apiClient.isAuthenticated()) {
    return <Redirect href="/auth/login" />;
  }
  
  // If authenticated, redirect based on role
  const userRole = apiClient.getUserRole();
  
  if (userRole === 'driver') {
    return <Redirect href="/driver" />;
  } else {
    // Default to customer for all other roles
    return <Redirect href="/customer" />;
  }
}
