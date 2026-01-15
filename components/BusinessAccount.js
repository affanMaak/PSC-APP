import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Keyboard
} from "react-native";
import { supabase } from '../lib/supabase';
import { useNavigation } from '@react-navigation/native';

const BusinessAccount = ({ route }) => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    businessName: '',
    phoneNumber: '',
    shopNumber: '',
    area: '',
    city: '',
    businessType: ''
  });
  const [businessTypes, setBusinessTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [businessId, setBusinessId] = useState(null);
    const theme = {
    primary: '#543A14',    
    secondary: '#8B5A2B',  
    background: 'black', 
    text: '#FFF0DC',
    textSecondary: '#8B5A2B',
    border: '#d4c9b8'
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          Alert.alert("Authentication Error", "Please login to continue");
          navigation.navigate('Login');
          return;
        }
        setUser(user);
        
        // Check if we're in edit mode (passed from navigation)
        if (route.params?.isEditing) {
          setIsEditing(true);
          loadBusinessData(user.id);
        } else {
          // Check if user already has a business
          const { data: businessData } = await supabase
            .from('business_users')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (businessData) {
            // If business exists, navigate to home screen
            navigation.replace('BusinessHome');
            return;
          }
        }
        
        // Load business types
        const { data, error: typesError } = await supabase
          .from('business_types')
          .select('*');
        
        if (!typesError) {
          setBusinessTypes(data);
        } else {
          Alert.alert("Error", "Failed to load business types");
        }
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };
    
    initialize();
  }, [route.params]);

  const loadBusinessData = async (userId) => {
    try {
      const { data: businessData, error } = await supabase
        .from('business_users')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      setFormData({
        businessName: businessData.business_name,
        phoneNumber: businessData.phone_number,
        shopNumber: businessData.shop_number || '',
        area: businessData.area || '',
        city: businessData.city || '',
        businessType: businessData.business_type.toString()
      });
      setBusinessId(businessData.id);
    } catch (error) {
      Alert.alert("Error", "Failed to load business data");
    }
  };

  const validatePhoneNumber = (number) => {
    const pakistaniPhoneRegex = /^03[0-9]{9}$/;
    return pakistaniPhoneRegex.test(number);
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();
    
    if (!formData.businessName || !formData.phoneNumber || !formData.businessType) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    if (!validatePhoneNumber(formData.phoneNumber)) {
      Alert.alert('Error', 'Please enter a valid Pakistani phone number (03XXXXXXXXX)');
      return;
    }

    setLoading(true);
    
    try {
      if (isEditing) {
        // Update existing business
        const { error } = await supabase
          .from('business_users')
          .update({
            business_name: formData.businessName,
            phone_number: formData.phoneNumber,
            shop_number: formData.shopNumber,
            area: formData.area,
            city: formData.city,
            business_type: parseInt(formData.businessType)
          })
          .eq('id', businessId);

        if (error) throw error;
        
        Alert.alert('Success', 'Business details updated successfully');
        navigation.goBack();
      } else {
        // Create new business
        const { error } = await supabase
          .from('business_users')
          .insert([{
            business_name: formData.businessName,
            phone_number: formData.phoneNumber,
            shop_number: formData.shopNumber,
            area: formData.area,
            city: formData.city,
            business_type: parseInt(formData.businessType),
            user_id: user.id
          }]);

        if (error) throw error;
        
        navigation.replace('BusinessHome');
      }
    } catch (error) {
      let errorMessage = error.message;
      if (error.code === '23505') {
        errorMessage = 'This business is already registered';
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>
        {isEditing ? 'Edit Business Details' : 'Business Registration'}
      </Text>
 
      <Text style={[styles.label, { color: theme.text }]}>Business Name *</Text>
      <TextInput
        style={[styles.input, { borderColor: theme.border, color: theme.text }]}
        placeholder="Enter business name"
        placeholderTextColor="#888"
        value={formData.businessName}
        onChangeText={text => setFormData({ ...formData, businessName: text })}
        editable={!loading}
      />

      <Text style={[styles.label, { color: theme.text }]}>Phone Number *</Text>
      <TextInput
        style={[styles.input, { borderColor: theme.border, color: theme.text }]}
        placeholder="03XXXXXXXXX"
        placeholderTextColor="#888"
        keyboardType="phone-pad"
        value={formData.phoneNumber}
        onChangeText={text => setFormData({ ...formData, phoneNumber: text })}
        editable={!loading}
        maxLength={11}
      />

      <Text style={[styles.label, { color: theme.text }]}>Business Type *</Text>
      <TouchableOpacity
        style={[styles.dropdownSelector, { borderColor: theme.border }]}
        onPress={() => {
          Keyboard.dismiss();
          setDropdownOpen(!dropdownOpen);
        }}
        disabled={loading}
      >
        <Text style={{ color: formData.businessType ? theme.text : '#888' }}>
          {formData.businessType
            ? businessTypes.find(bt => bt.id.toString() === formData.businessType)?.name
            : 'Select Business Type'}
        </Text>
      </TouchableOpacity>

      {dropdownOpen && (
        <View style={[styles.dropdownList, { borderColor: theme.border }]}>
          <FlatList
            data={businessTypes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setFormData({ ...formData, businessType: item.id.toString() });
                  setDropdownOpen(false);
                }}
              >
                <Text style={{ color: theme.text }}>{item.name}</Text>
              </TouchableOpacity>
            )}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}

      <Text style={[styles.label, { color: theme.text }]}>Shop Number</Text>
      <TextInput
        style={[styles.input, { borderColor: theme.border, color: theme.text }]}
        placeholder="Enter shop number"
        placeholderTextColor="#888"
        value={formData.shopNumber}
        onChangeText={text => setFormData({ ...formData, shopNumber: text })}
        editable={!loading}
      />

      <Text style={[styles.label, { color: theme.text }]}>Area</Text>
      <TextInput
        style={[styles.input, { borderColor: theme.border, color: theme.text }]}
        placeholder="Enter area"
        placeholderTextColor="#888"
        value={formData.area}
        onChangeText={text => setFormData({ ...formData, area: text })}
        editable={!loading}
      />

      <Text style={[styles.label, { color: theme.text }]}>City</Text>
      <TextInput
        style={[styles.input, { borderColor: theme.border, color: theme.text }]}
        placeholder="Enter city"
        placeholderTextColor="#888"
        value={formData.city}
        onChangeText={text => setFormData({ ...formData, city: text })}
        editable={!loading}
      />

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: theme.primary },
          loading && styles.disabledButton
        ]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {isEditing ? 'Update Business' : 'Register Business'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     flex: 1,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "bold",
//     marginBottom: 20,
//     textAlign : 'center'
//   },
//   label: {
//     marginTop: 15,
//     fontSize: 16,
//     fontWeight: "600"
//   },
//   input: {
//     borderWidth: 1,
//     borderRadius: 8,
//     padding: 10,
//     marginTop: 5,
//     backgroundColor: "#1E1E1E",

//   },
//   dropdownSelector: {
//     borderWidth: 1,
//     borderRadius: 8,
//     padding: 10,
//     marginTop: 5,
//     backgroundColor: "#1E1E1E",
//   },
//   dropdownList: {
//     borderWidth: 1,
//     borderRadius: 8,
//     marginTop: 5,
//     maxHeight: 150,
//     backgroundColor: "#1E1E1E",
//   },
//   dropdownItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//     backgroundColor: "#1E1E1E",
//   },
//   button: {
//     padding: 15,
//     borderRadius: 24,
//     marginTop: 30,
//     alignItems: "center",
//     borderColor :'#FFF0DC',
//     borderWidth : 1,
//     borderColor : '#FFF0DC'
//   },
//   disabledButton: {
//     opacity: 0.6
//   },
//   buttonText: {
//     color: "#FFF0DC",
//     fontWeight: "bold",
//     fontSize: 16
//   }
// });
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#000",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFF0DC",
    marginBottom: 30,
    textAlign: "center",
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFF0DC",
    marginTop: 16,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#1E1E1E",
    color: "#FFF0DC",
    borderWidth: 1,
    borderColor: "#d4c9b8",
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
  },
  dropdownSelector: {
    backgroundColor: "#1E1E1E",
    borderColor: "#d4c9b8",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  dropdownList: {
    backgroundColor: "#1E1E1E",
    borderColor: "#d4c9b8",
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 6,
    maxHeight: 160,
    overflow: "hidden",
  },
  dropdownItem: {
    padding: 12,
    borderBottomColor: "#2c2c2c",
    borderBottomWidth: 1,
  },
  button: {
    marginTop: 30,
    paddingVertical: 16,
    backgroundColor: "#543A14",
    borderRadius: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFF0DC",
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFF0DC",
    fontSize: 16,
    fontWeight: "bold",
  },
});


export default BusinessAccount;