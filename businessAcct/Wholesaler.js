import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Location from './BusinessHome';

const Wholesaler = ({ navigation }) => {
  const businessSections = [
  
    {
      title: 'CHOOSE ONE',
      items: ['Kirana', 'Medical', 'Stationary', 'Mobile' , 'Textile' , 'Automobile' , 'Sports', 'Electronics' , 'Toys' , 'Hardware' , 'Others']
    }
  ];

  const renderSection = ({ item }) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{item.title}</Text>
      <View style={styles.itemsContainer}>
        {item.items.map((buttonText, index) => (
          <TouchableOpacity 
            key={index}
            style={styles.featureButton}
            onPress={() => navigation.navigate(Location)}
          >
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>SELECT BUSINESS CATEGORY</Text>
      <FlatList
        data={businessSections}
        renderItem={renderSection}
        keyExtractor={(item) => item.title}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  header: {
    color: '#FFF0DC',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureButton: {
    backgroundColor: '#222',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    minWidth: 120,
  },
  buttonText: {
    color: '#FFF0DC',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 24,
  },
});

export default Wholesaler;