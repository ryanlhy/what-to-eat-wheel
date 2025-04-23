import { FoodItem, WheelSection } from '@/types/food'

export const FOOD_SECTIONS: WheelSection[] = [
  {
    category: 'japanese',
    label: 'Japanese',
    color: 'bg-japanese',
    items: [
      {
        id: 'j1',
        name: 'Sushi Platter',
        category: 'japanese',
        description: 'Fresh assortment of nigiri and maki rolls',
        healthRating: 4,
        culturalInfo: 'Traditional Japanese dish featuring vinegared rice and fresh seafood',
        locations: ['Sushi Tei', 'Genki Sushi']
      },
      {
        id: 'j2',
        name: 'Ramen',
        category: 'japanese',
        description: 'Japanese noodle soup with rich broth and toppings',
        healthRating: 3,
        culturalInfo: 'Popular Japanese comfort food with Chinese origins',
        locations: ['Ippudo', 'Ramen Keisuke']
      }
    ]
  },
  {
    category: 'indian',
    label: 'Indian',
    color: 'bg-indian',
    items: [
      {
        id: 'i1',
        name: 'Butter Chicken',
        category: 'indian',
        description: 'Tender chicken in creamy tomato sauce',
        healthRating: 3,
        culturalInfo: 'North Indian dish originating from Delhi',
        locations: ['Komala Vilas', 'Ananda Bhavan']
      },
      {
        id: 'i2',
        name: 'Biryani',
        category: 'indian',
        description: 'Fragrant rice dish with spices and meat',
        healthRating: 3,
        culturalInfo: 'Royal dish with Persian influences',
        locations: ['Bismillah Biryani', 'Allauddin\'s Briyani']
      }
    ]
  },
  {
    category: 'chinese',
    label: 'Chinese',
    color: 'bg-chinese',
    items: [
      {
        id: 'c1',
        name: 'Dim Sum',
        category: 'chinese',
        description: 'Assortment of steamed and fried dumplings',
        healthRating: 3,
        culturalInfo: 'Traditional Cantonese brunch dishes',
        locations: ['Tim Ho Wan', 'Crystal Jade']
      },
      {
        id: 'c2',
        name: 'Peking Duck',
        category: 'chinese',
        description: 'Crispy roasted duck with pancakes',
        healthRating: 3,
        culturalInfo: 'Imperial dish from Beijing',
        locations: ['Imperial Treasure', 'Hai Tien Lo']
      }
    ]
  },
  {
    category: 'vegetarian',
    label: 'Vegetarian',
    color: 'bg-vegetarian',
    items: [
      {
        id: 'v1',
        name: 'Buddha Bowl',
        category: 'vegetarian',
        description: 'Nutritious bowl with grains and vegetables',
        healthRating: 5,
        locations: ['The Daily Cut', 'Project Acai']
      },
      {
        id: 'v2',
        name: 'Falafel Wrap',
        category: 'vegetarian',
        description: 'Crispy chickpea patties in pita bread',
        healthRating: 4,
        locations: ['Pita Pan', 'Beirut Grill']
      }
    ]
  },
  {
    category: 'korean',
    label: 'Korean',
    color: 'bg-korean',
    items: [
      {
        id: 'k1',
        name: 'Bibimbap',
        category: 'korean',
        description: 'Mixed rice bowl with vegetables and meat',
        healthRating: 4,
        culturalInfo: 'Traditional Korean mixed rice dish',
        locations: ['Seoul Garden', 'Koryo Korean BBQ']
      },
      {
        id: 'k2',
        name: 'Korean BBQ',
        category: 'korean',
        description: 'Grilled meats with side dishes',
        healthRating: 3,
        culturalInfo: 'Popular Korean dining experience',
        locations: ['Seoul Garden', 'Koryo Korean BBQ']
      }
    ]
  },
  {
    category: 'thai',
    label: 'Thai',
    color: 'bg-thai',
    items: [
      {
        id: 't1',
        name: 'Pad Thai',
        category: 'thai',
        description: 'Stir-fried rice noodles with tamarind sauce',
        healthRating: 3,
        culturalInfo: 'National dish of Thailand',
        locations: ['Nakhon Kitchen', 'Soi 60']
      },
      {
        id: 't2',
        name: 'Tom Yum Soup',
        category: 'thai',
        description: 'Spicy and sour soup with herbs',
        healthRating: 3,
        culturalInfo: 'Classic Thai hot and sour soup',
        locations: ['Nakhon Kitchen', 'Soi 60']
      }
    ]
  }
] 