// // import React from 'react';
// // import { View, Text, StyleSheet } from 'react-native';

// // export default function Invoicing() {
// //   return (
// //     <View style={styles.container}>
// //       <Text style={styles.title}>Business Invoice Screen</Text>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#fff',
// //   },
// //   title: {
// //     fontSize: 24,
// //     fontWeight: 'bold',
// //   },
// // }); 


// //ios test
// import React, { useState, useEffect } from 'react';
// import { 
//   View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput, Alert, ActivityIndicator, Modal 
// } from 'react-native';
// import { supabase } from '../lib/supabase';

// const Invoicing = ({ navigation }) => {
//   const [invoices, setInvoices] = useState([]);
//   const [clients, setClients] = useState([]);
//   const [loading, setLoading] = useState(true);
  
//   // Form State
//   const [clientId, setClientId] = useState(null);
//   const [amount, setAmount] = useState('');
//   const [date, setDate] = useState(new Date());
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [showClientPicker, setShowClientPicker] = useState(false);

//   useEffect(() => {
//     fetchInvoices();
//     fetchClients();
    
//     const invoiceSubscription = supabase
//       .channel('invoices')
//       .on('postgres_changes', { event: '*', schema: 'public', table: 'invoices' }, fetchInvoices)
//       .subscribe();

//     return () => invoiceSubscription.unsubscribe();
//   }, []);

//   const fetchInvoices = async () => {
//     try {
//       const { data: { user } } = await supabase.auth.getUser();
//       const { data, error } = await supabase
//         .from('invoices')
//         .select(`
//           id,
//           amount,
//           due_date,
//           status,
//           clients (name)
//         `)
//         .eq('business_id', user.id);

//       if (error) throw error;
//       setInvoices(data || []);
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchClients = async () => {
//     try {
//       const { data: { user } } = await supabase.auth.getUser();
//       const { data, error } = await supabase
//         .from('clients')
//         .select('*')
//         .eq('business_id', user.id);

//       if (error) throw error;
//       setClients(data || []);
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     }
//   };

//   const createInvoice = async () => {
//     if (!clientId || !amount) {
//       Alert.alert('Error', 'Please fill in all fields.');
//       return;
//     }

//     try {
//       const { data: { user } } = await supabase.auth.getUser();
      
//       const { error } = await supabase
//         .from('invoices')
//         .insert([{
//           client_id: clientId,
//           amount: parseFloat(amount),
//           business_id: user.id,
//           due_date: date.toISOString(),
//           status: 'draft'
//         }]);

//       if (error) throw error;

//       setClientId(null);
//       setAmount('');
//       setDate(new Date());

//       Alert.alert('Success', 'Invoice created successfully');
//       fetchInvoices();
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     }
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       paid: '#4CAF50',
//       draft: '#FFC107',
//       sent: '#2196F3',
//       overdue: '#F44336'
//     };
//     return colors[status] || '#666';
//   };

//   const renderInvoiceItem = ({ item }) => (
//     <TouchableOpacity 
//       style={styles.invoiceCard}
//       onPress={() => navigation.navigate('InvoiceDetails', { invoiceId: item.id })}
//     >
//       <View style={styles.invoiceHeader}>
//         <Text style={styles.clientName}>{item.clients?.name || 'No Client'}</Text>
//         <Text style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
//           {item.status.toUpperCase()}
//         </Text>
//       </View>
//       <Text style={styles.amount}>₹{item.amount.toFixed(2)}</Text>
//       <Text style={styles.dueDate}>
//         Due: {new Date(item.due_date).toLocaleDateString()}
//       </Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       {/* Create Invoice Form */}
//       <View style={styles.formContainer}>
//         {/* Client Picker */}
//         <TouchableOpacity 
//           style={styles.input}
//           onPress={() => setShowClientPicker(true)}
//         >
//           <Text style={{ color: clientId ? '#FFF0DC' : '#888' }}>
//             {clientId ? clients.find(c => c.id === clientId)?.name : 'Select Client'}
//           </Text>
//         </TouchableOpacity>

