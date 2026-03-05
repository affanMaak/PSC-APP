import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Linking,
  Platform,
  ImageBackground,
  ActivityIndicator,
  Alert,
  Modal,
  Image,
  Clipboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getBaseUrl } from '../config/apis'; // If you have this, otherwise use your API_BASE_URL

const API_BASE_URL = getBaseUrl ? getBaseUrl() : 'https://admin.peshawarservicesclub.com/api';

// API functions
const storeAuthData = async (tokens, userData) => {
  try {
    await AsyncStorage.setItem('access_token', tokens.access_token);
    await AsyncStorage.setItem('refresh_token', tokens.refresh_token);
    await AsyncStorage.setItem('user_data', JSON.stringify(userData));
    console.log('✅ Auth data stored');
  } catch (error) {
    console.error('Error storing auth data:', error);
  }
};

const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem('access_token');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

const getMembershipNumberFromUserData = (userData) => {
  // Try different possible field names for membership number
  return userData?.Membership_No ||
    userData?.membershipNo ||
    userData?.membershipNumber ||
    userData?.memberId ||
    userData?.id ||
    '';
};

const Bills = ({ navigation }) => {
  const [membershipNumber, setMembershipNumber] = useState('');
  const [membershipName, setMembershipName] = useState('');
  const [memberData, setMemberData] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Balance Payment states
  const [amountToPay, setAmountToPay] = useState('');
  const [isGeneratingVoucher, setIsGeneratingVoucher] = useState(false);
  const [generatedVoucher, setGeneratedVoucher] = useState(null);
  const [showVoucherModal, setShowVoucherModal] = useState(false);

  // Payment apps for bank dropdown (for 1 Bill payment)
  const paymentApps = [
    { name: 'Easypaisa' },
    { name: 'JazzCash' },
    { name: 'HBL Mobile' },
    { name: 'Meezan Bank' },
    { name: 'UBL Digital' },
    { name: 'Bank Alfalah' },
    { name: 'MCB Mobile' },
    { name: 'Allied Bank' },
  ];

  // Payment modes - Only Cash and Kuickpay
  const paymentModes = [
    { id: 'cash', label: 'Cash Payment', icon: 'cash', color: '#00A651', type: 'icon' },
    { id: 'kuickpay', label: 'Kuickpay', image: require('../assets/kp.png'), type: 'image' },
  ];

  // Handle bank selection from dropdown
  const handleBankSelect = (bank) => {
    setSelectedBank(bank.name);
    setShowBankDropdown(false);
  };

  // Handle Generate Balance Voucher
  const handleGenerateBalanceVoucher = async () => {
    try {
      // Validate amount
      if (!amountToPay || amountToPay.trim() === '') {
        Alert.alert('Error', 'Please enter an amount to pay');
        return;
      }

      const paymentAmount = Number(amountToPay);
      
      if (isNaN(paymentAmount) || paymentAmount <= 0) {
        Alert.alert('Error', 'Please enter a valid amount');
        return;
      }

      if (paymentAmount > memberData.Balance) {
        Alert.alert('Error', `Amount exceeds your balance of Rs ${memberData.Balance.toLocaleString()}`);
        return;
      }

      setIsGeneratingVoucher(true);

      const token = await getAuthToken();
      const membershipNo = membershipNumber;

      console.log('🔵 Generating balance voucher:', { amountToPay: paymentAmount, membership_no: membershipNo });

      const response = await fetch(
        `${API_BASE_URL}/payment/generate/invoice/balance`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amountToPay: String(paymentAmount),
            membership_no: membershipNo,
          }),
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        console.log('✅ Voucher generated successfully:', responseData);
        
        // Store the voucher data
        setGeneratedVoucher(responseData.voucher || responseData);
        setShowVoucherModal(true);
        
        // Clear the input
        setAmountToPay('');
        
        Alert.alert('Success', 'Payment code generated successfully!');
      } else {
        console.error('❌ Voucher generation failed:', responseData);
        
        // Handle specific error cases
        const errorMessage = responseData.message || responseData.error || 'Failed to generate payment code';
        
        if (errorMessage.includes('Member not found')) {
          Alert.alert('Error', 'Member not found. Please contact support.');
        } else if (errorMessage.includes('Amount exceeds')) {
          Alert.alert('Error', 'Amount exceeds your balance. Please enter a lower amount.');
        } else if (errorMessage.includes('Invalid amount')) {
          Alert.alert('Error', 'Invalid amount entered. Please try again.');
        } else {
          Alert.alert('Error', errorMessage);
        }
      }
    } catch (error) {
      console.error('❌ Error generating voucher:', error);
      Alert.alert('Error', 'Failed to generate payment code. Please try again.');
    } finally {
      setIsGeneratingVoucher(false);
    }
  };

  // Copy consumer number to clipboard
  const copyConsumerNumber = () => {
    if (generatedVoucher?.consumer_number) {
      Clipboard.setString(String(generatedVoucher.consumer_number));
      Alert.alert('Copied!', 'Consumer number copied to clipboard');
    }
  };

  // Check user role and initialize
  const initializeApp = async () => {
    try {
      setLoading(true);
      const userData = await getUserData();

      if (!userData) {
        Alert.alert('Error', 'Please login first');
        navigation.navigate('Login');
        return;
      }

      // Check if user is admin based on role field
      const role = userData?.role || userData?.Role || 'MEMBER';
      setUserRole(role);
      const isUserAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'admin';
      setIsAdmin(isUserAdmin);

      if (isUserAdmin) {
        // For admin, don't auto-fetch member data
        setLoading(false);
      } else {
        // For member, fetch their own data
        fetchMemberData(userData);
      }
    } catch (error) {
      console.error('Error initializing app:', error);
      Alert.alert('Error', 'Failed to initialize app');
      setLoading(false);
    }
  };

  // Fetch member data
  const fetchMemberData = async (userData) => {
    try {
      const token = await getAuthToken();
      const memberId = getMembershipNumberFromUserData(userData);

      if (!memberId) {
        Alert.alert('Error', 'No membership number found');
        setLoading(false);
        return;
      }

      console.log('🔍 Fetching data for membership:', memberId);

      const response = await fetch(
        `${API_BASE_URL}/member/get/members?membershipNo=${memberId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          // Find the EXACT match for the membership number
          const exactMember = data.data.find(
            m => m.Membership_No === memberId ||
              m.membershipNo === memberId ||
              String(m.Membership_No) === String(memberId)
          );

          // If exact match found, use it. Otherwise fall back to first result
          const member = exactMember || data.data[0];

          console.log('✅ Found member:', member.Name, 'with ID:', member.Membership_No);

          setMemberData(member);
          setMembershipNumber(member.Membership_No);
          setMembershipName(member.Name);

          // Fetch additional data
          fetchMemberVouchers(member.Membership_No);
          fetchMemberBookings(member.Membership_No);
        } else {
          Alert.alert('Error', 'Member data not found');
        }
      } else {
        Alert.alert('Error', 'Failed to fetch member data');
      }
    } catch (error) {
      console.error('Error fetching member data:', error);
      Alert.alert('Error', 'Failed to load member data');
    } finally {
      setLoading(false);
    }
  };

  // Search members (admin only)
  const searchMembers = async () => {
    if (!searchTerm.trim()) {
      Alert.alert('Error', 'Please enter search term');
      return;
    }

    try {
      setLoading(true);
      const token = await getAuthToken();

      const response = await fetch(
        `${API_BASE_URL}/member/get/members?search=${encodeURIComponent(searchTerm)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          const member = data.data[0];
          setMemberData(member);
          setMembershipNumber(member.Membership_No);
          setMembershipName(member.Name);
          setSearchTerm('');

          // Fetch additional data for the selected member
          fetchMemberVouchers(member.Membership_No);
          fetchMemberBookings(member.Membership_No);
        } else {
          Alert.alert('Not Found', 'No member found with that search term');
        }
      } else {
        Alert.alert('Error', 'Failed to search members');
      }
    } catch (error) {
      console.error('Error searching members:', error);
      Alert.alert('Error', 'Failed to search members');
    } finally {
      setLoading(false);
    }
  };

  const fetchMemberVouchers = async (membershipNo) => {
    if (!membershipNo) return;

    try {
      const token = await getAuthToken();
      const response = await fetch(
        `${API_BASE_URL}/payment/member/vouchers?membershipNo=${membershipNo}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const vouchers = await response.json();
        console.log('Vouchers:', vouchers);
      }
    } catch (error) {
      console.error('Error fetching vouchers:', error);
    }
  };

  const fetchMemberBookings = async (membershipNo) => {
    if (!membershipNo) return;

    try {
      const token = await getAuthToken();
      const response = await fetch(
        `${API_BASE_URL}/booking/member/bookings?membershipNo=${membershipNo}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const bookings = await response.json();
        console.log('Bookings:', bookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  useEffect(() => {
    initializeApp();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PAID':
      case 'CONFIRMED':
      case 'ACTIVE':
        return <Text style={styles.statusBadgePaid}>{status}</Text>;
      case 'HALF_PAID':
      case 'PENDING':
        return <Text style={styles.statusBadgeHalfPaid}>{status}</Text>;
      case 'UNPAID':
      case 'INACTIVE':
        return <Text style={styles.statusBadgeUnpaid}>{status}</Text>;
      default:
        return <Text style={styles.statusBadge}>{status}</Text>;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#b48a64" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="black" />

      {/* 🔹 Notch Header with Background Image */}
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

          <Text style={styles.headerText}>Bill Payment</Text>

          <TouchableOpacity
            style={styles.refreshButton}
            onPress={initializeApp}
          >
            <Icon name="refresh" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Role Badge */}
        {/* <View style={styles.roleBadgeContainer}>
          <Text style={[styles.roleBadge, isAdmin ? styles.adminBadge : styles.memberBadge]}>
            {isAdmin ? 'Super-Admin' : 'MEMBER'}
          </Text>
        </View> */}

        {/* Search Section - Only for Admin */}
        {isAdmin && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Search Member</Text>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                value={searchTerm}
                onChangeText={setSearchTerm}
                placeholder="Search by name or membership number"
                placeholderTextColor="#999"
              />
              <TouchableOpacity
                style={styles.searchButton}
                onPress={searchMembers}
              >
                <Text style={styles.searchButtonText}>Search</Text>
              </TouchableOpacity>
            </View>
            {searchTerm && !memberData && (
              <Text style={styles.searchHint}>
                Enter a member's name or membership number to search
              </Text>
            )}
          </View>
        )}

        {/* User Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isAdmin ? 'Member Information' : 'Your Information'}
          </Text>

          {(!isAdmin || (isAdmin && memberData)) ? (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Membership Number</Text>
                <TextInput
                  style={styles.input}
                  value={membershipNumber}
                  editable={false}
                  selectTextOnFocus={false}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Member Name</Text>
                <TextInput
                  style={styles.input}
                  value={membershipName}
                  editable={false}
                  selectTextOnFocus={false}
                />
              </View>

              {memberData && (
                <View style={styles.memberDetailsContainer}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Dues</Text>
                    <Text style={[
                      styles.detailValue,
                      memberData.Balance < 0 && styles.negativeBalance
                    ]}>
                      Rs {memberData.Balance?.toLocaleString() || 0}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Account Status</Text>
                    {getStatusBadge(memberData.Status)}
                  </View>

                  {memberData.totalBookings !== undefined && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Total Bookings</Text>
                      <Text style={styles.detailValue}>{memberData.totalBookings || 0}</Text>
                    </View>
                  )}
                </View>
              )}
            </>
          ) : isAdmin ? (
            <View style={styles.noMemberContainer}>
              <Text style={styles.noMemberText}>
                Search for a member to view their information
              </Text>
            </View>
          ) : (
            <View style={styles.noMemberContainer}>
              <Text style={styles.noMemberText}>
                Unable to load member information
              </Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={initializeApp}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

          {!isAdmin && memberData && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Custom Payment</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Enter Amount to Pay (Rs)</Text>
              <TextInput
                style={styles.input}
                value={amountToPay}
                onChangeText={setAmountToPay}
                placeholder="e.g., 5000"
                placeholderTextColor="#999"
                keyboardType="numeric"
                editable={!isGeneratingVoucher}
              />
            </View>

            <View style={styles.balanceInfo}>
              <Text style={styles.balanceInfoText}>
                Your Current Balance: <Text style={styles.balanceAmount}>Rs {memberData.Balance?.toLocaleString() || 0}</Text>
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.generateButton,
                (!amountToPay || Number(amountToPay) <= 0 || Number(amountToPay) > memberData.Balance) && styles.disabledButton
              ]}
              onPress={handleGenerateBalanceVoucher}
              disabled={isGeneratingVoucher || !amountToPay || Number(amountToPay) <= 0 || Number(amountToPay) > memberData.Balance}
            >
              {isGeneratingVoucher ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.generateButtonText}>Generate Payment Code</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.generateNote}>
              Enter the amount you wish to pay. The amount cannot exceed your current balance.
            </Text>
          </View>
        )}

        {/* Voucher Success Modal */}
        {!isAdmin && (
          <Modal
            visible={showVoucherModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowVoucherModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.voucherModalContent}>
                <View style={styles.successHeader}>
                  <Icon name="check-circle" size={60} color="#4CAF50" />
                  <Text style={styles.successTitle}>Payment Code Generated!</Text>
                </View>

                {generatedVoucher && (
                  <View style={styles.voucherDetails}>
                    <View style={styles.voucherRow}>
                      <Text style={styles.voucherLabel}>Consumer Number:</Text>
                      <View style={styles.consumerNumberContainer}>
                        <Text style={styles.consumerNumber}>
                          {generatedVoucher.consumer_number}
                        </Text>
                        <TouchableOpacity
                          style={styles.copyButton}
                          onPress={copyConsumerNumber}
                        >
                          <Icon name="content-copy" size={20} color="#C9A962" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {generatedVoucher.due_date && (
                      <View style={styles.voucherRow}>
                        <Text style={styles.voucherLabel}>Due Date:</Text>
                        <Text style={styles.voucherValue}>
                          {new Date(generatedVoucher.due_date).toLocaleDateString('en-PK', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Text>
                      </View>
                    )}

                    {generatedVoucher.amount && (
                      <View style={styles.voucherRow}>
                        <Text style={styles.voucherLabel}>Amount:</Text>
                        <Text style={styles.voucherValue}>
                          Rs {Number(generatedVoucher.amount).toLocaleString()}
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                <View style={styles.instructionsContainer}>
                  <Text style={styles.instructionsTitle}>How to Use This Code:</Text>
                  
                  <View style={styles.instructionStep}>
                    <Text style={styles.stepNumber}>1</Text>
                    <Text style={styles.instructionText}>Open your banking mobile app (HBL, Meezan, UBL, etc.)</Text>
                  </View>

                  <View style={styles.instructionStep}>
                    <Text style={styles.stepNumber}>2</Text>
                    <Text style={styles.instructionText}>Select <Text style={styles.highlightText}>Kuickpay</Text> payment option</Text>
                  </View>

                  <View style={styles.instructionStep}>
                    <Text style={styles.stepNumber}>3</Text>
                    <Text style={styles.instructionText}>Enter or paste the consumer number shown above</Text>
                  </View>

                  <View style={styles.instructionStep}>
                    <Text style={styles.stepNumber}>4</Text>
                    <Text style={styles.instructionText}>Verify the amount and confirm payment</Text>
                  </View>

                  <View style={styles.instructionStep}>
                    <Text style={styles.stepNumber}>5</Text>
                    <Text style={styles.instructionText}>You will receive a confirmation message</Text>
                  </View>
                </View>

                <View style={styles.warningBox}>
                  <Icon name="information" size={20} color="#FF9800" />
                  <Text style={styles.warningText}>
                    Payment will be reflected in the Club system on the next working day.
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.closeModalButton}
                  onPress={() => setShowVoucherModal(false)}
                >
                  <Text style={styles.closeModalButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}


        {/* Payment Section - Only for Members */}
        {!isAdmin && memberData && (
          <>
            {/* BILL PAYMENT VIA MOBILE APP & OTHER PAYMENT MODES */}
            <View style={styles.section}>
              <Text style={styles.proceduresTitle}>BILL PAYMENT VIA MOBILE APP & OTHER PAYMENT MODES</Text>
              
              <Text style={styles.procedureItem}>
                This guide explains the step-by-step procedure for bill payment through the mobile application of Peshawar Services Club, along with alternative payment options available for members.
              </Text>

              <Text style={styles.procedureItemHighlight}>
                1. Mobile App Payment Procedure (via Kuick Pay)
              </Text>
              
              <Text style={styles.procedureItem}>
                Please note that payment through the mobile app is processed using Kuick Pay services via your personal bank application. Members may pay in advance, partially, or the exact billed amount.
              </Text>

              <Text style={styles.procedureItemHighlight}>
                • Steps to Pay:
              </Text>
              <Text style={styles.procedureItem}>
                1. Open the Club Mobile App and click "Pay Now."{'\n'}
                2. Enter the amount you wish to pay.{'\n'}
                3. A unique payment code will be generated.{'\n'}
                4. Open your personal bank's mobile app.{'\n'}
                5. Select the Kuick Pay payment option.{'\n'}
                6. Enter or paste the unique payment code.{'\n'}
                7. Confirm payment.
              </Text>

              <Text style={styles.procedureItemHighlight}>
                • After Payment:
              </Text>
              <Text style={styles.procedureItem}>
                ✓ You will receive a payment confirmation message on PSC mobile app.{'\n'}
                ✓ Payment will be reflected in the Club system on the next working day.{'\n'}
                ✓ All transactions will be automatically recorded in the app payment history.
              </Text>

              <Text style={styles.procedureItemHighlight}>
                2. Other Modes of Payment
              </Text>

              <Text style={styles.procedureItemHighlight}>
                A. HBL Bill Payment (via HBL Mobile App)
              </Text>
              <Text style={styles.procedureItem}>
                1. Open the HBL mobile app.{'\n'}
                2. Go to More → Other Payments → Corporate Payments.{'\n'}
                3. Search for Peshawar Services Club.{'\n'}
                4. Enter your Membership Number.{'\n'}
                5. Review bill details and enter payment amount.{'\n'}
                6. Confirm the transaction.
              </Text>

              <Text style={styles.procedureItemHighlight}>
                Note:
              </Text>
              <Text style={styles.procedureItem}>
                ✓ You will receive confirmation on your banking app.{'\n'}
                ✓ Payment will be reflected in the Club system on the next working day.
              </Text>

              <Text style={styles.procedureItemHighlight}>
                B. POS (Card) Payment
              </Text>
              <Text style={styles.procedureItem}>
                • Visit the Accounts Department during office hours.{'\n'}
                • Pay via credit or debit card using the POS machine.{'\n'}
                • Payment will be recorded immediately and reflected in the system accordingly.
              </Text>

              <Text style={styles.procedureItemHighlight}>
                C. Cash Payment
              </Text>
              <Text style={styles.procedureItem}>
                • Visit the Accounts Department during office hours.{'\n'}
                • Pay outstanding dues in cash.{'\n'}
                • Payment will be reflected instantly.
              </Text>

              <Text style={styles.procedureItemHighlight}>
                D. Cheque Payment
              </Text>
              <Text style={styles.procedureItem}>
                • Submit cheque in favour (Title) of "Secretary PSC" at the Accounts Department.{'\n'}
                • Payment will be reflected after 2–3 working days (subject to cheque clearance).
              </Text>

              <Text style={styles.procedureItemHighlight}>
                3. Terms & Conditions
              </Text>
              <Text style={styles.procedureItem}>
                • Updated outstanding balances will be available on the mobile app on the next working day after payment.{'\n'}
                • Monthly bills are generated on the 1st of every month.{'\n'}
                • Members are requested to clear dues before the 25th of each month.{'\n'}
                • 5% surcharge will be applied if payment is not made before the due date.{'\n'}
                • Updated bills and previous month bills can be viewed in the mobile app.{'\n'}
                • The mobile app and banking platforms will display outstanding balances of active members only. Members with suspended, terminated, absent, or cancelled status may contact the Accounts Office for bill inquiries.{'\n'}
                • For any clarification regarding billing, members may contact the Accounts Department during office hours.{'\n'}
                • For further information, please visit or call 091-9212753-4
              </Text>
            </View>
          </>
        )}

    
        {/* Admin Message - Only for admin when member data is loaded */}
        {/* {isAdmin && memberData && (
          <View style={styles.section}>
            <Text style={styles.adminMessage}>
              Payment section is only available to members. As an admin, you can only view member information.
            </Text>
          </View>
        )} */}
      </ScrollView>
    </View>
  );
};

// Payment modes data (these are only used for members)
const paymentModes = [
  { id: 'cash', label: 'Cash Payment', icon: 'cash', color: '#00A651', type: 'icon' },
  { id: 'kuickpay', label: 'Kuickpay', image: require('../assets/kp.png'), type: 'image' },
];

const handleBankSelect = (bank) => {
  // This function is only used in member context
  // We'll define this inside the component but it's only called for members
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9EFE6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9EFE6',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
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
  backIcon: {
    fontSize: 36,
    color: '#000',
    fontWeight: 'bold',
  },
  headerText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    flex: 1,
  },
  placeholder: {
    width: 40,
  },
  refreshButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshIcon: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  // Role Badge Styles
  roleBadgeContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  roleBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
    overflow: 'hidden',
  },
  adminBadge: {
    backgroundColor: '#FF6B6B',
    color: '#fff',
  },
  memberBadge: {
    backgroundColor: '#4CAF50',
    color: '#fff',
  },
  // Section Styles
  section: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  billTopUp: {
    color: '#666',
    fontSize: 14,
  },
  selectChannel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    marginTop: 8,
  },
  // Search Styles (Admin)
  searchContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchButton: {
    backgroundColor: '#C9A962',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  searchHint: {
    fontSize: 13,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  // Input Styles
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  // Member Details Styles
  memberDetailsContainer: {
    backgroundColor: '#FFF9F0',
    borderRadius: 10,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E8DDD0',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E8E0',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  negativeBalance: {
    color: '#f44336',
  },
  // Status Badge Styles
  statusBadge: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    color: '#333',
    overflow: 'hidden',
  },
  statusBadgePaid: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    color: 'white',
    overflow: 'hidden',
  },
  statusBadgeHalfPaid: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: '#FF9800',
    color: 'white',
    overflow: 'hidden',
  },
  statusBadgeUnpaid: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: '#f44336',
    color: 'white',
    overflow: 'hidden',
  },
  // No Member Styles
  noMemberContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  noMemberText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: '#C9A962',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  // Dropdown Styles
  dropdown: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dropdownTextPlaceholder: {
    fontSize: 16,
    color: '#999',
  },
  dropdownTextSelected: {
    fontSize: 16,
    color: '#333',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#666',
  },
  dropdownContainer: {
    position: 'relative',
    zIndex: 1000,
  },
  dropdownList: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1001,
  },
  dropdownScrollView: {
    maxHeight: 300,
  },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#333',
  },
  // Payment Modes Styles
  paymentModesSection: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentModesTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 2,
  },
  paymentModesTitleGold: {
    color: '#C9A962',
  },
  paymentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  paymentCard: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#C9A962',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  paymentCardSelected: {
    borderColor: '#00A651',
    backgroundColor: '#F0F8F4',
  },
  paymentMethod: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#C9A962',
  },
  paymentMethodSelected: {
    borderColor: '#00A651',
    backgroundColor: '#F0F8F4',
  },
  paymentIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentIcon: {
    fontSize: 48,
  },
  paymentImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
  },
  paymentImage: {
    width: 100,
    height: 100,
  },
  paymentLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 36,
  },
  methodLabel: {
    fontSize: 13,
    color: '#333',
    textAlign: 'center',
    lineHeight: 18,
  },
  // Procedures Styles
  proceduresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  proceduresSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  proceduresList: {
    paddingLeft: 4,
  },
  procedureItem: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
    marginBottom: 12,
  },
  procedureItemHighlight: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    marginTop: 4,
  },
  // Button Styles
  submitButton: {
    backgroundColor: '#00A651',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  downloadButton: {
    backgroundColor: '#C9A962',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  downloadNote: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  // Important Notice Styles
  noticeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  noticeBox: {
    backgroundColor: '#FFF9E6',
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
    padding: 12,
    borderRadius: 6,
  },
  noticeItem: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
    marginBottom: 8,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    width: '85%',
    maxHeight: '70%',
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  bankList: {
    maxHeight: 300,
  },
  bankItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  bankItemText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#C9A962',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Balance Payment Styles
  balanceInfo: {
    backgroundColor: '#F0F8F4',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  balanceInfoText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  balanceAmount: {
    fontWeight: 'bold',
    color: '#00A651',
    fontSize: 16,
  },
  generateButton: {
    backgroundColor: '#00A651',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  generateButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  generateNote: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  // Voucher Modal Styles
  voucherModalContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  successHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
  },
  voucherDetails: {
    backgroundColor: '#FFF9E6',
    borderLeftWidth: 4,
    borderLeftColor: '#C9A962',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  voucherRow: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E8E0',
  },
  voucherLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
    fontWeight: '600',
  },
  voucherValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '700',
  },
  consumerNumberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  consumerNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  copyButton: {
    padding: 8,
    marginLeft: 8,
  },
  instructionsContainer: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  instructionStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumber: {
    backgroundColor: '#C9A962',
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 10,
    flexShrink: 0,
  },
  instructionText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
    flex: 1,
    paddingTop: 2,
  },
  highlightText: {
    fontWeight: 'bold',
    color: '#C9A962',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 10,
  },
  warningText: {
    fontSize: 13,
    color: '#856404',
    flex: 1,
    lineHeight: 18,
  },
  closeModalButton: {
    backgroundColor: '#C9A962',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  closeModalButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Admin Message
  adminMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 10,
  },
});

export default Bills;