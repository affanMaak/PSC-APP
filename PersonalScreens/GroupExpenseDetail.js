// // //custom ok sex 
// // // import React, { useEffect, useState } from 'react';
// // // import {
// // //   View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert,
// // // } from 'react-native';
// // // import { supabase } from '../lib/supabase';
// // // import Icon from 'react-native-vector-icons/MaterialIcons';

// // // export default function GroupExpenseDetail({ route, navigation }) {
// // //   const { groupId } = route.params;
// // //   const [loading, setLoading] = useState(true);
// // //   const [description, setDescription] = useState('');
// // //   const [date, setDate] = useState('');
// // //   const [totalAmount, setTotalAmount] = useState(0);
// // //   const [participants, setParticipants] = useState([]);
// // //   const [settlements, setSettlements] = useState([]);
// // //   const [sharePerPerson, setSharePerPerson] = useState(0);

// // //   useEffect(() => {
// // //     const fetchCustomExpense = async () => {
// // //       try {
// // //         setLoading(true);
// // //         const { data, error } = await supabase
// // //           .from('custom_expenses')
// // //           .select('*')
// // //           .eq('id', groupId)
// // //           .single();

// // //         if (error) throw error;
        
// // //         const { participants, settlements, total_amount } = data;
        
// // //         // Calculate fair share per participant
// // //         const validParticipants = participants?.filter(p => p.id) || [];
// // //         const share = validParticipants.length > 0 
// // //           ? total_amount / validParticipants.length 
// // //           : 0;
// // //         setSharePerPerson(share);

// // //         const userIds = [
// // //           ...new Set([
// // //             ...(validParticipants.map(p => p.id)),
// // //             ...(settlements || []).flatMap(s => [s.from, s.to]),
// // //           ]),
// // //         ];

// // //         const { data: users, error: userError } = await supabase
// // //           .from('profiles')
// // //           .select('id, username')
// // //           .in('id', userIds);

// // //         if (userError) throw userError;

// // //         const idToUsername = {};
// // //         users.forEach(u => { idToUsername[u.id] = u.username });

// // //         // Calculate net balance for each participant
// // //         const enrichedParticipants = validParticipants.map(p => {
// // //           const net = p.paid - share;
// // //           return {
// // //             ...p,
// // //             name: idToUsername[p.id] || 'Unknown',
// // //             net: net,
// // //             owes: net < 0 ? Math.abs(net) : 0,
// // //             gets: net > 0 ? net : 0
// // //           };
// // //         });

// // //         const enrichedSettlements = (settlements || []).map(s => ({
// // //           ...s,
// // //           from: idToUsername[s.from] || s.from,
// // //           to: idToUsername[s.to] || s.to,
// // //         }));

// // //         setDescription(data.description);
// // //         setDate(data.created_at);
// // //         setTotalAmount(total_amount);
// // //         setParticipants(enrichedParticipants);
// // //         setSettlements(enrichedSettlements);

// // //       } catch (err) {
// // //         Alert.alert('Error', err.message);
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };

// // //     fetchCustomExpense();
// // //   }, [groupId]);

// // //   const handleSettle = async (settlement) => {
// // //     Alert.alert(
// // //       'Confirm Payment',
// // //       `Are you sure you want to mark payment from ${settlement.from} to ${settlement.to} as complete?`,
// // //       [
// // //         { text: 'Cancel', style: 'cancel' },
// // //         {
// // //           text: 'Mark Paid',
// // //           onPress: async () => {
// // //             // Remove this specific settlement
// // //             const updatedSettlements = settlements.filter(
// // //               s => !(s.from === settlement.from && s.to === settlement.to && s.amount === settlement.amount)
// // //             );
            
// // //             // Update the expense in database
// // //             const { error } = await supabase
// // //               .from('custom_expenses')
// // //               .update({ settlements: updatedSettlements })
// // //               .eq('id', groupId);

// // //             if (error) {
// // //               Alert.alert('Error', 'Failed to update settlement.');
// // //             } else {
// // //               if (updatedSettlements.length === 0) {
// // //                 // Delete expense if all settlements are complete
// // //                 await supabase.from('custom_expenses').delete().eq('id', groupId);
// // //                 Alert.alert('Settled', 'All settlements completed. Expense removed.');
// // //                 navigation.goBack();
// // //               } else {
// // //                 setSettlements(updatedSettlements);
// // //                 Alert.alert('Success', 'Payment marked as complete.');
// // //               }
// // //             }
// // //           },
// // //         },
// // //       ]
// // //     );
// // //   };

// // //   if (loading) {
// // //     return (
// // //       <View style={styles.loadingContainer}>
// // //         <ActivityIndicator size="large" color="#D2B48C" />
// // //       </View>
// // //     );
// // //   }

// // //   return (
// // //     <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
// // //       {/* Header Card */}
// // //       <View style={styles.headerCard}>
// // //         <View style={styles.headerIcon}>
// // //           <Icon name="receipt" size={24} color="#D2B48C" />
// // //         </View>
// // //         <View style={styles.headerContent}>
// // //           <Text style={styles.title}>{description}</Text>
// // //           <View style={styles.dateRow}>
// // //             <Icon name="event" size={16} color="#888" />
// // //             <Text style={styles.subtitle}>
// // //               {new Date(date).toLocaleDateString('en-IN', {
// // //                 day: 'numeric',
// // //                 month: 'short',
// // //                 year: 'numeric',
// // //               })}
// // //             </Text>
// // //           </View>
// // //         </View>
// // //       </View>

// // //       {/* Summary Cards */}
// // //       <View style={styles.summaryContainer}>
// // //         <View style={styles.summaryCard}>
// // //           <View style={styles.summaryIcon}>
// // //             <Icon name="account-balance-wallet" size={20} color="#FFF0DC" />
// // //           </View>
// // //           <View>
// // //             <Text style={styles.summaryLabel}>Total Amount</Text>
// // //             <Text style={styles.summaryValue}>Rs{totalAmount.toFixed(2)}</Text>
// // //           </View>
// // //         </View>
        
// // //         <View style={styles.summaryCard}>
// // //           <View style={styles.summaryIcon}>
// // //             <Icon name="people" size={20} color="#FFF0DC" />
// // //           </View>
// // //           <View>
// // //             <Text style={styles.summaryLabel}>Per Person</Text>
// // //             <Text style={styles.summaryValue}>Rs{sharePerPerson.toFixed(2)}</Text>
// // //           </View>
// // //         </View>
// // //       </View>

// // //       {/* Settlements Section */}
// // //       <View style={styles.sectionHeader}>
// // //         <Icon name="compare-arrows" size={20} color="#D2B48C" />
// // //         <Text style={styles.sectionTitle}>Final Settlements</Text>
// // //       </View>
      
// // //       {settlements.length > 0 ? (
// // //         settlements.map((s, index) => (
// // //           <View key={index} style={styles.settlementCard}>
// // //             <View style={styles.settlementContent}>
// // //               <View style={styles.settlementIcon}>
// // //                 <Icon name="swap-horiz" size={20} color="#D2B48C" />
// // //               </View>
// // //               <View>
// // //                 <Text style={styles.settlementText}>
// // //                   <Text style={{ fontWeight: 'bold' }}>{s.from}</Text> → {s.to}
// // //                 </Text>
// // //                 <Text style={styles.settlementAmount}>Rs{s.amount.toFixed(2)}</Text>
// // //               </View>
// // //             </View>
// // //             <TouchableOpacity
// // //               style={styles.settleButton}
// // //               onPress={() => handleSettle(s)}
// // //             >
// // //               <Icon name="check-circle" size={18} color="#FFF0DC" />
// // //               <Text style={styles.settleButtonText}>Mark Paid</Text>
// // //             </TouchableOpacity>
// // //           </View>
// // //         ))
// // //       ) : (
// // //         <View style={styles.emptyCard}>
// // //           <Icon name="check-circle" size={24} color="#4CAF50" />
// // //           <Text style={styles.emptyText}>All settlements completed</Text>
// // //         </View>
// // //       )}

