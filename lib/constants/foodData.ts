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
    category: 'mexican',
    label: 'Mexican',
    color: 'bg-mexican',
    items: [
      {
        id: 'm1',
        name: 'Tacos',
        category: 'mexican',
        description: 'Soft corn tortillas with various fillings',
        healthRating: 3,
        culturalInfo: 'Traditional Mexican street food',
        locations: ['Muchachos', 'Super Loco']
      },
      {
        id: 'm2',
        name: 'Enchiladas',
        category: 'mexican',
        description: 'Rolled tortillas with sauce and cheese',
        healthRating: 3,
        culturalInfo: 'Classic Mexican comfort food',
        locations: ['Muchachos', 'Super Loco']
      }
    ]
  },
  {
    category: 'spanish',
    label: 'Spanish',
    color: 'bg-spanish',
    items: [
      {
        id: 's1',
        name: 'Paella',
        category: 'spanish',
        description: 'Saffron rice with seafood and vegetables',
        healthRating: 4,
        culturalInfo: 'Traditional Valencian dish',
        locations: ['Binomio', 'Tapas Club']
      },
      {
        id: 's2',
        name: 'Tapas',
        category: 'spanish',
        description: 'Small plates of various Spanish dishes',
        healthRating: 3,
        culturalInfo: 'Spanish social dining tradition',
        locations: ['Binomio', 'Tapas Club']
      }
    ]
  },
  {
    category: 'american',
    label: 'American',
    color: 'bg-american',
    items: [
      {
        id: 'a1',
        name: 'Burger',
        category: 'american',
        description: 'Classic beef patty with cheese and toppings',
        healthRating: 2,
        culturalInfo: 'American fast food staple',
        locations: ['Five Guys', 'Shake Shack']
      },
      {
        id: 'a2',
        name: 'BBQ Ribs',
        category: 'american',
        description: 'Slow-cooked pork ribs with BBQ sauce',
        healthRating: 2,
        culturalInfo: 'Southern American barbecue tradition',
        locations: ['Morganfield\'s', 'Smokey\'s BBQ']
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
    category: 'vietnamese',
    label: 'Vietnamese',
    color: 'bg-vietnamese',
    items: [
      {
        id: 'v1',
        name: 'Pho',
        category: 'vietnamese',
        description: 'Vietnamese noodle soup with herbs',
        healthRating: 4,
        culturalInfo: 'National dish of Vietnam',
        locations: ['Nam Nam', 'Long Phung']
      },
      {
        id: 'v2',
        name: 'Banh Mi',
        category: 'vietnamese',
        description: 'Vietnamese baguette sandwich',
        healthRating: 3,
        culturalInfo: 'French-Vietnamese fusion sandwich',
        locations: ['Nam Nam', 'Long Phung']
      }
    ]
  },
  {
    category: 'french',
    label: 'French',
    color: 'bg-french',
    items: [
      {
        id: 'f1',
        name: 'Coq au Vin',
        category: 'french',
        description: 'Chicken braised with wine and mushrooms',
        healthRating: 3,
        culturalInfo: 'Classic French comfort food',
        locations: ['Bistro du Vin', 'Saveur']
      },
      {
        id: 'f2',
        name: 'Croissant',
        category: 'french',
        description: 'Buttery flaky pastry',
        healthRating: 2,
        culturalInfo: 'Iconic French breakfast pastry',
        locations: ['Tiong Bahru Bakery', 'Paul']
      }
    ]
  },
  {
    category: 'mediterranean',
    label: 'Mediterranean',
    color: 'bg-mediterranean',
    items: [
      {
        id: 'md1',
        name: 'Greek Salad',
        category: 'mediterranean',
        description: 'Fresh vegetables with feta and olives',
        healthRating: 5,
        culturalInfo: 'Traditional Greek dish',
        locations: ['Alati', 'Mykonos on the Bay']
      },
      {
        id: 'md2',
        name: 'Hummus',
        category: 'mediterranean',
        description: 'Creamy chickpea dip',
        healthRating: 4,
        culturalInfo: 'Middle Eastern staple',
        locations: ['Alati', 'Mykonos on the Bay']
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
    category: 'italian',
    label: 'Italian',
    color: 'bg-italian',
    items: [
      {
        id: 'it1',
        name: 'Margherita Pizza',
        category: 'italian',
        description: 'Classic pizza with tomato sauce, mozzarella, and basil',
        healthRating: 3,
        culturalInfo: 'Traditional Neapolitan pizza representing the colors of the Italian flag',
        locations: ['Pizza Express', 'Peperoni Pizzeria']
      },
      {
        id: 'it2',
        name: 'Spaghetti Carbonara',
        category: 'italian',
        description: 'Pasta with eggs, cheese, pancetta, and black pepper',
        healthRating: 3,
        culturalInfo: 'Roman dish with disputed origins',
        locations: ['Pasta Brava', 'Pasta Fresca']
      }
    ]
  },
  {
    category: 'hawker',
    label: 'Hawker',
    color: 'bg-hawker',
    items: [
      {
        id: 'h1',
        name: 'Chicken Rice',
        category: 'hawker',
        description: 'Steamed chicken with fragrant rice',
        healthRating: 3,
        culturalInfo: 'Singapore\'s national dish',
        locations: ['Tian Tian', 'Boon Tong Kee']
      },
      {
        id: 'h2',
        name: 'Laksa',
        category: 'hawker',
        description: 'Spicy coconut noodle soup',
        healthRating: 3,
        culturalInfo: 'Peranakan dish with Chinese and Malay influences',
        locations: ['328 Katong Laksa', 'Sungei Road Laksa']
      }
    ]
  },
  {
    category: 'healthy',
    label: 'Healthy',
    color: 'bg-healthy',
    items: [
      {
        id: 'he1',
        name: 'Acai Bowl',
        category: 'healthy',
        description: 'Acai berry smoothie bowl with toppings',
        healthRating: 5,
        culturalInfo: 'Brazilian superfood dish',
        locations: ['Project Acai', 'An Acai Affair']
      },
      {
        id: 'he2',
        name: 'Quinoa Salad',
        category: 'healthy',
        description: 'Nutritious grain salad with vegetables',
        healthRating: 5,
        culturalInfo: 'Modern health food dish',
        locations: ['The Daily Cut', 'Salad Stop']
      }
    ]
  }
] 