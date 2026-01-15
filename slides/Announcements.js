import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions
} from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getUserNotifications } from "../config/apis";

const { height } = Dimensions.get('window');

const announcements = [
  { id: "1", date: "2025-09-24", title: "Welcome" },
  { id: "2", date: "2024-08-12", title: "Welcome to the App" },
];

export default function AnnouncementsScreen({ navigation }) {
  const [announcements, setAnnouncements] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const fetchAnnouncements = async () => {
    try {
      const response = await getUserNotifications();
      console.log(response)
      setAnnouncements(response);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const openModal = (item) => {
    setSelectedAnnouncement(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedAnnouncement(null);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <ImageBackground
        source={require("../assets/notch.jpg")}
        style={styles.header}
        imageStyle={styles.headerImage}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Icon name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Announcements</Text>
        </View>
      </ImageBackground>

      {/* Announcements List */}
      <FlatList
        data={announcements}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openModal(item)} activeOpacity={0.8}>
            <View style={styles.card}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.date}>
                {item.createdAt ? formatDateTime(item.createdAt) : item.date}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Floating Refresh Button */}
      <TouchableOpacity style={styles.refreshButton} onPress={fetchAnnouncements}>
        <Text style={styles.refreshIcon}>↻</Text>
      </TouchableOpacity>

      {/* Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => { }}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Notification Details</Text>
                  <TouchableOpacity onPress={closeModal}>
                    <Icon name="close" size={24} color="#555" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalBody}>
                  {selectedAnnouncement && (
                    <>
                      <Text style={styles.modalDate}>
                        {selectedAnnouncement.createdAt ? formatDateTime(selectedAnnouncement.createdAt) : selectedAnnouncement.date}
                      </Text>
                      <Text style={styles.modalItemTitle}>{selectedAnnouncement.title}</Text>
                      <View style={styles.divider} />
                      <Text style={styles.modalText}>
                        {selectedAnnouncement.description ||
                          selectedAnnouncement.content ||
                          selectedAnnouncement.body ||
                          selectedAnnouncement.message ||
                          "No detailed description available."}
                      </Text>
                    </>
                  )}
                </ScrollView>

                <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBF5EE",
  },
  header: {
    width: "100%",
    height: 140,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: "hidden",
    justifyContent: "center", // vertically centered
  },
  headerImage: {
    resizeMode: "cover",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // centers the title horizontally
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 20,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#000",
    letterSpacing: 1,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: "#F6EFE9",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  date: {
    color: "#7B7B7B",
    fontSize: 10,
    marginLeft: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: "#222",
    flex: 1,
  },
  refreshButton: {
    position: "absolute",
    bottom: 25,
    right: 25,
    backgroundColor: "#F8CF93",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  refreshIcon: {
    fontSize: 26,
    color: "#000",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: height * 0.7,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  modalBody: {
    marginBottom: 20,
  },
  modalDate: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  modalItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
  closeButton: {
    backgroundColor: '#F8CF93',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});
