import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// NOTE: In a real app, this entire component would be rendered inside a 
// <Modal> from 'react-native' or a specialized library like 
// @react-native-community/datetimepicker for native UI.

const TimePickerModal = ({ isVisible, onClose, onSelectTime }) => {
  const [hour, setHour] = useState('10');
  const [minute, setMinute] = useState('02');
  const [ampm, setAmpm] = useState('AM');

  // Simple placeholder logic for demonstrating selection
  const handleSelect = (selectedHour, selectedMinute, selectedAmpm) => {
    setHour(selectedHour);
    setMinute(selectedMinute);
    setAmpm(selectedAmpm);
  };

  const handleOK = () => {
    onSelectTime(`${hour}:${minute} ${ampm}`);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.timePickerCard}>
          <Text style={styles.selectTimeHeader}>Select time</Text>

          {/* Time Digits and AM/PM Selector */}
          <View style={styles.timeDisplayContainer}>
            {/* Hour */}
            <TouchableOpacity style={[styles.timeDigitBox, styles.timeDigitActive]} onPress={() => handleSelect('10', minute, ampm)}>
              <Text style={styles.timeDigitText}>{hour}</Text>
            </TouchableOpacity>
            <Text style={styles.colon}>:</Text>
            {/* Minute */}
            <TouchableOpacity style={styles.timeDigitBox} onPress={() => handleSelect(hour, '02', ampm)}>
              <Text style={styles.timeDigitText}>{minute}</Text>
            </TouchableOpacity>
            
            {/* AM/PM */}
            <View style={styles.ampmContainer}>
              <TouchableOpacity 
                style={[styles.ampmButton, ampm === 'AM' && styles.ampmActive]} 
                onPress={() => setAmpm('AM')}
              >
                <Text style={[styles.ampmText, ampm === 'AM' && styles.ampmTextActive]}>AM</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.ampmButton, ampm === 'PM' && styles.ampmActive]} 
                onPress={() => setAmpm('PM')}
              >
                <Text style={[styles.ampmText, ampm === 'PM' && styles.ampmTextActive]}>PM</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Clock Face (Simplified Representation) */}
          <View style={styles.clockFaceContainer}>
            <View style={styles.clockFace}>
                {/* Clock numbers and hand can be complex with position: absolute. 
                    This is a simplified visual representation. */}
                <Text style={[styles.clockNumber, { top: '5%', right: '45%' }]}>12</Text>
                <Text style={[styles.clockNumber, { top: '20%', right: '15%' }]}>1</Text>
                {/* Hand Position for 10 */}
                <View style={[styles.clockHand, { transform: [{ rotate: '-120deg' }] }]}>
                    <View style={styles.handLine}></View>
                    <View style={styles.handDot}></View>
                </View>
                {/* Placeholder for Hour Indicator */}
                <View style={styles.hourIndicatorActive}>
                    <Text style={styles.hourIndicatorText}>10</Text>
                </View>
            </View>
          </View>
          
          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <MaterialCommunityIcons name="keyboard-outline" size={24} color="#666" />
            <View style={styles.buttonGroup}>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.actionButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleOK}>
                <Text style={styles.actionButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </View>
    </Modal>
  );
};

const pickerStyles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    timePickerCard: {
        width: '85%',
        backgroundColor: '#F5F5F5', // Background color of the dialog itself
        borderRadius: 15,
        paddingTop: 20,
    },
    selectTimeHeader: {
        fontSize: 14,
        color: '#666',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    // Time Digits and AM/PM
    timeDisplayContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    timeDigitBox: {
        backgroundColor: 'transparent',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 8,
    },
    timeDigitActive: {
        backgroundColor: '#FFEBD6', // Light gold background
    },
    timeDigitText: {
        fontSize: 48,
        fontWeight: '300',
        color: '#000',
    },
    colon: {
        fontSize: 48,
        fontWeight: '300',
        color: '#000',
        marginHorizontal: 5,
    },
    ampmContainer: {
        marginLeft: 15,
        justifyContent: 'center',
    },
    ampmButton: {
        paddingVertical: 5,
        paddingHorizontal: 8,
        borderRadius: 5,
        marginBottom: 4,
    },
    ampmActive: {
        backgroundColor: '#CEFCD0', // Light green background
    },
    ampmText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    ampmTextActive: {
        color: '#000',
    },
    // Clock Face (Very Simplified Styling)
    clockFaceContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    clockFace: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#F5F5F5', // Lighter background for the clock circle
        borderWidth: 1,
        borderColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
    },
    hourIndicatorActive: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#B8860B',
        justifyContent: 'center',
        alignItems: 'center',
        // Example position near 10 o'clock - requires complex math for actual clock positions
        left: 45, 
        top: 45,
    },
    hourIndicatorText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    clockHand: {
        position: 'absolute',
        width: '50%',
        height: '50%',
        // Center of the clock
        transformOrigin: 'bottom left', 
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    handLine: {
        width: 3,
        height: '80%',
        backgroundColor: '#B8860B',
    },
    handDot: {
        width: 15,
        height: 15,
        borderRadius: 7.5,
        backgroundColor: '#B8860B',
        position: 'absolute',
        bottom: 0,
    },
    clockNumber: {
        position: 'absolute',
        // Positioning numbers is complex and omitted for full accuracy
    },
    // Action Buttons
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 15,
        paddingTop: 10,
    },
    buttonGroup: {
        flexDirection: 'row',
        width: '50%',
        justifyContent: 'space-around',
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#B8860B',
        paddingHorizontal: 10,
    },
});

export default TimePickerModal;
// Use the styles defined above when integrating into the ConferenceRoomBookingScreen