// src/screens/Home/HomeScreen.js
import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Searchbar, Card, Title, Paragraph, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { STORES, CATEGORIES } from '../../constants/mockData';
import { AuthContext } from '../../contexts/AuthContext';
import { getUserLocation } from '../../services/locationService';
import { calculateDistance, formatDistance } from '../../services/geocodingService';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [sortBy, setSortBy] = useState('distance'); // 'distance', 'rating'
  const [userLocation, setUserLocation] = useState(null);
  const [storesWithDistances, setStoresWithDistances] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Load user location and calculate distances
  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        try {
          setLoading(true);
          
          // Get user location
          const location = await getUserLocation();
          if (location) {
            setUserLocation(location);
            
            // Calculate distance for each store
            const storesWithDist = STORES.map(store => {
              const distance = calculateDistance(
                location.latitude,
                location.longitude,
                store.coordinate.latitude,
                store.coordinate.longitude
              );
              
              return {
                ...store,
                distance,
                formattedDistance: formatDistance(distance)
              };
            });
            
            // Sort stores by distance
            const sortedStores = [...storesWithDist].sort((a, b) => a.distance - b.distance);
            
            setStoresWithDistances(sortedStores);
            applyFilters(sortedStores, activeCategory, searchQuery, sortBy);
          } else {
            setStoresWithDistances(STORES);
            applyFilters(STORES, activeCategory, searchQuery, sortBy);
          }
        } catch (error) {
          console.error('Error loading data:', error);
          setStoresWithDistances(STORES);
          applyFilters(STORES, activeCategory, searchQuery, sortBy);
        } finally {
          setLoading(false);
        }
      };
      
      loadData();
    }, [])
  );
  
  // Apply filters when category, search, or sort changes
  useEffect(() => {
    applyFilters(storesWithDistances, activeCategory, searchQuery, sortBy);
  }, [activeCategory, searchQuery, sortBy, storesWithDistances]);
  
  // Apply all filters to stores
  const applyFilters = (stores, category, query, sort) => {
    let filtered = [...stores];
    
    // Filter by category
    if (category) {
      const categoryObj = CATEGORIES.find(c => c.id === category);
      const categoryName = categoryObj ? categoryObj.name.toLowerCase() : '';
      
      filtered = filtered.filter(store => {
        // For demo purposes, we'll just check if store name or description
        // contains the category name (since we don't have category data)
        return store.name.toLowerCase().includes(categoryName) || 
               store.description.toLowerCase().includes(categoryName) ||
               // Check menu items
               store.items.some(item => 
                 item.name.toLowerCase().includes(categoryName)
               );
      });
    }
    
    // Filter by search query
    if (query) {
      filtered = filtered.filter(store => {
        // Search in store name and description
        const matchesStore = store.name.toLowerCase().includes(query.toLowerCase()) ||
                            store.description.toLowerCase().includes(query.toLowerCase());
        
        // Search in menu items
        const matchesMenu = store.items.some(item => 
          item.name.toLowerCase().includes(query.toLowerCase())
        );
        
        return matchesStore || matchesMenu;
      });
    }
    
    // Apply sorting
    if (sort === 'distance') {
      filtered.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
    } else if (sort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }
    
    setFilteredStores(filtered);
  };

  const toggleSortBy = () => {
    setSortBy(sortBy === 'distance' ? 'rating' : 'distance');
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      navigation.navigate('Search', { query: searchQuery });
    }
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        activeCategory === item.id && styles.activeCategoryItem
      ]}
      onPress={() => setActiveCategory(activeCategory === item.id ? null : item.id)}
    >
      <Ionicons 
        name={item.icon} 
        size={24} 
        color={activeCategory === item.id ? "#FFF" : "#007BFF"} 
      />
      <Text style={[
        styles.categoryText,
        activeCategory === item.id && styles.activeCategoryText
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
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
          <Text style={styles.address}>{item.address}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Blue top section */}
      <View style={styles.topSection}>
        <Text style={styles.welcomeText}>
          Hello! Food Lover, {user?.name}
        </Text>
        <Text style={styles.subtitleText}>
          Find delicious food nearby
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search restaurants"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.filterButton} onPress={toggleSortBy}>
          <Ionicons 
            name={sortBy === 'distance' ? "star-outline" : "locate-outline"} 
            size={24} 
            color="#007BFF" 
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.categoryContainer}>
        <FlatList
          data={CATEGORIES}
          renderItem={renderCategoryItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View style={styles.resultsHeader}>
        <Text style={styles.sectionTitle}>
          {activeCategory 
            ? CATEGORIES.find(c => c.id === activeCategory)?.name + ' Restaurants' 
            : 'Popular Restaurants'
          }
        </Text>
        <Chip mode="outlined" style={styles.sortChip} onPress={toggleSortBy}>
          {sortBy === 'distance' ? 'By Rating' : 'By Distance'}
        </Chip>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={styles.loadingText}>Finding restaurants near you...</Text>
        </View>
      ) : filteredStores.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="restaurant-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No restaurants found</Text>
          <Text style={styles.emptySubtext}>
            Try a different category or search term
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredStores}
          renderItem={renderStoreItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.storeList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  topSection: {
    backgroundColor: '#007BFF',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 5,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitleText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  searchbar: {
    flex: 1,
    elevation: 1,
    borderRadius: 10,
  },
  filterButton: {
    marginLeft: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 48,
    elevation: 1,
  },
  categoryContainer: {
    marginTop: 20,
    paddingLeft: 20,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
  },
  activeCategoryItem: {
    backgroundColor: '#007BFF',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
    color: '#333',
  },
  activeCategoryText: {
    color: 'white',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sortChip: {
    height: 39,
    backgroundColor: 'white',
  },
  storeList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  address: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

export default HomeScreen;