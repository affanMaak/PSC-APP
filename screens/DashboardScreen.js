import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { supabase } from '../lib/supabase';

export default function DashboardScreen() {
  const [summary, setSummary] = useState({
    totalReceivables: 0,
    totalPayables: 0,
    recentTransactions: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Get receivables summary
    const { data: receivables } = await supabase
      .from('receivables')
      .select('amount')
      .eq('user_id', user.id)
      .eq('status', 'pending');

    // Get payables summary
    const { data: payables } = await supabase
      .from('payables')
      .select('amount')
      .eq('user_id', user.id)
      .eq('status', 'pending');

    // Get recent transactions
    const { data: transactions } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', user.id)
      .order('payment_date', { ascending: false })
      .limit(5);

    setSummary({
      totalReceivables: receivables.reduce((acc, curr) => acc + curr.amount, 0),
      totalPayables: payables.reduce((acc, curr) => acc + curr.amount, 0),
      recentTransactions: transactions
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Amount to Receive</Text>
          <Text style={styles.summaryValue}>₹{summary.totalReceivables.toFixed(2)}</Text>
        </View>
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Amount to Pay</Text>
          <Text style={styles.summaryValue}>₹{summary.totalPayables.toFixed(2)}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Recent Transactions</Text>
      {summary.recentTransactions.map(transaction => (
        <View key={transaction.id} style={styles.transactionCard}>
          <Text style={styles.transactionAmount}>₹{transaction.amount.toFixed(2)}</Text>
          <Text style={styles.transactionDate}>
            {new Date(transaction.payment_date).toLocaleDateString()}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 16,
      backgroundColor: '#f8f9fa',
    },
    summaryContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    summaryCard: {
      flex: 1,
      backgroundColor: '#ffffff',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      marginHorizontal: 5,
    },
    summaryLabel: {
      fontSize: 14,
      color: '#666',
      fontWeight: '500',
    },
    summaryValue: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#2c3e50',
      marginTop: 5,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 10,
    },
    transactionCard: {
      backgroundColor: '#fff',
      padding: 15,
      borderRadius: 8,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    transactionAmount: {
      fontSize: 16,
      fontWeight: '600',
      color: '#27ae60',
    },
    transactionDate: {
      fontSize: 14,
      color: '#7f8c8d',
    },
  });