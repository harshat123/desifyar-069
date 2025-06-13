import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/colors';
import { Bell, Heart, Eye, MessageCircle } from 'lucide-react-native';

interface Notification {
  id: string;
  type: 'view' | 'reaction' | 'comment' | 'system';
  message: string;
  time: string;
  read: boolean;
  flyerId?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'reaction',
    message: 'Your flyer "Weekly Grocery Sale" received 5 new reactions',
    time: '10 minutes ago',
    read: false,
    flyerId: '1',
  },
  {
    id: '2',
    type: 'view',
    message: 'Your flyer "Weekly Grocery Sale" has been viewed 50 times',
    time: '1 hour ago',
    read: false,
    flyerId: '1',
  },
  {
    id: '3',
    type: 'comment',
    message: 'Someone commented on your "Live Music Night" flyer',
    time: '3 hours ago',
    read: true,
    flyerId: '3',
  },
  {
    id: '4',
    type: 'system',
    message: 'Welcome to Local Flyers! Start by creating your first flyer.',
    time: '1 day ago',
    read: true,
  },
];

export default function NotificationsScreen() {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'view':
        return <Eye size={20} color={colors.primary} />;
      case 'reaction':
        return <Heart size={20} color={colors.primary} />;
      case 'comment':
        return <MessageCircle size={20} color={colors.primary} />;
      case 'system':
      default:
        return <Bell size={20} color={colors.primary} />;
    }
  };
  
  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity 
      style={[
        styles.notificationItem,
        item.read ? styles.readNotification : styles.unreadNotification
      ]}
    >
      <View style={styles.iconContainer}>
        {getNotificationIcon(item.type)}
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationTime}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="dark" />
      
      <FlatList
        data={mockNotifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <Text style={styles.headerText}>Notifications</Text>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Bell size={48} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No notifications yet</Text>
            <Text style={styles.emptySubText}>
              You'll be notified when someone interacts with your flyers
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  unreadNotification: {
    backgroundColor: `${colors.primary}10`,
  },
  readNotification: {
    backgroundColor: colors.card,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationMessage: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});