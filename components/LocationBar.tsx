import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, FlatList, ActivityIndicator } from 'react-native';
import { useLocationStore } from '@/store/useLocationStore';
import { colors } from '@/constants/colors';
import { popularCities, states, City } from '@/constants/cities';
import { MapPin, RefreshCw, Search, X, ChevronDown } from "lucide-react";

export default function LocationBar() {
  const { latitude, longitude, address, setLocation } = useLocationStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCitySearch, setShowCitySearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCities, setFilteredCities] = useState(popularCities);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [showStateFilter, setShowStateFilter] = useState(false);
  const [searchByZipcode, setSearchByZipcode] = useState(false);

  const requestLocation = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // For web, we'll use the browser's geolocation API
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            
            // In a real app, you would use a reverse geocoding service here
            // For now, we'll just set a generic address
            setLocation(latitude, longitude, "Current Location");
            setLoading(false);
          },
          (err) => {
            setError("Could not fetch location");
            console.error(err);
            setLoading(false);
          }
        );
      } else {
        setError("Geolocation is not supported by this browser");
        setLoading(false);
      }
    } catch (err) {
      setError('Could not fetch location');
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Always request location on component mount
    requestLocation();
  }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    
    if (searchByZipcode) {
      // Handle zipcode search
      // In a real app, you would call an API to get location data from zipcode
      // For now, we'll just filter the cities that might have the zipcode in their name
      const filtered = popularCities.filter(city => 
        city.name.includes(text) || `${city.name}, ${city.state}`.includes(text)
      );
      setFilteredCities(filtered);
    } else {
      // Handle city search
      let filtered = [...popularCities];
      
      // Apply state filter if selected
      if (selectedState) {
        filtered = filtered.filter(city => city.state === selectedState);
      }
      
      // Apply search text filter
      if (text.trim() !== '') {
        filtered = filtered.filter(city => 
          city.name.toLowerCase().includes(text.toLowerCase()) ||
          `${city.name}, ${city.state}`.toLowerCase().includes(text.toLowerCase())
        );
      }
      
      setFilteredCities(filtered);
    }
  };

  const selectCity = (city: City) => {
    setLocation(city.latitude, city.longitude, `${city.name}, ${city.state}`);
    setShowCitySearch(false);
    setSearchQuery('');
    setSelectedState(null);
  };
  
  const handleStateSelect = (state: string) => {
    if (selectedState === state) {
      setSelectedState(null);
    } else {
      setSelectedState(state);
    }
    
    setShowStateFilter(false);
    
    // Filter cities by selected state
    if (state && state !== selectedState) {
      const filtered = popularCities.filter(city => city.state === state);
      setFilteredCities(filtered);
    } else {
      setFilteredCities(popularCities);
    }
  };
  
  const toggleSearchMode = () => {
    setSearchByZipcode(!searchByZipcode);
    setSearchQuery('');
    setFilteredCities(popularCities);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.locationContainer}
        onPress={() => {
          setShowCitySearch(true);
        }}
      >
        <MapPin size={18} color={colors.primary} />
        <Text style={styles.locationText} numberOfLines={1}>
          {address || 'Set your location'}
        </Text>
        <ChevronDown size={16} color={colors.primary} style={styles.chevron} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.refreshButton} 
        onPress={requestLocation}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <RefreshCw size={18} color={colors.primary} />
        )}
      </TouchableOpacity>
      
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={showCitySearch}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCitySearch(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Location</Text>
              <TouchableOpacity 
                onPress={() => setShowCitySearch(false)}
                style={styles.closeButton}
              >
                <X size={20} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Search size={18} color={colors.textSecondary} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder={searchByZipcode ? "Search by zipcode..." : "Search cities..."}
                value={searchQuery}
                onChangeText={handleSearch}
                autoFocus
                keyboardType={searchByZipcode ? "numeric" : "default"}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity 
                  onPress={() => {
                    setSearchQuery('');
                    if (selectedState) {
                      const filtered = popularCities.filter(city => city.state === selectedState);
                      setFilteredCities(filtered);
                    } else {
                      setFilteredCities(popularCities);
                    }
                  }}
                  style={styles.clearButton}
                >
                  <X size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
            
            <View style={styles.searchModeContainer}>
              <TouchableOpacity 
                style={[
                  styles.searchModeButton,
                  !searchByZipcode && styles.activeSearchMode
                ]}
                onPress={() => {
                  if (searchByZipcode) toggleSearchMode();
                }}
              >
                <Text style={[
                  styles.searchModeText,
                  !searchByZipcode && styles.activeSearchModeText
                ]}>
                  Search by City
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.searchModeButton,
                  searchByZipcode && styles.activeSearchMode
                ]}
                onPress={() => {
                  if (!searchByZipcode) toggleSearchMode();
                }}
              >
                <Text style={[
                  styles.searchModeText,
                  searchByZipcode && styles.activeSearchModeText
                ]}>
                  Search by Zipcode
                </Text>
              </TouchableOpacity>
            </View>
            
            {!searchByZipcode && (
              <View style={styles.filterContainer}>
                <TouchableOpacity 
                  style={styles.stateFilterButton}
                  onPress={() => setShowStateFilter(!showStateFilter)}
                >
                  <Text style={styles.stateFilterText}>
                    {selectedState ? `State: ${selectedState}` : 'All USA States'}
                  </Text>
                  <ChevronDown size={16} color={colors.primary} />
                </TouchableOpacity>
                
                {selectedState && (
                  <TouchableOpacity 
                    style={styles.clearFilterButton}
                    onPress={() => {
                      setSelectedState(null);
                      setFilteredCities(popularCities);
                    }}
                  >
                    <X size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                )}
              </View>
            )}
            
            {showStateFilter && !searchByZipcode && (
              <View style={styles.stateListContainer}>
                <FlatList
                  data={states}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={[
                        styles.stateItem,
                        selectedState === item && styles.selectedStateItem
                      ]}
                      onPress={() => handleStateSelect(item)}
                    >
                      <Text style={[
                        styles.stateItemText,
                        selectedState === item && styles.selectedStateItemText
                      ]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                  numColumns={5}
                  contentContainerStyle={styles.stateGrid}
                />
              </View>
            )}

            <Text style={styles.sectionTitle}>
              {searchQuery 
                ? 'Search Results' 
                : searchByZipcode 
                  ? 'Enter a zipcode to search'
                  : selectedState 
                    ? `Cities in ${selectedState}` 
                    : 'Popular Cities in USA'}
            </Text>

            <FlatList
              data={filteredCities}
              keyExtractor={(item) => `${item.name}-${item.state}`}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.cityItem}
                  onPress={() => selectCity(item)}
                >
                  <MapPin size={16} color={colors.primary} />
                  <Text style={styles.cityName}>{item.name}, {item.state}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  {searchByZipcode 
                    ? 'Enter a valid zipcode to search for locations' 
                    : 'No cities found'}
                </Text>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 8,
    flex: 1,
  },
  chevron: {
    marginLeft: 4,
  },
  refreshButton: {
    position: 'absolute',
    right: 16,
    top: 12,
    padding: 4,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingBottom: 30,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  clearButton: {
    padding: 4,
  },
  searchModeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 4,
  },
  searchModeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeSearchMode: {
    backgroundColor: colors.primary,
  },
  searchModeText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  activeSearchModeText: {
    color: '#FFFFFF',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stateFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flex: 1,
  },
  stateFilterText: {
    fontSize: 14,
    color: colors.primary,
    marginRight: 8,
    flex: 1,
  },
  clearFilterButton: {
    padding: 8,
    marginLeft: 8,
    backgroundColor: colors.card,
    borderRadius: 8,
  },
  stateListContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    maxHeight: 200,
  },
  stateGrid: {
    paddingBottom: 8,
  },
  stateItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    margin: 4,
    borderRadius: 4,
    backgroundColor: colors.background,
  },
  selectedStateItem: {
    backgroundColor: colors.primary,
  },
  stateItemText: {
    fontSize: 12,
    color: colors.text,
  },
  selectedStateItemText: {
    color: '#fff',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cityName: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 16,
  },
});