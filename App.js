import React, { useState, useEffect } from 'react';
import { SafeAreaView, StatusBar, LogBox, Image } from 'react-native';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/contexts/AuthContext';
import { CartProvider } from './src/contexts/CartContext';

// Ignore specific warnings (only for development)
LogBox.ignoreLogs([
  'Reanimated 2',
  'AsyncStorage has been extracted',
  'Setting a timer',
]);

// Define custom theme
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#007BFF',
    accent: '#FF3B30',
    background: '#f5f5f5',
  },
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate splash screen
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView 
        style={{ 
          flex: 1, 
          backgroundColor: '#007BFF', 
          justifyContent: 'center', 
          alignItems: 'center' 
        }}
      >
        <Image
          source={require('./src/assets/images/logo.png')}
          style={{ width: 120, height: 120 }}
          resizeMode="contain"
        />
        <StatusBar barStyle="light-content" backgroundColor="#007BFF" />
      </SafeAreaView>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <CartProvider>
          
            <SafeAreaView style={{ flex: 1 }}>
              <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
              <AppNavigator />
            </SafeAreaView>
          
        </CartProvider>
      </AuthProvider>
    </PaperProvider>
  );
};

export default App;