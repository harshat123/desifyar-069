import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Stack, router } from 'expo-router';
import { colors } from '@/constants/colors';
import { Receipt, Download, ChevronRight } from 'lucide-react-native';

interface Transaction {
  id: string;
  date: string;
  amount: string;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  receiptUrl?: string;
}

const mockTransactions: Transaction[] = [
  {
    id: 'tx-001',
    date: '2025-06-01',
    amount: '$49.99',
    description: 'Annual Premium Subscription',
    status: 'completed',
    receiptUrl: 'https://example.com/receipt/tx-001',
  },
  {
    id: 'tx-002',
    date: '2025-05-15',
    amount: '$5.99',
    description: 'Flyer Posting - Diwali Sale',
    status: 'completed',
    receiptUrl: 'https://example.com/receipt/tx-002',
  },
  {
    id: 'tx-003',
    date: '2025-05-10',
    amount: '$5.99',
    description: 'Flyer Posting - Restaurant Opening',
    status: 'completed',
    receiptUrl: 'https://example.com/receipt/tx-003',
  },
  {
    id: 'tx-004',
    date: '2025-05-05',
    amount: '$5.99',
    description: 'Flyer Posting - Grocery Sale',
    status: 'completed',
    receiptUrl: 'https://example.com/receipt/tx-004',
  },
  {
    id: 'tx-005',
    date: '2025-05-01',
    amount: '$5.99',
    description: 'Flyer Posting - Cultural Event',
    status: 'completed',
    receiptUrl: 'https://example.com/receipt/tx-005',
  },
];

export default function PaymentHistoryScreen() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.success;
      case 'pending':
        return colors.secondary;
      case 'failed':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };
  
  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionHeader}>
        <Text style={styles.transactionDate}>{formatDate(item.date)}</Text>
        <View style={[
          styles.statusBadge, 
          { backgroundColor: `${getStatusColor(item.status)}20` }
        ]}>
          <Text style={[
            styles.statusText, 
            { color: getStatusColor(item.status) }
          ]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>
      
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionDescription}>{item.description}</Text>
        <Text style={styles.transactionAmount}>{item.amount}</Text>
      </View>
      
      <View style={styles.transactionFooter}>
        <Text style={styles.transactionId}>Transaction ID: {item.id}</Text>
        
        {item.receiptUrl && (
          <TouchableOpacity style={styles.receiptButton}>
            <Download size={16} color={colors.primary} />
            <Text style={styles.receiptText}>Receipt</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="dark" />
      
      <Stack.Screen
        options={{
          title: 'Payment History',
        }}
      />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recent Transactions</Text>
      </View>
      
      <FlatList
        data={mockTransactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransaction}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Receipt size={48} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No transactions yet</Text>
          </View>
        }
      />
      
      <TouchableOpacity 
        style={styles.subscriptionButton}
        onPress={() => router.push('/subscription')}
      >
        <Text style={styles.subscriptionButtonText}>Manage Subscription</Text>
        <ChevronRight size={20} color={colors.primary} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  listContent: {
    padding: 16,
  },
  transactionItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  transactionDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionId: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  receiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  receiptText: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
  },
  subscriptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  subscriptionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
});