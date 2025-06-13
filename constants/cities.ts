export interface City {
  name: string;
  state: string;
  latitude: number;
  longitude: number;
}

export const popularCities: City[] = [
  // Major Indian-American population centers
  { name: "Edison", state: "NJ", latitude: 40.5187, longitude: -74.4121 },
  { name: "Jersey City", state: "NJ", latitude: 40.7282, longitude: -74.0776 },
  { name: "Queens", state: "NY", latitude: 40.7282, longitude: -73.7949 },
  { name: "Fremont", state: "CA", latitude: 37.5485, longitude: -121.9886 },
  { name: "Sunnyvale", state: "CA", latitude: 37.3688, longitude: -122.0363 },
  { name: "San Jose", state: "CA", latitude: 37.3382, longitude: -121.8863 },
  { name: "Chicago", state: "IL", latitude: 41.8781, longitude: -87.6298 },
  { name: "Houston", state: "TX", latitude: 29.7604, longitude: -95.3698 },
  { name: "Dallas", state: "TX", latitude: 32.7767, longitude: -96.7970 },
  { name: "Atlanta", state: "GA", latitude: 33.7490, longitude: -84.3880 },
  { name: "Naperville", state: "IL", latitude: 41.7508, longitude: -88.1535 },
  { name: "Iselin", state: "NJ", latitude: 40.5743, longitude: -74.3232 },
  { name: "Artesia", state: "CA", latitude: 33.8658, longitude: -118.0831 },
  { name: "Cupertino", state: "CA", latitude: 37.3230, longitude: -122.0322 },
  { name: "Bellevue", state: "WA", latitude: 47.6101, longitude: -122.2015 },
  { name: "Ashburn", state: "VA", latitude: 39.0438, longitude: -77.4874 },
  { name: "Alpharetta", state: "GA", latitude: 34.0754, longitude: -84.2941 },
  { name: "Cary", state: "NC", latitude: 35.7915, longitude: -78.7811 },
  { name: "Sugar Land", state: "TX", latitude: 29.6197, longitude: -95.6349 },
  { name: "Irvine", state: "CA", latitude: 33.6846, longitude: -117.8265 },
  { name: "Plano", state: "TX", latitude: 33.0198, longitude: -96.6989 },
  { name: "Chandler", state: "AZ", latitude: 33.3062, longitude: -111.8413 },
  { name: "Schaumburg", state: "IL", latitude: 42.0334, longitude: -88.0834 },
  { name: "Herndon", state: "VA", latitude: 38.9695, longitude: -77.3861 },
  { name: "Farmington Hills", state: "MI", latitude: 42.4989, longitude: -83.3677 },
  { name: "Piscataway", state: "NJ", latitude: 40.5549, longitude: -74.4649 },
  { name: "Hicksville", state: "NY", latitude: 40.7684, longitude: -73.5251 },
  { name: "Flushing", state: "NY", latitude: 40.7654, longitude: -73.8318 },
  { name: "Cerritos", state: "CA", latitude: 33.8583, longitude: -118.0647 },
  { name: "Milpitas", state: "CA", latitude: 37.4323, longitude: -121.8996 },
];

export const states = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];