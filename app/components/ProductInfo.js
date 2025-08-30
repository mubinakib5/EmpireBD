"use client";
import { useState } from "react";
import { PortableText } from '@portabletext/react';

export default function ProductInfo({ product }) {
  const [openSections, setOpenSections] = useState({
    details: false,
    shipping: false,
    returns: false
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const sections = [
    {
      id: 'details',
      title: 'Product Details',
      content: (
        <div className="space-y-4">
          {product.description && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Description</h4>
              <div className="text-gray-600 prose prose-sm max-w-none">
                <PortableText value={product.description} />
              </div>
            </div>
          )}
          
          {product.productDetails && (
            <div className="space-y-3">
              {product.productDetails.material && (
                <div>
                  <span className="font-medium text-gray-900">Material: </span>
                  <span className="text-gray-600">{product.productDetails.material}</span>
                </div>
              )}
              {product.productDetails.care && (
                <div>
                  <span className="font-medium text-gray-900">Care: </span>
                  <span className="text-gray-600">{product.productDetails.care}</span>
                </div>
              )}
              {product.productDetails.origin && (
                <div>
                  <span className="font-medium text-gray-900">Origin: </span>
                  <span className="text-gray-600">{product.productDetails.origin}</span>
                </div>
              )}
              {product.productDetails.features && product.productDetails.features.length > 0 && (
                <div>
                  <span className="font-medium text-gray-900">Features:</span>
                  <ul className="list-disc list-inside text-gray-600 mt-1">
                    {product.productDetails.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )
    },
    {
      id: 'shipping',
      title: 'Shipping',
      content: (
        <div className="space-y-3">
          {product.shipping?.shippingTime && (
            <div>
              <span className="font-medium text-gray-900">Delivery Time: </span>
              <span className="text-gray-600">{product.shipping.shippingTime}</span>
            </div>
          )}
          <div>
            <span className="font-medium text-gray-900">Standard Shipping: </span>
            <span className="text-gray-600">5-7 business days</span>
          </div>
          <div>
            <span className="font-medium text-gray-900">Express Shipping: </span>
            <span className="text-gray-600">2-3 business days</span>
          </div>
        </div>
      )
    },
    {
      id: 'returns',
      title: 'Returns',
      content: (
        <div className="space-y-3">
          {product.shipping?.returnPolicy && (
            <p className="text-gray-600">{product.shipping.returnPolicy}</p>
          )}
          <div>
            <span className="font-medium text-gray-900">Return Window: </span>
            <span className="text-gray-600">30 days from delivery</span>
          </div>
          <div>
            <span className="font-medium text-gray-900">Return Shipping: </span>
            <span className="text-gray-600">Free returns on all orders</span>
          </div>
          <div>
            <span className="font-medium text-gray-900">Condition: </span>
            <span className="text-gray-600">Items must be unworn with tags attached</span>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="mt-10 border-t border-gray-200">
      <div className="divide-y divide-gray-200">
        {sections.map((section) => (
          <div key={section.id} className="py-6">
            <button
              onClick={() => toggleSection(section.id)}
              className="flex w-full items-center justify-between text-left"
            >
              <span className="text-lg font-medium text-gray-900">
                {section.title}
              </span>
              <span className="ml-6 flex items-center">
                <svg
                  className={`h-6 w-6 transform transition-transform duration-200 ${
                    openSections[section.id] ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </button>
            
            {openSections[section.id] && (
              <div className="mt-4 prose prose-sm max-w-none text-gray-600">
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}