// //ios test
// import React, { useEffect, useState } from 'react';
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   FlatList, 
//   TouchableOpacity, 
//   Alert,
//   ActivityIndicator,
//   RefreshControl,
//   TextInput,
//   SectionList
// } from 'react-native';
// import { supabase } from '../lib/supabase';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const Reports = ({ navigation }) => {
//   const [receipts, setReceipts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [groupedReceipts, setGroupedReceipts] = useState([]);

//   useEffect(() => {
//     fetchReceipts();
//   }, []);

//   useEffect(() => {
//     // Group and filter receipts when data or search changes
//     if (receipts.length > 0) {
//       groupAndFilterReceipts();
//     }
//   }, [receipts, searchQuery]);

//   const fetchReceipts = async () => {
//     try {
//       setRefreshing(true);
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) throw new Error('User not authenticated');

//       const { data, error } = await supabase
//         .from('receipts')
//         .select('id, created_at, customer_name, total_amount, transaction_date, payment_method, items')
//         .eq('user_id', user.id)
//         .order('transaction_date', { ascending: false });

//       if (error) throw error;
//       setReceipts(data || []);
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const groupAndFilterReceipts = () => {
//     const today = new Date();
//     const yesterday = new Date(today);
//     yesterday.setDate(yesterday.getDate() - 1);
    
//     const todayStart = new Date(today.setHours(0, 0, 0, 0));
//     const yesterdayStart = new Date(yesterday.setHours(0, 0, 0, 0));
//     const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    
//     // Filter based on search query
//     const filtered = receipts.filter(receipt => {
//       const searchLower = searchQuery.toLowerCase();
      
//       // Check customer name
//       if (receipt.customer_name && receipt.customer_name.toLowerCase().includes(searchLower)) {
//         return true;
//       }
      
//       // Check formatted date
//       const dateStr = new Date(receipt.transaction_date).toLocaleDateString('en-IN');
//       if (dateStr.includes(searchLower)) {
//         return true;
//       }
      
//       // Check invoice ID
//       const invId = `inv-${receipt.id.slice(0, 8)}`;
//       if (invId.includes(searchLower)) {
//         return true;
//       }
      
//       return false;
//     });
    
//     // Group by date
//     const todayReceipts = [];
//     const yesterdayReceipts = [];
//     const thisMonthReceipts = [];
//     const olderReceipts = [];
    
//     filtered.forEach(receipt => {
//       const receiptDate = new Date(receipt.transaction_date);
      
//       if (receiptDate >= todayStart) {
//         todayReceipts.push(receipt);
//       } else if (receiptDate >= yesterdayStart) {
//         yesterdayReceipts.push(receipt);
//       } else if (receiptDate >= monthStart) {
//         thisMonthReceipts.push(receipt);
//       } else {
//         olderReceipts.push(receipt);
//       }
//     });
    
//     // Prepare section data
//     const sections = [];
    
//     if (todayReceipts.length > 0) {
//       sections.push({ 
//         title: 'Today', 
//         data: todayReceipts,
//         icon: 'today'
//       });
//     }
    
//     if (yesterdayReceipts.length > 0) {
//       sections.push({ 
//         title: 'Yesterday', 
//         data: yesterdayReceipts,
//         icon: 'event-available'
//       });
//     }
    
//     if (thisMonthReceipts.length > 0) {
//       sections.push({ 
//         title: 'This Month', 
//         data: thisMonthReceipts,
//         icon: 'calendar-today'
//       });
//     }
    
//     if (olderReceipts.length > 0) {
//       sections.push({ 
//         title: 'Older', 
//         data: olderReceipts,
//         icon: 'history'
//       });
//     }
    
//     setGroupedReceipts(sections);
//   };

//   const handleRefresh = () => {
//     fetchReceipts();
//   };

//   const renderSectionHeader = ({ section }) => (
//     <View style={styles.sectionHeader}>
//       <Icon name={section.icon} size={20} color="#D2B48C" />
//       <Text style={styles.sectionTitle}>{section.title}</Text>
//       <Text style={styles.sectionCount}>{section.data.length} invoices</Text>
//     </View>
//   );

//   const renderItem = ({ item }) => (
//     <TouchableOpacity
//       style={styles.item}
//       onPress={() => navigation.navigate('ReceiptScreen', {
//         receiptId: item.id,
//         customerName: item.customer_name,
//         items: item.items,
//         amount: item.total_amount,
//         date: item.transaction_date,
//         paymentMethod: item.payment_method
//       })}
//     >
//       <View style={styles.itemHeader}>
//         <Text style={styles.itemDate}>
//           {new Date(item.transaction_date).toLocaleDateString('en-IN', {
//             day: 'numeric',
//             month: 'short',
//             year: 'numeric'
//           })}
//         </Text>
//         <View style={styles.paymentMethod}>
//           <Icon 
//             name={getPaymentMethodIcon(item.payment_method)} 
//             size={16} 
//             color="#543A14" 
//           />
//           <Text style={styles.paymentMethodText}>
//             {item.payment_method || 'Unknown'}
//           </Text>
//         </View>
//       </View>
      
//       <Text style={styles.itemCustomer}>
//         {item.customer_name || 'Walk-in Customer'}
//       </Text>
      
//       <View style={styles.itemFooter}>
//         <Text style={styles.itemId}>INV-{item.id.slice(0, 8).toUpperCase()}</Text>
//         <Text style={styles.itemAmount}>Rs{item.total_amount?.toFixed(2) || '0.00'}</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   const getPaymentMethodIcon = (method) => {
//     switch(method?.toLowerCase()) {
//       case 'cash': return 'money';
//       case 'card': return 'credit-card';
//       case 'upi': return 'smartphone';
//       case 'online': return 'public';
//       default: return 'payment';
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {/* Search Bar */}
//       <View style={styles.searchContainer}>
//         <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search by name, date or invoice..."
//           placeholderTextColor="#888"
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//           clearButtonMode="while-editing"
//         />
//       </View>

//       {loading && !refreshing ? (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#543A14" />
//         </View>
//       ) : (
//         <SectionList
//           sections={groupedReceipts}
//           keyExtractor={item => item.id}
//           renderItem={renderItem}
//           renderSectionHeader={renderSectionHeader}
//           ListEmptyComponent={
//             <View style={styles.emptyContainer}>
//               <Icon name="receipt" size={50} color="#A0A0A0" />
//               <Text style={styles.emptyText}>No invoices found</Text>
//               <Text style={styles.emptySubText}>
//                 {searchQuery ? 'No matches for your search' : 'Your recent invoices will appear here'}
//               </Text>
//             </View>
//           }
//           contentContainerStyle={groupedReceipts.length === 0 && styles.emptyListContainer}
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={handleRefresh}
//               colors={['#543A14']}
//               tintColor={'#543A14'}
//             />
//           }
//           stickySectionHeadersEnabled={true}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#1E1E1E',
//     borderRadius: 10,
//     margin: 16,
//     paddingHorizontal: 16,
//     borderWidth: 1,
//     borderColor: '#333',
//   },
//   searchIcon: {
//     marginRight: 10,
//   },
//   searchInput: {
//     flex: 1,
//     height: 50,
//     color: '#FFF0DC',
//     fontSize: 16,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 40,
//   },
//   emptyListContainer: {
//     flex: 1,
//   },
//   emptyText: {
//     fontSize: 18,
//     color: '#FFF0DC',
//     marginTop: 16,
//     fontWeight: '500',
//   },
//   emptySubText: {
//     fontSize: 14,
//     color: '#FFF0DC',
//     marginTop: 8,
//     textAlign: 'center',
//     paddingHorizontal: 20,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#121212',
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#333',
//   },
//   sectionTitle: {
//     color: '#D2B48C',
//     fontSize: 16,
//     fontWeight: '600',
//     marginLeft: 10,
//   },
//   sectionCount: {
//     color: '#888',
//     fontSize: 14,
//     marginLeft: 'auto',
//   },
//   listContainer: {
//     padding: 16,
//     paddingBottom: 32,
//   },
//   item: {
//     color: '#FFF0DC',
//     backgroundColor: '#1E1E1E',
//     padding: 16,
//     marginBottom: 12,
//     borderRadius: 12,
//     borderLeftWidth: 4,
//     borderLeftColor: '#543A14',
//     marginHorizontal: 16,
//   },
//   itemHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   itemDate: {
//     color: '#A0A0A0',
//     fontSize: 14,
//   },
//   paymentMethod: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   paymentMethodText: {
//     color: '#FFF0DC',
//     fontSize: 14,
//     marginLeft: 4,
//   },
//   itemCustomer: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginVertical: 4,
//     color: '#FFF0DC',
//   },
//   itemFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   itemId: {
//     fontSize: 12,
//     color: '#A0A0A0',
//     fontFamily: 'monospace',
//   },
//   itemAmount: {
//     fontSize: 18,
//     color: '#4CAF50',
//     fontWeight: '700',
//   },
// });

// export default Reports;

import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  SectionList
} from 'react-native';
import { supabase } from '../lib/supabase';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import Icon from '../components/IconWrapper';

