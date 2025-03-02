import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  FlatList 
} from 'react-native';
import { Searchbar, Card, Title, Paragraph, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { STORES, CATEGORIES } from '../../constants/mockData';
import { AuthContext } from '../../contexts/AuthContext';

const HomeScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  
  const filteredStores = STORES.filter(store => {
    // Filter based on search query
    if (searchQuery) {
      return store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             store.description.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const handleSearch = () => {
    navigation.navigate('Search', { query: searchQuery });
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        activeCategory === item.id && styles.activeCategoryItem
      ]}
      onPress={() => setActiveCategory(activeCategory === item.id ? null : item.id)}
    >
      <Ionicons name={item.icon} size={24} color={activeCategory === item.id ? "#FFF" : "#007BFF"} />
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
            <Text style={styles.address}>{item.address}</Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>
            Hello, {user?.name || 'User'}
          </Text>
          <Text style={styles.subtitleText}>
            Find your favorite stores
          </Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search stores"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.filterButton} onPress={() => navigation.navigate('Filter')}>
          <Ionicons name="options-outline" size={24} color="#007BFF" />
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

      <Text style={styles.sectionTitle}>Popular Stores</Text>

      <FlatList
        data={filteredStores}
        renderItem={renderStoreItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.storeList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007BFF',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  welcomeContainer: {
    flex: 1,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
    paddingHorizontal: 20,
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
  address: {
    fontSize: 12,
    color: '#666',
  },
});

export default HomeScreen;