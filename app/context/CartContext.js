'use client'

import { createContext, useContext, useReducer, useEffect } from 'react'
import { toast } from 'react-hot-toast'

const CartContext = createContext()

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload,
        isLoaded: true
      }
    
    case 'ADD_TO_CART':
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id && item.size === action.payload.size
      )
      
      if (existingItemIndex > -1) {
        const updatedItems = [...state.items]
        updatedItems[existingItemIndex].quantity += action.payload.quantity
        return {
          ...state,
          items: updatedItems
        }
      } else {
        return {
          ...state,
          items: [...state.items, action.payload]
        }
      }
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(
          item => !(item.id === action.payload.id && item.size === action.payload.size)
        )
      }
    
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id && item.size === action.payload.size
            ? { ...item, quantity: action.payload.quantity }
            : item
        ).filter(item => item.quantity > 0)
      }
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      }
    
    default:
      return state
  }
}

const initialState = {
  items: [],
  isLoaded: false
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: parsedCart })
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
        dispatch({ type: 'LOAD_CART', payload: [] })
      }
    } else {
      dispatch({ type: 'LOAD_CART', payload: [] })
    }
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (state.isLoaded) {
      localStorage.setItem('cart', JSON.stringify(state.items))
    }
  }, [state.items, state.isLoaded])

  const addToCart = (product, quantity = 1, size = null) => {
    const cartItem = {
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || product.image,
      slug: product.slug?.current || product.slug,
      quantity,
      size,
      addedAt: new Date().toISOString()
    }
    
    dispatch({ type: 'ADD_TO_CART', payload: cartItem })
    
    // Show toast notification
    toast.success(`${product.name} added to cart!`, {
      duration: 3000,
      position: 'top-right',
    })
  }

  const removeFromCart = (id, size = null) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { id, size } })
  }

  const updateQuantity = (id, quantity, size = null) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity, size } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getCartItemsCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0)
  }

  const isInCart = (id, size = null) => {
    return state.items.some(item => item.id === id && item.size === size)
  }

  const getCartItem = (id, size = null) => {
    return state.items.find(item => item.id === id && item.size === size)
  }

  const value = {
    items: state.items,
    isLoaded: state.isLoaded,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    isInCart,
    getCartItem
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}