// // //       {/* Participants Section */}
// // //       <View style={styles.sectionHeader}>
// // //         <Icon name="group" size={20} color="#D2B48C" />
// // //         <Text style={styles.sectionTitle}>Participants</Text>
// // //       </View>
      
// // //       {participants.length > 0 ? (
// // //         participants.map((p, idx) => (
// // //           <View key={idx} style={styles.participantCard}>
// // //             <View style={styles.participantHeader}>
// // //               <Icon name="person" size={20} color="#FFF0DC" style={styles.participantIcon} />
// // //               <Text style={styles.participantName}>{p.name}</Text>
// // //             </View>
            
// // //             <View style={styles.participantDetails}>
// // //               <View style={styles.detailRow}>
// // //                 <Icon name="payments" size={16} color="#888" />
// // //                 <Text style={styles.detailText}>Paid: Rs{p.paid.toFixed(2)}</Text>
// // //               </View>
              
// // //               <View style={styles.detailRow}>
// // //                 <Icon name="pie-chart" size={16} color="#888" />
// // //                 <Text style={styles.detailText}>Share: Rs{sharePerPerson.toFixed(2)}</Text>
// // //               </View>
// // //             </View>
            
// // //             {p.net < 0 ? (
// // //               <View style={styles.balanceStatus}>
// // //                 <Icon name="arrow-upward" size={16} color="#FF6B6B" />
// // //                 <Text style={[styles.balanceText, styles.owesText]}>Owes: Rs{(-p.net).toFixed(2)}</Text>
// // //               </View>
// // //             ) : p.net > 0 ? (
// // //               <View style={styles.balanceStatus}>
// // //                 <Icon name="arrow-downward" size={16} color="#4CAF50" />
// // //                 <Text style={[styles.balanceText, styles.getsText]}>Gets: Rs{p.net.toFixed(2)}</Text>
// // //               </View>
// // //             ) : (
// // //               <View style={styles.balanceStatus}>
// // //                 <Icon name="check-circle" size={16} color="#4CAF50" />
// // //                 <Text style={[styles.balanceText, styles.settledText]}>Settled</Text>
// // //               </View>
// // //             )}
// // //           </View>
// // //         ))
// // //       ) : (
// // //         <View style={styles.emptyCard}>
// // //           <Icon name="error" size={24} color="#FF6B6B" />
// // //           <Text style={styles.emptyText}>No participant data found</Text>
// // //         </View>
// // //       )}
// // //     </ScrollView>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     backgroundColor: '#121212',
// // //   },
// // //   contentContainer: {
// // //     padding: 16,
// // //   },
// // //   loadingContainer: {
// // //     flex: 1,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
  
// // //   // Header Styles
// // //   headerCard: {
// // //     backgroundColor: '#1E1E1E',
// // //     borderRadius: 12,
// // //     padding: 16,
// // //     marginBottom: 16,
// // //     borderLeftWidth: 4,
// // //     borderLeftColor: '#D2B48C',
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //   },
// // //   headerIcon: {
// // //     backgroundColor: '#121212',
// // //     borderRadius: 30,
// // //     width: 40,
// // //     height: 40,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginRight: 12,
// // //   },
// // //   headerContent: {
// // //     flex: 1,
// // //   },
// // //   title: {
// // //     fontSize: 18,
// // //     fontWeight: 'bold',
// // //     color: '#FFF0DC',
// // //     marginBottom: 4,
// // //   },
// // //   dateRow: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //   },
// // //   subtitle: {
// // //     color: '#888',
// // //     fontSize: 14,
// // //     marginLeft: 4,
// // //   },
  
// // //   // Summary Styles
// // //   summaryContainer: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     marginBottom: 16,
// // //   },
// // //   summaryCard: {
// // //     backgroundColor: '#1E1E1E',
// // //     borderRadius: 12,
// // //     padding: 16,
// // //     flex: 1,
// // //     marginHorizontal: 4,
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //   },
// // //   summaryIcon: {
// // //     backgroundColor: '#121212',
// // //     borderRadius: 20,
// // //     width: 36,
// // //     height: 36,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginRight: 12,
// // //   },
// // //   summaryLabel: {
// // //     color: '#888',
// // //     fontSize: 14,
// // //   },
// // //   summaryValue: {
// // //     color: '#D2B48C',
// // //     fontSize: 18,
// // //     fontWeight: 'bold',
// // //   },
  
// // //   // Section Styles
// // //   sectionHeader: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     marginTop: 24,
// // //     marginBottom: 12,
// // //   },
// // //   sectionTitle: {
// // //     fontSize: 16,
// // //     fontWeight: '600',
// // //     color: '#D2B48C',
// // //     marginLeft: 8,
// // //   },
  
// // //   // Settlement Styles
// // //   settlementCard: {
// // //     backgroundColor: '#1E1E1E',
// // //     borderRadius: 12,
// // //     padding: 16,
// // //     marginBottom: 12,
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //   },
// // //   settlementContent: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     flex: 1,
// // //   },
// // //   settlementIcon: {
// // //     marginRight: 12,
// // //   },
// // //   settlementText: {
// // //     color: '#FFF0DC',
// // //     fontSize: 15,
// // //   },
// // //   settlementAmount: {
// // //     color: '#D2B48C',
// // //     fontSize: 16,
// // //     fontWeight: 'bold',
// // //     marginTop: 4,
// // //   },
// // //   settleButton: {
// // //     backgroundColor: '#543A14',
// // //     paddingVertical: 8,
// // //     paddingHorizontal: 12,
// // //     borderRadius: 8,
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     borderWidth: 1,
// // //     borderColor: '#D2B48C',
// // //   },
// // //   settleButtonText: {
// // //     color: '#FFF0DC',
// // //     fontSize: 14,
// // //     fontWeight: 'bold',
// // //     marginLeft: 6,
// // //   },
  
// // //   // Participant Styles
// // //   participantCard: {
// // //     backgroundColor: '#1E1E1E',
// // //     borderRadius: 12,
// // //     padding: 16,
// // //     marginBottom: 12,
// // //   },
// // //   participantHeader: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     marginBottom: 12,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#333',
// // //     paddingBottom: 12,
// // //   },
// // //   participantIcon: {
// // //     marginRight: 10,
// // //   },
// // //   participantName: {
// // //     color: '#FFF0DC',
// // //     fontSize: 16,
// // //     fontWeight: '600',
// // //   },
// // //   participantDetails: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     marginBottom: 12,
// // //   },
// // //   detailRow: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //   },
// // //   detailText: {
// // //     color: '#FFF0DC',
// // //     fontSize: 14,
// // //     marginLeft: 6,
// // //   },
// // //   balanceStatus: {
// // //     backgroundColor: '#121212',
// // //     borderRadius: 8,
// // //     padding: 10,
// // //     flexDirection: 'row',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   balanceText: {
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //     marginLeft: 6,
// // //   },
// // //   owesText: {
// // //     color: '#FF6B6B',
// // //   },
// // //   getsText: {
// // //     color: '#4CAF50',
// // //   },
// // //   settledText: {
// // //     color: '#4CAF50',
// // //   },
  
// // //   // Empty States
// // //   emptyCard: {
// // //     backgroundColor: '#1E1E1E',
// // //     borderRadius: 12,
// // //     padding: 20,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   emptyText: {
// // //     color: '#888',
// // //     fontSize: 14,
// // //     marginTop: 8,
// // //     textAlign: 'center',
// // //   },
// // // });

// // //multiple exp ok
// // import React, { useEffect, useState } from 'react';
// // import {
// //   View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert,
// // } from 'react-native';
// // import { supabase } from '../lib/supabase';
// // import Icon from 'react-native-vector-icons/MaterialIcons';

