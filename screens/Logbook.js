// import React, { useState, useEffect } from 'react'; 
// import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
// import { supabase } from '../lib/supabase';
// import { SwipeListView } from 'react-native-swipe-list-view';

// const Logbook = ({ navigation }) => {
//   const [logs, setLogs] = useState([]);
//   const [filteredLogs, setFilteredLogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState('all');
//   const [searchQuery, setSearchQuery] = useState('');

//   useEffect(() => {
//     fetchLogs();
//   }, [filter]);

//   useEffect(() => {
//     const subscription = supabase
//       .channel('logs')
//       .on('postgres_changes', { event: '*', schema: 'public', table: 'business_logs' }, () => {
//         fetchLogs();
//       })
//       .subscribe();

//     return () => subscription.unsubscribe();
//   }, []);

//   useEffect(() => {
//     handleSearch(searchQuery);
//   }, [logs, searchQuery]);

//   const fetchLogs = async () => {
//     try {
//       const { data: { user } } = await supabase.auth.getUser();
//       let query = supabase
//         .from('business_logs')
//         .select('*')
//         .eq('user_id', user.id)
//         .order('log_date', { ascending: false });

//       if (filter !== 'all') {
//         query = query.eq('type', filter);
//       }

//       const { data, error } = await query;

//       if (error) throw error;
//       setLogs(data || []);
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteLog = async (id) => {
//     Alert.alert(
//       "Delete Log",
//       "Are you sure you want to delete this log entry?",
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
//               setLogs(logs.filter(log => log.id !== id));
//             } catch (error) {
//               Alert.alert("Error", error.message);
//             }
//           }
//         }
//       ]
//     );
//   };

//   const handleSearch = (query) => {
//     setSearchQuery(query);
//     if (!query.trim()) {
//       setFilteredLogs(logs);
//     } else {
//       const lower = query.toLowerCase();
//       const filtered = logs.filter(log => 
//         log.category.toLowerCase().includes(lower) ||
//         log.description.toLowerCase().includes(lower) ||
//         log.amount.toString().includes(lower)
//       );
//       setFilteredLogs(filtered);
//     }
//   };

//   return ( 
    
//     <View style={styles.container}>
//       {/* Search Bar */}
//       <TextInput
//         style={styles.searchBar}
//         placeholder="Search by category, description, or amount"
//         placeholderTextColor="#AAA"
//         value={searchQuery}
//         onChangeText={handleSearch}
//       />

//       {/* Filter Buttons */}
//       <View style={styles.filterContainer}>
//         <TouchableOpacity style={[styles.filterButton, filter === 'all' && styles.activeFilter]} onPress={() => setFilter('all')}>
//           <Text style={styles.filterText}>All</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={[styles.filterButton, filter === 'income' && styles.activeFilter]} onPress={() => setFilter('income')}>
//           <Text style={styles.filterText}>Income</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={[styles.filterButton, filter === 'expense' && styles.activeFilter]} onPress={() => setFilter('expense')}>
//           <Text style={styles.filterText}>Expenses</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Swipe List View */}
//       <SwipeListView
//         data={filteredLogs}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View style={styles.rowFront}>
//             <View style={styles.logItem}>
//               <View style={styles.logLeft}>
//                 <Text style={styles.logDate}>{new Date(item.log_date).toLocaleDateString()}</Text>
//                 <Text style={styles.logCategory}>{item.category}</Text>
//               </View>
//               <View style={styles.logRight}>
//                 <Text style={[styles.logAmount, item.type === 'income' ? styles.income : styles.expense]}>
//                   Rs{item.amount.toFixed(2)}
//                 </Text>
//                 <Text style={styles.logDescription}>{item.description}</Text>
//               </View>
//             </View>
//           </View>
//         )}
//         renderHiddenItem={({ item }) => (
//           <View style={styles.rowBack}>
//             <TouchableOpacity style={styles.deleteButton} onPress={() => deleteLog(item.id)}>
//               <Text style={styles.deleteText}>Delete</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//         leftOpenValue={0}
//         rightOpenValue={-80}
//       />

//       {/* Add Button */}
//       <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddLogEntry')}>
//         <Text style={styles.addButtonText}>+ Add Entry</Text>
//       </TouchableOpacity>
//     </View>
    
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//     padding: 16,
//   },
//   searchBar: {
//     backgroundColor: '#222',
//     padding: 10,
//     borderRadius: 12,
//     color: '#FFF',
//     marginBottom: 12,
//     borderColor: '#FFF0DC',
//     borderWidth: 1,
//   },
//   logItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 16,
//   },
//   logLeft: {
//     flex: 1,
//     marginRight: 10,
//   },
//   logRight: {
//     alignItems: 'flex-end',
//   },
//   logDate: {
//     color: '#888',
//     fontSize: 14,
//   },
//   logCategory: {
//     color: '#4CAF50',
//     fontSize: 16,
//     marginTop: 4,
//   },
//   logAmount: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   income: {
//     color: '#4CAF50',
//   },
//   expense: {
//     color: '#F44336',
//   },
//   logDescription: {
//     color: '#BBB',
//     fontSize: 14,
//     marginTop: 4,
//   },
//   filterContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 16,
//   },
//   filterButton: {
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 20,
//     backgroundColor: '#333',
//     borderWidth : 1,
//     borderColor : '#FFF0DC'
//   },
//   activeFilter: {
//     backgroundColor: '#4CAF50',
//   },
//   filterText: {
//     color: '#FFF0DC',
//   },
//   addButton: {
//     backgroundColor: '#543A14',
//     padding: 16,
//     borderRadius: 24,
//     alignItems: 'center',
//     marginTop: 16,
//     borderWidth : 1,
//     borderColor : '#FFF0DC'
//   },
//   addButtonText: {
//     color: '#FFF0DC',
//     fontWeight: 'bold',
//   },
//   rowFront: {
//     backgroundColor: '#222',
//     borderRadius: 8,
//     marginBottom: 12,
//     overflow: 'hidden',
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

// export default Logbook;



//ios test

// import React, { useState, useEffect, useMemo } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, SectionList } from 'react-native';
// import { supabase } from '../lib/supabase';
// import { SwipeRow } from 'react-native-swipe-list-view';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const Logbook = ({ navigation }) => {
//   const [logs, setLogs] = useState([]);
//   const [filteredLogs, setFilteredLogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState('all');
//   const [searchQuery, setSearchQuery] = useState('');

//   useEffect(() => {
//     fetchLogs();
//   }, [filter]);

//   useEffect(() => {
//     const subscription = supabase
//       .channel('logs')
//       .on('postgres_changes', { event: '*', schema: 'public', table: 'business_logs' }, () => {
//         fetchLogs();
//       })
//       .subscribe();

//     return () => subscription.unsubscribe();
//   }, []);

//   useEffect(() => {
//     handleSearch(searchQuery);
//   }, [logs, searchQuery]);

//   const fetchLogs = async () => {
//     try {
//       const { data: { user } } = await supabase.auth.getUser();
//       let query = supabase
//         .from('business_logs')
//         .select('*')
//         .eq('user_id', user.id)
//         .order('log_date', { ascending: false });

//       if (filter !== 'all') {
//         query = query.eq('type', filter);
//       }

//       const { data, error } = await query;

//       if (error) throw error;
//       setLogs(data || []);
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteLog = async (id) => {
//     Alert.alert(
//       "Delete Log",
//       "Are you sure you want to delete this log entry?",
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
//               setLogs(logs.filter(log => log.id !== id));
//             } catch (error) {
//               Alert.alert("Error", error.message);
//             }
//           }
//         }
//       ]
//     );
//   };

//   const handleSearch = (query) => {
//     setSearchQuery(query);
//     if (!query.trim()) {
//       setFilteredLogs(logs);
//     } else {
//       const lower = query.toLowerCase();
//       const filtered = logs.filter(log => 
//         log.category.toLowerCase().includes(lower) ||
//         log.description.toLowerCase().includes(lower) ||
//         log.amount.toString().includes(lower)
//       );
//       setFilteredLogs(filtered);
//     }
//   };

//   // Calculate daily totals based on filter
//   const dailyTotals = useMemo(() => {
//     const totals = {};
    
//     filteredLogs.forEach(log => {
//       const date = new Date(log.log_date).toLocaleDateString();
//       if (!totals[date]) {
//         totals[date] = 0;
//       }
      
//       if (filter === 'all') {
//         totals[date] += (log.type === 'income' ? log.amount : -log.amount);
//       } else {
//         totals[date] += log.amount;
//       }
//     });
    
//     return totals;
//   }, [filteredLogs, filter]);

//   // Group logs by date for SectionList
//   const groupedLogs = useMemo(() => {
//     const groups = {};
    
//     filteredLogs.forEach(log => {
//       const date = new Date(log.log_date).toLocaleDateString();
//       if (!groups[date]) {
//         groups[date] = [];
//       }
//       groups[date].push(log);
//     });
    
//     return Object.keys(groups).map(date => ({
//       date,
//       data: groups[date],
//       total: dailyTotals[date] || 0
//     })).sort((a, b) => new Date(b.date) - new Date(a.date));
//   }, [filteredLogs, dailyTotals]);

//   // Render section headers with daily total
//   const renderSectionHeader = ({ section }) => {
//     const isPositive = section.total >= 0;
//     const isNet = filter === 'all';
    
//     return (
//       <View style={styles.sectionHeader}>
//         <Text style={styles.sectionDate}>{section.date}</Text>
//         <View style={styles.summaryContainer}>
//           <Text style={[
//             styles.summaryValue, 
//             isNet ? (isPositive ? styles.income : styles.expense) : 
//                    (filter === 'income' ? styles.income : styles.expense)
//           ]}>
//             {isNet ? 'Net: ' : filter === 'income' ? 'Income: ' : 'Expense: '}
//             {isNet && (section.total >= 0 ? '+' : '-')}
//             Rs{Math.abs(section.total).toFixed(2)}
//           </Text>
//         </View>
//       </View>
//     );
//   };

//   // Render individual log items
//   const renderItem = ({ item }) => (
//     <SwipeRow
//       rightOpenValue={-80}
//       disableRightSwipe
//       stopRightSwipe={-80}
//     >
//       {/* Hidden delete button */}
//       <View style={styles.rowBack}>
//         <TouchableOpacity 
//           style={styles.deleteButton} 
//           onPress={() => deleteLog(item.id)}
//         >
//           <Icon name="delete" size={24} color="#FFF" />
//         </TouchableOpacity>
//       </View>

//       {/* Visible log item */}
//       <View style={styles.rowFront}>
//         <View style={styles.logItem}>
//           <View style={styles.logLeft}>
//             <View style={styles.logCategoryContainer}>
//               <Icon 
//                 name={item.type === 'income' ? 'trending-up' : 'trending-down'} 
//                 size={18} 
//                 color={item.type === 'income' ? '#4CAF50' : '#F44336'} 
//                 style={styles.categoryIcon}
//               />
//               <Text style={styles.logCategory}>{item.category}</Text>
//             </View>
//             <Text style={styles.logDescription} numberOfLines={1}>
//               {item.description}
//             </Text>
//           </View>
//           <View style={styles.logRight}>
//             <Text style={[
//               styles.logAmount, 
//               item.type === 'income' ? styles.income : styles.expense
//             ]}>
//               {item.type === 'income' ? '+' : '-'}Rs{item.amount.toFixed(2)}
//             </Text>
//           </View>
//         </View>
//       </View>
//     </SwipeRow>
//   );

//   return ( 
//     <View style={styles.container}>
//       {/* Search Bar */}
//       <View style={styles.searchContainer}>
//         <Icon name="search" size={20} color="#AAA" style={styles.searchIcon} />
//         <TextInput
//           style={styles.searchBar}
//           placeholder="Search by category, description, or amount"
//           placeholderTextColor="#AAA"
//           value={searchQuery}
//           onChangeText={handleSearch}
//         />
//       </View>

//       {/* Filter Buttons */}
//       <View style={styles.filterContainer}>
//         <TouchableOpacity 
//           style={[styles.filterButton, filter === 'all' && styles.activeFilter]} 
//           onPress={() => setFilter('all')}
//         >
//           <Text style={styles.filterText}>All</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={[styles.filterButton, filter === 'income' && styles.activeFilter]} 
//           onPress={() => setFilter('income')}
//         >
//           <Text style={styles.filterText}>Income</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={[styles.filterButton, filter === 'expense' && styles.activeFilter]} 
//           onPress={() => setFilter('expense')}
//         >
//           <Text style={styles.filterText}>Expenses</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Section List */}
//       {groupedLogs.length > 0 ? (
//         <SectionList
//           sections={groupedLogs}
//           keyExtractor={(item) => item.id}
//           renderItem={renderItem}
//           renderSectionHeader={renderSectionHeader}
//           contentContainerStyle={styles.listContent}
//           stickySectionHeadersEnabled
//           showsVerticalScrollIndicator={false}
//         />
//       ) : (
//         <View style={styles.emptyState}>
//           <Icon name="description" size={60} color="#444" />
//           <Text style={styles.emptyText}>No entries found</Text>
//         </View>
//       )}

//       {/* Add Button */}
//       <TouchableOpacity 
//         style={styles.addButton} 
//         onPress={() => navigation.navigate('AddLogEntry')}
//       >
//         <Icon name="add" size={28} color="#FFF0DC" />
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//     padding: 16,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#222',
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#FFF0DC',
//   },
//   searchIcon: {
//     marginRight: 8,
//   },
//   searchBar: {
//     flex: 1,
//     paddingVertical: 12,
//     color: '#FFF',
//     fontSize: 16,
//   },
//   filterContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 16,
//   },
//   filterButton: {
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 20,
//     backgroundColor: '#333',
//     borderWidth: 1,
//     borderColor: '#FFF0DC',
//     flex: 1,
//     marginHorizontal: 4,
//     alignItems: 'center',
//   },
//   activeFilter: {
//     backgroundColor: '#4CAF50',
//     borderColor: '#4CAF50',
//   },
//   filterText: {
//     color: '#FFF0DC',
//     fontWeight: '500',
//   },
//   sectionHeader: {
//     backgroundColor: '#1A1A1A',
//     padding: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#333',
//   },
//   sectionDate: {
//     color: '#FFF0DC',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   summaryContainer: {
//     marginTop: 8,
//   },
//   summaryValue: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   income: {
//     color: '#4CAF50',
//   },
//   expense: {
//     color: '#F44336',
//   },
//   listContent: {
//     paddingBottom: 100,
//   },
//   rowFront: {
//     backgroundColor: '#222',
//     borderRadius: 8,
//     marginBottom: 8,
//     overflow: 'hidden',
//   },
//   rowBack: {
//     flex: 1,
//     alignItems: 'flex-end',
//     justifyContent: 'center',
//     backgroundColor: '#F44336',
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   deleteButton: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: 80,
//     height: '100%',
//   },
//   logItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 16,
//     alignItems: 'center',
//   },
//   logLeft: {
//     flex: 1,
//     marginRight: 10,
//   },
//   logRight: {
//     alignItems: 'flex-end',
//     minWidth: 100,
//   },
//   logCategoryContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   categoryIcon: {
//     marginRight: 8,
//   },
//   logCategory: {
//     color: '#FFF0DC',
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   logDescription: {
//     color: '#BBB',
//     fontSize: 14,
//     marginTop: 4,
//   },
//   logAmount: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   addButton: {
//     position: 'absolute',
//     bottom: 30,
//     right: 30,
//     backgroundColor: '#543A14',
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 1,
//     borderColor: '#FFF0DC',
//     elevation: 5,
//   },
//   emptyState: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 40,
//   },
//   emptyText: {
//     color: '#FFF0DC',
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginTop: 20,
//   },
// });

// export default Logbook;

import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, SectionList } from 'react-native';
import { supabase } from '../lib/supabase';
import { SwipeRow } from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/MaterialIcons';


const Logbook = ({ navigation }) => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLogs();
  }, [filter]);

  useEffect(() => {
    const subscription = supabase
      .channel('logs')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'business_logs' }, () => {
        fetchLogs();
      })
      .subscribe();

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [logs, searchQuery]);

  const fetchLogs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      let query = supabase
        .from('business_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('log_date', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('type', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteLog = async (id) => {
    Alert.alert(
      "Delete Log",
      "Are you sure you want to delete this log entry?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('business_logs')
                .delete()
                .eq('id', id);

              if (error) throw error;
              setLogs(logs.filter(log => log.id !== id));
            } catch (error) {
              Alert.alert("Error", error.message);
            }
          }
        }
      ]
    );
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredLogs(logs);
    } else {
      const lower = query.toLowerCase();
      const filtered = logs.filter(log => 
        (log.category?.toLowerCase().includes(lower)) ||
        (log.description?.toLowerCase().includes(lower)) ||
        (log.amount?.toString().includes(lower))
      );
      setFilteredLogs(filtered);
    }
  };

  // Calculate daily totals based on filter
  const dailyTotals = useMemo(() => {
    const totals = {};
    
    filteredLogs.forEach(log => {
      const date = new Date(log.log_date).toLocaleDateString();
      if (!totals[date]) {
        totals[date] = 0;
      }
      
      if (filter === 'all') {
        totals[date] += (log.type === 'income' ? log.amount : -log.amount);
      } else {
        totals[date] += log.amount;
      }
    });
    
    return totals;
  }, [filteredLogs, filter]);

  // Group logs by date for SectionList
  const groupedLogs = useMemo(() => {
    const groups = {};
    
    filteredLogs.forEach(log => {
      const date = new Date(log.log_date).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(log);
    });
    
    return Object.keys(groups).map(date => ({
      date,
      data: groups[date],
      total: dailyTotals[date] || 0
    })).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [filteredLogs, dailyTotals]);

  // Render section headers with daily total
  const renderSectionHeader = ({ section }) => {
    const isPositive = section.total >= 0;
    const isNet = filter === 'all';
    
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionDate}>{section.date}</Text>
        <View style={styles.summaryContainer}>
          <Text style={[
            styles.summaryValue, 
            isNet ? (isPositive ? styles.incomeText : styles.expenseText) : 
                   (filter === 'income' ? styles.incomeText : styles.expenseText)
          ]}>
            {isNet ? 'Net: ' : filter === 'income' ? 'Income: ' : 'Expense: '}
            {isNet && (section.total >= 0 ? '+' : '-')}
            Rs{Math.abs(section.total).toFixed(2)}
          </Text>
        </View>
      </View>
    );
  };

  // Render individual log items
  const renderItem = ({ item }) => (
    <SwipeRow
      rightOpenValue={-80}
      disableRightSwipe
      stopRightSwipe={-80}
    >
      {/* Hidden delete button */}
      <View style={styles.rowBack}>
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={() => deleteLog(item.id)}
        >
          <Icon name="delete" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Visible log item */}
      <View style={styles.rowFront}>
        <View style={styles.logItem}>
          <View style={styles.logLeft}>
            <View style={styles.logCategoryContainer}>
              <Icon 
                name={item.type === 'income' ? 'trending-up' : 'trending-down'} 
                size={18} 
                color={item.type === 'income' ? '#4CAF50' : '#F44336'} 
                style={styles.categoryIcon}
              />
              <Text style={styles.logCategory}>{item.category || 'Uncategorized'}</Text>
            </View>
            <Text style={styles.logDescription} numberOfLines={1}>
              {item.description || 'No description'}
            </Text>
          </View>
          <View style={styles.logRight}>
            <Text style={[
              styles.logAmount, 
              item.type === 'income' ? styles.incomeText : styles.expenseText
            ]}>
              {item.type === 'income' ? '+' : '-'}Rs{item.amount?.toFixed(2) || '0.00'}
            </Text>
          </View>
        </View>
      </View>
    </SwipeRow>
  );

  return ( 
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#AAA" style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search by category, description, or amount"
          placeholderTextColor="#AAA"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'all' && styles.activeFilter]} 
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'income' && styles.activeFilter]} 
          onPress={() => setFilter('income')}
        >
          <Text style={[styles.filterText, filter === 'income' && styles.activeFilterText]}>Income</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'expense' && styles.activeFilter]} 
          onPress={() => setFilter('expense')}
        >
          <Text style={[styles.filterText, filter === 'expense' && styles.activeFilterText]}>Expenses</Text>
        </TouchableOpacity>
      </View>

      {/* Section List */}
      {groupedLogs.length > 0 ? (
        <SectionList
          sections={groupedLogs}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Icon name="description" size={60} color="#444" />
          <Text style={styles.emptyText}>No entries found</Text>
        </View>
      )}

      {/* Add Button */}
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => navigation.navigate('AddLogEntry')}
      >
        <Icon name="add" size={28} color="#FFF0DC" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFF0DC',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchBar: {
    flex: 1,
    paddingVertical: 12,
    color: '#FFF',
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#FFF0DC',
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  activeFilter: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  filterText: {
    color: '#FFF0DC',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  sectionHeader: {
    backgroundColor: '#1A1A1A',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  sectionDate: {
    color: '#FFF0DC',
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryContainer: {
    marginTop: 8,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  incomeText: {
    color: '#4CAF50',
  },
  expenseText: {
    color: '#F44336',
  },
  listContent: {
    paddingBottom: 100,
  },
  rowFront: {
    backgroundColor: '#222',
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  rowBack: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: '#F44336',
    borderRadius: 8,
    marginBottom: 8,
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  logItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    alignItems: 'center',
  },
  logLeft: {
    flex: 1,
    marginRight: 10,
  },
  logRight: {
    alignItems: 'flex-end',
    minWidth: 100,
  },
  logCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryIcon: {
    marginRight: 8,
  },
  logCategory: {
    color: '#FFF0DC',
    fontSize: 16,
    fontWeight: '500',
  },
  logDescription: {
    color: '#BBB',
    fontSize: 14,
    marginTop: 4,
  },
  logAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#543A14',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFF0DC',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#FFF0DC',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default Logbook;