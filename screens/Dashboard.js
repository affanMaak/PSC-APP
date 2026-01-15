// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
// import { SwipeListView } from 'react-native-swipe-list-view';
// import { supabase } from '../lib/supabase';

// export default function Dashboard() {
//   const [summary, setSummary] = useState({
//     totalIncome: 0,
//     totalExpenses: 0,
//     netBalance: 0,
//     recentTransactions: []
//   });

//   const [refreshing, setRefreshing] = useState(false); // Pull-to-refresh state

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     setRefreshing(true);
//     const { data: { user }, error: userError } = await supabase.auth.getUser();
//     if (userError || !user) {
//       console.error("Error fetching user:", userError);
//       setRefreshing(false);
//       return;
//     }

//     const { data, error } = await supabase
//       .from('business_logs')
//       .select('id, amount, type, category, description, log_date')
//       .eq('user_id', user.id)
//       .order('log_date', { ascending: false });

//     if (error) {
//       console.error("Error fetching transactions:", error);
//       setRefreshing(false);
//       return;
//     }

//     let totalIncome = 0, totalExpenses = 0;
//     data.forEach(({ amount, type }) => {
//       if (type === 'income') totalIncome += amount;
//       else if (type === 'expense') totalExpenses += amount;
//     });

//     setSummary({
//       totalIncome,
//       totalExpenses,
//       netBalance: totalIncome - totalExpenses,
//       recentTransactions: data.slice(0, 5)
//     });

//     setRefreshing(false);
//   };

//   const handleRefresh = () => {
//     fetchDashboardData();
//   };

//   const deleteTransaction = async (id) => {
//     Alert.alert(
//       "Delete Transaction",
//       "Are you sure you want to delete this transaction?",
//       [
//         { text: "Cancel", style: "cancel" },
//         { 
//           text: "Delete", 
//           style: "destructive", 
//           onPress: async () => {
//             try {
//               const { error } = await supabase
//                 .from('business_logs')
//                 .delete()
//                 .eq('id', id);

//               if (error) throw error;

//               setSummary((prevSummary) => ({
//                 ...prevSummary,
//                 recentTransactions: prevSummary.recentTransactions.filter(transaction => transaction.id !== id)
//               }));
//             } catch (error) {
//               Alert.alert("Error", error.message);
//             }
//           }
//         }
//       ]
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.summaryContainer}>
//         <View style={styles.row}>
//           {['Total Income', 'Total Expenses'].map((label, index) => {
//             const value = index === 0 ? summary.totalIncome : summary.totalExpenses;
//             const color = index === 0 ? styles.income : styles.expense;
//             return (
//               <View key={label} style={[styles.summaryCard, styles.halfCard]}>
//                 <Text style={styles.summaryLabel}>{label}</Text>
//                 <Text style={[styles.summaryValue, color]}>Rs{value.toFixed(2)}</Text>
//               </View>
//             );
//           })}
//         </View>

//         <View style={styles.fullWidthCard}>
//           <Text style={styles.summaryLabel}>Net Balance</Text>
//           <Text style={[
//             styles.summaryValue,
//             summary.netBalance >= 0 ? styles.income : styles.expense
//           ]}>
//             Rs{summary.netBalance.toFixed(2)}
//           </Text>
//         </View>
//       </View>

//       <Text style={styles.sectionTitle}>Recent Transactions</Text>
      
//       {refreshing && <ActivityIndicator size="large" color="#4CAF50" />}

//       <SwipeListView
//         data={summary.recentTransactions}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => (
//           <View style={styles.rowFront}>
//             <View style={styles.transactionCard}>
//               <View style={styles.transactionLeft}>
//                 <Text style={styles.transactionCategory}>{item.category}</Text>
//                 <Text style={styles.transactionDescription}>{item.description}</Text>
//               </View>
//               <View style={styles.transactionRight}>
//                 <Text style={[styles.transactionAmount, item.type === 'income' ? styles.income : styles.expense]}>Rs{item.amount.toFixed(2)}</Text>
//                 <Text style={styles.transactionDate}>{new Date(item.log_date).toLocaleDateString()}</Text>
//               </View>
//             </View>
//           </View>
//         )}
//         renderHiddenItem={({ item }) => (
//           <View style={styles.rowBack}>
//             <TouchableOpacity style={styles.deleteButton} onPress={() => deleteTransaction(item.id)}>
//               <Text style={styles.deleteText}>Delete</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//         leftOpenValue={0}
//         rightOpenValue={-80}
//         refreshing={refreshing} // Enable pull-to-refresh
//         onRefresh={handleRefresh} // Trigger refresh
//       />
//     </View>
  
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1, 
//     padding: 16,
//     backgroundColor: 'black',
//   },
//   summaryContainer: {
//     paddingVertical: 10,
//     marginBottom: 10,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   summaryCard: {
//     backgroundColor: '#ffffff',
//     padding: 20,
//     borderRadius: 10,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     marginBottom: 10,
//   },
//   halfCard: {
//     width: '48%', 
//   },
//   fullWidthCard: {
//     width: '100%',
//     backgroundColor: '#ffffff',
//     padding: 25,
//     borderRadius: 10,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     marginBottom: 10, 
//   },
//   summaryLabel: {
//     fontSize: 14,
//     color: '#A0A0A0',
//     fontWeight: '500',
//     marginBottom: 5,
//   },
//   summaryValue: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   income: { color: '#4CAF50' },
//   expense: { color: '#F44336' },

//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#EAEAEA',
//     marginVertical: 10,
//   },
//   transactionCard: {
//     backgroundColor: '#1E1E1E',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 10,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   transactionLeft: {
//     flex: 1,
//     marginRight: 10,
//   },
//   transactionRight: {
//     alignItems: 'flex-end',
//   },
//   transactionCategory: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#EAEAEA',
//   },
//   transactionDescription: {
//     fontSize: 14,
//     color: '#A0A0A0',
//   },
//   transactionAmount: {
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   transactionDate: {
//     fontSize: 14,
//     color: '#888',
//     marginTop: 4,
//   },
//   rowBack: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'flex-end',
//     backgroundColor: '#F44336',
//     borderRadius: 8,
//     marginBottom: 12,
//   },
//   deleteButton: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: 80,
//     height: '100%',
//   },
//   deleteText: {
//     color: '#FFF',
//     fontWeight: 'bold',
//   },
// });

