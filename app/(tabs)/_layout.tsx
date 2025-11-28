import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      {/* Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />

      {/* Explore */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="paperplane.fill" color={color} />
          ),
        }}
      />

      {/* Notificaciones */}
      <Tabs.Screen
        name="notificaciones/index"
        options={{
          title: 'Notificaciones',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="bell.badge.fill" color={color} />
          ),
        }}
      />

      {/* Historial de Accesos */}
      <Tabs.Screen
        name="historial-accesos/index"
        options={{
          title: 'Accesos',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="clock.arrow.circlepath" color={color} />
          ),
        }}
      />

      {/* Solicitudes de Acceso */}
      <Tabs.Screen
        name="solicitudes/index"
        options={{
          title: "Solicitudes",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="exclamationmark.bubble.fill" color={color} />
          )
        }}
      />



      {/* Historia Clínica */}
      <Tabs.Screen
        name="historia-clinica/index"
        options={{
          title: 'Historia Clínica',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="doc.text.magnifyingglass" color={color} />
          ),
        }}
      />
    </Tabs>


  );
}