// // // UUID generator function (same as in Add.js)
// // const generateUUID = () => {
// //   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
// //     const r = Math.random() * 16 | 0;
// //     const v = c === 'x' ? r : (r & 0x3 | 0x8);
// //     return v.toString(16);
// //   });
// // };

// // export default function GroupExpenseDetail({ route, navigation }) {
// //   const { groupId } = route.params;
// //   const [loading, setLoading] = useState(true);
// //   const [description, setDescription] = useState('');
// //   const [date, setDate] = useState('');
// //   const [totalAmount, setTotalAmount] = useState(0);
// //   const [participants, setParticipants] = useState([]);
// //   const [settlements, setSettlements] = useState([]);
// //   const [sharePerPerson, setSharePerPerson] = useState(0);

// //   useEffect(() => {
// //     const fetchExpenseGroup = async () => {
// //       try {
// //         setLoading(true);
        
// //         // First try custom_expenses table
// //         let { data: customData, error: customError } = await supabase
// //           .from('custom_expenses')
// //           .select('*')
// //           .eq('group_id', groupId)
// //           .single();

// //         if (customError || !customData) {
// //           // If not found, try expenses table
// //           const { data: expensesData, error: expensesError } = await supabase
// //             .from('expenses')
// //             .select('*')
// //             .eq('group_id', groupId);

// //           if (expensesError) throw expensesError;

// //           if (expensesData && expensesData.length > 0) {
// //             // Convert to custom expense format
// //             const firstExpense = expensesData[0];
// //             const payerId = firstExpense.user_id;
            
// //             // Collect all participants
// //             const participantsSet = new Set();
// //             expensesData.forEach(exp => {
// //               participantsSet.add(exp.user_id);
// //               participantsSet.add(exp.friend_id);
// //             });
// //             const participantIds = Array.from(participantsSet);
            
// //             // Get usernames
// //             const { data: users, error: userError } = await supabase
// //               .from('profiles')
// //               .select('id, username')
// //               .in('id', participantIds);
            
// //             if (userError) throw userError;
            
// //             const idToUsername = {};
// //             users.forEach(u => { idToUsername[u.id] = u.username });
            
// //             // Create participants array
// //             const participantsArray = participantIds.map(id => ({
// //               id,
// //               username: idToUsername[id] || 'Unknown',
// //               paid: id === payerId ? firstExpense.total_amount : 0
// //             }));
            
// //             // Create settlements
// //             const settlementsArray = expensesData.map(exp => ({
// //               from: exp.friend_id,
// //               to: exp.user_id,
// //               amount: exp.amount
// //             }));
            
// //             // Set state
// //             setDescription(firstExpense.description);
// //             setDate(firstExpense.created_at);
// //             setTotalAmount(firstExpense.total_amount);
// //             setSharePerPerson(firstExpense.total_amount / participantsArray.length);
// //             setParticipants(participantsArray.map(p => ({
// //               ...p,
// //               net: p.id === payerId 
// //                 ? p.paid - firstExpense.total_amount / participantsArray.length
// //                 : -firstExpense.total_amount / participantsArray.length
// //             })));
// //             setSettlements(settlementsArray.map(s => ({
// //               from: idToUsername[s.from] || s.from,
// //               to: idToUsername[s.to] || s.to,
// //               amount: s.amount
// //             })));
// //           } else {
// //             throw new Error('Expense group not found');
// //           }
// //         } else {
// //           // Process custom expense
// //           const { participants, settlements, total_amount, created_at } = customData;
          
// //           // Calculate fair share per participant
// //           const validParticipants = participants?.filter(p => p.id) || [];
// //           const share = validParticipants.length > 0 
// //             ? total_amount / validParticipants.length 
// //             : 0;
// //           setSharePerPerson(share);

// //           const userIds = [
// //             ...new Set([
// //               ...(validParticipants.map(p => p.id)),
// //               ...(settlements || []).flatMap(s => [s.from, s.to]),
// //             ]),
// //           ];

// //           const { data: users, error: userError } = await supabase
// //             .from('profiles')
// //             .select('id, username')
// //             .in('id', userIds);

// //           if (userError) throw userError;

// //           const idToUsername = {};
// //           users.forEach(u => { idToUsername[u.id] = u.username });

// //           // Calculate net balance for each participant
// //           const enrichedParticipants = validParticipants.map(p => {
// //             const net = p.paid - share;
// //             return {
// //               ...p,
// //               name: idToUsername[p.id] || 'Unknown',
// //               net: net,
// //               owes: net < 0 ? Math.abs(net) : 0,
// //               gets: net > 0 ? net : 0
// //             };
// //           });

// //           const enrichedSettlements = (settlements || []).map(s => ({
// //             ...s,
// //             from: idToUsername[s.from] || s.from,
// //             to: idToUsername[s.to] || s.to,
// //           }));

// //           setDescription(customData.description);
// //           setDate(created_at);
// //           setTotalAmount(total_amount);
// //           setParticipants(enrichedParticipants);
// //           setSettlements(enrichedSettlements);
// //         }
// //       } catch (err) {
// //         Alert.alert('Error', err.message);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchExpenseGroup();
// //   }, [groupId]);

// //   const handleSettle = async (settlement) => {
// //     Alert.alert(
// //       'Confirm Payment',
// //       `Are you sure you want to mark payment from ${settlement.from} to ${settlement.to} as complete?`,
// //       [
// //         { text: 'Cancel', style: 'cancel' },
// //         {
// //           text: 'Mark Paid',
// //           onPress: async () => {
// //             // Remove this specific settlement
// //             const updatedSettlements = settlements.filter(
// //               s => !(s.from === settlement.from && s.to === settlement.to && s.amount === settlement.amount)
// //             );
            
// //             // Update the expense in database
// //             const { error } = await supabase
// //               .from('custom_expenses')
// //               .update({ settlements: updatedSettlements })
// //               .eq('group_id', groupId);

// //             if (error) {
// //               Alert.alert('Error', 'Failed to update settlement.');
// //             } else {
// //               if (updatedSettlements.length === 0) {
// //                 // Delete expense if all settlements are complete
// //                 await supabase.from('custom_expenses').delete().eq('group_id', groupId);
// //                 Alert.alert('Settled', 'All settlements completed. Expense removed.');
// //                 navigation.goBack();
// //               } else {
// //                 setSettlements(updatedSettlements);
// //                 Alert.alert('Success', 'Payment marked as complete.');
// //               }
// //             }
// //           },
// //         },
// //       ]
// //     );
// //   };

// //   if (loading) {
// //     return (
// //       <View style={styles.loadingContainer}>
// //         <ActivityIndicator size="large" color="#D2B48C" />
// //       </View>
// //     );
// //   }

// //   return (
// //     <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
// //       {/* Header Card */}
// //       <View style={styles.headerCard}>
// //         <View style={styles.headerIcon}>
// //           <Icon name="receipt" size={24} color="#D2B48C" />
// //         </View>
// //         <View style={styles.headerContent}>
// //           <Text style={styles.title}>{description}</Text>
// //           <View style={styles.dateRow}>
// //             <Icon name="event" size={16} color="#888" />
// //             <Text style={styles.subtitle}>
// //               {new Date(date).toLocaleDateString('en-IN', {
// //                 day: 'numeric',
// //                 month: 'short',
// //                 year: 'numeric',
// //               })}
// //             </Text>
// //           </View>
// //         </View>
// //       </View>

// //       {/* Summary Cards */}
// //       <View style={styles.summaryContainer}>
// //         <View style={styles.summaryCard}>
// //           <View style={styles.summaryIcon}>
// //             <Icon name="account-balance-wallet" size={20} color="#FFF0DC" />
// //           </View>
// //           <View>
// //             <Text style={styles.summaryLabel}>Total Amount</Text>
// //             <Text style={styles.summaryValue}>Rs{totalAmount.toFixed(2)}</Text>
// //           </View>
// //         </View>
        
