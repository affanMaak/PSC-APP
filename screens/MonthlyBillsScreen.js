import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Linking,
  ImageBackground,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getBaseUrl, listMonthlyBills } from '../config/apis';

const API_BASE_URL = getBaseUrl ? getBaseUrl() : 'https://admin.peshawarservicesclub.com/api';

// Helper function to get auth token
const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem('access_token');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Month names for display
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MonthlyBillsScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(true);
  const [bills, setBills] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('01');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [membershipNumber, setMembershipNumber] = useState('');

  // Current year for dropdown options
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());

  useEffect(() => {
    // Get membership number from route params or user data
    const loadMembershipNumber = async () => {
      if (route?.params?.membershipNumber) {
        setMembershipNumber(route.params.membershipNumber);
      } else {
        try {
          const userData = await AsyncStorage.getItem('user_data');
          if (userData) {
            const parsed = JSON.parse(userData);
            const memberNo = parsed?.Membership_No || parsed?.membershipNo || '';
            setMembershipNumber(memberNo);
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      }
    };

    loadMembershipNumber();
  }, [route?.params?.membershipNumber]);

  useEffect(() => {
    fetchBills();
  }, [selectedMonth, selectedYear, membershipNumber]);

  const fetchBills = async () => {
    if (!membershipNumber) {
      console.log('⚠️ No membership number available');
      setBills([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log(`📋 Fetching bills for month: ${selectedMonth}, year: ${selectedYear}`);

      // Fetch all bills for the selected month/year
      const billsData = await listMonthlyBills(selectedMonth, selectedYear);
      console.log('📦 Bills received:', billsData);

      const billsArray = Array.isArray(billsData) ? billsData : [billsData].filter(Boolean);

      // CLIENT-SIDE FILTERING: Filter bills for current user only
      const userBills = billsArray.filter(bill => {
        const fileName = bill.url || bill.filename || '';
        return fileName.includes('/' + membershipNumber + '_') ||
          fileName.endsWith(membershipNumber + '_bill.pdf');
      });

      console.log(`✅ Filtered to ${userBills.length} bills for member ${membershipNumber}`);
      setBills(userBills);
    } catch (err) {
      console.error('❌ Error fetching bills:', err);
      if (err.message?.includes('404')) {
        console.log('No bills found for this period (404)');
        setBills([]);
      } else {
        Alert.alert('Error', err.message || 'Failed to fetch bills');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleViewBill = async (bill) => {
    try {
      console.log('📄 Opening bill:', bill);

      let fullUrl = bill.url;
      if (!fullUrl) {
        Alert.alert('Error', 'Bill URL not available');
        return;
      }

      // Ensure URL starts with http/https
      if (fullUrl.startsWith('/')) {
        const baseUrl = getBaseUrl().replace('/api', '');
        fullUrl = `${baseUrl}${fullUrl}`;
      } else if (!fullUrl.startsWith('http')) {
        fullUrl = `https://admin.peshawarservicesclub.com${fullUrl}`;
      }

      console.log('🔗 Full bill URL:', fullUrl);

      const supported = await Linking.canOpenURL(fullUrl);
      if (supported) {
        await Linking.openURL(fullUrl);
      } else {
        try {
          await Linking.openURL(fullUrl);
        } catch (fallbackErr) {
          Alert.alert(
            'Cannot Open PDF',
            'Unable to open the PDF. Please try downloading instead.',
            [{ text: 'OK' }]
          );
          console.error('❌ Fallback failed:', fallbackErr);
        }
      }
    } catch (err) {
      console.error('❌ Error opening bill:', err);
      Alert.alert(
        'Error',
        'Failed to open bill PDF. Please try downloading instead.'
      );
    }
  };

  const handleDownloadBill = async (bill) => {
    try {
      console.log('📥 Downloading bill:', bill);

      let fullUrl = bill.url;
      if (!fullUrl) {
        Alert.alert('Error', 'Bill URL not available');
        return;
      }

      if (fullUrl.startsWith('/')) {
        const baseUrl = getBaseUrl().replace('/api', '');
        fullUrl = `${baseUrl}${fullUrl}`;
      } else if (!fullUrl.startsWith('http')) {
        fullUrl = `https://admin.peshawarservicesclub.com${fullUrl}`;
      }

      console.log('🔗 Full download URL:', fullUrl);

      const supported = await Linking.canOpenURL(fullUrl);
      if (supported) {
        await Linking.openURL(fullUrl);
        Alert.alert(
          'Download Started',
          'The bill will be downloaded to your device.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', 'Cannot open download link');
      }
    } catch (err) {
      console.error('❌ Error downloading bill:', err);
      Alert.alert('Error', 'Failed to download bill');
    }
  };

  const renderBillItem = ({ item }) => (
    <View style={styles.billCard}>
      <View style={styles.billHeader}>
        <View style={styles.billIconContainer}>
          <Icon name="file-pdf-box" size={32} color="#B48A64" />
        </View>
        <View style={styles.billInfo}>
          <Text style={styles.billFilename} numberOfLines={1}>
            {item.filename || `Bill_${selectedMonth}_${selectedYear}.pdf`}
          </Text>
          <Text style={styles.billPeriod}>
            {monthNames[parseInt(selectedMonth) - 1]} {selectedYear}
          </Text>
        </View>
      </View>

      <View style={styles.billActions}>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => handleViewBill(item)}
          activeOpacity={0.7}
        >
          <Icon name="eye-outline" size={20} color="#B48A64" />
          <Text style={styles.viewButtonText}>VIEW</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.downloadButton}
          onPress={() => handleDownloadBill(item)}
          activeOpacity={0.7}
        >
          <Icon name="download-outline" size={20} color="#FFF" />
          <Text style={styles.downloadButtonText}>DOWNLOAD</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Icon name="file-remove-outline" size={64} color="#999" />
      <Text style={styles.emptyTitle}>No Bills Found</Text>
      <Text style={styles.emptyText}>
        No monthly bills available for the selected filters.
      </Text>
    </View>
  );

  const renderLoadingComponent = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#B48A64" />
      <Text style={styles.loadingText}>Loading Bills...</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="black" />

      {/* Notch Header */}
      <ImageBackground
        source={require('../assets/notch.jpg')}
        style={styles.notch}
        imageStyle={styles.notchImage}
      >
        <View style={styles.notchContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>

          <Text style={styles.headerText}>Monthly Bills</Text>

          <TouchableOpacity
            style={styles.refreshButton}
            onPress={fetchBills}
          >
            <Icon name="refresh" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.contentWrapper}>
          {/* Filter Card */}
          <View style={styles.filterCard}>
            <Text style={styles.cardTitle}>Filter Bills</Text>

            <View style={styles.filterRow}>
              <View style={styles.filterField}>
                <Text style={styles.filterLabel}>Month</Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => {
                    setShowMonthDropdown(!showMonthDropdown);
                    setShowYearDropdown(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.dropdownText}>
                    {monthNames[parseInt(selectedMonth) - 1]}
                  </Text>
                  <Icon name="chevron-down" size={20} color="#B48A64" />
                </TouchableOpacity>
              </View>

              <View style={styles.filterField}>
                <Text style={styles.filterLabel}>Year</Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => {
                    setShowYearDropdown(!showYearDropdown);
                    setShowMonthDropdown(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.dropdownText}>{selectedYear}</Text>
                  <Icon name="chevron-down" size={20} color="#B48A64" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Membership Info */}
            {membershipNumber && (
              <View style={styles.membershipInfo}>
                <Icon name="account-outline" size={16} color="#666" />
                <Text style={styles.membershipText}>
                  Membership: {membershipNumber}
                </Text>
              </View>
            )}
          </View>

          {/* Month Dropdown Modal */}
          {showMonthDropdown && (
            <View style={styles.dropdownModal}>
              {monthNames.map((month, index) => (
                <TouchableOpacity
                  key={month}
                  style={styles.dropdownOption}
                  onPress={() => {
                    setSelectedMonth(String(index + 1).padStart(2, '0'));
                    setShowMonthDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownOptionText}>{month}</Text>
                  {selectedMonth === String(index + 1).padStart(2, '0') && (
                    <Icon name="check" size={20} color="#B48A64" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Year Dropdown Modal */}
          {showYearDropdown && (
            <View style={styles.dropdownModal}>
              {yearOptions.map((year) => (
                <TouchableOpacity
                  key={year}
                  style={styles.dropdownOption}
                  onPress={() => {
                    setSelectedYear(year);
                    setShowYearDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownOptionText}>{year}</Text>
                  {selectedYear === year && (
                    <Icon name="check" size={20} color="#B48A64" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Bill List */}
          {loading ? (
            renderLoadingComponent()
          ) : (
            <FlatList
              data={bills}
              renderItem={renderBillItem}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={renderEmptyComponent}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1E9',
  },
  contentWrapper: {
    paddingVertical: 20,
  },
  scrollView: {
    backgroundColor: '#F5F1E9',
  },

  // Notch Header Styles (matching BillPaymentsScreen)
  notch: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomEndRadius: 30,
    borderBottomStartRadius: 30,
    overflow: 'hidden',
    minHeight: 120,
  },
  notchImage: {
    resizeMode: 'cover',
  },
  notchContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    flex: 1,
  },
  refreshButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Filter Card Styles
  filterCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#543A14',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 15,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
  },
  filterField: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F2E8DF',
    padding: 15,
    borderRadius: 10,
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  membershipInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E8DDD0',
  },
  membershipText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },

  // Dropdown Modal Styles
  dropdownModal: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxHeight: 250,
  },
  dropdownOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  dropdownOptionText: {
    fontSize: 14,
    color: '#333',
  },

  // Bill Card Styles
  billCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    marginHorizontal: 15,
    borderWidth: 1,
    borderColor: '#E8DDD0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  billHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  billIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F2E8DF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  billInfo: {
    flex: 1,
  },
  billFilename: {
    fontSize: 16,
    fontWeight: '700',
    color: '#543A14',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  billPeriod: {
    fontSize: 12,
    color: '#999',
  },
  billActions: {
    flexDirection: 'row',
    gap: 10,
  },
  viewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#B48A64',
    backgroundColor: 'transparent',
    gap: 8,
  },
  viewButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B48A64',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  downloadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#F5E6D3',
    borderWidth: 2,
    borderColor: '#B48A64',
    gap: 8,
  },
  downloadButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B48A64',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // List & Empty State Styles
  listContent: {
    padding: 8,
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    backgroundColor: '#FFF',
    borderRadius: 15,
    marginHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E8DDD0',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#543A14',
    marginTop: 16,
    letterSpacing: 0.5,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
    lineHeight: 20,
  },

  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});

export default MonthlyBillsScreen;