//         {/* Amount Input */}
//         <TextInput
//           style={styles.input}
//           placeholder="Amount"
//           placeholderTextColor="#888"
//           keyboardType="numeric"
//           value={amount}
//           onChangeText={setAmount}
//         />

//         {/* Date Picker */}
//         <TouchableOpacity 
//           style={styles.datePickerButton}
//           onPress={() => setShowDatePicker(true)}
//         >
//           <Text style={styles.dateText}>Due Date: {date.toLocaleDateString()}</Text>
//         </TouchableOpacity>

//         {/* Create Invoice Button */}
//         <TouchableOpacity 
//           style={styles.createButton}
//           onPress={createInvoice}
//         >
//           <Text style={styles.buttonText}>Create Invoice</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Invoices List */}
//       {loading ? (
//         <ActivityIndicator size="large" color="#4CAF50" />
//       ) : (
//         <FlatList
//           data={invoices}
//           renderItem={renderInvoiceItem}
//           keyExtractor={item => item.id}
//           contentContainerStyle={styles.listContainer}
//           ListEmptyComponent={<Text style={styles.emptyText}>No invoices found</Text>}
//         />
//       )}

//       {/* Custom Client Picker Modal */}
//       <Modal visible={showClientPicker} transparent>
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             {clients.map(client => (
//               <TouchableOpacity
//                 key={client.id}
//                 style={styles.modalItem}
//                 onPress={() => {
//                   setClientId(client.id);
//                   setShowClientPicker(false);
//                 }}
//               >
//                 <Text style={{ color: '#FFF0DC' }}>{client.name}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>
//       </Modal>

//       {/* Custom Date Picker Modal */}
//       <Modal visible={showDatePicker} transparent>
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <TouchableOpacity onPress={() => setDate(new Date())}>
//               <Text style={{ color: '#FFF0DC' }}>Select Today</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => setShowDatePicker(false)}>
//               <Text style={{ color: '#FFF0DC', marginTop: 20 }}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#000', padding: 16 },
//   formContainer: { backgroundColor: '#222', borderRadius: 12, padding: 16, marginBottom: 20 },
//   input: { backgroundColor: '#333', color: '#FFF0DC', borderRadius: 8, padding: 14, marginBottom: 12 },
//   datePickerButton: { backgroundColor: '#333', borderRadius: 8, padding: 14, marginBottom: 12 },
//   dateText: { color: '#FFF0DC' },
//   createButton: { backgroundColor: '#4CAF50', borderRadius: 8, padding: 16, alignItems: 'center' },
//   buttonText: { color: '#FFF0DC', fontWeight: 'bold' },
//   modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
//   modalContent: { backgroundColor: '#222', padding: 20, borderRadius: 10 },
//   modalItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#FFF0DC' },
// });

// export default Invoicing;


import React, { useState, useEffect } from 'react';
import { 
  View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput, Alert, ActivityIndicator, Modal 
} from 'react-native';
import { supabase } from '../lib/supabase';

const Invoicing = ({ navigation }) => {
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [clientId, setClientId] = useState(null);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showClientPicker, setShowClientPicker] = useState(false);

  useEffect(() => {
    fetchInvoices();
    fetchClients();
    
    const invoiceSubscription = supabase
      .channel('invoices')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invoices' }, fetchInvoices)
      .subscribe();

    return () => invoiceSubscription.unsubscribe();
  }, []);

  const fetchInvoices = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          id,
          amount,
          due_date,
          status,
          clients (name)
        `)
        .eq('business_id', user.id);

      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('business_id', user.id);

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const createInvoice = async () => {
    if (!clientId || !amount) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('invoices')
        .insert([{
          client_id: clientId,
          amount: parseFloat(amount),
          business_id: user.id,
          due_date: date.toISOString(),
          status: 'draft'
        }]);

      if (error) throw error;

      setClientId(null);
      setAmount('');
      setDate(new Date());

      Alert.alert('Success', 'Invoice created successfully');
      fetchInvoices();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      paid: '#4CAF50',
      draft: '#FFC107',
      sent: '#2196F3',
      overdue: '#F44336'
    };
    return colors[status] || '#666';
  };

  const renderInvoiceItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.invoiceCard}
      onPress={() => navigation.navigate('InvoiceDetails', { invoiceId: item.id })}
    >
      <View style={styles.invoiceHeader}>
        <Text style={styles.clientName}>{item.clients?.name || 'No Client'}</Text>
        <Text style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          {item.status.toUpperCase()}
        </Text>
      </View>
      <Text style={styles.amount}>₹{item.amount.toFixed(2)}</Text>
      <Text style={styles.dueDate}>
        Due: {new Date(item.due_date).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Create Invoice Form */}
      <View style={styles.formContainer}>
        {/* Client Picker */}
        <TouchableOpacity 
          style={styles.input}
          onPress={() => setShowClientPicker(true)}
        >
          <Text style={clientId ? styles.selectedText : styles.placeholderText}>
            {clientId ? clients.find(c => c.id === clientId)?.name : 'Select Client'}
          </Text>
        </TouchableOpacity>

        {/* Amount Input */}
        <TextInput
          style={styles.input}
          placeholder="Amount"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        {/* Date Picker */}
        <TouchableOpacity 
          style={styles.datePickerButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>Due Date: {date.toLocaleDateString()}</Text>
        </TouchableOpacity>

        {/* Create Invoice Button */}
        <TouchableOpacity 
          style={styles.createButton}
          onPress={createInvoice}
        >
          <Text style={styles.buttonText}>Create Invoice</Text>
        </TouchableOpacity>
      </View>

      {/* Invoices List */}
      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <FlatList
          data={invoices}
          renderItem={renderInvoiceItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<Text style={styles.emptyText}>No invoices found</Text>}
        />
      )}

      {/* Custom Client Picker Modal */}
      <Modal visible={showClientPicker} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {clients.map(client => (
              <TouchableOpacity
                key={client.id}
                style={styles.modalItem}
                onPress={() => {
                  setClientId(client.id);
                  setShowClientPicker(false);
                }}
              >
                <Text style={styles.modalText}>{client.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Custom Date Picker Modal */}
      <Modal visible={showDatePicker} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setDate(new Date())}>
              <Text style={styles.modalText}>Select Today</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowDatePicker(false)}>
              <Text style={[styles.modalText, { marginTop: 20 }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000', 
    padding: 16 
  },
  formContainer: { 
    backgroundColor: '#222', 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 20 
  },
  input: { 
    backgroundColor: '#333', 
    color: '#FFF0DC', 
    borderRadius: 8, 
    padding: 14, 
    marginBottom: 12 
  },
  selectedText: {
    color: '#FFF0DC'
  },
  placeholderText: {
    color: '#888'
  },
  datePickerButton: { 
    backgroundColor: '#333', 
    borderRadius: 8, 
    padding: 14, 
    marginBottom: 12 
  },
  dateText: { 
    color: '#FFF0DC' 
  },
  createButton: { 
    backgroundColor: '#4CAF50', 
    borderRadius: 8, 
    padding: 16, 
    alignItems: 'center' 
  },
  buttonText: { 
    color: '#FFF0DC', 
    fontWeight: 'bold' 
  },
  invoiceCard: {
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  clientName: {
    color: '#FFF0DC',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  amount: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dueDate: {
    color: '#888',
    fontSize: 14,
  },
  listContainer: {
    paddingBottom: 16,
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
  },
  modalContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.6)' 
  },
  modalContent: { 
    backgroundColor: '#222', 
    padding: 20, 
    borderRadius: 10,
    minWidth: 200,
  },
  modalItem: { 
    padding: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: '#444' 
  },
  modalText: {
    color: '#FFF0DC'
  },
});

export default Invoicing;