/**
 * API Service for external API integrations
 */

export interface ShiojaProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  category: string;
  description?: string;
}

/**
 * Fetches product details from the Shioja API
 */
export const fetchShiojaProducts = async (): Promise<ShiojaProduct[]> => {
  try {
    // Using a mock response since the API is not available
    return [
      {
        id: "p1",
        name: "Premium Wireless Earbuds",
        price: 149.99,
        image:
          "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=300&q=80",
        rating: 4.7,
        category: "Electronics",
        description:
          "High-quality sound with active noise cancellation and long battery life.",
      },
      {
        id: "p2",
        name: "Smart Watch Series 5",
        price: 299.99,
        image:
          "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=300&q=80",
        rating: 4.8,
        category: "Wearables",
        description:
          "Track your fitness, monitor your health, and stay connected with this premium smartwatch.",
      },
      {
        id: "p3",
        name: "Artisan Coffee Gift Set",
        price: 59.99,
        image:
          "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&q=80",
        rating: 4.5,
        category: "Food & Drink",
        description:
          "A curated selection of premium coffee beans from around the world.",
      },
      {
        id: "p4",
        name: "Luxury Scented Candle Collection",
        price: 79.99,
        image:
          "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=300&q=80",
        rating: 4.6,
        category: "Home",
        description:
          "Set of 4 premium scented candles with natural ingredients and long burn time.",
      },
      {
        id: "p5",
        name: "Portable Bluetooth Speaker",
        price: 129.99,
        image:
          "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&q=80",
        rating: 4.4,
        category: "Electronics",
        description:
          "Waterproof speaker with 360° sound and 20-hour battery life.",
      },
      {
        id: "p6",
        name: "Leather Journal Set",
        price: 45.99,
        image:
          "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&q=80",
        rating: 4.7,
        category: "Stationery",
        description:
          "Handcrafted leather journal with premium paper and matching pen.",
      },
      {
        id: "p7",
        name: "Gourmet Chocolate Box",
        price: 39.99,
        image:
          "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=300&q=80",
        rating: 4.9,
        category: "Food & Drink",
        description:
          "Assortment of premium chocolates from artisan chocolatiers.",
      },
      {
        id: "p8",
        name: "Yoga Mat Premium",
        price: 89.99,
        image:
          "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=300&q=80",
        rating: 4.6,
        category: "Fitness",
        description:
          "Eco-friendly, non-slip yoga mat with perfect cushioning for all types of yoga.",
      },
    ];
  } catch (error) {
    console.error("Error with mock products:", error);
    throw error;
  }
};
