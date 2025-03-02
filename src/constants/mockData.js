// Mock stores with location data for the map
export const STORES = [
    {
      id: '1',
      name: 'Tech Gadgets Store',
      description: 'The best place for all your tech needs',
      address: '123 Main St, Halifax, NS',
      image: 'https://example.com/store1.jpg',
      rating: 4.5,
      coordinate: {
        latitude: 44.6488,
        longitude: -63.5752,
      },
      items: [
        { id: '101', name: 'Smartphone X', price: 999.99, image: 'https://example.com/phone.jpg' },
        { id: '102', name: 'Laptop Pro', price: 1299.99, image: 'https://example.com/laptop.jpg' },
        { id: '103', name: 'Wireless Earbuds', price: 149.99, image: 'https://example.com/earbuds.jpg' },
      ]
    },
    {
      id: '2',
      name: 'Fashion Outlet',
      description: 'Trendy clothes for everyone',
      address: '456 Spring Garden Rd, Halifax, NS',
      image: 'https://example.com/store2.jpg',
      rating: 4.2,
      coordinate: {
        latitude: 44.6427,
        longitude: -63.5753,
      },
      items: [
        { id: '201', name: 'Denim Jacket', price: 79.99, image: 'https://example.com/jacket.jpg' },
        { id: '202', name: 'Casual Sneakers', price: 59.99, image: 'https://example.com/sneakers.jpg' },
        { id: '203', name: 'Summer Dress', price: 49.99, image: 'https://example.com/dress.jpg' },
      ]
    },
    {
      id: '3',
      name: 'Home Decor',
      description: 'Make your home beautiful',
      address: '789 Barrington St, Halifax, NS',
      image: 'https://example.com/store3.jpg',
      rating: 4.7,
      coordinate: {
        latitude: 44.6388,
        longitude: -63.5717,
      },
      items: [
        { id: '301', name: 'Table Lamp', price: 39.99, image: 'https://example.com/lamp.jpg' },
        { id: '302', name: 'Area Rug', price: 89.99, image: 'https://example.com/rug.jpg' },
        { id: '303', name: 'Throw Pillows Set', price: 29.99, image: 'https://example.com/pillows.jpg' },
      ]
    },
    {
      id: '4',
      name: 'Grocery Market',
      description: 'Fresh produce and local goods',
      address: '101 Quinpool Rd, Halifax, NS',
      image: 'https://example.com/store4.jpg',
      rating: 4.3,
      coordinate: {
        latitude: 44.6505,
        longitude: -63.5908,
      },
      items: [
        { id: '401', name: 'Organic Fruit Basket', price: 24.99, image: 'https://example.com/fruit.jpg' },
        { id: '402', name: 'Artisan Bread', price: 5.99, image: 'https://example.com/bread.jpg' },
        { id: '403', name: 'Local Cheese Selection', price: 18.99, image: 'https://example.com/cheese.jpg' },
      ]
    },
    {
      id: '5',
      name: 'Sports Gear',
      description: 'Equipment for all your athletic needs',
      address: '222 Robie St, Halifax, NS',
      image: 'https://example.com/store5.jpg',
      rating: 4.4,
      coordinate: {
        latitude: 44.6540,
        longitude: -63.5830,
      },
      items: [
        { id: '501', name: 'Running Shoes', price: 119.99, image: 'https://example.com/runshoes.jpg' },
        { id: '502', name: 'Yoga Mat', price: 29.99, image: 'https://example.com/yogamat.jpg' },
        { id: '503', name: 'Basketball', price: 24.99, image: 'https://example.com/basketball.jpg' },
      ]
    }
  ];
  
  // Category data
  export const CATEGORIES = [
    { id: '1', name: 'Electronics', icon: 'laptop' },
    { id: '2', name: 'Fashion', icon: 'shirt' },
    { id: '3', name: 'Home', icon: 'home' },
    { id: '4', name: 'Grocery', icon: 'shopping-cart' },
    { id: '5', name: 'Sports', icon: 'basketball' },
  ];
  
  // Sample orders for profile screen
  export const ORDERS = [
    { 
      id: 'ORD-001', 
      date: '2023-11-15', 
      storeId: '1', 
      storeName: 'Tech Gadgets Store',
      items: [
        { id: '101', name: 'Smartphone X', price: 999.99, quantity: 1 },
      ],
      total: 999.99,
      status: 'Delivered'
    },
    { 
      id: 'ORD-002', 
      date: '2023-11-05', 
      storeId: '3', 
      storeName: 'Home Decor',
      items: [
        { id: '301', name: 'Table Lamp', price: 39.99, quantity: 2 },
        { id: '302', name: 'Area Rug', price: 89.99, quantity: 1 },
      ],
      total: 169.97,
      status: 'Delivered'
    },
    { 
      id: 'ORD-003', 
      date: '2023-11-20', 
      storeId: '5', 
      storeName: 'Sports Gear',
      items: [
        { id: '502', name: 'Yoga Mat', price: 29.99, quantity: 1 },
      ],
      total: 29.99,
      status: 'Processing'
    }
  ];
  
  // Sample payments for profile screen
  export const PAYMENTS = [
    { id: 'PAY-001', date: '2023-11-15', amount: 999.99, method: 'Credit Card', status: 'Success' },
    { id: 'PAY-002', date: '2023-11-05', amount: 169.97, method: 'PayPal', status: 'Success' },
    { id: 'PAY-003', date: '2023-11-20', amount: 29.99, method: 'Credit Card', status: 'Pending' },
  ];