const Reports = ({ navigation }) => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [groupedReceipts, setGroupedReceipts] = useState([]);

  useEffect(() => {
    fetchReceipts();
  }, []);

  useEffect(() => {
    // Group and filter receipts when data or search changes
    if (receipts.length > 0) {
      groupAndFilterReceipts();
    }
  }, [receipts, searchQuery]);

  const fetchReceipts = async () => {
    try {
      setRefreshing(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('receipts')
        .select('id, created_at, customer_name, total_amount, transaction_date, payment_method, items')
        .eq('user_id', user.id)
        .order('transaction_date', { ascending: false });

      if (error) throw error;
      setReceipts(data || []);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const groupAndFilterReceipts = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const todayStart = new Date(today.setHours(0, 0, 0, 0));
    const yesterdayStart = new Date(yesterday.setHours(0, 0, 0, 0));
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // Filter based on search query
    const filtered = receipts.filter(receipt => {
      const searchLower = searchQuery.toLowerCase();
      
      // Check customer name
      if (receipt.customer_name && receipt.customer_name.toLowerCase().includes(searchLower)) {
        return true;
      }
      
      // Check formatted date
      const dateStr = new Date(receipt.transaction_date).toLocaleDateString('en-IN');
      if (dateStr.includes(searchLower)) {
        return true;
      }
      
      // Check invoice ID
      const invId = `inv-${receipt.id.slice(0, 8)}`;
      if (invId.includes(searchLower)) {
        return true;
      }
      
      return false;
    });
    
    // Group by date
    const todayReceipts = [];
    const yesterdayReceipts = [];
    const thisMonthReceipts = [];
    const olderReceipts = [];
    
    filtered.forEach(receipt => {
      const receiptDate = new Date(receipt.transaction_date);
      
      if (receiptDate >= todayStart) {
        todayReceipts.push(receipt);
      } else if (receiptDate >= yesterdayStart) {
        yesterdayReceipts.push(receipt);
      } else if (receiptDate >= monthStart) {
        thisMonthReceipts.push(receipt);
      } else {
        olderReceipts.push(receipt);
      }
    });
    
    // Prepare section data
    const sections = [];
    
    if (todayReceipts.length > 0) {
      sections.push({ 
        title: 'Today', 
        data: todayReceipts,
        icon: 'today'
      });
    }
    
    if (yesterdayReceipts.length > 0) {
      sections.push({ 
        title: 'Yesterday', 
        data: yesterdayReceipts,
        icon: 'event-available'
      });
    }
    
    if (thisMonthReceipts.length > 0) {
      sections.push({ 
        title: 'This Month', 
        data: thisMonthReceipts,
        icon: 'calendar-today'
      });
    }
    
    if (olderReceipts.length > 0) {
      sections.push({ 
        title: 'Older', 
        data: olderReceipts,
        icon: 'history'
      });
    }
    
    setGroupedReceipts(sections);
  };

  const handleRefresh = () => {
    fetchReceipts();
  };

  const renderSectionHeader = ({ section }) => (
    <View style={styles.sectionHeader}>
      <Icon name={section.icon} size={20} color="#D2B48C" />
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <Text style={styles.sectionCount}>{section.data.length} invoices</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('ReceiptScreen', {
        receiptId: item.id,
        customerName: item.customer_name,
        items: item.items,
        amount: item.total_amount,
        date: item.transaction_date,
        paymentMethod: item.payment_method
      })}
    >
      <View style={styles.itemHeader}>
        <Text style={styles.itemDate}>
          {new Date(item.transaction_date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })}
        </Text>
        <View style={styles.paymentMethod}>
          <Icon 
            name={getPaymentMethodIcon(item.payment_method)} 
            size={16} 
            color="#543A14" 
          />
          <Text style={styles.paymentMethodText}>
            {item.payment_method || 'Unknown'}
          </Text>
        </View>
      </View>
      
      <Text style={styles.itemCustomer}>
        {item.customer_name || 'Walk-in Customer'}
      </Text>
      
      <View style={styles.itemFooter}>
        <Text style={styles.itemId}>INV-{item.id.slice(0, 8).toUpperCase()}</Text>
        <Text style={styles.itemAmount}>Rs{item.total_amount?.toFixed(2) || '0.00'}</Text>
      </View>
    </TouchableOpacity>
  );

  const getPaymentMethodIcon = (method) => {
    switch(method?.toLowerCase()) {
      case 'cash': return 'money';
      case 'card': return 'credit-card';
      case 'upi': return 'smartphone';
      case 'online': return 'public';
      default: return 'payment';
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, date or invoice..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#543A14" />
        </View>
      ) : (
        <SectionList
          sections={groupedReceipts}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="receipt" size={50} color="#A0A0A0" />
              <Text style={styles.emptyText}>No invoices found</Text>
              <Text style={styles.emptySubText}>
                {searchQuery ? 'No matches for your search' : 'Your recent invoices will appear here'}
              </Text>
            </View>
          }
          contentContainerStyle={groupedReceipts.length === 0 && styles.emptyListContainer}
          refreshControl={
            <RefreshControl
  refreshing={refreshing}
  onRefresh={handleRefresh}
  tintColor={'#543A14'}
/>
          }
          stickySectionHeadersEnabled={true}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    margin: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: '#FFF0DC',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyListContainer: {
    flex: 1,
  },
  emptyText: {
    fontSize: 18,
    color: '#FFF0DC',
    marginTop: 16,
    fontWeight: '500',
  },
  emptySubText: {
    fontSize: 14,
    color: '#FFF0DC',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121212',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  sectionTitle: {
    color: '#D2B48C',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  sectionCount: {
    color: '#888',
    fontSize: 14,
    marginLeft: 'auto',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  item: {
    backgroundColor: '#1E1E1E',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#543A14',
    marginHorizontal: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemDate: {
    color: '#A0A0A0',
    fontSize: 14,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodText: {
    color: '#FFF0DC',
    fontSize: 14,
    marginLeft: 4,
  },
  itemCustomer: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 4,
    color: '#FFF0DC',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  itemId: {
    fontSize: 12,
    color: '#A0A0A0',
    fontFamily: 'monospace',
  },
  itemAmount: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: '700',
  },
});

export default Reports;