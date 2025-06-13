import React, { useState } from 'react';
import { StyleSheet, View, TextInput, FlatList, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Flyer } from '@/types';
import { colors } from '@/constants/colors';
import { mockFlyers } from '@/mocks/flyers';
import FlyerCard from '@/components/FlyerCard';
import { Search as SearchIcon } from 'lucide-react-native';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Flyer[]>([]);
  
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    
    if (text.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    // Filter flyers based on search query
    const results = mockFlyers.filter(flyer => 
      flyer.title.toLowerCase().includes(text.toLowerCase()) ||
      flyer.description.toLowerCase().includes(text.toLowerCase())
    );
    
    setSearchResults(results);
  };
  
  const handleFlyerPress = (flyer: Flyer) => {
    router.push(`/flyer/${flyer.id}`);
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="dark" />
      
      <View style={styles.searchContainer}>
        <SearchIcon size={20} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search flyers..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor={colors.textSecondary}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      
      {searchQuery.trim() !== '' && searchResults.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No results found for "{searchQuery}"</Text>
          <Text style={styles.emptySubText}>Try different keywords or browse by category</Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <FlyerCard flyer={item} onPress={handleFlyerPress} />
          )}
          contentContainerStyle={styles.resultsContainer}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            searchQuery.trim() !== '' && searchResults.length > 0 ? (
              <Text style={styles.resultsText}>
                {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found
              </Text>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: colors.text,
  },
  resultsContainer: {
    padding: 16,
  },
  resultsText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});