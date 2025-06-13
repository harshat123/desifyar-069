// This is a mock Firebase configuration file
// In a real app, you would use the actual Firebase SDK

// Mock Firebase services
export const mockFirebaseServices = {
  // Auth
  getCurrentUser: () => {
    return {
      uid: 'user123',
      email: 'user@example.com',
      displayName: 'Test User'
    };
  },
  
  // Firestore
  addDocument: async (collection: string, data: any) => {
    console.log(`Adding document to ${collection}:`, data);
    return { id: `doc-${Date.now()}` };
  },
  
  getDocument: async (collection: string, id: string) => {
    console.log(`Getting document from ${collection} with ID ${id}`);
    return { id, ...mockData[collection]?.[0] };
  },
  
  updateDocument: async (collection: string, id: string, data: any) => {
    console.log(`Updating document in ${collection} with ID ${id}:`, data);
    return true;
  },
  
  deleteDocument: async (collection: string, id: string) => {
    console.log(`Deleting document from ${collection} with ID ${id}`);
    return true;
  },
  
  // Storage
  uploadFile: async (path: string, file: any) => {
    console.log(`Uploading file to ${path}`);
    return { downloadURL: 'https://example.com/mock-image.jpg' };
  },
  
  deleteFile: async (path: string) => {
    console.log(`Deleting file from ${path}`);
    return true;
  }
};

// Mock data for different collections
const mockData: Record<string, any[]> = {
  flyers: [
    {
      title: 'Sample Flyer',
      description: 'This is a sample flyer',
      imageUrl: 'https://example.com/sample.jpg',
      category: 'groceries',
      location: {
        latitude: 37.7749,
        longitude: -122.4194,
        address: '123 Main St, San Francisco, CA'
      },
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      views: 0,
      reactions: 0,
      userId: 'user123',
      businessName: 'Sample Business'
    }
  ],
  users: [
    {
      id: 'user123',
      name: 'Test User',
      email: 'user@example.com',
      isVendor: true,
      flyersPosted: 3,
      isPremium: false,
      businessNames: ['Sample Business'],
      redeemedCoupons: [],
      monthlyPostingCount: 3,
      lastPostingMonth: new Date().getMonth()
    }
  ],
  reviews: [
    {
      id: 'review123',
      flyerId: 'flyer123',
      userId: 'user456',
      userName: 'Reviewer Name',
      rating: 4,
      comment: 'Great flyer!',
      createdAt: new Date().toISOString(),
      helpful: 5
    }
  ]
};

// Export a mock initialization function
export const initializeFirebase = () => {
  console.log('Mock Firebase initialized');
  return mockFirebaseServices;
};