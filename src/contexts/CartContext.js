// src/contexts/CartContext.js
import React, { createContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { getData, storeData, STORAGE_KEYS } from '../utils/asyncStorage';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart items from AsyncStorage on initial render
  useEffect(() => {
    const loadCartItems = async () => {
      try {
        setLoading(true);
        const savedCart = await getData(STORAGE_KEYS.CART_ITEMS);
        if (savedCart) {
          setCartItems(savedCart);
        }
      } catch (error) {
        console.error('Error loading cart items:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCartItems();
  }, []);

  // Add item to cart
  const addToCart = async (item, storeId, storeName) => {
    try {
      // Check if item is already in cart
      const existingItemIndex = cartItems.findIndex(
        (cartItem) => cartItem.id === item.id
      );
      
      let updatedCart = [];
      
      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        updatedCart = [...cartItems];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + 1,
        };
      } else {
        // Item doesn't exist, add it with quantity 1
        updatedCart = [...cartItems, { 
          ...item, 
          quantity: 1, 
          storeId, 
          storeName 
        }];
      }
      
      setCartItems(updatedCart);
      await storeData(STORAGE_KEYS.CART_ITEMS, updatedCart);
      
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Failed to add item to cart');
      return false;
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId, quantity) => {
    try {
      if (quantity < 1) {
        return removeFromCart(itemId);
      }
      
      const updatedCart = cartItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      
      setCartItems(updatedCart);
      await storeData(STORAGE_KEYS.CART_ITEMS, updatedCart);
      
      return true;
    } catch (error) {
      console.error('Error updating quantity:', error);
      Alert.alert('Error', 'Failed to update item quantity');
      return false;
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    try {
      const updatedCart = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedCart);
      await storeData(STORAGE_KEYS.CART_ITEMS, updatedCart);
      
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      Alert.alert('Error', 'Failed to remove item from cart');
      return false;
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      setCartItems([]);
      await storeData(STORAGE_KEYS.CART_ITEMS, []);
      
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      Alert.alert('Error', 'Failed to clear cart');
      return false;
    }
  };

  // Get cart total
  const getCartTotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  // Get total item count
  const getItemCount = () => {
    return cartItems.reduce(
      (count, item) => count + item.quantity,
      0
    );
  };

  // Check if a specific item is in the cart
  const isItemInCart = (itemId) => {
    return cartItems.some(item => item.id === itemId);
  };

  // Get the quantity of a specific item in the cart
  const getItemQuantity = (itemId) => {
    const item = cartItems.find(item => item.id === itemId);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
        getItemCount,
        isItemInCart,
        getItemQuantity
      }}
    >
      {children}
    </CartContext.Provider>
  );
};