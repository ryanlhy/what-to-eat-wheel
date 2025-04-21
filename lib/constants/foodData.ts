import { FoodItem, WheelSection } from '@/types/food'

export const FOOD_SECTIONS: WheelSection[] = [
  {
    category: 'hawker',
    label: 'Hawker Favorites',
    color: 'bg-hawker',
    items: [
      {
        id: 'h1',
        name: 'Hainanese Chicken Rice',
        category: 'hawker',
        description: 'Tender poached chicken served with fragrant rice and chili sauce',
        healthRating: 3,
        culturalInfo: 'A national dish of Singapore, influenced by Hainanese immigrants',
        locations: ['Tian Tian Chicken Rice', 'Maxwell Food Centre']
      },
      {
        id: 'h2',
        name: 'Laksa',
        category: 'hawker',
        description: 'Spicy coconut curry noodle soup with seafood',
        healthRating: 2,
        culturalInfo: 'Peranakan dish with Chinese and Malay influences',
        locations: ['328 Katong Laksa', 'Sungei Road Laksa']
      },
      {
        id: 'h3',
        name: 'Char Kway Teow',
        category: 'hawker',
        description: 'Stir-fried rice noodles with seafood and bean sprouts',
        healthRating: 2,
        culturalInfo: 'A popular street food dish with Chinese origins',
        locations: ['Outram Park Fried Kway Teow', 'Hill Street Fried Kway Teow']
      }
    ]
  },
  {
    category: 'healthy',
    label: 'Healthy Options',
    color: 'bg-healthy',
    items: [
      {
        id: 'ht1',
        name: 'Buddha Bowl',
        category: 'healthy',
        description: 'Nutritious bowl with quinoa, vegetables, and protein',
        healthRating: 5,
        locations: ['The Daily Cut', 'Project Acai']
      },
      {
        id: 'ht2',
        name: 'Poke Bowl',
        category: 'healthy',
        description: 'Fresh fish and vegetables in a bowl',
        healthRating: 4,
        locations: ['Poke Theory', 'Fish Bowl']
      },
      {
        id: 'ht3',
        name: 'Grain Bowl',
        category: 'healthy',
        description: 'Mixed grains with roasted vegetables and lean protein',
        healthRating: 5,
        locations: ['Grain Traders', 'The Daily Bowl']
      }
    ]
  },
  {
    category: 'quick',
    label: 'Quick Meals',
    color: 'bg-quick',
    items: [
      {
        id: 'q1',
        name: 'Ban Mian',
        category: 'quick',
        description: 'Handmade noodles in soup with minced meat',
        healthRating: 3,
        locations: ['Noodle Story', 'Ban Mian Express']
      },
      {
        id: 'q2',
        name: 'Yong Tau Foo',
        category: 'quick',
        description: 'Assorted vegetables and tofu in soup',
        healthRating: 4,
        locations: ['Yong Tau Foo Express', 'Food Republic']
      },
      {
        id: 'q3',
        name: 'Mixed Rice',
        category: 'quick',
        description: 'Rice with various Chinese dishes',
        healthRating: 3,
        locations: ['Mixed Rice Express', 'Food Junction']
      }
    ]
  },
  {
    category: 'special',
    label: 'Special Treats',
    color: 'bg-special',
    items: [
      {
        id: 's1',
        name: 'Chilli Crab',
        category: 'special',
        description: 'Singapore\'s famous crab dish in spicy tomato sauce',
        healthRating: 2,
        culturalInfo: 'A signature dish that represents Singapore\'s culinary heritage',
        locations: ['Jumbo Seafood', 'Long Beach Seafood']
      },
      {
        id: 's2',
        name: 'Durian',
        category: 'special',
        description: 'The king of fruits with a unique taste and aroma',
        healthRating: 3,
        culturalInfo: 'Known as the king of fruits in Southeast Asia',
        locations: ['99 Old Trees', 'The Durian Story']
      }
    ]
  },
  {
    category: 'veg',
    label: 'Vegetarian',
    color: 'bg-veg',
    items: [
      {
        id: 'v1',
        name: 'Vegetarian Nasi Lemak',
        category: 'veg',
        description: 'Coconut rice with vegetarian sides',
        healthRating: 4,
        locations: ['LingZhi Vegetarian', 'Vegetarian Kitchen']
      },
      {
        id: 'v2',
        name: 'Buddhist Vegetarian',
        category: 'veg',
        description: 'Traditional Chinese vegetarian dishes',
        healthRating: 4,
        locations: ['LingZhi Vegetarian', 'Vegetarian Kitchen']
      }
    ]
  },
  {
    category: 'halal',
    label: 'Halal Options',
    color: 'bg-halal',
    items: [
      {
        id: 'hl1',
        name: 'Nasi Padang',
        category: 'halal',
        description: 'Indonesian rice with various dishes',
        healthRating: 3,
        locations: ['Warong Nasi Pariaman', 'Hjh Maimunah']
      },
      {
        id: 'hl2',
        name: 'Mee Goreng',
        category: 'halal',
        description: 'Spicy fried noodles with vegetables and protein',
        healthRating: 3,
        locations: ['Zam Zam', 'Victory Restaurant']
      }
    ]
  }
] 