// //         <View style={styles.summaryCard}>
// //           <View style={styles.summaryIcon}>
// //             <Icon name="people" size={20} color="#FFF0DC" />
// //           </View>
// //           <View>
// //             <Text style={styles.summaryLabel}>Per Person</Text>
// //             <Text style={styles.summaryValue}>Rs{sharePerPerson.toFixed(2)}</Text>
// //           </View>
// //         </View>
// //       </View>

// //       {/* Settlements Section */}
// //       <View style={styles.sectionHeader}>
// //         <Icon name="compare-arrows" size={20} color="#D2B48C" />
// //         <Text style={styles.sectionTitle}>Final Settlements</Text>
// //       </View>
      
// //       {settlements.length > 0 ? (
// //         settlements.map((s, index) => (
// //           <View key={index} style={styles.settlementCard}>
// //             <View style={styles.settlementContent}>
// //               <View style={styles.settlementIcon}>
// //                 <Icon name="swap-horiz" size={20} color="#D2B48C" />
// //               </View>
// //               <View>
// //                 <Text style={styles.settlementText}>
// //                   <Text style={{ fontWeight: 'bold' }}>{s.from}</Text> → {s.to}
// //                 </Text>
// //                 <Text style={styles.settlementAmount}>Rs{s.amount.toFixed(2)}</Text>
// //               </View>
// //             </View>
// //             <TouchableOpacity
// //               style={styles.settleButton}
// //               onPress={() => handleSettle(s)}
// //             >
// //               <Icon name="check-circle" size={18} color="#FFF0DC" />
// //               <Text style={styles.settleButtonText}>Mark Paid</Text>
// //             </TouchableOpacity>
// //           </View>
// //         ))
// //       ) : (
// //         <View style={styles.emptyCard}>
// //           <Icon name="check-circle" size={24} color="#4CAF50" />
// //           <Text style={styles.emptyText}>All settlements completed</Text>
// //         </View>
// //       )}

// //       {/* Participants Section */}
// //       <View style={styles.sectionHeader}>
// //         <Icon name="group" size={20} color="#D2B48C" />
// //         <Text style={styles.sectionTitle}>Participants</Text>
// //       </View>
      
// //       {participants.length > 0 ? (
// //         participants.map((p, idx) => (
// //           <View key={idx} style={styles.participantCard}>
// //             <View style={styles.participantHeader}>
// //               <Icon name="person" size={20} color="#FFF0DC" style={styles.participantIcon} />
// //               <Text style={styles.participantName}>{p.name || p.username}</Text>
// //             </View>
            
// //             <View style={styles.participantDetails}>
// //               <View style={styles.detailRow}>
// //                 <Icon name="payments" size={16} color="#888" />
// //                 <Text style={styles.detailText}>Paid: Rs{p.paid?.toFixed(2) || '0.00'}</Text>
// //               </View>
              
// //               <View style={styles.detailRow}>
// //                 <Icon name="pie-chart" size={16} color="#888" />
// //                 <Text style={styles.detailText}>Share: Rs{sharePerPerson.toFixed(2)}</Text>
// //               </View>
// //             </View>
            
// //             {p.net < 0 ? (
// //               <View style={styles.balanceStatus}>
// //                 <Icon name="arrow-upward" size={16} color="#FF6B6B" />
// //                 <Text style={[styles.balanceText, styles.owesText]}>Owes: Rs{(-p.net).toFixed(2)}</Text>
// //               </View>
// //             ) : p.net > 0 ? (
// //               <View style={styles.balanceStatus}>
// //                 <Icon name="arrow-downward" size={16} color="#4CAF50" />
// //                 <Text style={[styles.balanceText, styles.getsText]}>Gets: Rs{p.net.toFixed(2)}</Text>
// //               </View>
// //             ) : (
// //               <View style={styles.balanceStatus}>
// //                 <Icon name="check-circle" size={16} color="#4CAF50" />
// //                 <Text style={[styles.balanceText, styles.settledText]}>Settled</Text>
// //               </View>
// //             )}
// //           </View>
// //         ))
// //       ) : (
// //         <View style={styles.emptyCard}>
// //           <Icon name="error" size={24} color="#FF6B6B" />
// //           <Text style={styles.emptyText}>No participant data found</Text>
// //         </View>
// //       )}
// //     </ScrollView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#121212',
// //   },
// //   contentContainer: {
// //     padding: 16,
// //   },
// //   loadingContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
  
