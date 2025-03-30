// src/screens/Home/SearchScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { Searchbar, Chip, Card, Title, Paragraph } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { STORES, CATEGORIES } from '../../constants/mockData';
import { getUserLocation } from '../../services/locationService';
import { calculateDistance, formatDistance } from '../../services/geocodingService';

const SearchScreen = ({ route, navigation }) => {
  const { query } = route.params || { query: '' };
  const [searchQuery, setSearchQuery] = useState(query);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Load user's location
  useEffect(() => {
    const getLocation = async () => {
      const location = await getUserLocation();
      if (location) {
        setUserLocation(location);
      }
    };
    
    getLocation();
  }, []);
  
  // Perform search when query changes
  useEffect(() => {
    handleSearch();
  }, [searchQuery, selectedCategory, userLocation]);
  
  const handleSearch = () => {
    setLoading(true);
    
    // Simulate API search delay
    setTimeout(() => {
      let filtered = [...STORES];
      
      // Filter by search query
      if (searchQuery) {
        filtered = filtered.filter(store => {
          // Search store name and description
          const matchesStore = store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            store.description.toLowerCase().includes(searchQuery.toLowerCase());
          
          // Search in menu items
          const matchesMenu = store.items.some(item => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
          
          return matchesStore || matchesMenu;
        });
      }
      
      // Filter by category
      if (selectedCategory) {
        // In a real app, would check store.categories.includes(selectedCategory)
        // For demo, just simple filtering:
        filtered = filtered.filter(store => {
          // For demo, let's match category based on store description or name
          const categoryObj = CATEGORIES.find(c => c.id === selectedCategory);
          const categoryName = categoryObj ? categoryObj.name.toLowerCase() : '';
          
          return store.name.toLowerCase().includes(categoryName) || 
                 store.description.toLowerCase().includes(categoryName);
        });
      }
      
      // Add distance if user location available
      if (userLocation) {
        filtered = filtered.map(store => {
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            store.coordinate.latitude,
            store.coordinate.longitude
          );
          
          return {
            ...store,
            distance,
            formattedDistance: formatDistance(distance)
          };
        });
        
        // Sort by distance
        filtered.sort((a, b) => a.distance - b.distance);
      }
      
      setResults(filtered);
      setLoading(false);
    }, 500);
  };
  
  const handleGoBack = () => {
    navigation.goBack();
  };
  
  const handleCategoryPress = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };
  
  const renderCategoryItem = ({ item }) => (
    <Chip
      selected={selectedCategory === item.id}
      onPress={() => handleCategoryPress(item.id)}
      style={styles.categoryChip}
    >
      {item.name}
    </Chip>
  );
  
  const renderStoreItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('StoreDetail', { storeId: item.id, storeName: item.name })}
    >
      <Card style={styles.storeCard}>
        <Card.Cover source={{ uri: item.image }} style={styles.storeImage} />
        <Card.Content>
          <Title>{item.name}</Title>
          <Paragraph numberOfLines={2}>{item.description}</Paragraph>
          <View style={styles.storeDetails}>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.rating}>{item.rating}</Text>
            </View>
            
            {item.formattedDistance && (
              <View style={styles.distanceContainer}>
                <Ionicons name="location" size={16} color="#007BFF" />
                <Text style={styles.distance}>{item.formattedDistance}</Text>
              </View>
            )}
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color="#007BFF" />
        </TouchableOpacity>
        
        <Searchbar
          placeholder="Search restaurants or dishes"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          autoFocus={true}
        />
      </View>
      
      <View style={styles.categoriesContainer}>
        <FlatList
          data={CATEGORIES}
          renderItem={renderCategoryItem}
          keyExtractor={item => item.id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      ) : results.length > 0 ? (
        <FlatList
          data={results}
          renderItem={renderStoreItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.resultsList}
        />
      ) : (
        <View style={styles.centered}>
          <Ionicons name="search" size={64} color="#ccc" />
          <Text style={styles.noResultsText}>No results found</Text>
          <Text style={styles.noResultsSubtext}>Try different search terms or categories</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 10,
    backgroundColor: 'white',
  },
  backButton: {
    marginRight: 16,
  },
  searchbar: {
    flex: 1,
    elevation: 0,
  },
  categoriesContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryChip: {
    marginRight: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  noResultsText: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: 'bold',
  },
  noResultsSubtext: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  resultsList: {
    padding: 16,
  },
  storeCard: {
    marginBottom: 16,
    borderRadius: 10,
    elevation: 2,
  },
  storeImage: {
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  storeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontWeight: 'bold',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distance: {
    fontSize: 14,
    color: '#007BFF',
    fontWeight: 'bold',
    marginLeft: 4,
  },
});

export default SearchScreen;