import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, Modal } from 'react-native';
import { colors } from '@/constants/colors';
import { Calendar, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import DateTimePicker from '@react-native-community/datetimepicker';

interface DatePickerProps {
  label: string;
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  maxMonths?: number; // Maximum number of months from now
}

export default function DatePicker({
  label,
  value,
  onChange,
  placeholder = "Select a date",
  maxMonths = 2 // Default to 2 months max
}: DatePickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  
  // Calculate the maximum allowed date (current date + maxMonths)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + maxMonths);
  
  // Calculate the minimum date (today)
  const minDate = new Date();
  
  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    
    // Set initial date to current value or today
    if (value) {
      setTempDate(new Date(value));
    } else {
      setTempDate(new Date());
    }
    
    setShowPicker(true);
  };
  
  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    
    if (selectedDate) {
      setTempDate(selectedDate);
      
      if (Platform.OS === 'ios') {
        // For iOS, we'll confirm the date when the user presses "Done"
      } else {
        // For Android, we'll confirm the date immediately
        const formattedDate = selectedDate.toISOString().split('T')[0];
        onChange(formattedDate);
      }
    }
  };
  
  const handleCancel = () => {
    setShowPicker(false);
  };
  
  const handleConfirm = () => {
    const formattedDate = tempDate.toISOString().split('T')[0];
    onChange(formattedDate);
    setShowPicker(false);
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };
  
  const formatDisplayDate = (dateString: string): string => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={handlePress}
      >
        <Calendar size={20} color={colors.textSecondary} style={styles.icon} />
        <Text style={[
          styles.pickerText,
          !value && styles.placeholderText
        ]}>
          {value ? formatDisplayDate(value) : placeholder}
        </Text>
      </TouchableOpacity>
      
      <Text style={styles.helperText}>
        Flyers can be active for up to {maxMonths} months from today
      </Text>
      
      {Platform.OS === 'ios' && (
        <Modal
          visible={showPicker}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={handleCancel}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                
                <Text style={styles.modalTitle}>Select Date</Text>
                
                <TouchableOpacity onPress={handleConfirm}>
                  <Text style={styles.doneText}>Done</Text>
                </TouchableOpacity>
              </View>
              
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                minimumDate={minDate}
                maximumDate={maxDate}
              />
            </View>
          </View>
        </Modal>
      )}
      
      {Platform.OS === 'android' && showPicker && (
        <DateTimePicker
          value={tempDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={minDate}
          maximumDate={maxDate}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  icon: {
    marginRight: 12,
  },
  pickerText: {
    fontSize: 16,
    color: colors.text,
  },
  placeholderText: {
    color: colors.textSecondary,
  },
  helperText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  cancelText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  doneText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
});