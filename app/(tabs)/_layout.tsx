import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons'; // <--- Import Ionicons
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarShowLabel: false, // Sembunyikan label/tulisan
      }}>
      <Tabs.Screen
        name="auth" // Ini akan merujuk ke app/(tabs)/auth.tsx
        options={{
          title: 'Auth',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="log-in-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="vote" // Ini akan merujuk ke app/(tabs)/vote.tsx
        options={{
          title: 'Vote',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-done-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile" // Ini akan merujuk ke app/(tabs)/profile.tsx
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}