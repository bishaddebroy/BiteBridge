import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import auth context
import { AuthContext } from '../contexts/AuthContext';

// Auth screens
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';

// Main screens
import HomeScreen from '../screens/Home/HomeScreen';
import SearchScreen from '../screens/Home/SearchScreen'; // Added SearchScreen
import StoreDetailScreen from '../screens/Home/StoreDetailScreen';
import MapScreen from '../screens/Map/MapScreen';
import OrderScreen from '../screens/Payment/OrderScreen';
import PaymentSuccessScreen from '../screens/Payment/PaymentSuccessScreen';
import PaymentFailedScreen from '../screens/Payment/PaymentFailedScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import CameraScreen from '../screens/Profile/CameraScreen';
import OrdersScreen from '../screens/Profile/OrdersScreen';
import PaymentsScreen from '../screens/Profile/PaymentsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth navigator
const AuthNavigator = () => {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        cardStyle: { backgroundColor: 'white' }
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};

// Home stack navigator
const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HomeMain" 
        component={HomeScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Search" 
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="StoreDetail" 
        component={StoreDetailScreen}
        options={({ route }) => ({ title: route.params?.storeName || 'Store' })}
      />
    </Stack.Navigator>
  );
};

// Map stack navigator
const MapStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MapMain" 
        component={MapScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="StoreDetail" 
        component={StoreDetailScreen}
        options={({ route }) => ({ title: route.params?.storeName || 'Store' })}
      />
    </Stack.Navigator>
  );
};

// Payment stack navigator
const PaymentStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Order" 
        component={OrderScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="PaymentSuccess" 
        component={PaymentSuccessScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="PaymentFailed" 
        component={PaymentFailedScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  ); 
};

// Profile stack navigator
const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ProfileMain" 
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Camera" component={CameraScreen} />
      <Stack.Screen name="Orders" component={OrdersScreen} />
      <Stack.Screen name="Payments" component={PaymentsScreen} />
    </Stack.Navigator>
  ); 
};

// Main tab navigator
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Payment') {
            iconName = focused ? 'card' : 'card-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007BFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Map" component={MapStack} />
      <Tab.Screen name="Payment" component={PaymentStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};

// Main navigator
const AppNavigator = () => {
  const { user } = useContext(AuthContext);
  
  return (
    <NavigationContainer>
      {user ? <TabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;