import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

export default function TabLayout() {
  const { colors, isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: { fontWeight: '700', fontSize: 18 },
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          headerShown: false, // Hides the top "Dashboard" header
          tabBarIcon: ({ focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24}
              color={focused ? colors.primary : colors.textMuted} />
          ),
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: 'Expenses',
          tabBarIcon: ({ focused }) => (
            <Ionicons name={focused ? 'list' : 'list-outline'} size={24}
              color={focused ? colors.primary : colors.textMuted} />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ focused }) => (
            <Ionicons name={focused ? 'bar-chart' : 'bar-chart-outline'} size={24}
              color={focused ? colors.primary : colors.textMuted} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => (
            <Ionicons name={focused ? 'settings' : 'settings-outline'} size={24}
              color={focused ? colors.primary : colors.textMuted} />
          ),
        }}
      />
    </Tabs>
  );
}
