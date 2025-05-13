import { FoodItem, WheelSection } from '@/types/food'

export const FALLBACK_FUN_FACTS: Record<string, string> = {
    japanese: "Did you know? Japanese cuisine emphasizes seasonal ingredients and beautiful presentation, reflecting the country's deep appreciation for nature and aesthetics.",
    mexican: "Fun fact: Mexican cuisine was added to UNESCO's list of Intangible Cultural Heritage in 2010, recognizing its importance to world culture.",
    spanish: "Interesting tidbit: The Spanish tradition of tapas began when bartenders would cover wine glasses with bread slices to keep dust out - 'tapa' means 'lid' in Spanish!",
    american: "Did you know? The hamburger as we know it today was popularized at the 1904 St. Louis World's Fair, marking the beginning of America's love affair with this iconic food.",
    korean: "Fun fact: Korean cuisine always includes kimchi, which has over 200 varieties and is recognized by UNESCO as an Intangible Cultural Heritage.",
    vietnamese: "Interesting fact: Vietnamese cuisine is considered one of the healthiest in the world, focusing on fresh herbs, vegetables, and balanced flavors.",
    french: "Did you know? The croissant was actually inspired by the Austrian kipferl, and was popularized in France by Marie Antoinette!",
    mediterranean: "Fun fact: The Mediterranean diet is one of the most studied diets in the world and is consistently ranked as one of the healthiest eating patterns.",
    thai: "Interesting tidbit: Traditional Thai cuisine aims to combine all four taste sensations - sour, sweet, salty, and bitter - in every meal.",
    indian: "Did you know? Indian cuisine dates back over 5000 years, with each region developing its own unique cooking style and traditions.",
    chinese: "Fun fact: Chinese cuisine has influenced many other Asian cuisines, with techniques like stir-frying being adopted worldwide.",
    italian: "Interesting fact: Pizza Margherita was created in 1889 to honor Queen Margherita of Italy, using ingredients that represented the Italian flag.",
    hawker: "Did you know? Singapore's hawker culture has been recognized by UNESCO as an Intangible Cultural Heritage, celebrating its unique food and community traditions.",
    healthy: "Fun fact: The concept of 'superfoods' gained popularity in the early 2000s, highlighting nutrient-rich foods that promote health and wellbeing."
} as const;

