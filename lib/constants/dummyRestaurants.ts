import { Restaurant } from '@/types/restaurant';

export const DUMMY_RESTAURANTS: Restaurant[] = [
  {
    id: '1',
    name: 'Sushi Paradise',
    description: 'Authentic Japanese sushi restaurant with fresh seafood flown in daily.',
    imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    rating: 4.7,
    priceRange: '$$',
    cuisine: 'Japanese',
    location: 'Downtown',
    openingHours: '11:00 AM - 10:00 PM',
    contact: '+65 9123 4567',
    website: 'https://www.sushiparadise.com',
    place_id: 'place_id_1',
    vicinity: '123 Main Street, Downtown',
    types: ['restaurant', 'food', 'japanese'],
    price_level: 2,
    opening_hours: {
      open_now: true,
      weekday_text: [
        'Monday: 11:00 AM – 10:00 PM',
        'Tuesday: 11:00 AM – 10:00 PM',
        'Wednesday: 11:00 AM – 10:00 PM',
        'Thursday: 11:00 AM – 10:00 PM',
        'Friday: 11:00 AM – 11:00 PM',
        'Saturday: 11:00 AM – 11:00 PM',
        'Sunday: 12:00 PM – 9:00 PM'
      ]
    },
    geometry: {
      location: {
        lat: 1.2800945,
        lng: 103.8509491
      }
    }
  },
  {
    id: '2',
    name: 'Burger Haven',
    description: 'Gourmet burgers made with premium beef and fresh ingredients.',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    rating: 4.5,
    priceRange: '$$',
    cuisine: 'American',
    location: 'Orchard',
    openingHours: '10:00 AM - 11:00 PM',
    contact: '+65 8765 4321',
    website: 'https://www.burgerhaven.com',
    place_id: 'place_id_2',
    vicinity: '456 Orchard Road, Orchard',
    types: ['restaurant', 'food', 'american'],
    price_level: 2,
    opening_hours: {
      open_now: true,
      weekday_text: [
        'Monday: 10:00 AM – 11:00 PM',
        'Tuesday: 10:00 AM – 11:00 PM',
        'Wednesday: 10:00 AM – 11:00 PM',
        'Thursday: 10:00 AM – 11:00 PM',
        'Friday: 10:00 AM – 12:00 AM',
        'Saturday: 10:00 AM – 12:00 AM',
        'Sunday: 11:00 AM – 10:00 PM'
      ]
    },
    geometry: {
      location: {
        lat: 1.3025321,
        lng: 103.8324827
      }
    }
  },
  {
    id: '3',
    name: 'Spice Garden',
    description: 'Authentic Indian cuisine with a wide variety of vegetarian options.',
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356c36?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    rating: 4.3,
    priceRange: '$',
    cuisine: 'Indian',
    location: 'Little India',
    openingHours: '11:30 AM - 10:30 PM',
    contact: '+65 9876 5432',
    website: 'https://www.spicegarden.com',
    place_id: 'place_id_3',
    vicinity: '78 Serangoon Road, Little India',
    types: ['restaurant', 'food', 'indian'],
    price_level: 1,
    opening_hours: {
      open_now: false,
      weekday_text: [
        'Monday: 11:30 AM – 10:30 PM',
        'Tuesday: 11:30 AM – 10:30 PM',
        'Wednesday: 11:30 AM – 10:30 PM',
        'Thursday: 11:30 AM – 10:30 PM',
        'Friday: 11:30 AM – 11:00 PM',
        'Saturday: 11:30 AM – 11:00 PM',
        'Sunday: 11:30 AM – 10:30 PM'
      ]
    },
    geometry: {
      location: {
        lat: 1.3067962,
        lng: 103.8518325
      }
    }
  },
  {
    id: '4',
    name: 'Golden Wok',
    description: 'Traditional Chinese restaurant specializing in dim sum and seafood.',
    imageUrl: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    rating: 4.8,
    priceRange: '$$$',
    cuisine: 'Chinese',
    location: 'Chinatown',
    openingHours: '10:00 AM - 10:00 PM',
    contact: '+65 8123 4567',
    website: 'https://www.goldenwok.com',
    place_id: 'place_id_4',
    vicinity: '45 Pagoda Street, Chinatown',
    types: ['restaurant', 'food', 'chinese', 'dim_sum'],
    price_level: 3,
    opening_hours: {
      open_now: true,
      weekday_text: [
        'Monday: 10:00 AM – 10:00 PM',
        'Tuesday: 10:00 AM – 10:00 PM',
        'Wednesday: 10:00 AM – 10:00 PM',
        'Thursday: 10:00 AM – 10:00 PM',
        'Friday: 10:00 AM – 11:00 PM',
        'Saturday: 9:00 AM – 11:00 PM',
        'Sunday: 9:00 AM – 10:00 PM'
      ]
    },
    geometry: {
      location: {
        lat: 1.2834546,
        lng: 103.8439724
      }
    }
  },
  {
    id: '5',
    name: 'Pasta Perfecto',
    description: 'Authentic Italian restaurant with homemade pasta and wood-fired pizzas.',
    imageUrl: 'https://images.unsplash.com/photo-1481931098730-318b6f776db0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    rating: 4.6,
    priceRange: '$$',
    cuisine: 'Italian',
    location: 'Holland Village',
    openingHours: '12:00 PM - 10:00 PM',
    contact: '+65 9234 5678',
    website: 'https://www.pastaperfecto.com',
    place_id: 'place_id_5',
    vicinity: '28 Lorong Mambong, Holland Village',
    types: ['restaurant', 'food', 'italian', 'pizza'],
    price_level: 2,
    opening_hours: {
      open_now: true,
      weekday_text: [
        'Monday: 12:00 PM – 10:00 PM',
        'Tuesday: 12:00 PM – 10:00 PM',
        'Wednesday: 12:00 PM – 10:00 PM',
        'Thursday: 12:00 PM – 10:00 PM',
        'Friday: 12:00 PM – 11:00 PM',
        'Saturday: 11:00 AM – 11:00 PM',
        'Sunday: 11:00 AM – 10:00 PM'
      ]
    },
    geometry: {
      location: {
        lat: 1.3118642,
        lng: 103.7965385
      }
    }
  },
  {
    id: '6',
    name: 'Taco Fiesta',
    description: 'Vibrant Mexican restaurant offering authentic tacos, burritos and margaritas.',
    imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    rating: 4.4,
    priceRange: '$$',
    cuisine: 'Mexican',
    location: 'Clarke Quay',
    openingHours: '12:00 PM - 1:00 AM',
    contact: '+65 8543 2109',
    website: 'https://www.tacofiesta.com',
    place_id: 'place_id_6',
    vicinity: '3A River Valley Road, Clarke Quay',
    types: ['restaurant', 'food', 'mexican', 'bar'],
    price_level: 2,
    opening_hours: {
      open_now: true,
      weekday_text: [
        'Monday: 12:00 PM – 12:00 AM',
        'Tuesday: 12:00 PM – 12:00 AM',
        'Wednesday: 12:00 PM – 12:00 AM',
        'Thursday: 12:00 PM – 1:00 AM',
        'Friday: 12:00 PM – 2:00 AM',
        'Saturday: 11:00 AM – 2:00 AM',
        'Sunday: 11:00 AM – 11:00 PM'
      ]
    },
    geometry: {
      location: {
        lat: 1.2905307,
        lng: 103.8465442
      }
    }
  },
  {
    id: '7',
    name: 'Seoul Kitchen',
    description: 'Korean BBQ restaurant with tabletop grills and authentic banchan sides.',
    imageUrl: 'https://images.unsplash.com/photo-1590330813083-fc22d4b6a2e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    rating: 4.5,
    priceRange: '$$',
    cuisine: 'Korean',
    location: 'Tanjong Pagar',
    openingHours: '11:30 AM - 10:30 PM',
    contact: '+65 9654 3210',
    website: 'https://www.seoulkitchen.com',
    place_id: 'place_id_7',
    vicinity: '34 Tanjong Pagar Road, Tanjong Pagar',
    types: ['restaurant', 'food', 'korean', 'bbq'],
    price_level: 2,
    opening_hours: {
      open_now: false,
      weekday_text: [
        'Monday: 11:30 AM – 10:30 PM',
        'Tuesday: 11:30 AM – 10:30 PM',
        'Wednesday: 11:30 AM – 10:30 PM',
        'Thursday: 11:30 AM – 10:30 PM',
        'Friday: 11:30 AM – 11:30 PM',
        'Saturday: 11:30 AM – 11:30 PM',
        'Sunday: 12:00 PM – 10:00 PM'
      ]
    },
    geometry: {
      location: {
        lat: 1.2782281,
        lng: 103.8427609
      }
    }
  },
  {
    id: '8',
    name: 'Banh Mi Express',
    description: 'Vietnamese sandwich shop offering fresh banh mi and authentic pho.',
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    rating: 4.2,
    priceRange: '$',
    cuisine: 'Vietnamese',
    location: 'Bugis',
    openingHours: '10:00 AM - 8:00 PM',
    contact: '+65 8765 0123',
    place_id: 'place_id_8',
    vicinity: '23 Bugis Street, Bugis',
    types: ['restaurant', 'food', 'vietnamese', 'sandwich'],
    price_level: 1,
    opening_hours: {
      open_now: true,
      weekday_text: [
        'Monday: 10:00 AM – 8:00 PM',
        'Tuesday: 10:00 AM – 8:00 PM',
        'Wednesday: 10:00 AM – 8:00 PM',
        'Thursday: 10:00 AM – 8:00 PM',
        'Friday: 10:00 AM – 9:00 PM',
        'Saturday: 10:00 AM – 9:00 PM',
        'Sunday: 11:00 AM – 8:00 PM'
      ]
    },
    geometry: {
      location: {
        lat: 1.3009125,
        lng: 103.8553152
      }
    }
  },
  {
    id: '9',
    name: 'Thai Basil',
    description: 'Cozy Thai restaurant specializing in authentic Tom Yum and Pad Thai.',
    imageUrl: 'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    rating: 4.4,
    priceRange: '$$',
    cuisine: 'Thai',
    location: 'Novena',
    openingHours: '11:00 AM - 10:00 PM',
    contact: '+65 9012 3456',
    website: 'https://www.thaibasil.com',
    place_id: 'place_id_9',
    vicinity: '45 Thomson Road, Novena',
    types: ['restaurant', 'food', 'thai'],
    price_level: 2,
    opening_hours: {
      open_now: true,
      weekday_text: [
        'Monday: 11:00 AM – 10:00 PM',
        'Tuesday: 11:00 AM – 10:00 PM',
        'Wednesday: 11:00 AM – 10:00 PM',
        'Thursday: 11:00 AM – 10:00 PM',
        'Friday: 11:00 AM – 10:30 PM',
        'Saturday: 11:00 AM – 10:30 PM',
        'Sunday: 11:30 AM – 9:30 PM'
      ]
    },
    geometry: {
      location: {
        lat: 1.3203026,
        lng: 103.8430325
      }
    }
  },
  {
    id: '10',
    name: 'La Patisserie',
    description: 'French bakery and café offering artisanal pastries and coffee.',
    imageUrl: 'https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    rating: 4.7,
    priceRange: '$$',
    cuisine: 'French',
    location: 'Tiong Bahru',
    openingHours: '8:00 AM - 8:00 PM',
    contact: '+65 8901 2345',
    website: 'https://www.lapatisserie.com',
    place_id: 'place_id_10',
    vicinity: '56 Eng Hoon Street, Tiong Bahru',
    types: ['bakery', 'cafe', 'food', 'french'],
    price_level: 2,
    opening_hours: {
      open_now: true,
      weekday_text: [
        'Monday: 8:00 AM – 8:00 PM',
        'Tuesday: 8:00 AM – 8:00 PM',
        'Wednesday: 8:00 AM – 8:00 PM',
        'Thursday: 8:00 AM – 8:00 PM',
        'Friday: 8:00 AM – 9:00 PM',
        'Saturday: 8:00 AM – 9:00 PM',
        'Sunday: 9:00 AM – 7:00 PM'
      ]
    },
    geometry: {
      location: {
        lat: 1.2827631,
        lng: 103.8319106
      }
    }
  }
];

// Mock implementation of getUrl for photo objects
export const createDummyRestaurantsWithPhotos = (): Restaurant[] => {
  return DUMMY_RESTAURANTS.map(restaurant => ({
    ...restaurant,
    photos: [
      {
        getUrl: ({ maxWidth, maxHeight }: { maxWidth: number; maxHeight: number }) => {
          return restaurant.imageUrl;
        }
      }
    ]
  }));
}; 