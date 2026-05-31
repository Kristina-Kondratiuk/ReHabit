import React from 'react';
import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/src/context/auth-context';

const AuthLayout = () => {
  const { session } = useAuth();

  if (session) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
    </Stack>
  );
};

export default AuthLayout;
