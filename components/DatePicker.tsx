import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, Modal } from 'react-native';
import { colors } from '@/constants/colors';
import { Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react-native';
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
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
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
      const dateObj = new Date(value);
      if (!isNaN(dateObj.getTime())) {
        setTempDate(dateObj);
        setCurrentMonth(new Date(dateObj.getFullYear(), dateObj.getMonth(), 1));
      } else {
        const today = new Date();
        setTempDate(today);
        setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
      }
    } else {
      const today = new Date();
      setTempDate(today);
      setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    }
    
    if (Platform.OS === 'ios') {
      setShowPicker(true);
    } else if (Platform.OS === 'android') {
      setShowPicker(true);
    } else {
      setShowCalendarModal(true);
    }
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
    setShowCalendarModal(false);
  };
  
  const handleConfirm = () => {
    const formattedDate = tempDate.toISOString().split('T')[0];
    onChange(formattedDate);
    setShowPicker(false);
    setShowCalendarModal(false);
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };
  
  const formatDisplayDate = (dateString: string): string => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return '';
    }
  };
  
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: '', isCurrentMonth: false, date: null });
    }
    
    // Add days of the current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const isDisabled = date < minDate || date > maxDate;
      const isSelected = tempDate && 
        date.getDate() === tempDate.getDate() && 
        date.getMonth() === tempDate.getMonth() && 
        date.getFullYear() === tempDate.getFullYear();
      
      days.push({ 
        day: i.toString(), 
        isCurrentMonth: true, 
        date, 
        isDisabled,
        isSelected
      });
    }
    
    return days;
  };
  
  const handlePrevMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    
    // Don't allow going before current month
    if (newMonth.getMonth() < minDate.getMonth() && newMonth.getFullYear() <= minDate.getFullYear()) {
      return;
    }
    
    setCurrentMonth(newMonth);
  };
  
  const handleNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    
    // Don't allow going past max month
    if (newMonth.getMonth() > maxDate.getMonth() && newMonth.getFullYear() >= maxDate.getFullYear()) {
      return;
    }
    
    setCurrentMonth(newMonth);
  };
  
  const handleSelectDay = (date: Date | null) => {
    if (!date) return;
    
    setTempDate(date);
    
    // Auto-confirm after a short delay
    setTimeout(() => {
      const formattedDate = date.toISOString().split('T')[0];
      onChange(formattedDate);
      setShowCalendarModal(false);
    }, 200);
  };
  
  const renderWebCalendar = () => {
    const days = generateCalendarDays();
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return (
      <View style={styles.calendarContainer}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={handlePrevMonth} style={styles.monthButton}>
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          
          <Text style={styles.monthTitle}>
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </Text>
          
          <TouchableOpacity onPress={handleNextMonth} style={styles.monthButton}>
            <ChevronRight size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.weekdaysRow}>
          {weekdays.map((day, index) => (
            <Text key={index} style={styles.weekdayText}>{day}</Text>
          ))}
        </View>
        
        <View style={styles.daysGrid}>
          {days.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCell,
                day.isSelected && styles.selectedDay,
                day.isDisabled && styles.disabledDay
              ]}
              onPress={() => day.date && !day.isDisabled && handleSelectDay(day.date)}
              disabled={!day.isCurrentMonth || day.isDisabled}
            >
              <Text style={[
                styles.dayText,
                !day.isCurrentMonth && styles.otherMonthDay,
                day.isSelected && styles.selectedDayText,
                day.isDisabled && styles.disabledDayText
              ]}>
                {day.day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
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
      
      {Platform.OS === 'web' && (
        <Modal
          visible={showCalendarModal}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.webModalContainer}>
            <View style={styles.webModalContent}>
              <View style={styles.webModalHeader}>
                <Text style={styles.webModalTitle}>Select Date</Text>
                <TouchableOpacity onPress={handleCancel} style={styles.webCloseButton}>
                  <X size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
              
              {renderWebCalendar()}
              
              <View style={styles.webModalFooter}>
                <TouchableOpacity onPress={handleCancel} style={styles.webCancelButton}>
                  <Text style={styles.webCancelText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={handleConfirm} style={styles.webConfirmButton}>
                  <Text style={styles.webConfirmText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  // Web calendar styles
  webModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  webModalContent: {
    backgroundColor: colors.card,
    borderRadius: 16,
    width: 320,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1001,
  },
  webModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  webModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  webCloseButton: {
    padding: 4,
  },
  calendarContainer: {
    marginBottom: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  monthButton: {
    padding: 8,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  weekdaysRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
  },
  dayText: {
    fontSize: 14,
    color: colors.text,
  },
  otherMonthDay: {
    opacity: 0,
  },
  selectedDay: {
    backgroundColor: colors.primary,
    borderRadius: 20,
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: '600',
  },
  disabledDay: {
    opacity: 0.4,
  },
  disabledDayText: {
    color: colors.textSecondary,
  },
  webModalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  webCancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  webCancelText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  webConfirmButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  webConfirmText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});