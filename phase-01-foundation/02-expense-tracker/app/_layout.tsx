import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

function AppContent() {
  const { colors, isDark } = useTheme();
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={colors.background} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: { fontWeight: '700', fontSize: 18 },
          contentStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="add-expense"
          options={{
            title: 'Add Expense',
            presentation: 'modal',
            headerStyle: { backgroundColor: colors.surface },
          }}
        />
        <Stack.Screen
          name="edit-expense"
          options={{
            title: 'Edit Expense',
            presentation: 'modal',
            headerStyle: { backgroundColor: colors.surface },
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
