// Mock restaurants with location data for the map
export const STORES = [
  {
    id: '1',
    name: 'Taste of Italy',
    description: 'Authentic Italian cuisine with homemade pasta and wood-fired pizza',
    address: '123 Main St, Halifax, NS',
    image: 'https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg',
    rating: 4.7,
    coordinate: {
      latitude: 44.6488,
      longitude: -63.5752,
    },
    items: [
      { id: '101', name: 'Margherita Pizza', price: 14.99, image: 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { id: '102', name: 'Spaghetti Carbonara', price: 16.99, image: 'https://images.pexels.com/photos/1049626/pexels-photo-1049626.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { id: '103', name: 'Tiramisu', price: 7.99, image: 'https://images.pexels.com/photos/30869364/pexels-photo-30869364/free-photo-of-elegant-coffee-and-cake-dessert-arrangement.jpeg' },
    ]
  },
  {
    id: '2',
    name: 'Spice Garden',
    description: 'Flavorful Indian cuisine with a wide range of vegetarian options',
    address: '456 Spring Garden Rd, Halifax, NS',
    image: 'https://images.pexels.com/photos/8818723/pexels-photo-8818723.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.5,
    coordinate: {
      latitude: 44.6427,
      longitude: -63.5753,
    },
    items: [
      { id: '201', name: 'Butter Chicken', price: 17.99, image: 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { id: '202', name: 'Vegetable Biryani', price: 15.99, image: 'https://images.pexels.com/photos/1049626/pexels-photo-1049626.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { id: '203', name: 'Garlic Naan', price: 3.99, image: 'https://images.pexels.com/photos/30869364/pexels-photo-30869364/free-photo-of-elegant-coffee-and-cake-dessert-arrangement.jpeg' },
    ]
  },
  {
    id: '3',
    name: 'Sushi Wave',
    description: 'Fresh and creative Japanese sushi and sashimi',
    address: '789 Barrington St, Halifax, NS',
    image: 'https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg',
    rating: 4.8,
    coordinate: {
      latitude: 44.6388,
      longitude: -63.5717,
    },
    items: [
      { id: '301', name: 'Dragon Roll', price: 12.99, image: 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { id: '302', name: 'Salmon Sashimi', price: 15.99, image: 'https://images.pexels.com/photos/1049626/pexels-photo-1049626.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { id: '303', name: 'Miso Soup', price: 4.99, image: 'https://images.pexels.com/photos/30869364/pexels-photo-30869364/free-photo-of-elegant-coffee-and-cake-dessert-arrangement.jpeg' },
    ]
  },
  {
    id: '4',
    name: 'Burger Joint',
    description: 'Gourmet burgers with fresh local ingredients',
    address: '101 Quinpool Rd, Halifax, NS',
    image: 'https://images.pexels.com/photos/8818723/pexels-photo-8818723.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.3,
    coordinate: {
      latitude: 44.6505,
      longitude: -63.5908,
    },
    items: [
      { id: '401', name: 'Classic Cheeseburger', price: 13.99, image: 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { id: '402', name: 'Truffle Fries', price: 6.99, image: 'https://images.pexels.com/photos/1049626/pexels-photo-1049626.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { id: '403', name: 'Chocolate Milkshake', price: 5.99, image: 'https://images.pexels.com/photos/30869364/pexels-photo-30869364/free-photo-of-elegant-coffee-and-cake-dessert-arrangement.jpeg' },
    ]
  },
  {
    id: '5',
    name: 'Taco Fiesta',
    description: 'Authentic Mexican tacos and burritos',
    address: '222 Robie St, Halifax, NS',
    image: 'https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg',
    rating: 4.6,
    coordinate: {
      latitude: 44.6540,
      longitude: -63.5830,
    },
    items: [
      { id: '501', name: 'Street Tacos (3)', price: 11.99, image: 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { id: '502', name: 'Chicken Burrito', price: 12.99, image: 'https://images.pexels.com/photos/1049626/pexels-photo-1049626.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { id: '503', name: 'Guacamole & Chips', price: 7.99, image: 'https://images.pexels.com/photos/30869364/pexels-photo-30869364/free-photo-of-elegant-coffee-and-cake-dessert-arrangement.jpeg' },
    ]
  }
];

// Food category data with correct icon names
export const CATEGORIES = [
  { id: '1', name: 'Pizza', icon: 'pizza-outline' },
  { id: '2', name: 'Burgers', icon: 'fast-food-outline' },
  { id: '3', name: 'Sushi', icon: 'restaurant-outline' },
  { id: '4', name: 'Drinks', icon: 'cafe-outline' },
  { id: '5', name: 'Desserts', icon: 'ice-cream-outline' },
];

// Sample orders for profile screen
export const ORDERS = [
  { 
    id: 'ORD-001', 
    date: '2023-11-15', 
    storeId: '1', 
    storeName: 'Taste of Italy',
    items: [
      { id: '101', name: 'Margherita Pizza', price: 14.99, quantity: 1 },
      { id: '103', name: 'Tiramisu', price: 7.99, quantity: 1 },
    ],
    total: 22.98,
    status: 'Delivered'
  },
  { 
    id: 'ORD-002', 
    date: '2023-11-05', 
    storeId: '3', 
    storeName: 'Sushi Wave',
    items: [
      { id: '301', name: 'Dragon Roll', price: 12.99, quantity: 2 },
      { id: '303', name: 'Miso Soup', price: 4.99, quantity: 1 },
    ],
    total: 30.97,
    status: 'Delivered'
  },
  { 
    id: 'ORD-003', 
    date: '2023-11-20', 
    storeId: '5', 
    storeName: 'Taco Fiesta',
    items: [
      { id: '501', name: 'Street Tacos (3)', price: 11.99, quantity: 1 },
      { id: '503', name: 'Guacamole & Chips', price: 7.99, quantity: 1 },
    ],
    total: 19.98,
    status: 'Processing'
  }
];

// Sample payments for profile screen
export const PAYMENTS = [
  { id: 'PAY-001', date: '2023-11-15', amount: 22.98, method: 'Credit Card', status: 'Success' },
  { id: 'PAY-002', date: '2023-11-05', amount: 30.97, method: 'PayPal', status: 'Success' },
  { id: 'PAY-003', date: '2023-11-20', amount: 19.98, method: 'Credit Card', status: 'Pending' },
];