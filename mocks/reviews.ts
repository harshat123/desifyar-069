import { Review } from '@/types';

export const mockReviews: Review[] = [
  // Reviews for Patel Brothers (id: '1')
  {
    id: 'rev-001',
    flyerId: '1',
    userId: 'user5',
    userName: 'Priya Sharma',
    rating: 5,
    comment: 'Great selection of Indian groceries! The fresh vegetables were excellent and the spices are authentic. Will definitely shop here again.',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    helpful: 12
  },
  {
    id: 'rev-002',
    flyerId: '1',
    userId: 'user6',
    userName: 'Rahul Patel',
    rating: 4,
    comment: 'Good prices on most items. The store was a bit crowded but staff was helpful. Used the coupon and saved quite a bit!',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    helpful: 8
  },
  {
    id: 'rev-003',
    flyerId: '1',
    userId: 'user7',
    userName: 'Anita Desai',
    rating: 5,
    comment: 'Found all the ingredients I needed for my special Diwali recipes. The discount was a nice bonus!',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    helpful: 15
  },
  
  // Reviews for Taj Mahal Restaurant (id: '2')
  {
    id: 'rev-004',
    flyerId: '2',
    userId: 'user8',
    userName: 'Vikram Singh',
    rating: 4,
    comment: 'The food was delicious and authentic. Service was a bit slow but the free dessert made up for it. Will visit again.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    helpful: 6
  },
  {
    id: 'rev-005',
    flyerId: '2',
    userId: 'user9',
    userName: 'Meera Kapoor',
    rating: 5,
    comment: "Best butter chicken I have had in the Bay Area! The ambiance is great and staff very friendly.",
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    helpful: 11
  },
  
  // Reviews for IPL Cricket Screening (id: '11')
  {
    id: 'rev-006',
    flyerId: '11',
    userId: 'user10',
    userName: 'Arjun Mehta',
    rating: 5,
    comment: 'Amazing atmosphere for watching the IPL! Great crowd, good food, and the free appetizer was delicious. Will definitely come for the next match!',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    helpful: 18
  },
  {
    id: 'rev-007',
    flyerId: '11',
    userId: 'user11',
    userName: 'Kiran Reddy',
    rating: 5,
    comment: 'Perfect place to watch cricket with fellow fans. The special Indian menu was a great touch. Highly recommend!',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    helpful: 14
  },
  {
    id: 'rev-008',
    flyerId: '11',
    userId: 'user12',
    userName: 'Sanjay Kumar',
    rating: 4,
    comment: 'Good screening setup with a big screen. It got a bit crowded during the final overs but overall a great experience.',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    helpful: 7
  },
  
  // Reviews for Badminton Tournament (id: '12')
  {
    id: 'rev-009',
    flyerId: '12',
    userId: 'user13',
    userName: 'Neha Gupta',
    rating: 4,
    comment: 'Well-organized tournament with players of all skill levels. The discount on entry fee was appreciated!',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    helpful: 9
  },
  {
    id: 'rev-010',
    flyerId: '12',
    userId: 'user14',
    userName: 'Raj Malhotra',
    rating: 5,
    comment: 'Great tournament! Met some amazing players and had a lot of fun. The refreshments were a nice touch.',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    helpful: 12
  }
];

export const getReviewsByFlyerId = (flyerId: string): Review[] => {
  return mockReviews
    .filter(review => review.flyerId === flyerId)
    .sort((a, b) => {
      // Sort by helpful count first, then by date
      if (b.helpful !== a.helpful) {
        return b.helpful - a.helpful;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
};

export const getAverageRatingByFlyerId = (flyerId: string): number => {
  const flyerReviews = mockReviews.filter(review => review.flyerId === flyerId);
  
  if (flyerReviews.length === 0) {
    return 0;
  }
  
  const totalRating = flyerReviews.reduce((sum, review) => sum + review.rating, 0);
  return parseFloat((totalRating / flyerReviews.length).toFixed(1));
};