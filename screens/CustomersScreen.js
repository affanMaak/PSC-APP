import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { supabase } from '../lib/supabase';

export default function CustomersScreen({ navigation }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
    
    const subscription = supabase
      .channel('customers')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'customers' }, () => {
        fetchCustomers();
      })
      .subscribe();

    return () => subscription.unsubscribe();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const addReceivable = async (customerId) => {
    navigation.navigate('TransactionForm', {
      type: 'receivable',
      customerId,
    });
  };

  const recordPayment = async (customerId) => {
    navigation.navigate('PaymentForm', {
      type: 'receivable',
      referenceId: customerId,
    });
  };

  const renderCustomer = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.phone}>{item.phone}</Text>
      <Text style={styles.amount}>Due: ₹{item.total_due.toFixed(2)}</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => addReceivable(item.id)}
        >
          <Text style={styles.buttonText}>Add Transaction</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.payButton]}
          onPress={() => recordPayment(item.id)}
        >
          <Text style={styles.buttonText}>Record Payment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={customers}
        renderItem={renderCustomer}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No customers found</Text>
        }
        refreshing={loading}
        onRefresh={fetchCustomers}
      />
      
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('CustomerForm')}
      >
        <Text style={styles.addButtonText}>+ Add Customer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
      padding: 16,
    },
    card: {
      backgroundColor: '#fff',
      padding: 16,
      borderRadius: 10,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    name: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    },
    phone: {
      fontSize: 14,
      color: '#666',
      marginVertical: 4,
    },
    amount: {
      fontSize: 16,
      fontWeight: '600',
      color: '#e74c3c',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 12,
    },
    button: {
      flex: 1,
      backgroundColor: '#3498db',
      padding: 10,
      borderRadius: 6,
      alignItems: 'center',
      marginHorizontal: 5,
    },
    payButton: {
      backgroundColor: '#2ecc71',
    },
    buttonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: 'bold',
    },
    emptyText: {
      textAlign: 'center',
      fontSize: 16,
      color: '#888',
      marginTop: 20,
    },
    addButton: {
      backgroundColor: '#1abc9c',
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 20,
    },
    addButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  