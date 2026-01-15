import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Linking,
  ImageBackground
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const contact = () => {
  const navigation = useNavigation();

  const handlePhonePress = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmailPress = () => {
    Linking.openURL('mailto:info@peshawarservicesclub.com');
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>

        {/* 🔹 Notch with Image Background */}
        <ImageBackground
          source={require('../assets/notch.jpg')}
          style={styles.notch}
          imageStyle={styles.notchImage}
        >
          <View style={styles.notchContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.navigate('Home')}>
              <Icon name="arrow-back" size={28} color="#000" />
            </TouchableOpacity>
            <Text style={styles.ctext}>Contact Us</Text>
          </View>
        </ImageBackground>

        <SafeAreaView style={styles.safeArea}>
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>

            {/* Info Desk Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.sectionTitle}>Info Desk</Text>
                <View style={styles.timingBadge}>
                  <Icon name="access-time" size={14} color="#5D4037" />
                  <Text style={styles.timingBadgeText}>9am - 8pm</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.contactRow}
                onPress={() => handlePhonePress('09192127534')}>
                <Text style={styles.icon}>📞</Text>
                <Text style={styles.phoneText}>091-9212753-4</Text>
              </TouchableOpacity>
            </View>

            {/* Event Booking Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.sectionTitle}>Event Booking</Text>
                <View style={styles.timingBadge}>
                  <Icon name="access-time" size={14} color="#5D4037" />
                  <Text style={styles.timingBadgeText}>10am - 6pm</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.contactRow}
                onPress={() => handlePhonePress('03419777711')}>
                <Text style={styles.icon}>📞</Text>
                <Text style={styles.phoneText}>0341-9777711</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.contactRow}
                onPress={() => handlePhonePress('0919212753')}>
                <Text style={styles.icon}>📞</Text>
                <Text style={styles.phoneText}>091-9212753-5</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.sectionTitle}>F&B Reservation</Text>
                <View style={styles.timingBadge}>
                  <Icon name="access-time" size={14} color="#5D4037" />
                  <Text style={styles.timingBadgeText}>9am - 10:15pm</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.contactRow}
                onPress={() => handlePhonePress('0345-8518625')}>
                <Text style={styles.icon}>📞</Text>
                <Text style={styles.phoneText}>0345-8518625</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.contactRow}
                onPress={() => handlePhonePress('091-9212755')}>
                <Text style={styles.icon}>📞</Text>
                <Text style={styles.phoneText}>091-9212755</Text>
              </TouchableOpacity>
            </View>
            {/* Room Reservation Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.sectionTitle}>Room Reservation</Text>
                <View style={styles.timingBadge}>
                  <Icon name="access-time" size={14} color="#5D4037" />
                  <Text style={styles.timingBadgeText}>24/7</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.contactRow}
                onPress={() => handlePhonePress('03458518696')}>
                <Text style={styles.icon}>📞</Text>
                <Text style={styles.phoneText}>0345-8518696</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.contactRow}
                onPress={() => handlePhonePress('0919212753')}>
                <Text style={styles.icon}>📞</Text>
                <Text style={styles.phoneText}>091-9212753-4</Text>
              </TouchableOpacity>
            </View>

            {/* Address Card */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Address</Text>
              <Text style={styles.addressText}>Peshawar Services Club</Text>
              <Text style={styles.addressText}>40-The Mall, Peshawar Cantt.</Text>
              <TouchableOpacity
                style={styles.contactRow}
                onPress={() => handlePhonePress('0919212753')}>
                <Text style={styles.icon}>📞</Text>
                <Text style={styles.phoneText}>091-9212753-4</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.contactRow}
                onPress={handleEmailPress}>
                <Text style={styles.icon}>✉️</Text>
                <Text style={styles.emailText}>info@peshawarservicesclub.com</Text>
              </TouchableOpacity>
            </View>


          </ScrollView>
        </SafeAreaView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  notch: {
    paddingTop: 40,
    paddingBottom: 40,
    borderBottomEndRadius: 30,
    borderBottomStartRadius: 30,
    overflow: 'hidden',
    paddingHorizontal: 20,
  },
  notchImage: {
    resizeMode: 'cover',
  },
  notchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    padding: 5,
  },

  ctext: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#000000',
    paddingHorizontal: 10,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#f1e3dcff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    paddingBottom: 8,
  },
  timingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(93, 64, 55, 0.2)',
  },
  timingBadgeText: {
    fontSize: 12,
    color: '#5D4037',
    fontWeight: '600',
    marginLeft: 4,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  icon: {
    fontSize: 20,
    marginRight: 12,
  },
  phoneText: {
    fontSize: 16,
    color: '#000000',
    flex: 1,
  },
  addressText: {
    fontSize: 16,
    color: '#000000',
    marginVertical: 2,
  },
  emailText: {
    fontSize: 16,
    color: '#000000',
    flex: 1,
  },
});

export default contact;