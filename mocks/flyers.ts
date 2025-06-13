import { Flyer, Category } from '@/types';

export const mockFlyers: Flyer[] = [
  {
    id: '1',
    title: 'Patel Brothers Weekly Sale',
    description: 'Get 20% off on all fresh produce and spices this weekend! Special discount on basmati rice and lentils. Authentic products imported from India.',
    imageUrl: 'https://images.unsplash.com/photo-1588449668365-d15e397f6787',
    category: 'groceries',
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      address: '123 Market St, San Francisco, CA',
    },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    expiresAt: new Date(Date.now() + 86400000 * 5).toISOString(),
    views: 124,
    reactions: 45,
    userId: 'user1',
    businessName: 'Patel Brothers',
    discount: '20% OFF',
    couponCode: 'PATEL20',
    isTrending: true,
    averageRating: 4.5,
    reviewCount: 12
  },
  {
    id: '2',
    title: 'Taj Mahal Restaurant Opening',
    description: 'Join us for our grand opening with special menu items and discounts! Free dessert with every main course. Authentic North Indian cuisine in the heart of San Francisco.',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
    category: 'restaurants',
    location: {
      latitude: 37.7739,
      longitude: -122.4312,
      address: '456 Valencia St, San Francisco, CA',
    },
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(),
    views: 287,
    reactions: 92,
    userId: 'user2',
    businessName: 'Taj Mahal Restaurant',
    discount: 'FREE DESSERT',
    couponCode: 'TAJMAHAL',
    isTrending: true,
    averageRating: 4.2,
    reviewCount: 8
  },
  {
    id: '3',
    title: 'Diwali Celebration Night',
    description: 'Join us for a grand Diwali celebration with music, dance, and delicious food. Special performances by local artists! Connect with the Indian community in the Bay Area.',
    imageUrl: 'https://images.unsplash.com/photo-1604423481621-54c1c2c7a2d7',
    category: 'events',
    location: {
      latitude: 37.7694,
      longitude: -122.4862,
      address: '789 Sunset Ave, San Francisco, CA',
    },
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    expiresAt: new Date(Date.now() + 86400000 * 3).toISOString(),
    views: 356,
    reactions: 128,
    userId: 'user3',
    businessName: 'Bay Area Indian Association',
    discount: '15% OFF TICKETS',
    couponCode: 'DIWALI2025',
    isTrending: true,
    averageRating: 4.8,
    reviewCount: 15
  },
  {
    id: '4',
    title: 'Indian Farmers Market',
    description: 'Fresh local produce, spices, and homemade Indian snacks every Saturday! Special discount on bulk purchases. Support local Indian farmers in California.',
    imageUrl: 'https://images.unsplash.com/photo-1611464613069-5e0d0cde3daf',
    category: 'markets',
    location: {
      latitude: 37.7831,
      longitude: -122.4039,
      address: '101 Ferry Building, San Francisco, CA',
    },
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    expiresAt: new Date(Date.now() + 86400000 * 4).toISOString(),
    views: 198,
    reactions: 67,
    userId: 'user4',
    businessName: 'SF Indian Farmers Collective',
    discount: '10% OFF',
    couponCode: 'FARMFRESH',
    averageRating: 4.0,
    reviewCount: 6
  },
  {
    id: '5',
    title: 'Organic Indian Spices Sale',
    description: 'All organic spices and lentils at 15% discount for the whole week! Buy 2 get 1 free on selected items. Directly imported from Kerala and Punjab.',
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d',
    category: 'groceries',
    location: {
      latitude: 37.7859,
      longitude: -122.4071,
      address: '202 Green St, San Francisco, CA',
    },
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    expiresAt: new Date(Date.now() + 86400000 * 6).toISOString(),
    views: 112,
    reactions: 38,
    userId: 'user5',
    businessName: 'Spice Bazaar',
    discount: '15% OFF',
    couponCode: 'SPICE15',
    averageRating: 3.8,
    reviewCount: 4
  },
  {
    id: '6',
    title: 'Thali Tuesday Special',
    description: 'Complete thali for just $12.99 every Tuesday from 5-8 PM! Includes 3 curries, rice, naan, and dessert. Authentic flavors from different regions of India.',
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356c36',
    category: 'restaurants',
    location: {
      latitude: 37.7609,
      longitude: -122.4148,
      address: '303 Mission St, San Francisco, CA',
    },
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(),
    views: 245,
    reactions: 89,
    userId: 'user6',
    businessName: 'Delhi Dhaba',
    discount: '$12.99 SPECIAL',
    couponCode: 'THALI12',
    averageRating: 4.6,
    reviewCount: 22
  },
  {
    id: '7',
    title: 'Bollywood Night',
    description: 'Dance to the latest Bollywood hits with our DJ. Special drinks menu and Indian snacks available all night! Meet fellow desis in the Bay Area.',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7',
    category: 'events',
    location: {
      latitude: 37.7875,
      longitude: -122.4008,
      address: '404 Gallery Way, San Francisco, CA',
    },
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    expiresAt: new Date(Date.now() + 86400000 * 5).toISOString(),
    views: 178,
    reactions: 62,
    userId: 'user7',
    businessName: 'Bollywood Beats',
    discount: '20% OFF ENTRY',
    couponCode: 'BOLLYWOOD20',
    averageRating: 4.3,
    reviewCount: 9
  },
  {
    id: '8',
    title: 'Indian Handicrafts Bazaar',
    description: 'Traditional Indian handicrafts, textiles, and jewelry from local artisans. Special discounts on selected items. Authentic crafts from different states of India.',
    imageUrl: 'https://images.unsplash.com/photo-1606744888344-493238951221',
    category: 'markets',
    location: {
      latitude: 37.7694,
      longitude: -122.4125,
      address: '505 Vintage Lane, San Francisco, CA',
    },
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    expiresAt: new Date(Date.now() + 86400000 * 4).toISOString(),
    views: 156,
    reactions: 51,
    userId: 'user8',
    businessName: 'Indian Artisan Collective',
    discount: '25% OFF',
    couponCode: 'BAZAAR25',
    averageRating: 4.1,
    reviewCount: 7
  },
  {
    id: '9',
    title: 'Swad Indian Grocery',
    description: 'New shipment of Indian snacks and ready-to-eat meals just arrived! Special discount on MTR and Haldiram products. All your favorite brands from back home.',
    imageUrl: 'https://images.unsplash.com/photo-1616661317361-64a32310a9a2',
    category: 'groceries',
    location: {
      latitude: 37.7959,
      longitude: -122.3991,
      address: '606 Jackson St, San Francisco, CA',
    },
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    expiresAt: new Date(Date.now() + 86400000 * 8).toISOString(),
    views: 89,
    reactions: 32,
    userId: 'user9',
    businessName: 'Swad Indian Grocery',
    discount: '10% OFF',
    couponCode: 'SWAD10',
    averageRating: 3.9,
    reviewCount: 11
  },
  {
    id: '10',
    title: 'Garba Night Celebration',
    description: 'Annual Navratri Garba celebration with live music and dandiya. Food stalls with Gujarati specialties. Connect with the Gujarati community in the Bay Area.',
    imageUrl: 'https://images.unsplash.com/photo-1601625193660-e7e8b57b5540',
    category: 'events',
    location: {
      latitude: 37.7849,
      longitude: -122.4294,
      address: '707 Community Center, San Francisco, CA',
    },
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    expiresAt: new Date(Date.now() + 86400000 * 5).toISOString(),
    views: 267,
    reactions: 98,
    userId: 'user10',
    businessName: 'Gujarati Cultural Association',
    discount: '15% OFF FAMILY TICKETS',
    couponCode: 'GARBA15',
    isTrending: true,
    averageRating: 4.7,
    reviewCount: 18
  },
  {
    id: '11',
    title: 'IPL Cricket Screening',
    description: 'Watch the IPL finals on our big screen with fellow cricket fans! Special Indian food menu and drinks available. Cheer for your favorite team with the community.',
    imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da',
    category: 'sports',
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      address: '123 Sports Bar, San Francisco, CA',
    },
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    expiresAt: new Date(Date.now() + 86400000 * 3).toISOString(),
    views: 312,
    reactions: 145,
    userId: 'user11',
    businessName: 'Cricket Lovers Club',
    discount: 'FREE APPETIZER',
    couponCode: 'IPLCRICKET',
    isTrending: true,
    averageRating: 4.9,
    reviewCount: 25
  },
  {
    id: '12',
    title: 'Badminton Tournament',
    description: 'Join our monthly badminton tournament for all skill levels. Singles and doubles categories available. Prizes for winners and refreshments for all participants.',
    imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea',
    category: 'sports',
    location: {
      latitude: 37.7739,
      longitude: -122.4312,
      address: '456 Sports Complex, San Francisco, CA',
    },
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(),
    views: 187,
    reactions: 76,
    userId: 'user12',
    businessName: 'Bay Area Badminton Club',
    discount: '20% OFF ENTRY FEE',
    couponCode: 'BADMINTON20',
    averageRating: 4.2,
    reviewCount: 14
  },
  {
    id: '13',
    title: 'Pickleball League Registration',
    description: 'New pickleball league starting next month! Register your team now for the season. All games will be played on weekends. Great way to stay active and meet new people.',
    imageUrl: 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827',
    category: 'sports',
    location: {
      latitude: 37.7694,
      longitude: -122.4862,
      address: '789 Recreation Center, San Francisco, CA',
    },
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    expiresAt: new Date(Date.now() + 86400000 * 14).toISOString(),
    views: 134,
    reactions: 52,
    userId: 'user13',
    businessName: 'Desi Pickleball League',
    discount: 'EARLY BIRD DISCOUNT',
    couponCode: 'PICKLE25',
    averageRating: 3.8,
    reviewCount: 5
  },
  {
    id: '14',
    title: 'Volleyball Tournament',
    description: 'Annual volleyball tournament with teams from across the Bay Area. Food, music, and prizes! Register your team of 6 players. All skill levels welcome.',
    imageUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1',
    category: 'sports',
    location: {
      latitude: 37.7831,
      longitude: -122.4039,
      address: '101 Beach Court, San Francisco, CA',
    },
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    expiresAt: new Date(Date.now() + 86400000 * 10).toISOString(),
    views: 221,
    reactions: 89,
    userId: 'user14',
    businessName: 'Indian Volleyball Association',
    discount: '15% GROUP DISCOUNT',
    couponCode: 'VOLLEYBALL15',
    averageRating: 4.4,
    reviewCount: 10
  },
  {
    id: '15',
    title: 'Tennis Coaching Classes',
    description: 'Learn tennis from professional coaches. Classes for beginners, intermediate, and advanced players. Special discount for group registrations. Equipment provided.',
    imageUrl: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0',
    category: 'sports',
    location: {
      latitude: 37.7859,
      longitude: -122.4071,
      address: '202 Tennis Club, San Francisco, CA',
    },
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    expiresAt: new Date(Date.now() + 86400000 * 30).toISOString(),
    views: 176,
    reactions: 64,
    userId: 'user15',
    businessName: 'Indian Tennis Academy',
    discount: '10% OFF FIRST MONTH',
    couponCode: 'TENNIS10',
    averageRating: 4.3,
    reviewCount: 8
  }
];

export const getFilteredFlyers = (
  category: Category | null, 
  latitude: number | null, 
  longitude: number | null
): Flyer[] => {
  let filtered = [...mockFlyers];
  
  // Filter by category if provided
  if (category) {
    filtered = filtered.filter(flyer => flyer.category === category);
  }
  
  // Calculate distance if location is provided
  if (latitude !== null && longitude !== null) {
    filtered = filtered.map(flyer => {
      const distance = calculateDistance(
        latitude,
        longitude,
        flyer.location.latitude,
        flyer.location.longitude
      );
      return { ...flyer, distance };
    });
    
    // Sort by distance
    filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0));
  } else {
    // Sort by creation date if no location
    filtered.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  
  return filtered;
};

export const getTrendingFlyers = (): Flyer[] => {
  return mockFlyers
    .filter(flyer => flyer.isTrending)
    .sort((a, b) => b.reactions - a.reactions);
};

// Haversine formula to calculate distance between two points
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return parseFloat(d.toFixed(1));
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};