import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
  Modal,
  TextInput,
  ScrollView,
  ImageBackground,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconAD from 'react-native-vector-icons/AntDesign';
import {
  getCurrentAdmin,
  getAdminReservations,
  cancelReservation,
  updateReservation,
  formatDateTime,
  formatDateForInput,
} from '../../config/apis';

const { width } = Dimensions.get('window');

const THEME_COLOR = 'rgba(216, 184, 54, 0.9)'; // Gold
const SECONDARY_COLOR = '#1A1A1A'; // Deep Black/Gray
const BG_COLOR = '#F5F5F5';
const CARD_BG = '#FFFFFF';

const ReservationsScreen = ({ navigation }) => {
  const [admin, setAdmin] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editForm, setEditForm] = useState({
    startDate: '',
    endDate: '',
    remarks: '',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const adminData = await getCurrentAdmin();
      if (!adminData) {
        setError('No active admin session. Please login again.');
        setLoading(false);
        return;
      }
      setAdmin(adminData);

      const reservationsData = await getAdminReservations(adminData.id);
      setReservations(reservationsData || []);
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Failed to load reservations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleCancelReservation = (reservation) => {
    if (!reservation?.id) {
      Alert.alert('Error', 'Invalid reservation ID');
      return;
    }

    Alert.alert(
      'Cancel Reservation',
      `Are you sure you want to cancel the reservation for "${reservation.resourceName || 'this resource'}"?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelReservation(reservation.id);
              setReservations(prev => prev.filter(r => r.id !== reservation.id));
              Alert.alert('Success', 'Reservation has been cancelled.');
            } catch (error) {
              console.error('Cancel error:', error);
              Alert.alert(
                'Error',
                error.response?.data?.message || 'Failed to cancel reservation. Please try again.'
              );
            }
          },
        },
      ]
    );
  };

  const handleModifyReservation = (reservation) => {
    setSelectedReservation(reservation);
    setEditForm({
      startDate: formatDateForInput(reservation.startTime || reservation.startDate),
      endDate: formatDateForInput(reservation.endTime || reservation.endDate),
      remarks: reservation.remarks || '',
    });
    setModalVisible(true);
  };

  const handleSaveModification = async () => {
    if (!editForm.startDate || !editForm.endDate) {
      Alert.alert('Error', 'Please enter both start and end dates.');
      return;
    }

    try {
      const start = new Date(editForm.startDate);
      const end = new Date(editForm.endDate);

      if (start >= end) {
        Alert.alert('Error', 'End date must be after start date.');
        return;
      }

      const updateData = {
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        remarks: editForm.remarks,
      };

      await updateReservation(selectedReservation.id, updateData);

      setReservations(prev =>
        prev.map(r =>
          r.id === selectedReservation.id
            ? { ...r, ...updateData }
            : r
        )
      );

      Alert.alert('Success', 'Reservation updated successfully.');
      setModalVisible(false);
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to update reservation.'
      );
    }
  };

  const getTypeColor = (type) => {
    switch (type?.toUpperCase()) {
      case 'ROOM': return '#4A90E2';
      case 'HALL': return '#9013FE';
      case 'LAWN': return '#7ED321';
      case 'PHOTOSHOOT': return '#F5A623';
      default: return '#9B9B9B';
    }
  };

  const renderReservationItem = ({ item }) => (
    <View style={styles.reservationCard}>
      <View style={styles.cardHeader}>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.resourceName}>{item.resourceName || 'Accommodation'}</Text>
          <View style={[styles.typeBadge, { backgroundColor: getTypeColor(item.type) }]}>
            <Text style={styles.typeText}>{item.type || 'N/A'}</Text>
          </View>
        </View>
        <Text style={styles.reservationId}>#{item.id}</Text>
      </View>

      <View style={styles.cardDivider} />

      <View style={styles.datesContainer}>
        <View style={styles.dateRow}>
          <Icon name="time-outline" size={18} color={THEME_COLOR} style={styles.dateIcon} />
          <View>
            <Text style={styles.dateLabel}>Check-in</Text>
            <Text style={styles.dateValue}>{formatDateTime(item.startTime || item.startDate)}</Text>
          </View>
        </View>

        <View style={styles.dateRow}>
          <Icon name="exit-outline" size={18} color="#FF6B6B" style={styles.dateIcon} />
          <View>
            <Text style={styles.dateLabel}>Check-out</Text>
            <Text style={styles.dateValue}>{formatDateTime(item.endTime || item.endDate)}</Text>
          </View>
        </View>
      </View>

      {item.remarks ? (
        <View style={styles.remarksContainer}>
          <Icon name="chatbubble-ellipses-outline" size={16} color="#666" style={{ marginRight: 6 }} />
          <Text style={styles.remarksText} numberOfLines={2}>{item.remarks}</Text>
        </View>
      ) : null}

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.button, styles.modifyButton]}
          onPress={() => handleModifyReservation(item)}
        >
          <Icon name="create-outline" size={18} color="#FFF" />
          <Text style={styles.modifyButtonText}>Modify</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => handleCancelReservation(item)}
        >
          <Icon name="trash-outline" size={18} color="#FFF" />
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../assets/notch.jpg')}
        style={styles.headerBg}
        imageStyle={styles.headerImage}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <IconAD name="arrowleft" size={26} color="black" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>My Reservations</Text>
            {admin?.name && <Text style={styles.adminWelcome}>Admin: {admin.name}</Text>}
          </View>
          <View style={{ width: 40 }} />
        </View>
      </ImageBackground>

      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={THEME_COLOR} />
          <Text style={styles.loadingText}>Fetching your reservations...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={60} color="#FF6B6B" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : reservations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="calendar-clear-outline" size={80} color="#DDD" />
          <Text style={styles.emptyText}>No Reservations Found</Text>
          <Text style={styles.emptySubText}>You haven't made any reservations yet.</Text>
        </View>
      ) : (
        <FlatList
          data={reservations}
          renderItem={renderReservationItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[THEME_COLOR]}
              tintColor={THEME_COLOR}
            />
          }
        />
      )}

      {/* Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Modify Reservation</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalScroll}>
              <Text style={styles.resourceNameLabel}>
                {selectedReservation?.resourceName}
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Start Date (YYYY-MM-DD)</Text>
                <TextInput
                  style={styles.textInput}
                  value={editForm.startDate}
                  onChangeText={(text) => setEditForm(prev => ({ ...prev, startDate: text }))}
                  placeholder="2024-01-01"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>End Date (YYYY-MM-DD)</Text>
                <TextInput
                  style={styles.textInput}
                  value={editForm.endDate}
                  onChangeText={(text) => setEditForm(prev => ({ ...prev, endDate: text }))}
                  placeholder="2024-01-02"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Remarks / Notes</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={editForm.remarks}
                  onChangeText={(text) => setEditForm(prev => ({ ...prev, remarks: text }))}
                  placeholder="Add any specific instructions or remarks..."
                  multiline
                  numberOfLines={4}
                />
              </View>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveModification}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  headerBg: {
    paddingTop: 50,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  headerImage: {
    opacity: 0.9,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 12,
  },
  titleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: SECONDARY_COLOR,
    letterSpacing: 0.5,
  },
  adminWelcome: {
    fontSize: 12,
    color: '#555',
    fontWeight: '600',
    marginTop: 2,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  reservationCard: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerTitleWrap: {
    flex: 1,
  },
  resourceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SECONDARY_COLOR,
    marginBottom: 6,
  },
  reservationId: {
    fontSize: 12,
    color: '#AAA',
    fontWeight: '600',
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  typeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 12,
  },
  datesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0.48,
  },
  dateIcon: {
    marginRight: 10,
  },
  dateLabel: {
    fontSize: 11,
    color: '#888',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  dateValue: {
    fontSize: 13,
    color: '#333',
    fontWeight: '700',
    marginTop: 2,
  },
  remarksContainer: {
    flexDirection: 'row',
    backgroundColor: '#F9F9F9',
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
  },
  remarksText: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 0.48,
    flexDirection: 'row',
    height: 45,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modifyButton: {
    backgroundColor: THEME_COLOR,
  },
  cancelButton: {
    backgroundColor: '#FF6B6B',
  },
  modifyButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginVertical: 20,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: THEME_COLOR,
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
  },
  emptySubText: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: SECONDARY_COLOR,
  },
  modalScroll: {
    padding: 25,
  },
  resourceNameLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME_COLOR,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1.5,
    borderColor: '#EFEFEF',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#FAFAFA',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: THEME_COLOR,
    height: 55,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: THEME_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ReservationsScreen;