export const FALLBACK_RECOMMENDED_DISHES: Record<string, Array<{dish: string; nutrition: string[]; suggestedRestaurants: string[]}>> = {
    japanese: [
        {
            dish: "Miso Ramen",
            nutrition: [
                "Rich in protein from the pork and egg",
                "Contains probiotics from fermented miso",
                "Good source of minerals from seaweed",
                "High in sodium - consume in moderation"
            ],
            suggestedRestaurants: ["Ippudo", "Ramen Keisuke", "Marutama Ra-men"]
        },
        {
            dish: "Chirashi Don",
            nutrition: [
                "High in omega-3 fatty acids from fresh fish",
                "Good source of protein",
                "Rich in vitamins A and D",
                "Contains healthy carbohydrates from rice"
            ],
            suggestedRestaurants: ["Sushi Tei", "Teppei Japanese Restaurant", "Standing Sushi Bar"]
        }
    ],
    chinese: [
        {
            dish: "Steamed Fish with Ginger and Scallion",
            nutrition: [
                "High in lean protein",
                "Rich in omega-3 fatty acids",
                "Low in calories",
                "Good source of vitamins and minerals"
            ],
            suggestedRestaurants: ["Paradise Dynasty", "Crystal Jade", "Imperial Treasure"]
        },
        {
            dish: "Mapo Tofu",
            nutrition: [
                "High in plant-based protein",
                "Good source of iron",
                "Contains healthy fats",
                "Rich in calcium from tofu"
            ],
            suggestedRestaurants: ["Si Chuan Dou Hua", "Shisen Hanten", "Chen's Mapo Tofu"]
        }
    ],
    korean: [
        {
            dish: "Sundubu Jjigae",
            nutrition: [
                "High in protein from tofu and seafood",
                "Rich in vitamins and minerals",
                "Contains healthy fats",
                "Good source of iron"
            ],
            suggestedRestaurants: ["Seoul Garden", "Kim's Family Restaurant", "Hanwoori Korean Restaurant"]
        },
        {
            dish: "Bibimbap",
            nutrition: [
                "Balanced mix of proteins and vegetables",
                "Rich in fiber",
                "Good source of vitamins and minerals",
                "Contains healthy carbohydrates"
            ],
            suggestedRestaurants: ["Seoul Garden", "Kimchi Korean Restaurant", "Hansang Korean Restaurant"]
        }
    ],
    thai: [
        {
            dish: "Green Curry",
            nutrition: [
                "Contains anti-inflammatory ingredients",
                "Rich in vitamins and minerals",
                "Good source of protein",
                "Contains healthy fats from coconut milk"
            ],
            suggestedRestaurants: ["Thai Express", "Nakhon Kitchen", "Soi Thai Kitchen"]
        },
        {
            dish: "Som Tam",
            nutrition: [
                "Low in calories",
                "High in fiber",
                "Rich in vitamins A and C",
                "Good source of plant-based nutrients"
            ],
            suggestedRestaurants: ["Nakhon Kitchen", "Soi Thai Kitchen", "Thai Gold Food"]
        }
    ],
    indian: [
        {
            dish: "Dal Makhani",
            nutrition: [
                "High in plant-based protein",
                "Rich in fiber",
                "Good source of iron",
                "Contains healthy fats"
            ],
            suggestedRestaurants: ["Muthu's Curry", "Banana Leaf Apolo", "Komala Vilas"]
        },
        {
            dish: "Tandoori Chicken",
            nutrition: [
                "High in lean protein",
                "Low in carbohydrates",
                "Good source of vitamins B6 and B12",
                "Contains healthy spices"
            ],
            suggestedRestaurants: ["Muthu's Curry", "Banana Leaf Apolo", "Delhi Restaurant"]
        }
    ],
    mediterranean: [
        {
            dish: "Grilled Sea Bass",
            nutrition: [
                "High in lean protein",
                "Rich in omega-3 fatty acids",
                "Good source of vitamins D and B12",
                "Low in saturated fat"
            ],
            suggestedRestaurants: ["Alati", "Bakalaki Greek Taverna", "PITA"]
        },
        {
            dish: "Mediterranean Mezze Platter",
            nutrition: [
                "Rich in healthy fats from olive oil",
                "Good source of plant-based protein",
                "High in fiber",
                "Contains various vitamins and minerals"
            ],
            suggestedRestaurants: ["Alati", "Bakalaki Greek Taverna", "Fat Prince"]
        }
    ],
    french: [
        {
            dish: "Ratatouille",
            nutrition: [
                "Low in calories",
                "High in fiber",
                "Rich in vitamins and minerals",
                "Good source of antioxidants"
            ],
            suggestedRestaurants: ["Les Amis", "L'Angelus", "Bistrot du Sommelier"]
        },
        {
            dish: "Bouillabaisse",
            nutrition: [
                "High in protein from seafood",
                "Rich in omega-3 fatty acids",
                "Good source of vitamins and minerals",
                "Contains healthy herbs and spices"
            ],
            suggestedRestaurants: ["Les Amis", "L'Angelus", "La Brasserie"]
        }
    ],
    mexican: [
        {
            dish: "Fish Tacos",
            nutrition: [
                "High in lean protein",
                "Contains healthy fats",
                "Good source of fiber",
                "Rich in vitamins and minerals"
            ],
            suggestedRestaurants: ["Muchachos", "Papi's Tacos", "Super Loco"]
        },
        {
            dish: "Chicken Fajitas",
            nutrition: [
                "High in protein",
                "Rich in vegetables",
                "Good source of vitamins and minerals",
                "Contains healthy fats"
            ],
            suggestedRestaurants: ["Muchachos", "Papi's Tacos", "Cafe Iguana"]
        }
    ],
    vietnamese: [
        {
            dish: "Bun Bo Hue",
            nutrition: [
                "Rich in protein",
                "Contains various herbs and spices",
                "Good source of iron",
                "Contains healthy carbohydrates"
            ],
            suggestedRestaurants: ["Mrs Pho", "Long Phung", "Little Vietnam"]
        },
        {
            dish: "Goi Cuon",
            nutrition: [
                "Low in calories",
                "High in fiber",
                "Rich in vitamins and minerals",
                "Contains lean protein"
            ],
            suggestedRestaurants: ["Mrs Pho", "Long Phung", "Little Vietnam"]
        }
    ],
    spanish: [
        {
            dish: "Seafood Paella",
            nutrition: [
                "Rich in protein from seafood",
                "Good source of saffron antioxidants",
                "Contains healthy carbohydrates",
                "Rich in vitamins and minerals"
            ],
            suggestedRestaurants: ["FOC Restaurant", "La Taperia", "My Little Spanish Place"]
        },
        {
            dish: "Gazpacho",
            nutrition: [
                "Low in calories",
                "High in vitamins A and C",
                "Rich in antioxidants",
                "Good source of fiber"
            ],
            suggestedRestaurants: ["FOC Restaurant", "La Taperia", "My Little Spanish Place"]
        }
    ],
    american: [
        {
            dish: "Grilled Salmon Burger",
            nutrition: [
                "High in omega-3 fatty acids",
                "Good source of protein",
                "Rich in vitamins D and B12",
                "Contains healthy fats"
            ],
            suggestedRestaurants: ["OverEasy", "25 Degrees", "Three Buns"]
        },
        {
            dish: "Quinoa Bowl",
            nutrition: [
                "High in plant-based protein",
                "Rich in fiber",
                "Good source of iron",
                "Contains all essential amino acids"
            ],
            suggestedRestaurants: ["The Daily Cut", "SaladStop!", "GRAIN"]
        }
    ],
    hawker: [
        {
            dish: "Sliced Fish Soup",
            nutrition: [
                "High in lean protein",
                "Low in calories",
                "Good source of omega-3",
                "Rich in minerals"
            ],
            suggestedRestaurants: ["Han Kee Fish Soup", "Ka-Soh Restaurant", "Blanco Court Fish Soup"]
        },
        {
            dish: "Thunder Tea Rice",
            nutrition: [
                "High in fiber",
                "Rich in antioxidants",
                "Good source of vitamins",
                "Contains healthy herbs"
            ],
            suggestedRestaurants: ["Thunder Tea Rice", "Living Wholesome", "Ah Lock & Co."]
        }
    ],
    healthy: [
        {
            dish: "Buddha Bowl",
            nutrition: [
                "Balanced mix of proteins and vegetables",
                "High in fiber",
                "Rich in vitamins and minerals",
                "Contains healthy fats"
            ],
            suggestedRestaurants: ["The Daily Cut", "SaladStop!", "GRAIN"]
        },
        {
            dish: "Poke Bowl",
            nutrition: [
                "High in protein",
                "Rich in omega-3 fatty acids",
                "Good source of fiber",
                "Contains various vitamins and minerals"
            ],
            suggestedRestaurants: ["Poke Theory", "A Poke Theory", "Alakai Poke"]
        }
    ]
}

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