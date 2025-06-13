import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Modal, Platform } from 'react-native';
import { colors } from '@/constants/colors';
import { MapPin, Search, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

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
  // Add more Indian locations
  { id: '25', address: '123 MG Road, Bangalore, Karnataka 560001', lat: 12.9716, lng: 77.5946 },
  { id: '26', address: '456 Linking Road, Mumbai, Maharashtra 400050', lat: 19.0760, lng: 72.8777 },
  { id: '27', address: '789 Connaught Place, New Delhi, Delhi 110001', lat: 28.6139, lng: 77.2090 },
  { id: '28', address: '101 Park Street, Kolkata, West Bengal 700016', lat: 22.5726, lng: 88.3639 },
  { id: '29', address: '202 Anna Salai, Chennai, Tamil Nadu 600002', lat: 13.0827, lng: 80.2707 },
  { id: '30', address: '303 Jubilee Hills, Hyderabad, Telangana 500033', lat: 17.4065, lng: 78.4772 },
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
  const [modalVisible, setModalVisible] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Update query when value changes from outside
    if (value !== query) {
      setQuery(value);
    }
  }, [value]);
  
  useEffect(() => {
    // Clear previous timeout if it exists
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (query.trim().length > 2) {
      // Set a small delay to avoid too many searches while typing
      setLoading(true);
      searchTimeoutRef.current = setTimeout(() => {
        searchAddresses(query);
      }, 300);
    } else {
      setSuggestions([]);
      setLoading(false);
    }
    
    // Cleanup function
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);
  
  const searchAddresses = (searchQuery: string) => {
    // In a real app, this would be an API call to a geocoding service
    // For this demo, we'll use mock data with a simulated delay
    
    setTimeout(() => {
      const filtered = mockAddressSuggestions.filter(
        item => item.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered);
      setLoading(false);
      
      // Show suggestions if we have results
      if (filtered.length > 0) {
        setShowSuggestions(true);
      }
    }, 300);
  };
  
  const handleSelectAddress = (suggestion: AddressSuggestion) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    
    setQuery(suggestion.address);
    onChange(suggestion.address, suggestion.lat, suggestion.lng);
    setShowSuggestions(false);
    setModalVisible(false);
  };
  
  const handleClearInput = () => {
    setQuery('');
    onChange('', undefined, undefined);
    setSuggestions([]);
  };
  
  const handleFocus = () => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      setModalVisible(true);
    } else {
      setShowSuggestions(true);
    }
    
    if (query.trim().length > 2) {
      searchAddresses(query);
    }
  };
  
  const handleChangeText = (text: string) => {
    setQuery(text);
    if (text.trim().length === 0) {
      onChange('', undefined, undefined);
    }
  };
  
  const renderSuggestionsList = () => (
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
  );
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      {Platform.OS === 'web' ? (
        <View style={styles.webInputContainer}>
          <MapPin size={20} color={colors.textSecondary} style={styles.inputIcon} />
          <TextInput
            style={styles.webInput}
            value={query}
            onChangeText={handleChangeText}
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
      ) : (
        <TouchableOpacity 
          style={styles.inputContainer}
          onPress={handleFocus}
          activeOpacity={0.8}
        >
          <MapPin size={20} color={colors.textSecondary} style={styles.inputIcon} />
          
          <Text style={[
            styles.input,
            !query && styles.placeholderText
          ]}>
            {query || placeholder}
          </Text>
          
          {query.length > 0 && (
            <TouchableOpacity onPress={handleClearInput} style={styles.clearButton}>
              <X size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      )}
      
      {Platform.OS === 'web' && showSuggestions && renderSuggestionsList()}
      
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <X size={24} color={colors.text} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Search Location</Text>
            </View>
            
            <View style={styles.searchContainer}>
              <View style={styles.searchInputContainer}>
                <Search size={20} color={colors.textSecondary} style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  value={query}
                  onChangeText={handleChangeText}
                  placeholder="Enter address or location"
                  placeholderTextColor={colors.textSecondary}
                  autoFocus
                />
                {query.length > 0 && (
                  <TouchableOpacity onPress={handleClearInput} style={styles.clearButton}>
                    <X size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            
            {loading ? (
              <View style={styles.modalLoadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.modalLoadingText}>Searching addresses...</Text>
              </View>
            ) : suggestions.length > 0 ? (
              <FlatList
                data={suggestions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalSuggestionItem}
                    onPress={() => handleSelectAddress(item)}
                  >
                    <MapPin size={20} color={colors.primary} style={styles.suggestionIcon} />
                    <Text style={styles.modalSuggestionText}>{item.address}</Text>
                  </TouchableOpacity>
                )}
                style={styles.modalSuggestionsList}
              />
            ) : query.trim().length > 2 ? (
              <View style={styles.modalNoResultsContainer}>
                <Text style={styles.modalNoResultsText}>No addresses found</Text>
                <Text style={styles.modalNoResultsSubtext}>Try a different search term</Text>
              </View>
            ) : (
              <View style={styles.modalInitialState}>
                <Text style={styles.modalInitialText}>
                  Start typing to search for locations
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
      
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
  webInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  webInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    padding: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  placeholderText: {
    color: colors.textSecondary,
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
    position: 'absolute',
    top: 90,
    left: 0,
    right: 0,
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
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    padding: 4,
    marginRight: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  searchContainer: {
    padding: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  modalSuggestionsList: {
    flex: 1,
  },
  modalSuggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalSuggestionText: {
    fontSize: 16,
    color: colors.text,
  },
  modalLoadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalLoadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
  },
  modalNoResultsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalNoResultsText: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  modalNoResultsSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  modalInitialState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalInitialText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});