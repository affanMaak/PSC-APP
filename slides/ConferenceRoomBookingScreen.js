import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';

// For the Time Picker (Image 3) - this is how you'd typically handle it.
// Since we can't create a native dialog, we'll use a placeholder function.

const ConferenceRoomBookingScreen = () => {
  const [selectedDate, setSelectedDate] = useState('2025-10-20');
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [attendees, setAttendees] = useState('');

  // Helper function for the "Selected Date" display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = () => {
    console.log('Booking submitted:', { selectedDate, fromTime, toTime, attendees });
    alert(`Conference Room booked on ${formatDateForDisplay(selectedDate)} for ${attendees} attendees.`);
  };

  // Function to simulate opening the time picker dialog (Image 3)
  const handleTimeSelect = (type) => {
    // In a real app, this would open a library like @react-native-community/datetimepicker
    // or a custom modal mimicking the design in Image 3.
    console.log(`--- OPENING TIME PICKER DIALOG for ${type} ---`);
    // Placeholder logic for demonstration:
    if (type === 'From') {
        setFromTime('10:00 AM');
    } else {
        setToTime('12:00 PM');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#D2B48C" />
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* --- Header Section --- */}
        <View style={styles.headerBackground}>
          <View style={styles.headerBar}>
            <Icon name="arrowleft" size={24} color="black" onPress={() => console.log('Go Back')} />
            <Text style={styles.headerTitle}>Conference Room Booking</Text>
          </View>
        </View>

        {/* --- Calendar Card --- */}
        <View style={styles.calendarCard}>
          <Text style={styles.monthSelector}>
            October 2025 <Icon name="caretdown" size={12} color="black" />
          </Text>

          <Calendar
            current={'2025-10-20'}
            hideArrows={false}
            hideExtraDays={true}
            disableMonthChange={true}
            firstDay={1} // Start week on Monday
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={{
              [selectedDate]: {
                selected: true,
                disableTouchEvent: true,
                selectedDotColor: 'white',
                selectedColor: '#B8860B',
              },
            }}
            theme={{
              calendarBackground: 'transparent',
              textSectionTitleColor: '#000000',
              selectedDayBackgroundColor: '#B8860B',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#B8860B',
              dayTextColor: '#000000',
              textDayFontSize: 14,
              textDayFontWeight: '600',
            }}
            style={styles.calendarStyle}
            renderArrow={(direction) => (
              <Icon
                name={direction === 'left' ? 'left' : 'right'}
                size={18}
                color="black"
                style={{ paddingHorizontal: 10 }}
              />
            )}
          />
          <Text style={styles.selectedDateText}>
            Selected Date: <Text style={{ fontWeight: 'bold' }}>{formatDateForDisplay(selectedDate)}</Text>
          </Text>
        </View>

        {/* --- Inputs Section (Time and Attendees) --- */}
        <View style={styles.inputsSection}>
            
          {/* Time Selection */}
          <View style={styles.timeContainer}>
            <TouchableOpacity 
              style={styles.timeInputButton} 
              onPress={() => handleTimeSelect('From')}
            >
              <TextInput
                  style={styles.timeInput}
                  value={fromTime || "From Time"}
                  placeholderTextColor="#666"
                  editable={false} 
              />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.timeInputButton} 
              onPress={() => handleTimeSelect('To')}
            >
              <TextInput
                  style={styles.timeInput}
                  value={toTime || "To Time"}
                  placeholderTextColor="#666"
                  editable={false} 
              />
            </TouchableOpacity>
          </View>

          {/* Number of Attendees */}
          <View style={styles.attendeesInputGroup}>
            <TextInput
              style={styles.attendeesInput}
              onChangeText={setAttendees}
              value={attendees}
              placeholder="Number Of Attendees"
              keyboardType="numeric"
              placeholderTextColor="#666"
            />
            <Feather
              name="users"
              size={20}
              color="#A9A9A9"
              style={styles.attendeesIcon}
            />
          </View>
        </View>

        {/* --- Submit Button --- */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
        
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', 
  },
  scrollContent: {
    paddingBottom: 30,
  },
  // Header Styles
  headerBackground: {
    backgroundColor: '#D2B48C',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 50, 
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
    color: '#000',
  },
  // Calendar Card
  calendarCard: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: -30, 
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  monthSelector: {
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingVertical: 5,
  },
  calendarStyle: {
    borderWidth: 0,
  },
  selectedDateText: {
    alignSelf: 'center',
    marginTop: 15,
    fontSize: 14,
    color: '#555',
  },
  // Inputs Section
  inputsSection: {
    marginHorizontal: 15,
    marginTop: 25,
  },
  // Time Selection Styles
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginHorizontal: -5, // Compensate for button margin
  },
  timeInputButton: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 15,
    paddingHorizontal: 15,
    alignItems: 'flex-start',
  },
  timeInput: {
    fontSize: 16,
    color: '#000',
    padding: 0, 
  },
  // Attendees Input Styles
  attendeesInputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  attendeesInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    paddingLeft: 0,
    color: '#000',
  },
  attendeesIcon: {
    paddingLeft: 10,
  },
  // Submit Button
  submitButton: {
    marginHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#B8860B', 
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ConferenceRoomBookingScreen;