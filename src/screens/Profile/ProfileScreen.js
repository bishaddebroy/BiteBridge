import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Button, Divider, List } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../contexts/AuthContext';
import { signOutUser } from '../../services/authService';
import { clearAllData } from '../../utils/asyncStorage';

const ProfileScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [timestamp, setTimestamp] = useState(new Date().getTime());

  // Update timestamp when the screen gains focus - ensures fresh image on navigation
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setTimestamp(new Date().getTime());
    });

    return unsubscribe;
  }, [navigation]);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await signOutUser();
      await clearAllData();
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCameraNavigation = () => {
    navigation.navigate('Camera');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <TouchableOpacity 
          style={styles.profileImageContainer}
          onPress={handleCameraNavigation}
        >
          {user?.photoURL ? (
            <Image 
              source={{ 
                uri: `${user.photoURL}?time=${timestamp}`,
                cache: 'reload'
              }} 
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profilePlaceholder}>
              <Ionicons name="person" size={60} color="#CCCCCC" />
            </View>
          )}
          <View style={styles.cameraButton}>
            <Ionicons name="camera" size={20} color="white" />
          </View>
        </TouchableOpacity>
        
        <Text style={styles.username}>{user?.name || 'User'}</Text>
        <Text style={styles.email}>{user?.email || ''}</Text>
      </View>
      
      <View style={styles.sectionContainer}>
        <List.Section>
          <List.Subheader>Account</List.Subheader>
          
          <List.Item
            title="Edit Profile"
            left={props => <List.Icon {...props} icon="account-edit" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('Coming Soon', 'This feature is not available yet.')}
          />
          
          <Divider />
          
          <List.Item
            title="My Orders"
            left={props => <List.Icon {...props} icon="package" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('Orders')}
          />
          
          <Divider />
          
          <List.Item
            title="Payment History"
            left={props => <List.Icon {...props} icon="credit-card" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('Payments')}
          />
          
          <Divider />
          
          <List.Item
            title="Addresses"
            left={props => <List.Icon {...props} icon="map-marker" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('Coming Soon', 'This feature is not available yet.')}
          />
        </List.Section>
      </View>
      
      <View style={styles.sectionContainer}>
        <List.Section>
          <List.Subheader>Settings</List.Subheader>
          
          <List.Item
            title="Notifications"
            left={props => <List.Icon {...props} icon="bell" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('Coming Soon', 'This feature is not available yet.')}
          />
          
          <Divider />
          
          <List.Item
            title="Privacy & Security"
            left={props => <List.Icon {...props} icon="shield" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('Coming Soon', 'This feature is not available yet.')}
          />
          
          <Divider />
          
          <List.Item
            title="Help & Support"
            left={props => <List.Icon {...props} icon="help-circle" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('Coming Soon', 'This feature is not available yet.')}
          />
        </List.Section>
      </View>
      
      <View style={styles.logoutContainer}>
        <Button 
          mode="outlined" 
          color="#FF3B30"
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={loading}
        >
          {loading ? <ActivityIndicator size="small" color="#FF3B30" /> : 'Logout'}
        </Button>
      </View>
      
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: 'white',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profilePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EEEEEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007BFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#555',
  },
  sectionContainer: {
    backgroundColor: 'white',
    marginTop: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  logoutContainer: {
    padding: 16,
    marginTop: 16,
  },
  logoutButton: {
    borderColor: '#FF3B30',
    borderWidth: 1,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  versionText: {
    color: '#888',
    fontSize: 12,
  },
});

export default ProfileScreen;