// //   // Header Styles
// //   headerCard: {
// //     backgroundColor: '#1E1E1E',
// //     borderRadius: 12,
// //     padding: 16,
// //     marginBottom: 16,
// //     borderLeftWidth: 4,
// //     borderLeftColor: '#D2B48C',
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   headerIcon: {
// //     backgroundColor: '#121212',
// //     borderRadius: 30,
// //     width: 40,
// //     height: 40,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginRight: 12,
// //   },
// //   headerContent: {
// //     flex: 1,
// //   },
// //   title: {
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //     color: '#FFF0DC',
// //     marginBottom: 4,
// //   },
// //   dateRow: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   subtitle: {
// //     color: '#888',
// //     fontSize: 14,
// //     marginLeft: 4,
// //   },
  
// //   // Summary Styles
// //   summaryContainer: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     marginBottom: 16,
// //   },
// //   summaryCard: {
// //     backgroundColor: '#1E1E1E',
// //     borderRadius: 12,
// //     padding: 16,
// //     flex: 1,
// //     marginHorizontal: 4,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   summaryIcon: {
// //     backgroundColor: '#121212',
// //     borderRadius: 20,
// //     width: 36,
// //     height: 36,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginRight: 12,
// //   },
// //   summaryLabel: {
// //     color: '#888',
// //     fontSize: 14,
// //   },
// //   summaryValue: {
// //     color: '#D2B48C',
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //   },
  
// //   // Section Styles
// //   sectionHeader: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginTop: 24,
// //     marginBottom: 12,
// //   },
// //   sectionTitle: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: '#D2B48C',
// //     marginLeft: 8,
// //   },
  
// //   // Settlement Styles
// //   settlementCard: {
// //     backgroundColor: '#1E1E1E',
// //     borderRadius: 12,
// //     padding: 16,
// //     marginBottom: 12,
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //   },
// //   settlementContent: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     flex: 1,
// //   },
// //   settlementIcon: {
// //     marginRight: 12,
// //   },
// //   settlementText: {
// //     color: '#FFF0DC',
// //     fontSize: 15,
// //   },
// //   settlementAmount: {
// //     color: '#D2B48C',
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //     marginTop: 4,
// //   },
// //   settleButton: {
// //     backgroundColor: '#543A14',
// //     paddingVertical: 8,
// //     paddingHorizontal: 12,
// //     borderRadius: 8,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     borderWidth: 1,
// //     borderColor: '#D2B48C',
// //   },
// //   settleButtonText: {
// //     color: '#FFF0DC',
// //     fontSize: 14,
// //     fontWeight: 'bold',
// //     marginLeft: 6,
// //   },
  
// //   // Participant Styles
// //   participantCard: {
// //     backgroundColor: '#1E1E1E',
// //     borderRadius: 12,
// //     padding: 16,
// //     marginBottom: 12,
// //   },
// //   participantHeader: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 12,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#333',
// //     paddingBottom: 12,
// //   },
// //   participantIcon: {
// //     marginRight: 10,
// //   },
// //   participantName: {
// //     color: '#FFF0DC',
// //     fontSize: 16,
// //     fontWeight: '600',
// //   },
// //   participantDetails: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     marginBottom: 12,
// //   },
// //   detailRow: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   detailText: {
// //     color: '#FFF0DC',
// //     fontSize: 14,
// //     marginLeft: 6,
// //   },
// //   balanceStatus: {
// //     backgroundColor: '#121212',
// //     borderRadius: 8,
// //     padding: 10,
// //     flexDirection: 'row',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   balanceText: {
// //     fontSize: 14,
// //     fontWeight: '600',
// //     marginLeft: 6,
// //   },
// //   owesText: {
// //     color: '#FF6B6B',
// //   },
// //   getsText: {
// //     color: '#4CAF50',
// //   },
// //   settledText: {
// //     color: '#4CAF50',
// //   },
  
// //   // Empty States
// //   emptyCard: {
// //     backgroundColor: '#1E1E1E',
// //     borderRadius: 12,
// //     padding: 20,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   emptyText: {
// //     color: '#888',
// //     fontSize: 14,
// //     marginTop: 8,
// //     textAlign: 'center',
// //   },
// // });



// \\ios test
// import React, { useEffect, useState } from 'react';
// import {
//   View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert,
// } from 'react-native';
// import { supabase } from '../lib/supabase';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// export default function GroupExpenseDetail({ route, navigation }) {
//   const { groupId } = route.params;
//   const [loading, setLoading] = useState(true);
//   const [description, setDescription] = useState('');
//   const [date, setDate] = useState('');
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [participants, setParticipants] = useState([]);
//   const [settlements, setSettlements] = useState([]);
//   const [sharePerPerson, setSharePerPerson] = useState(0);
//   const [expenseType, setExpenseType] = useState(''); // 'custom' or 'regular'

//   useEffect(() => {
//     const fetchExpenseGroup = async () => {
//       try {
//         setLoading(true);
        
//         // First try custom_expenses table by group_id
//         let { data: customData, error: customError } = await supabase
//           .from('custom_expenses')
//           .select('*')
//           .eq('group_id', groupId)
//           .single();

//         if (!customError && customData) {
//           setExpenseType('custom');
//           // Process custom expense
//           const { participants, settlements, total_amount, created_at, description } = customData;
          
//           // Calculate fair share per participant
//           const validParticipants = participants?.filter(p => p.id) || [];
//           const share = validParticipants.length > 0 
//             ? total_amount / validParticipants.length 
//             : 0;
//           setSharePerPerson(share);

//           const userIds = [
//             ...new Set([
//               ...(validParticipants.map(p => p.id)),
//               ...(settlements || []).flatMap(s => [s.from, s.to]),
//             ]),
//           ];

//           const { data: users, error: userError } = await supabase
//             .from('profiles')
//             .select('id, username')
//             .in('id', userIds);

//           if (userError) throw userError;

//           const idToUsername = {};
//           users.forEach(u => { idToUsername[u.id] = u.username });

//           // Calculate net balance for each participant
//           const enrichedParticipants = validParticipants.map(p => {
//             const net = p.paid - share;
//             return {
//               ...p,
//               name: idToUsername[p.id] || 'Unknown',
//               net: net,
//               owes: net < 0 ? Math.abs(net) : 0,
//               gets: net > 0 ? net : 0
//             };
//           });

//           const enrichedSettlements = (settlements || []).map(s => ({
//             ...s,
//             from: idToUsername[s.from] || s.from,
//             to: idToUsername[s.to] || s.to,
//           }));

//           setDescription(description);
//           setDate(created_at);
//           setTotalAmount(total_amount);
//           setParticipants(enrichedParticipants);
//           setSettlements(enrichedSettlements);
//         } else {
//           // If not found, try expenses table by group_id
//           const { data: expensesData, error: expensesError } = await supabase
//             .from('expenses')
//             .select('*')
//             .eq('group_id', groupId);

//           if (expensesError) throw expensesError;

//           if (expensesData && expensesData.length > 0) {
//             setExpenseType('regular');
//             // Process regular expense
//             const firstExpense = expensesData[0];
//             const payerId = firstExpense.user_id;
            
//             // Collect all participants
//             const participantsSet = new Set();
//             expensesData.forEach(exp => {
//               participantsSet.add(exp.user_id);
//               participantsSet.add(exp.friend_id);
//             });
//             const participantIds = Array.from(participantsSet);
            
//             // Get usernames
//             const { data: users, error: userError } = await supabase
//               .from('profiles')
//               .select('id, username')
//               .in('id', participantIds);
            
//             if (userError) throw userError;
            
//             const idToUsername = {};
//             users.forEach(u => { idToUsername[u.id] = u.username });
            
//             // Create participants array
//             const participantsArray = participantIds.map(id => ({
//               id,
//               username: idToUsername[id] || 'Unknown',
//               paid: id === payerId ? firstExpense.total_amount : 0
//             }));
            
//             // Create settlements
//             const settlementsArray = expensesData.map(exp => ({
//               from: exp.friend_id,
//               to: exp.user_id,
//               amount: exp.amount
//             }));
            
//             const share = firstExpense.total_amount / participantsArray.length;
            
//             setDescription(firstExpense.description);
//             setDate(firstExpense.created_at);
//             setTotalAmount(firstExpense.total_amount);
//             setSharePerPerson(share);
//             setParticipants(participantsArray.map(p => ({
//               ...p,
//               net: p.id === payerId ? p.paid - share : -share
//             })));
//             setSettlements(settlementsArray.map(s => ({
//               from: idToUsername[s.from] || s.from,
//               to: idToUsername[s.to] || s.to,
//               amount: s.amount
//             })));
//           } else {
//             // Final fallback: try custom_expenses by id
//             const { data: customAltData, error: customAltError } = await supabase
//               .from('custom_expenses')
//               .select('*')
//               .eq('id', groupId)
//               .single();
            
//             if (!customAltError && customAltData) {
//               setExpenseType('custom');
//               const { participants, settlements, total_amount, created_at, description } = customAltData;
              
//               // Same processing as above for custom expense
//               const validParticipants = participants?.filter(p => p.id) || [];
//               const share = validParticipants.length > 0 
//                 ? total_amount / validParticipants.length 
//                 : 0;
//               setSharePerPerson(share);

//               const userIds = [
//                 ...new Set([
//                   ...(validParticipants.map(p => p.id)),
//                   ...(settlements || []).flatMap(s => [s.from, s.to]),
//                 ]),
//               ];

//               const { data: users, error: userError } = await supabase
//                 .from('profiles')
//                 .select('id, username')
//                 .in('id', userIds);

//               if (userError) throw userError;

//               const idToUsername = {};
//               users.forEach(u => { idToUsername[u.id] = u.username });

//               const enrichedParticipants = validParticipants.map(p => {
//                 const net = p.paid - share;
//                 return {
//                   ...p,
//                   name: idToUsername[p.id] || 'Unknown',
//                   net: net,
//                   owes: net < 0 ? Math.abs(net) : 0,
//                   gets: net > 0 ? net : 0
//                 };
//               });

//               const enrichedSettlements = (settlements || []).map(s => ({
//                 ...s,
//                 from: idToUsername[s.from] || s.from,
//                 to: idToUsername[s.to] || s.to,
//               }));

//               setDescription(description);
//               setDate(created_at);
//               setTotalAmount(total_amount);
//               setParticipants(enrichedParticipants);
//               setSettlements(enrichedSettlements);
//             } else {
//               throw new Error(`Expense not found for ID: ${groupId}`);
//             }
//           }
//         }
//       } catch (err) {
//         Alert.alert('Error', err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchExpenseGroup();
//   }, [groupId]);

//   const handleSettle = async (settlement) => {
//     if (expenseType !== 'custom') {
//       Alert.alert('Info', 'Settlement is only available for custom expenses');
//       return;
//     }
    
//     Alert.alert(
//       'Confirm Payment',
//       `Are you sure you want to mark payment from ${settlement.from} to ${settlement.to} as complete?`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Mark Paid',
//           onPress: async () => {
//             // Remove this specific settlement
//             const updatedSettlements = settlements.filter(
//               s => !(s.from === settlement.from && s.to === settlement.to && s.amount === settlement.amount)
//             );
            
//             // Update the expense in database
//             const { error } = await supabase
//               .from('custom_expenses')
//               .update({ settlements: updatedSettlements })
//               .eq('group_id', groupId);

//             if (error) {
//               Alert.alert('Error', 'Failed to update settlement.');
//             } else {
//               if (updatedSettlements.length === 0) {
//                 // Delete expense if all settlements are complete
//                 await supabase.from('custom_expenses').delete().eq('group_id', groupId);
//                 Alert.alert('Settled', 'All settlements completed. Expense removed.');
//                 navigation.goBack();
//               } else {
//                 setSettlements(updatedSettlements);
//                 Alert.alert('Success', 'Payment marked as complete.');
//               }
//             }
//           },
//         },
//       ]
//     );
//   };

//   const getExpenseTypeBadge = () => {
//     if (expenseType === 'custom') {
//       return (
//         <View style={[styles.typeBadge, styles.customBadge]}>
//           <Icon name="pie-chart" size={14} color="#FFF" />
//           <Text style={styles.badgeText}>Custom Split</Text>
//         </View>
//       );
//     } else if (expenseType === 'regular') {
//       return (
//         <View style={[styles.typeBadge, styles.regularBadge]}>
//           <Icon name="call-split" size={14} color="#FFF" />
//           <Text style={styles.badgeText}>Regular Split</Text>
//         </View>
//       );
//     }
//     return null;
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#D2B48C" />
//       </View>
//     );
//   }

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
//       {/* Header Card */}
//       <View style={styles.headerCard}>
//         <View style={styles.headerIcon}>
//           <Icon name="receipt" size={24} color="#D2B48C" />
//         </View>
//         <View style={styles.headerContent}>
//           <View style={styles.titleRow}>
//             <Text style={styles.title}>{description}</Text>
//             {getExpenseTypeBadge()}
//           </View>
//           <View style={styles.dateRow}>
//             <Icon name="event" size={16} color="#888" />
//             <Text style={styles.subtitle}>
//               {new Date(date).toLocaleDateString('en-IN', {
//                 day: 'numeric',
//                 month: 'short',
//                 year: 'numeric',
//               })}
//             </Text>
//           </View>
//         </View>
//       </View>

//       {/* Summary Cards */}
//       <View style={styles.summaryContainer}>
//         <View style={styles.summaryCard}>
//           <View style={styles.summaryIcon}>
//             <Icon name="account-balance-wallet" size={20} color="#FFF0DC" />
//           </View>
//           <View>
//             <Text style={styles.summaryLabel}>Total Amount</Text>
//             <Text style={styles.summaryValue}>Rs{totalAmount.toFixed(2)}</Text>
//           </View>
//         </View>
        
//         <View style={styles.summaryCard}>
//           <View style={styles.summaryIcon}>
//             <Icon name="people" size={20} color="#FFF0DC" />
//           </View>
//           <View>
//             <Text style={styles.summaryLabel}>Per Person</Text>
//             <Text style={styles.summaryValue}>Rs{sharePerPerson.toFixed(2)}</Text>
//           </View>
//         </View>
//       </View>

//       {/* Settlements Section */}
//       <View style={styles.sectionHeader}>
//         <Icon name="compare-arrows" size={20} color="#D2B48C" />
//         <Text style={styles.sectionTitle}>Final Settlements</Text>
//       </View>
      
//       {settlements.length > 0 ? (
//         settlements.map((s, index) => (
//           <View key={index} style={styles.settlementCard}>
//             <View style={styles.settlementContent}>
//               <View style={styles.settlementIcon}>
//                 <Icon name="swap-horiz" size={20} color="#D2B48C" />
//               </View>
//               <View>
//                 <Text style={styles.settlementText}>
//                   <Text style={{ fontWeight: 'bold' }}>{s.from}</Text> → {s.to}
//                 </Text>
//                 <Text style={styles.settlementAmount}>Rs{s.amount.toFixed(2)}</Text>
//               </View>
//             </View>
//             {expenseType === 'custom' && (
//               <TouchableOpacity
//                 style={styles.settleButton}
//                 onPress={() => handleSettle(s)}
//               >
//                 <Icon name="check-circle" size={18} color="#FFF0DC" />
//                 <Text style={styles.settleButtonText}>Mark Paid</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         ))
//       ) : (
//         <View style={styles.emptyCard}>
//           <Icon name="check-circle" size={24} color="#4CAF50" />
//           <Text style={styles.emptyText}>All settlements completed</Text>
//         </View>
//       )}

//       {/* Participants Section */}
//       <View style={styles.sectionHeader}>
//         <Icon name="group" size={20} color="#D2B48C" />
//         <Text style={styles.sectionTitle}>Participants</Text>
//       </View>
      
//       {participants.length > 0 ? (
//         participants.map((p, idx) => (
//           <View key={idx} style={styles.participantCard}>
//             <View style={styles.participantHeader}>
//               <Icon name="person" size={20} color="#FFF0DC" style={styles.participantIcon} />
//               <Text style={styles.participantName}>{p.name || p.username}</Text>
//             </View>
            
//             <View style={styles.participantDetails}>
//               <View style={styles.detailRow}>
//                 <Icon name="payments" size={16} color="#888" />
//                 <Text style={styles.detailText}>Paid: Rs{p.paid?.toFixed(2) || '0.00'}</Text>
//               </View>
              
//               <View style={styles.detailRow}>
//                 <Icon name="pie-chart" size={16} color="#888" />
//                 <Text style={styles.detailText}>Share: Rs{sharePerPerson.toFixed(2)}</Text>
//               </View>
//             </View>
            
//             {p.net < 0 ? (
//               <View style={styles.balanceStatus}>
//                 <Icon name="arrow-upward" size={16} color="#FF6B6B" />
//                 <Text style={[styles.balanceText, styles.owesText]}>Owes: Rs{(-p.net).toFixed(2)}</Text>
//               </View>
//             ) : p.net > 0 ? (
//               <View style={styles.balanceStatus}>
//                 <Icon name="arrow-downward" size={16} color="#4CAF50" />
//                 <Text style={[styles.balanceText, styles.getsText]}>Gets: Rs{p.net.toFixed(2)}</Text>
//               </View>
//             ) : (
//               <View style={styles.balanceStatus}>
//                 <Icon name="check-circle" size={16} color="#4CAF50" />
//                 <Text style={[styles.balanceText, styles.settledText]}>Settled</Text>
//               </View>
//             )}
//           </View>
//         ))
//       ) : (
//         <View style={styles.emptyCard}>
//           <Icon name="error" size={24} color="#FF6B6B" />
//           <Text style={styles.emptyText}>No participant data found</Text>
//         </View>
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#121212',
//   },
//   contentContainer: {
//     padding: 16,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
  
//   // Header Styles
//   headerCard: {
//     backgroundColor: '#1E1E1E',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     borderLeftWidth: 4,
//     borderLeftColor: '#D2B48C',
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   headerIcon: {
//     backgroundColor: '#121212',
//     borderRadius: 30,
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   headerContent: {
//     flex: 1,
//   },
//   titleRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#FFF0DC',
//     marginBottom: 4,
//     flex: 1,
//   },
//   typeBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 4,
//     paddingHorizontal: 8,
//     borderRadius: 12,
//     marginLeft: 8,
//   },
//   customBadge: {
//     backgroundColor: '#4A148C',
//   },
//   regularBadge: {
//     backgroundColor: '#01579B',
//   },
//   badgeText: {
//     color: '#FFF',
//     fontSize: 12,
//     marginLeft: 4,
//   },
//   dateRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   subtitle: {
//     color: '#888',
//     fontSize: 14,
//     marginLeft: 4,
//   },
  
//   // Summary Styles
//   summaryContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 16,
//   },
//   summaryCard: {
//     backgroundColor: '#1E1E1E',
//     borderRadius: 12,
//     padding: 16,
//     flex: 1,
//     marginHorizontal: 4,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   summaryIcon: {
//     backgroundColor: '#121212',
//     borderRadius: 20,
//     width: 36,
//     height: 36,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   summaryLabel: {
//     color: '#888',
//     fontSize: 14,
//   },
//   summaryValue: {
//     color: '#D2B48C',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
  
//   // Section Styles
//   sectionHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 24,
//     marginBottom: 12,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#D2B48C',
//     marginLeft: 8,
//   },
  
//   // Settlement Styles
//   settlementCard: {
//     backgroundColor: '#1E1E1E',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   settlementContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   settlementIcon: {
//     marginRight: 12,
//   },
//   settlementText: {
//     color: '#FFF0DC',
//     fontSize: 15,
//   },
//   settlementAmount: {
//     color: '#D2B48C',
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginTop: 4,
//   },
//   settleButton: {
//     backgroundColor: '#543A14',
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#D2B48C',
//   },
//   settleButtonText: {
//     color: '#FFF0DC',
//     fontSize: 14,
//     fontWeight: 'bold',
//     marginLeft: 6,
//   },
  
//   // Participant Styles
//   participantCard: {
//     backgroundColor: '#1E1E1E',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//   },
//   participantHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#333',
//     paddingBottom: 12,
//   },
//   participantIcon: {
//     marginRight: 10,
//   },
//   participantName: {
//     color: '#FFF0DC',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   participantDetails: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 12,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   detailText: {
//     color: '#FFF0DC',
//     fontSize: 14,
//     marginLeft: 6,
//   },
//   balanceStatus: {
//     backgroundColor: '#121212',
//     borderRadius: 8,
//     padding: 10,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   balanceText: {
//     fontSize: 14,
//     fontWeight: '600',
//     marginLeft: 6,
//   },
//   owesText: {
//     color: '#FF6B6B',
//   },
//   getsText: {
//     color: '#4CAF50',
//   },
//   settledText: {
//     color: '#4CAF50',
//   },
  
//   // Empty States
//   emptyCard: {
//     backgroundColor: '#1E1E1E',
//     borderRadius: 12,
//     padding: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   emptyText: {
//     color: '#888',
//     fontSize: 14,
//     marginTop: 8,
//     textAlign: 'center',
//   },
// });

import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native';
import { supabase } from '../lib/supabase';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import Icon from '../components/IconWrapper';

export default function GroupExpenseDetail({ route, navigation }) {
  const { groupId } = route.params;
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [participants, setParticipants] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [sharePerPerson, setSharePerPerson] = useState(0);
  const [expenseType, setExpenseType] = useState(''); // 'custom' or 'regular'

  useEffect(() => {
    const fetchExpenseGroup = async () => {
      try {
        setLoading(true);
        
        // First try custom_expenses table by group_id
        let { data: customData, error: customError } = await supabase
          .from('custom_expenses')
          .select('*')
          .eq('group_id', groupId)
          .single();

        if (!customError && customData) {
          setExpenseType('custom');
          // Process custom expense
          const { participants, settlements, total_amount, created_at, description } = customData;
          
          // Calculate fair share per participant
          const validParticipants = participants?.filter(p => p.id) || [];
          const share = validParticipants.length > 0 
            ? total_amount / validParticipants.length 
            : 0;
          setSharePerPerson(share);

          const userIds = [
            ...new Set([
              ...(validParticipants.map(p => p.id)),
              ...(settlements || []).flatMap(s => [s.from, s.to]),
            ]),
          ];

          const { data: users, error: userError } = await supabase
            .from('profiles')
            .select('id, username')
            .in('id', userIds);

          if (userError) throw userError;

          const idToUsername = {};
          users.forEach(u => { idToUsername[u.id] = u.username });

          // Calculate net balance for each participant
          const enrichedParticipants = validParticipants.map(p => {
            const net = p.paid - share;
            return {
              ...p,
              name: idToUsername[p.id] || 'Unknown',
              net: net,
              owes: net < 0 ? Math.abs(net) : 0,
              gets: net > 0 ? net : 0
            };
          });

          const enrichedSettlements = (settlements || []).map(s => ({
            ...s,
            from: idToUsername[s.from] || s.from,
            to: idToUsername[s.to] || s.to,
          }));

          setDescription(description);
          setDate(created_at);
          setTotalAmount(total_amount);
          setParticipants(enrichedParticipants);
          setSettlements(enrichedSettlements);
        } else {
          // If not found, try expenses table by group_id
          const { data: expensesData, error: expensesError } = await supabase
            .from('expenses')
            .select('*')
            .eq('group_id', groupId);

          if (expensesError) throw expensesError;

          if (expensesData && expensesData.length > 0) {
            setExpenseType('regular');
            // Process regular expense
            const firstExpense = expensesData[0];
            const payerId = firstExpense.user_id;
            
            // Collect all participants
            const participantsSet = new Set();
            expensesData.forEach(exp => {
              participantsSet.add(exp.user_id);
              participantsSet.add(exp.friend_id);
            });
            const participantIds = Array.from(participantsSet);
            
            // Get usernames
            const { data: users, error: userError } = await supabase
              .from('profiles')
              .select('id, username')
              .in('id', participantIds);
            
            if (userError) throw userError;
            
            const idToUsername = {};
            users.forEach(u => { idToUsername[u.id] = u.username });
            
            // Create participants array
            const participantsArray = participantIds.map(id => ({
              id,
              username: idToUsername[id] || 'Unknown',
              paid: id === payerId ? firstExpense.total_amount : 0
            }));
            
            // Create settlements
            const settlementsArray = expensesData.map(exp => ({
              from: exp.friend_id,
              to: exp.user_id,
              amount: exp.amount
            }));
            
            const share = firstExpense.total_amount / participantsArray.length;
            
            setDescription(firstExpense.description);
            setDate(firstExpense.created_at);
            setTotalAmount(firstExpense.total_amount);
            setSharePerPerson(share);
            setParticipants(participantsArray.map(p => ({
              ...p,
              net: p.id === payerId ? p.paid - share : -share
            })));
            setSettlements(settlementsArray.map(s => ({
              from: idToUsername[s.from] || s.from,
              to: idToUsername[s.to] || s.to,
              amount: s.amount
            })));
          } else {
            // Final fallback: try custom_expenses by id
            const { data: customAltData, error: customAltError } = await supabase
              .from('custom_expenses')
              .select('*')
              .eq('id', groupId)
              .single();
            
            if (!customAltError && customAltData) {
              setExpenseType('custom');
              const { participants, settlements, total_amount, created_at, description } = customAltData;
              
              // Same processing as above for custom expense
              const validParticipants = participants?.filter(p => p.id) || [];
              const share = validParticipants.length > 0 
                ? total_amount / validParticipants.length 
                : 0;
              setSharePerPerson(share);

              const userIds = [
                ...new Set([
                  ...(validParticipants.map(p => p.id)),
                  ...(settlements || []).flatMap(s => [s.from, s.to]),
                ]),
              ];

              const { data: users, error: userError } = await supabase
                .from('profiles')
                .select('id, username')
                .in('id', userIds);

              if (userError) throw userError;

              const idToUsername = {};
              users.forEach(u => { idToUsername[u.id] = u.username });

              const enrichedParticipants = validParticipants.map(p => {
                const net = p.paid - share;
                return {
                  ...p,
                  name: idToUsername[p.id] || 'Unknown',
                  net: net,
                  owes: net < 0 ? Math.abs(net) : 0,
                  gets: net > 0 ? net : 0
                };
              });

              const enrichedSettlements = (settlements || []).map(s => ({
                ...s,
                from: idToUsername[s.from] || s.from,
                to: idToUsername[s.to] || s.to,
              }));

              setDescription(description);
              setDate(created_at);
              setTotalAmount(total_amount);
              setParticipants(enrichedParticipants);
              setSettlements(enrichedSettlements);
            } else {
              throw new Error(`Expense not found for ID: ${groupId}`);
            }
          }
        }
      } catch (err) {
        Alert.alert('Error', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenseGroup();
  }, [groupId]);

  const handleSettle = async (settlement) => {
    if (expenseType !== 'custom') {
      Alert.alert('Info', 'Settlement is only available for custom expenses');
      return;
    }
    
    Alert.alert(
      'Confirm Payment',
      `Are you sure you want to mark payment from ${settlement.from} to ${settlement.to} as complete?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mark Paid',
          onPress: async () => {
            // Remove this specific settlement
            const updatedSettlements = settlements.filter(
              s => !(s.from === settlement.from && s.to === settlement.to && s.amount === settlement.amount)
            );
            
            // Update the expense in database
            const { error } = await supabase
              .from('custom_expenses')
              .update({ settlements: updatedSettlements })
              .eq('group_id', groupId);

            if (error) {
              Alert.alert('Error', 'Failed to update settlement.');
            } else {
              if (updatedSettlements.length === 0) {
                // Delete expense if all settlements are complete
                await supabase.from('custom_expenses').delete().eq('group_id', groupId);
                Alert.alert('Settled', 'All settlements completed. Expense removed.');
                navigation.goBack();
              } else {
                setSettlements(updatedSettlements);
                Alert.alert('Success', 'Payment marked as complete.');
              }
            }
          },
        },
      ]
    );
  };

  const getExpenseTypeBadge = () => {
    if (expenseType === 'custom') {
      return (
        <View style={[styles.typeBadge, styles.customBadge]}>
          <Icon name="pie-chart" size={14} color="#FFF" />
          <Text style={styles.badgeText}>Custom Split</Text>
        </View>
      );
    } else if (expenseType === 'regular') {
      return (
        <View style={[styles.typeBadge, styles.regularBadge]}>
          <Icon name="call-split" size={14} color="#FFF" />
          <Text style={styles.badgeText}>Regular Split</Text>
        </View>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D2B48C" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.headerIcon}>
          <Icon name="receipt" size={24} color="#D2B48C" />
        </View>
        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{description}</Text>
            {getExpenseTypeBadge()}
          </View>
          <View style={styles.dateRow}>
            <Icon name="event" size={16} color="#888" />
            <Text style={styles.subtitle}>
              {new Date(date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </Text>
          </View>
        </View>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <Icon name="account-balance-wallet" size={20} color="#FFF0DC" />
          </View>
          <View>
            <Text style={styles.summaryLabel}>Total Amount</Text>
            <Text style={styles.summaryValue}>Rs{totalAmount.toFixed(2)}</Text>
          </View>
        </View>
        
        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <Icon name="people" size={20} color="#FFF0DC" />
          </View>
          <View>
            <Text style={styles.summaryLabel}>Per Person</Text>
            <Text style={styles.summaryValue}>Rs{sharePerPerson.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {/* Settlements Section */}
      <View style={styles.sectionHeader}>
        <Icon name="compare-arrows" size={20} color="#D2B48C" />
        <Text style={styles.sectionTitle}>Final Settlements</Text>
      </View>
      
      {settlements.length > 0 ? (
        settlements.map((s, index) => (
          <View key={index} style={styles.settlementCard}>
            <View style={styles.settlementContent}>
              <View style={styles.settlementIconContainer}>
                <Icon name="swap-horiz" size={20} color="#D2B48C" />
              </View>
              <View>
                <Text style={styles.settlementText}>
                  <Text style={{ fontWeight: 'bold' }}>{s.from}</Text> → {s.to}
                </Text>
                <Text style={styles.settlementAmount}>Rs{s.amount.toFixed(2)}</Text>
              </View>
            </View>
            {expenseType === 'custom' && (
              <TouchableOpacity
                style={styles.settleButton}
                onPress={() => handleSettle(s)}
              >
                <Icon name="check-circle" size={18} color="#FFF0DC" />
                <Text style={styles.settleButtonText}>Mark Paid</Text>
              </TouchableOpacity>
            )}
          </View>
        ))
      ) : (
        <View style={styles.emptyCard}>
          <Icon name="check-circle" size={24} color="#4CAF50" />
          <Text style={styles.emptyText}>All settlements completed</Text>
        </View>
      )}

      {/* Participants Section */}
      <View style={styles.sectionHeader}>
        <Icon name="group" size={20} color="#D2B48C" />
        <Text style={styles.sectionTitle}>Participants</Text>
      </View>
      
      {participants.length > 0 ? (
        participants.map((p, idx) => (
          <View key={idx} style={styles.participantCard}>
            <View style={styles.participantHeader}>
              <Icon name="person" size={20} color="#FFF0DC" style={styles.personIcon} />
              <Text style={styles.participantName}>{p.name || p.username}</Text>
            </View>
            
            <View style={styles.participantDetails}>
              <View style={styles.detailRow}>
                <Icon name="payments" size={16} color="#888" />
                <Text style={styles.detailText}>Paid: Rs{p.paid?.toFixed(2) || '0.00'}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Icon name="pie-chart" size={16} color="#888" />
                <Text style={styles.detailText}>Share: Rs{sharePerPerson.toFixed(2)}</Text>
              </View>
            </View>
            
            {p.net < 0 ? (
              <View style={styles.balanceStatus}>
                <Icon name="arrow-upward" size={16} color="#FF6B6B" />
                <Text style={[styles.balanceText, styles.owesText]}>Owes: Rs{(-p.net).toFixed(2)}</Text>
              </View>
            ) : p.net > 0 ? (
              <View style={styles.balanceStatus}>
                <Icon name="arrow-downward" size={16} color="#4CAF50" />
                <Text style={[styles.balanceText, styles.getsText]}>Gets: Rs{p.net.toFixed(2)}</Text>
              </View>
            ) : (
              <View style={styles.balanceStatus}>
                <Icon name="check-circle" size={16} color="#4CAF50" />
                <Text style={[styles.balanceText, styles.settledText]}>Settled</Text>
              </View>
            )}
          </View>
        ))
      ) : (
        <View style={styles.emptyCard}>
          <Icon name="error" size={24} color="#FF6B6B" />
          <Text style={styles.emptyText}>No participant data found</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Header Styles
  headerCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#D2B48C',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    backgroundColor: '#121212',
    borderRadius: 30,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF0DC',
    marginBottom: 4,
    flex: 1,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginLeft: 8,
  },
  customBadge: {
    backgroundColor: '#4A148C',
  },
  regularBadge: {
    backgroundColor: '#01579B',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    marginLeft: 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitle: {
    color: '#888',
    fontSize: 14,
    marginLeft: 4,
  },
  
  // Summary Styles
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryIcon: {
    backgroundColor: '#121212',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  summaryLabel: {
    color: '#888',
    fontSize: 14,
  },
  summaryValue: {
    color: '#D2B48C',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  // Section Styles
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D2B48C',
    marginLeft: 8,
  },
  
  // Settlement Styles
  settlementCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settlementContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settlementIconContainer: {
    marginRight: 12,
  },
  settlementText: {
    color: '#FFF0DC',
    fontSize: 15,
  },
  settlementAmount: {
    color: '#D2B48C',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  settleButton: {
    backgroundColor: '#543A14',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D2B48C',
  },
  settleButtonText: {
    color: '#FFF0DC',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  
  // Participant Styles
  participantCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  participantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 12,
  },
  personIcon: {
    marginRight: 10,
  },
  participantName: {
    color: '#FFF0DC',
    fontSize: 16,
    fontWeight: '600',
  },
  participantDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    color: '#FFF0DC',
    fontSize: 14,
    marginLeft: 6,
  },
  balanceStatus: {
    backgroundColor: '#121212',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  owesText: {
    color: '#FF6B6B',
  },
  getsText: {
    color: '#4CAF50',
  },
  settledText: {
    color: '#4CAF50',
  },
  
  // Empty States
  emptyCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});