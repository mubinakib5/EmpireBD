"use client";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useMetaPixel } from "../context/MetaPixelContext";

export default function AddToCart({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();
  const { trackAddToCart } = useMetaPixel();
  const isOutOfStock = product?.outOfStock === true;

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    try {
      // Add item to cart using the cart context
      addToCart(product, quantity);
      
      // Track Meta Pixel AddToCart event
      if (product) {
        trackAddToCart(
          product._id || product.slug?.current,
          product.name,
          product.price * quantity,
          'USD'
        );
      }
      
      // Simulate a brief loading state for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Added to cart:', { product, quantity });
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  return (
    <div className="mt-10">
      {/* Quantity Selector */}
      <div className={`flex items-center space-x-4 mb-6 ${isOutOfStock ? 'opacity-50' : ''}`}>
        <label htmlFor="quantity" className="text-sm font-medium text-gray-900">
          Quantity
        </label>
        <div className="flex items-center border border-gray-300 rounded-md">
          <button
            type="button"
            onClick={decrementQuantity}
            className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
            disabled={quantity <= 1 || isOutOfStock}
          >
            <span className="sr-only">Decrease quantity</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            disabled={isOutOfStock}
            className="w-16 text-center border-0 py-2 text-gray-900 focus:ring-0 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            type="button"
            onClick={incrementQuantity}
            className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
            disabled={isOutOfStock}
          >
            <span className="sr-only">Increase quantity</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isAdding || isOutOfStock}
        className={`w-full border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
          isOutOfStock 
            ? 'bg-gray-400 text-white cursor-not-allowed' 
            : 'bg-primary text-white hover:bg-gray-800 focus:ring-primary'
        }`}
      >
        {isOutOfStock ? (
          'Out of Stock'
        ) : isAdding ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Adding to Cart...
          </>
        ) : (
          'Add to Cart'
        )}
      </button>

      {/* Wishlist Button */}
      <button
        type="button"
        className="w-full mt-4 bg-white border border-gray-300 rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        Add to Wishlist
      </button>


    </div>
  );
}