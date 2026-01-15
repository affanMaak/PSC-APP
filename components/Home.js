import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';

export default function Home({ navigation, users, session }) {
  const loggedInUser = users.find(user => user.id === session?.user?.id);
  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {loggedInUser ? (
          <Text style={styles.title}>Welcome, {loggedInUser.username}!</Text>
        ) : (
          <Text style={styles.title}>Welcome to Expense Tracker</Text>
        )}
        <Text style={styles.subtitle}>Manage your finances effortlessly</Text>
      </View>

      {/* <Image 
        source={require('../assets/home.jpg')} 
        style={styles.image} 
        resizeMode="contain"
      /> */}
      <Image 
        source={require('../assets/logo1.png')} 
        style={styles.image} 
        resizeMode="contain"
      />

      <Text style={styles.sectionTitle}>Continue as..</Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('BusinessAccount', { users, session })}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Business Account</Text>
            <Text style={styles.buttonDescription}>
              Manage business sales and expenses in one place
            </Text>
          </View>
          <View style={[styles.buttonIcon, styles.businessIcon]}>
            <Text style={styles.iconText}>💼</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('PersonalAccount', { users, session })}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Personal Account</Text>
            <Text style={styles.buttonDescription}>
              Track expenses and split bills with friends
            </Text>
          </View>
          <View style={[styles.buttonIcon, styles.personalIcon]}>
            <Text style={styles.iconText}>👤</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>a product of Code Club</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black',
  },
  header: {
    marginTop: 100,
    marginBottom: 10, // Reduced margin
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF0DC',
    marginBottom: 5,
    textAlign: 'center', // Center title
  },
  subtitle: {
    fontSize: 16,
    color: '#D2B48C',
    opacity: 0.8,
    textAlign: 'center', // Center subtitle
  },
  image: {
    width: '60%', // Responsive width
    height: Dimensions.get('window').height * 0.18, // Reduced height
    borderRadius: 15,
    marginVertical: 10,
    alignSelf: 'center', // Center horizontally
  },
  sectionTitle: {
    color: '#FFF0DC',
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 15,
  },
  buttonsContainer: {
    flex: 0,
   paddingVertical: 20,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#543A14',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#D2B48C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonContent: {
    flex: 1,
    paddingRight: 15,
  },
  buttonText: {
    color: '#FFF0DC',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  buttonDescription: {
    fontSize: 14,
    color: '#BBB',
    lineHeight: 20,
  },
  buttonIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  businessIcon: {
    backgroundColor: 'rgba(84, 58, 20, 0.3)',
    borderColor: '#D2B48C',
    borderWidth: 1,
  },
  personalIcon: {
    backgroundColor: 'rgba(84, 58, 20, 0.3)',
    borderColor: '#D2B48C',
    borderWidth: 1,
  },
  iconText: {
    fontSize: 28,
  },
  footer: {
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#333',
    marginTop: 10,
  },
  footerText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
})