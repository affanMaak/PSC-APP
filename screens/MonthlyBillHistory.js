import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Linking,
  RefreshControl,
  Modal,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { listMonthlyBills, getBaseUrl } from '../config/apis';

// Theme colors - defined outside component for StyleSheet access
const THEME = {
  primary: '#543A14',
  secondary: '#8B5A2B',
  gold: '#b48a64',
  background: '#000',
  card: '#1E1E1E',
  text: '#FFF0DC',
  textSecondary: '#BBB',
  border: '#d4c9b8'
};

const MonthlyBillHistory = ({ navigation }) => {
  // State Management - CRITICAL FIXES
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [allBills, setAllBills] = useState([]); // All bills from API
  const [filteredBills, setFilteredBills] = useState([]); // Filtered bills for current user
  const [currentUser, setCurrentUser] = useState(null);
  const [membershipNo, setMembershipNo] = useState(null); // CRITICAL: Initialize as null

  // Period selectors - Default to March 2026
  const [selectedMonth, setSelectedMonth] = useState('03'); // Default to March
  const [selectedYear, setSelectedYear] = useState('2026'); // Default to 2026
  
  // Dropdown states
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  // Theme colors - reference to external constant
  const theme = THEME;

  // Month names for display
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Generate year options (current year ± 2)
  const currentYear = new Date().getFullYear();
  const yearOptions = [currentYear -2, currentYear - 1, currentYear, currentYear + 1, currentYear + 2];

  // Fetch user data and bills on mount
  useEffect(() => {
    fetchUserData();
  }, []);

  // Fetch bills when month/year changes
  useEffect(() => {
    // Clear previous bills immediately when filters change (prevent ghosting)
    setFilteredBills([]);
    
    if (membershipNo) {
      fetchBills();
    }
  }, [selectedMonth, selectedYear, membershipNo]);

  const fetchUserData = async () => {
   try {
     const userData = await AsyncStorage.getItem('user_data');
     if (userData) {
       const parsedUser= JSON.parse(userData);
        setCurrentUser(parsedUser);
        
        // Extract membership number with sanitization
       const memberNo = parsedUser?.Membership_No || 
                       parsedUser?.membershipNo || 
                       parsedUser?.memberId || 
                       parsedUser?.id || '';
        
        // Sanitize - remove any non-digit characters
       const sanitizedNo= String(memberNo).replace(/[^0-9]/g, '');
        setMembershipNo(sanitizedNo);
        
       console.log('👤 User loaded, Membership No:', sanitizedNo);
      } else {
        setError('User data not found. Please login again.');
      }
    } catch (err) {
     console.error('❌ Error fetching user data:', err);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const fetchBills = async () => {
   if (!membershipNo) return;
    
   try {
      setLoading(true);
      setError(null);
      
     console.log(`📋 Fetching all bills for month: ${selectedMonth}, year: ${selectedYear}`);
      
      // Fetch ALL bills for the selected month/year (not filtered by member)
     const billsData = await listMonthlyBills(selectedMonth, selectedYear);
     console.log('📦 All bills received:', billsData);
      
      // Store all bills
     const billsArray = Array.isArray(billsData) ? billsData : [billsData].filter(Boolean);
      setAllBills(billsArray);
      
      // CLIENT-SIDE FILTERING: Filter bills for current user only using MATHEMATICAL TRUTH
      const myBills = billsArray.filter(bill => {
        // 1. Force the User's ID to a pure integer (Removes 'PSC-', '00', etc.)
        const userNum = parseInt(String(membershipNo).replace(/[^0-9]/g, ''), 10);

        // 2. Extract the Bill's ID from the dedicated field or filename prefix
        const rawBillId = bill.membershipNo || (bill.filename || "").split('_')[0];
        const billNum = parseInt(String(rawBillId).replace(/[^0-9]/g, ''), 10);

        // 3. THE TRUTH TEST: 
        // If user is 3, billNum MUST BE 3. 803 === 3 will always be FALSE.
        const isMatch = billNum === userNum;

        // 4. FORCED DEBUGGING (KILL THE GHOST):
        if (billNum === 803 && userNum === 3 && isMatch === false) {
            console.log("✅ SUCCESS: Blocked Bill 803 from User 3.");
        } else if (isMatch && billNum !== userNum) {
            console.error("🛑 CRITICAL FAILURE: Logic leak detected.");
        }

        return isMatch;
      });
      
     console.log(`✅ Filtered to ${myBills.length} bills for member ${membershipNo}`);
      setFilteredBills(myBills);
      
    } catch (err) {
     console.error('❌ Error fetching bills:', err);
      setError(err.message || 'Failed to fetch bills');
      Alert.alert('Error', err.message || 'Failed to fetch bills');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBills();
  }, [selectedMonth, selectedYear, membershipNo]);

  const handleViewBill = async (bill) => {
   try {
     console.log('📄 Opening bill:', bill);
      
      // Construct full URL from relative path
     let fullUrl = bill.url;
     if (!fullUrl) {
        Alert.alert('Error', 'Bill URL not available');
       return;
      }
      
      // Ensure URL starts with http/https - ROBUST URL HANDLING
     if (fullUrl.startsWith('/')) {
        // Remove/api from base URL and append the relative path
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
        // Fallback: Try opening anyway
       try {
          await Linking.openURL(fullUrl);
        } catch (fallbackErr) {
          Alert.alert(
            'Cannot Open PDF',
            'Unable to open the PDF. Please try downloading instead.',
            [{ text: 'OK' }]
          );
         console.error('❌ Fallback also failed:', fallbackErr);
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
      
      // Construct full URL from relative path
     let fullUrl = bill.url;
     if (!fullUrl) {
        Alert.alert('Error', 'Bill URL not available');
       return;
      }
      
      // Ensure URL starts with http/https - ROBUST URL HANDLING
     if (fullUrl.startsWith('/')) {
        // Remove/api from base URL and append the relative path
       const baseUrl = getBaseUrl().replace('/api', '');
        fullUrl = `${baseUrl}${fullUrl}`;
      } else if (!fullUrl.startsWith('http')) {
        fullUrl = `https://admin.peshawarservicesclub.com${fullUrl}`;
      }
      
     console.log('🔗 Full bill URL for download:', fullUrl);
      
      // For React Native without RNFS/ expo-sharing, use this approach
      // This opens the PDF which user can then save from browser
     const supported = await Linking.canOpenURL(fullUrl);
     if (supported) {
        await Linking.openURL(fullUrl);
        setTimeout(() => {
          Alert.alert(
            'Download Started',
            'The PDF has been opened in your browser. You can save it from there by:\n\n1. Tapping the share/download icon\n2. Selecting "Save to Files" or "Download"',
            [{ text: 'OK' }]
          );
        }, 500);
      } else {
        // Try opening anyway as fallback
       try {
          await Linking.openURL(fullUrl);
          setTimeout(() => {
            Alert.alert(
              'Download Started',
              'The PDF has been opened in your browser. You can save it from there.',
              [{ text: 'OK' }]
            );
          }, 500);
        } catch (fallbackErr) {
          Alert.alert('Error', `Cannot open URL: ${fullUrl}`);
        }
      }
    } catch (err) {
     console.error('❌ Error downloading bill:', err);
      Alert.alert(
        'Error', 
        'Failed to download bill. Please try again later.'
      );
    }
  };

  const renderBillItem = ({ item }) => (
    <View style={[styles.billCard, { backgroundColor: theme.card, borderColor: theme.gold }]}>
      <View style={styles.billHeader}>
        <Icon name="file-pdf-box" size={28} color={theme.gold} />
        <View style={styles.billInfo}>
          <Text style={[styles.billFilename, { color: theme.text }]} numberOfLines={1}>
            {item.filename || `Bill_${item.month || ''}_${item.year || ''}.pdf`}
          </Text>
          <Text style={[styles.billPeriod, { color: theme.textSecondary }]}>
            {monthNames[parseInt(selectedMonth) - 1]} {selectedYear}
          </Text>
        </View>
      </View>
      
      <View style={styles.billActions}>
        <TouchableOpacity
         style={[styles.actionButton, styles.viewButton, { backgroundColor: theme.primary, borderColor: theme.gold }]}
          onPress={() => handleViewBill(item)}
        >
          <Icon name="eye-outline" size={20} color={theme.gold} />
          <Text style={[styles.actionButtonText, { color: theme.text }]}>View</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
         style={[styles.actionButton, styles.downloadButton, { borderColor: theme.gold }]}
          onPress={() => handleDownloadBill(item)}
        >
          <Icon name="download" size={20} color={theme.gold} />
          <Text style={[styles.downloadButtonText, { color: theme.gold }]}>Download</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Icon name="file-remove-outline" size={80} color={theme.textSecondary} />
      <Text style={[styles.emptyTitle, { color: theme.text }]}>No Bills Found</Text>
      <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
        There are no bills found for {monthNames[parseInt(selectedMonth) - 1] || ''} {selectedYear || ''}
        {membershipNo ? ` for membership ${membershipNo}` : ''}.
      </Text>
    </View>
  );

 if (loading && !refreshing) {
   return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.gold} />
        <Text style={[styles.loadingText, { color: theme.text }]}>Loading Bills...</Text>
      </View>
    );
  }

 return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Monthly Bills</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          View and download your monthly bills
        </Text>
      </View>

      {/* Filter Section */}
      <View style={[styles.filterSection, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.filterHeader}>
          <Icon name="filter" size={20} color={theme.gold} />
          <Text style={[styles.filterTitle, { color: theme.text }]}>Filter Period</Text>
        </View>

        <View style={styles.filterRow}>
          {/* Month Selector */}
          <View style={styles.filterField}>
            <Text style={[styles.filterLabel, { color: theme.textSecondary }]}>Month</Text>
            <TouchableOpacity
             style={[styles.dropdown, { borderColor: theme.border }]}
              onPress={() => {
                setShowMonthDropdown(!showMonthDropdown);
                setShowYearDropdown(false);
              }}
            >
              <Text style={[styles.dropdownText, { color: theme.text }]}>
                {monthNames[parseInt(selectedMonth) - 1]}
              </Text>
              <Icon name="chevron-down" size={20} color={theme.gold} />
            </TouchableOpacity>
          </View>

          {/* Year Selector */}
          <View style={styles.filterField}>
            <Text style={[styles.filterLabel, { color: theme.textSecondary }]}>Year</Text>
            <TouchableOpacity
             style={[styles.dropdown, { borderColor: theme.border }]}
              onPress={() => {
                setShowYearDropdown(!showYearDropdown);
                setShowMonthDropdown(false);
              }}
            >
              <Text style={[styles.dropdownText, { color: theme.text }]}>
                {selectedYear}
              </Text>
              <Icon name="chevron-down" size={20} color={theme.gold} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Membership Info */}
        <View style={styles.membershipInfo}>
          <Icon name="account" size={16} color={theme.gold} />
          <Text style={[styles.membershipText, { color: theme.textSecondary }]}>
            Membership: {membershipNo || 'Loading...'}
          </Text>
        </View>
      </View>

      {/* Bills List */}
      {error ? (
        <View style={[styles.errorContainer, { backgroundColor: theme.card }]}>
          <Icon name="alert-circle-outline" size={50} color="#ff6b6b" />
          <Text style={[styles.errorText, { color: theme.text }]}>
            {error}
          </Text>
          <TouchableOpacity
           style={[styles.retryButton, { backgroundColor: theme.primary }]}
            onPress={fetchBills}
          >
            <Text style={[styles.retryButtonText, { color: theme.text }]}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredBills}
         renderItem={renderBillItem}
          keyExtractor={(item, index) => item.id || item.filename || index.toString()}
         contentContainerStyle={styles.listContent}
         refreshControl={
            <RefreshControl
             refreshing={refreshing}
              onRefresh={onRefresh}
             tintColor={theme.gold}
             colors={[theme.gold]}
            />
          }
          ListEmptyComponent={renderEmptyComponent}
        />
      )}

      {/* Month Dropdown Modal */}
      <Modal
        visible={showMonthDropdown}
       transparent
        animationType="fade"
        onRequestClose={() => setShowMonthDropdown(false)}
      >
        <TouchableOpacity
         style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMonthDropdown(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <ScrollView>
              {monthNames.map((month, index) => (
                <TouchableOpacity
                  key={month}
                 style={[
                   styles.monthOption,
                    selectedMonth === (index + 1).toString().padStart(2, '0') && { backgroundColor: theme.primary}
                  ]}
                  onPress={() => {
                    setSelectedMonth((index + 1).toString().padStart(2, '0'));
                    setShowMonthDropdown(false);
                  }}
                >
                  <Text style={[styles.monthOptionText, { color: theme.text }]}>
                    {month}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Year Dropdown Modal */}
      <Modal
        visible={showYearDropdown}
       transparent
        animationType="fade"
        onRequestClose={() => setShowYearDropdown(false)}
      >
        <TouchableOpacity
         style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowYearDropdown(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.card, borderColor: theme.border }]}>
            {yearOptions.map((year) => (
              <TouchableOpacity
                key={year}
               style={[
                 styles.yearOption,
                  selectedYear === year.toString() && { backgroundColor: theme.primary}
                ]}
                onPress={() => {
                  setSelectedYear(year.toString());
                  setShowYearDropdown(false);
                }}
              >
                <Text style={[styles.yearOptionText, { color: theme.text }]}>
                  {year}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  header: {
   padding: 20,
   paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  filterSection: {
    margin: 16,
   padding: 16,
   borderRadius: 12,
   borderWidth: 1,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterField: {
    flex: 1,
    marginHorizontal: 4,
  },
  filterLabel: {
    fontSize: 12,
    marginBottom: 6,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
   padding: 12,
   borderWidth: 1,
   borderRadius: 8,
  },
  dropdownText: {
    fontSize: 14,
  },
  membershipInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
   paddingTop: 12,
   borderTopWidth: 1,
   borderTopColor: '#2c2c2c',
  },
  membershipText: {
    fontSize: 12,
    marginLeft: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
   padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
 retryButton: {
   paddingHorizontal: 24,
   paddingVertical: 12,
   borderRadius: 24,
   borderWidth: 1,
   borderColor: '#d4c9b8',
  },
 retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
   padding: 16,
   paddingBottom: 100,
  },
  billCard: {
   padding: 16,
   borderRadius: 12,
   borderWidth: 1,
    marginBottom: 12,
  },
  billHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  billInfo: {
    flex: 1,
    marginLeft: 12,
  },
  billFilename: {
    fontSize: 16,
    fontWeight: '600',
  },
  billPeriod: {
    fontSize: 12,
    marginTop: 4,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
   padding: 12,
   borderRadius: 8,
   borderWidth: 1,
    backgroundColor: '#543A14',
  },
  viewButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
   color: '#FFF0DC',
  },
  billActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
   padding: 12,
   borderRadius: 8,
   borderWidth: 1,
  },
  downloadButton: {
    backgroundColor: 'transparent',
  },
  downloadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
   paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
   paddingHorizontal: 32,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
   width: '85%',
    maxHeight: '60%',
   borderRadius: 12,
   borderWidth: 1,
    overflow: 'hidden',
  },
  monthOption: {
   padding: 16,
   borderBottomWidth: 1,
   borderBottomColor: '#2c2c2c',
  },
  yearOption: {
   padding: 16,
   borderBottomWidth: 1,
   borderBottomColor: '#2c2c2c',
  },
  monthOptionText: {
    fontSize: 16,
  },
  yearOptionText: {
    fontSize: 16,
  },
});

export default MonthlyBillHistory;
