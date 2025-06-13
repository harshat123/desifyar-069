import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { colors } from '@/constants/colors';
import { MapPin, Search, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// Mock data for address suggestions - expanded to include more US cities
const mockAddressSuggestions = [
  { id: '1', address: '123 Main St, Edison, NJ 08817', lat: 40.5187, lng: -74.4121 },
  { id: '2', address: '456 Oak Ave, Edison, NJ 08820', lat: 40.5234, lng: -74.4156 },
  { id: '3', address: '789 Maple Rd, Edison, NJ 08837', lat: 40.5312, lng: -74.4201 },
  { id: '4', address: '101 Pine Blvd, Edison, NJ 08820', lat: 40.5187, lng: -74.4221 },
  { id: '5', address: '202 Cedar Ln, Edison, NJ 08817', lat: 40.5287, lng: -74.4021 },
  { id: '6', address: '303 Birch Dr, Edison, NJ 08837', lat: 40.5387, lng: -74.4321 },
  { id: '7', address: '404 Elm St, Edison, NJ 08820', lat: 40.5487, lng: -74.4421 },
  { id: '8', address: '505 Willow Ave, Edison, NJ 08817', lat: 40.5587, lng: -74.4521 },
  { id: '9', address: '123 Main St, Fremont, CA 94538', lat: 37.5485, lng: -121.9886 },
  { id: '10', address: '456 Oak Ave, Fremont, CA 94539', lat: 37.5429, lng: -121.9858 },
  { id: '11', address: '789 Maple Rd, Fremont, CA 94536', lat: 37.5391, lng: -121.9579 },
  { id: '12', address: '101 Pine Blvd, Sunnyvale, CA 94086', lat: 37.3688, lng: -122.0363 },
  { id: '13', address: '202 Cedar Ln, Sunnyvale, CA 94087', lat: 37.3713, lng: -122.0439 },
  { id: '14', address: '303 Birch Dr, Cupertino, CA 95014', lat: 37.3230, lng: -122.0322 },
  { id: '15', address: '404 Elm St, Cupertino, CA 95014', lat: 37.3230, lng: -122.0322 },
  { id: '16', address: '505 Willow Ave, San Jose, CA 95129', lat: 37.2960, lng: -121.8527 },
  { id: '17', address: '123 Main St, Chicago, IL 60601', lat: 41.8781, lng: -87.6298 },
  { id: '18', address: '456 Oak Ave, Chicago, IL 60602', lat: 41.8781, lng: -87.6298 },
  { id: '19', address: '789 Maple Rd, Chicago, IL 60603', lat: 41.8781, lng: -87.6298 },
  { id: '20', address: '101 Pine Blvd, New York, NY 10001', lat: 40.7128, lng: -74.0060 },
  { id: '21', address: '202 Cedar Ln, New York, NY 10002', lat: 40.7128, lng: -74.0060 },
  { id: '22', address: '303 Birch Dr, New York, NY 10003', lat: 40.7128, lng: -74.0060 },
  { id: '23', address: '404 Elm St, Houston, TX 77001', lat: 29.7604, lng: -95.3698 },
  { id: '24', address: '505 Willow Ave, Houston, TX 77002', lat: 29.7604, lng: -95.3698 },
];

interface LocationAutocompleteProps {
  value: string;
  onChange: (address: string, lat?: number, lng?: number) => void;
  label: string;
  placeholder?: string;
}

interface AddressSuggestion {
  id: string;
  address: string;
  lat: number;
  lng: number;
}

export default function LocationAutocomplete({
  value,
  onChange,
  label,
  placeholder = "Enter location address"
}: LocationAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (query.trim().length > 2) {
      searchAddresses(query);
    } else {
      setSuggestions([]);
    }
  }, [query]);
  
  const searchAddresses = (searchQuery: string) => {
    // In a real app, this would be an API call to a geocoding service
    // For this demo, we'll use mock data with a simulated delay
    setLoading(true);
    
    setTimeout(() => {
      const filtered = mockAddressSuggestions.filter(
        item => item.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered);
      setLoading(false);
    }, 500);
  };
  
  const handleSelectAddress = (suggestion: AddressSuggestion) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    
    setQuery(suggestion.address);
    onChange(suggestion.address, suggestion.lat, suggestion.lng);
    setShowSuggestions(false);
  };
  
  const handleClearInput = () => {
    setQuery('');
    onChange('');
    setSuggestions([]);
  };
  
  const handleFocus = () => {
    setShowSuggestions(true);
    if (query.trim().length > 2) {
      searchAddresses(query);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      <View style={styles.inputContainer}>
        <MapPin size={20} color={colors.textSecondary} style={styles.inputIcon} />
        
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          onFocus={handleFocus}
        />
        
        {query.length > 0 && (
          <TouchableOpacity onPress={handleClearInput} style={styles.clearButton}>
            <X size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      
      {showSuggestions && (
        <View style={styles.suggestionsContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.loadingText}>Searching addresses...</Text>
            </View>
          ) : suggestions.length > 0 ? (
            <FlatList
              data={suggestions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => handleSelectAddress(item)}
                >
                  <MapPin size={16} color={colors.primary} style={styles.suggestionIcon} />
                  <Text style={styles.suggestionText}>{item.address}</Text>
                </TouchableOpacity>
              )}
              style={styles.suggestionsList}
            />
          ) : query.trim().length > 2 ? (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No addresses found</Text>
              <Text style={styles.noResultsSubtext}>Try a different search term</Text>
            </View>
          ) : null}
        </View>
      )}
      
      <Text style={styles.helperText}>
        Enter your store or event location for customers to find you easily
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    zIndex: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  clearButton: {
    padding: 4,
  },
  suggestionsContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: 200,
    zIndex: 20,
  },
  suggestionsList: {
    padding: 8,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  suggestionIcon: {
    marginRight: 12,
  },
  suggestionText: {
    fontSize: 14,
    color: colors.text,
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.textSecondary,
  },
  noResultsContainer: {
    padding: 16,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  noResultsSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  helperText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
  },
});