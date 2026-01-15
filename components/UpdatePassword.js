import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { supabase } from '../lib/supabase';

export default function UpdatePassword({ navigation }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Check if user has a session (meaning they came from the reset link)
 useEffect(() => {
  const handlePasswordReset = async () => {
    // Extract tokens from URL (you may need to pass this via navigation)
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (session) {
      // User is authenticated via the reset link, can update password
      setUserAuthenticated(true);
    }
  };
  
  handlePasswordReset();
}, []);

const updatePassword = async (newPassword) => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });
  
  if (error) {
    Alert.alert('Error', error.message);
  } else {
    Alert.alert('Success', 'Password updated successfully');
    navigation.navigate('Auth');
  }
};
  const handleUpdatePassword = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert(
          'Success!', 
          'Your password has been updated successfully.',
          [
            {
              text: 'Continue to Login',
              onPress: () => navigation.navigate('Auth')
            }
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Set New Password</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>New Password</Text>
          <View style={styles.passwordInput}>
            <TextInput
              style={styles.input}
              placeholder="Enter new password (min 6 characters)"
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              editable={!loading}
            />
            <TouchableOpacity 
              style={styles.showHide}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.showHideText}>
                {showPassword ? 'HIDE' : 'SHOW'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.passwordInput}>
            <TextInput
              style={styles.input}
              placeholder="Confirm your new password"
              placeholderTextColor="#888"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              editable={!loading}
            />
            <TouchableOpacity 
              style={styles.showHide}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Text style={styles.showHideText}>
                {showConfirmPassword ? 'HIDE' : 'SHOW'}
              </Text>
            </TouchableOpacity>
            </View>
          </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleUpdatePassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFF0DC" />
          ) : (
            <Text style={styles.buttonText}>UPDATE PASSWORD</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF0DC',
    textAlign: 'center',
    marginBottom: 40,
    fontFamily: 'Helvetica Neue',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: '#FFF0DC',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    flex: 1,
    color: '#FFF0DC',
    fontSize: 16,
    padding: 15,
  },
  passwordInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  showHide: {
    paddingHorizontal: 15,
  },
  showHideText: {
    color: '#FFF0DC',
    fontWeight: 'bold',
    fontSize: 12,
  },
  button: {
    backgroundColor: '#543A14',
    padding: 16,
    borderRadius: 28,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#FFF0DC',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFF0DC',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    padding: 16,
    alignItems: 'center',
    marginTop: 15,
  },
  backButtonText: {
    color: '#FFF0DC',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});