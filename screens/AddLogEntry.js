// // // import React, { useState } from 'react';
// // // import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
// // // import { supabase } from '../lib/supabase';
// // // import DropDownPicker from 'react-native-dropdown-picker';
// // // import DateTimePicker from '@react-native-community/datetimepicker';

// // // const AddLogEntry = ({ navigation  ,users, session }) => {
// // //   const [amount, setAmount] = useState('');
// // //   const [type, setType] = useState('income');
// // //   const [category, setCategory] = useState('');
// // //   const [description, setDescription] = useState('');
// // //   const [date, setDate] = useState(new Date());
// // //   const [showDatePicker, setShowDatePicker] = useState(false);
// // //   const [customerName, setCustomerName] = useState('');
// // //   const [billingMethod, setBillingMethod] = useState('receivable');
// // //   const [paymentMethod, setPaymentMethod] = useState('cash');
// // //   const [itemName, setItemName] = useState('');
// // //   const [quantity, setQuantity] = useState('');
// // //   const [unitPrice, setUnitPrice] = useState('');
  
// // //   // Dropdown states
// // //   const [openPaymentMethod, setOpenPaymentMethod] = useState(false);
// // //   const [paymentItems, setPaymentItems] = useState([
// // //     { label: 'cash', value: 'cash' },
// // //     { label: 'bank transfer', value: 'bank transfer' },
// // //     { label: 'other', value: 'other' },
// // //   ]);

// // //   const validateForm = () => {
// // //     if (!amount || isNaN(amount)) {
// // //       Alert.alert('Error', 'Please enter a valid amount');
// // //       return false;
// // //     }
// // //     if (itemName && (!quantity || !unitPrice)) {
// // //       Alert.alert('Error', 'Please fill all inventory fields');
// // //       return false;
// // //     }
// // //     return true;
// // //   };

// // //   const handleSubmit = async () => {
// // //     if (!validateForm()) return;

// // //     try {
// // //       const { data: { user } } = await supabase.auth.getUser();
// // //       if (!user) throw new Error('User not authenticated');

// // //       // Start transaction
// // //       const { data: logData, error: logError } = await supabase
// // //         .from('business_logs')
// // //         .insert({
// // //           user_id: user.id,
// // //           amount: parseFloat(amount),
// // //           type,
// // //           category,
// // //           description,
// // //           log_date: date.toISOString()
// // //         })
// // //         .select()
// // //         .single();

// // //       if (logError) throw logError;

// // //       // Handle customer/supplier

// // //       // For customers/suppliers upsert
// // //       if (customerName) {
// // //         const table = type === 'income' ? 'customers' : 'suppliers';
// // //         const { data: entityData, error: entityError } = await supabase
// // //           .from(table)
// // //           .upsert(
// // //             { 
// // //               user_id: user.id,
// // //               name: customerName,
// // //               total_due: parseFloat(amount)
// // //             },
// // //             { onConflict: 'user_id,name', returning: 'representation' }
// // //           )
// // //           .select()
// // //           .single();

// // //         if (entityError) throw entityError;

// // //         // Handle transaction (receivable/payable)
// // //         const transactionTable = type === 'income' ? 'receivables' : 'payables';
// // //         const { error: transactionError } = await supabase
// // //           .from(transactionTable)
// // //           .insert({
// // //             user_id: user.id,
// // //             [type === 'income' ? 'customer_id' : 'supplier_id']: entityData.id,
// // //             amount: parseFloat(amount),
// // //             description,
// // //             due_date: date.toISOString(),
// // //             status: 'pending'
// // //           });

// // //         if (transactionError) throw transactionError;
// // //       }

// // //       // Handle payment
// // //       const { error: paymentError } = await supabase
// // //         .from('payments')
// // //         .insert({
// // //           user_id: user.id,
// // //           type: billingMethod,
// // //           reference_id: logData.id,
// // //           amount: parseFloat(amount),
// // //           method: paymentMethod.toLowerCase(),
// // //           payment_date: date.toISOString()
// // //         });

// // //       if (paymentError) throw paymentError;

// // //       // Handle inventory
// // //     //   if (itemName && quantity && unitPrice) {
// // //     //     const { error: inventoryError } = await supabase
// // //     //       .from('inventory')
// // //     //       .upsert(
// // //     //         {
// // //     //           user_id: user.id,
// // //     //           item_name: itemName,
// // //     //           quantity: parseInt(quantity),
// // //     //           price: parseFloat(unitPrice),
// // //     //           updated_at: new Date().toISOString()
// // //     //         },
// // //     //         { onConflict: 'user_id,item_name' }
// // //     //       );

// // //     //     if (inventoryError) throw inventoryError;
// // //     //   }

// // //     // Handle inventory

    
// // // if (itemName && quantity && unitPrice) {
// // //     const { error: inventoryError } = await supabase
// // //       .from('inventory')
// // //       .upsert(
// // //         {
// // //           user_id: user.id,
// // //           item_name: itemName,
// // //           quantity: parseInt(quantity),
// // //           price: parseFloat(unitPrice),
// // //           updated_at: new Date().toISOString()
// // //         },
// // //         { 
// // //           onConflict: 'user_id,item_name', // Match the unique constraint
// // //           returning: 'minimal' // Don't return the inserted record
// // //         }
// // //       );
  
// // //     if (inventoryError) throw inventoryError;
// // //   }
// // //   navigation.navigate('ReceiptScreen',  {
// // //    session, 
// // //    users, 
// // //     customerName,
// // //     items: [{ itemName, quantity: parseInt(quantity), unitPrice: parseFloat(unitPrice) }],
// // //     amount: parseFloat(amount).toFixed(2),
// // //     paidAmount: parseFloat(amount), // Assuming full payment, update logic as needed
// // //     date: date.toISOString(),
// // //     paymentMethod,
// // //     type
// // //   });

// // //     const receiptItems = itemName ? [{
// // //         itemName,
// // //         quantity: parseInt(quantity),
// // //         unitPrice: parseFloat(unitPrice)
// // //       }] : [];
  
// // //       const {data: receiptResponse, error: receiptError } = await supabase
// // //         .from('receipts')
// // //         .insert({
// // //           user_id: user.id,
// // //           customer_name: customerName,
// // //           items: receiptItems,
// // //           total_amount: parseFloat(amount),
// // //           payment_method: paymentMethod.toLowerCase(),
// // //           transaction_date: date.toISOString()
// // //         })

// // //         .select('id')  // Explicitly select the ID field
// // //         .single();  

// // //       if (receiptError) throw receiptError;
  
// // //       navigation.navigate('ReceiptScreen', {
// // //         users ,
// // //         session,
// // //         customerName,
// // //         items: receiptItems,
// // //         amount: parseFloat(amount).toFixed(2),
// // //         date: date.toISOString(),
// // //         paymentMethod,
// // //         type,
// // //         receiptId: receiptResponse.id,
// // //       });

// // //     } catch (error) {
// // //       Alert.alert('Error', error.message);
// // //     }
// // //   };

// // //   return (
// // //     <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
// // //       {/* Amount Input */}
// // //       <TextInput
// // //         style={styles.input}
// // //         placeholder="Amount*"
// // //         placeholderTextColor="#888"
// // //         keyboardType="numeric"
// // //         value={amount}
// // //         onChangeText={setAmount}
// // //       />

// // //       {/* Transaction Type */}
// // //       <View style={styles.typeContainer}>
// // //         <TouchableOpacity
// // //           style={[styles.typeButton, type === 'income' && styles.activeType]}
// // //           onPress={() => setType('income')}
// // //         >
// // //           <Text style={styles.typeText}>Income</Text>
// // //         </TouchableOpacity>
// // //         <TouchableOpacity
// // //           style={[styles.typeButton, type === 'expense' && styles.activeType]}
// // //           onPress={() => setType('expense')}
// // //         >
// // //           <Text style={styles.typeText}>Expense</Text>
// // //         </TouchableOpacity>
// // //       </View>

// // //       {/* Date Picker */}
// // //       <TouchableOpacity
// // //         style={styles.input}
// // //         onPress={() => setShowDatePicker(true)}
// // //       >
// // //         <Text style={styles.dateText}>
// // //           {date.toLocaleDateString()}
// // //         </Text>
// // //       </TouchableOpacity>
// // //       {showDatePicker && (
// // //         <DateTimePicker
// // //           value={date}
// // //           mode="date"
// // //           display="default"
// // //           onChange={(event, selectedDate) => {
// // //             setShowDatePicker(false);
// // //             selectedDate && setDate(selectedDate);
// // //           }}
// // //         />
// // //       )}

// // //       {/* Customer/Supplier Input */}
// // //       <TextInput
// // //         style={styles.input}
// // //         placeholder="Customer/Supplier Name"
// // //         placeholderTextColor="#888"
// // //         value={customerName}
// // //         onChangeText={setCustomerName}
// // //       />

// // //       {/* Billing Method */}
// // //       <View style={styles.typeContainer}>
// // //         <TouchableOpacity
// // //           style={[styles.typeButton, billingMethod === 'receivable' && styles.activeType]}
// // //           onPress={() => setBillingMethod('receivable')}
// // //         >
// // //           <Text style={styles.typeText}>Receivable</Text>
// // //         </TouchableOpacity>
// // //         <TouchableOpacity
// // //           style={[styles.typeButton, billingMethod === 'payable' && styles.activeType]}
// // //           onPress={() => setBillingMethod('payable')}
// // //         >
// // //           <Text style={styles.typeText}>Payable</Text>
// // //         </TouchableOpacity>
// // //       </View>

// // //       {/* Payment Method Dropdown */}
// // //       <DropDownPicker
// // //         open={openPaymentMethod}
// // //         value={paymentMethod}
// // //         items={paymentItems}
// // //         setOpen={setOpenPaymentMethod}
// // //         setValue={setPaymentMethod}
// // //         setItems={setPaymentItems}
// // //         placeholder="Select Payment Method"
// // //         style={styles.dropdown}
// // //         textStyle={styles.dropdownText}
// // //         dropDownContainerStyle={styles.dropdownContainer}
// // //         zIndex={3000}
// // //         zIndexInverse={1000}
// // //       />

// // //       {/* Inventory Section */}
// // //       <Text style={styles.sectionHeader}>Inventory Details</Text>
// // //       <TextInput
// // //         style={styles.input}
// // //         placeholder="Item Name"
// // //         placeholderTextColor="#888"
// // //         value={itemName}
// // //         onChangeText={setItemName}
// // //       />
// // //       <View style={styles.row}>
// // //         <TextInput
// // //           style={[styles.input, styles.halfInput]}
// // //           placeholder="Quantity"
// // //           placeholderTextColor="#888"
// // //           keyboardType="numeric"
// // //           value={quantity}
// // //           onChangeText={setQuantity}
// // //         />
// // //         <TextInput
// // //           style={[styles.input, styles.halfInput]}
// // //           placeholder="Unit Price"
// // //           placeholderTextColor="#888"
// // //           keyboardType="numeric"
// // //           value={unitPrice}
// // //           onChangeText={setUnitPrice}
// // //         />
// // //       </View>

// // //       {/* Description */}
// // //       <TextInput
// // //         style={[styles.input, styles.descriptionInput]}
// // //         placeholder="Description"
// // //         placeholderTextColor="#888"
// // //         value={description}
// // //         onChangeText={setDescription}
// // //         multiline
// // //         numberOfLines={3}
// // //       />

// // //       {/* Submit Button */}
// // //       <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
// // //         <Text style={styles.submitText}>Save & Generate Receipt</Text>
// // //       </TouchableOpacity>
// // //     </ScrollView>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     backgroundColor: '#000',
// // //   },
// // //   contentContainer: {
// // //     padding: 16,
// // //   },
// // //   input: {
// // //     backgroundColor: '#333',
// // //     color: '#FFF0DC',
// // //     padding: 16,
// // //     borderRadius: 8,
// // //     marginBottom: 16,
// // //     fontSize: 16,
// // //   },
// // //   typeContainer: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     marginBottom: 16,
// // //   },
// // //   typeButton: {
// // //     flex: 1,
// // //     padding: 16,
// // //     borderRadius: 8,
// // //     backgroundColor: '#222',
// // //     marginHorizontal: 4,
// // //     alignItems: 'center',
// // //   },
// // //   activeType: {
// // //     backgroundColor: '#4CAF50',
// // //   },
// // //   typeText: {
// // //     color: '#FFF0DC',
// // //     fontWeight: 'bold',
// // //   },
// // //   submitButton: {
// // //     backgroundColor: '#543A14',
// // //     padding: 16,
// // //     borderRadius: 8,
// // //     alignItems: 'center',
// // //     marginTop: 20,
// // //   },
// // //   submitText: {
// // //     color: '#FFF0DC',
// // //     fontWeight: 'bold',
// // //     fontSize: 16,
// // //   },
// // //   row: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //   },
// // //   halfInput: {
// // //     width: '48%',
// // //   },
// // //   dropdown: {
// // //     backgroundColor: '#333',
// // //     borderColor: '#444',
// // //     marginBottom: 16,
// // //   },
// // //   dropdownText: {
// // //     color: '#FFF0DC',
// // //   },
// // //   dropdownContainer: {
// // //     backgroundColor: '#333',
// // //     borderColor: '#444',
// // //   },
// // //   sectionHeader: {
// // //     color: '#FFF0DC',
// // //     fontSize: 18,
// // //     fontWeight: 'bold',
// // //     marginVertical: 10,
// // //   },
// // //   dateText: {
// // //     color: '#FFF0DC',
// // //   },
// // //   descriptionInput: {
// // //     height: 100,
// // //     textAlignVertical: 'top',
// // //   },
// // // });

// // // export default AddLogEntry;

// // import React, { useState } from 'react';
// // import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
// // import { supabase } from '../lib/supabase';
// // import DropDownPicker from 'react-native-dropdown-picker';
// // import DateTimePicker from '@react-native-community/datetimepicker';
// // import Icon from 'react-native-vector-icons/MaterialIcons';

// // const AddLogEntry = ({ navigation, users, session }) => {
// //   const [amount, setAmount] = useState('');
// //   const [type, setType] = useState('income');
// //   const [category, setCategory] = useState('');
// //   const [description, setDescription] = useState('');
// //   const [date, setDate] = useState(new Date());
// //   const [showDatePicker, setShowDatePicker] = useState(false);
// //   const [customerName, setCustomerName] = useState('');
// //   const [billingMethod, setBillingMethod] = useState('receivable');
// //   const [paymentMethod, setPaymentMethod] = useState('cash');
  
// //   // Inventory items state (multiple entries)
// //   // const [inventoryItems, setInventoryItems] = useState([
// //   //   { id: 1, itemName: '', quantity: '', unitPrice: '' }
// //   // ]);
  
// //    const [inventoryItems, setInventoryItems] = useState([
// //     { id: Date.now(), itemName: '', quantity: '', unitPrice: '' }
// //   ]);
  

// //   // Dropdown states
// //   const [openPaymentMethod, setOpenPaymentMethod] = useState(false);
// //   const [paymentItems, setPaymentItems] = useState([
// //     { label: 'cash', value: 'cash' },
// //     { label: 'bank transfer', value: 'bank transfer' },
// //     { label: 'other', value: 'other' },
// //   ]);

// //   const validateForm = () => {
// //     if (!amount || isNaN(amount)) {
// //       Alert.alert('Error', 'Please enter a valid amount');
// //       return false;
// //     }
    
// //     // Validate inventory items
// //     for (const item of inventoryItems) {
// //       if (item.itemName && (!item.quantity || !item.unitPrice)) {
// //         Alert.alert('Error', 'Please fill all inventory fields');
// //         return false;
// //       }
// //     }
    
// //     return true;
// //   };

// //    // Add new inventory item with unique ID
// //   const addInventoryItem = () => {
// //     setInventoryItems([
// //       ...inventoryItems,
// //       { id: Date.now(), itemName: '', quantity: '', unitPrice: '' }
// //     ]);
// //   };

// //   // Remove inventory item
// //   const removeInventoryItem = (id) => {
// //     if (inventoryItems.length > 1) {
// //       setInventoryItems(inventoryItems.filter(item => item.id !== id));
// //     }
// //   };

// //   // Update specific inventory item
// //   const updateInventoryItem = (id, field, value) => {
// //     setInventoryItems(
// //       inventoryItems.map(item => 
// //         item.id === id ? { ...item, [field]: value } : item
// //       )
// //     );
// //   };
  
// //   // // Add new inventory item
// //   // const addInventoryItem = () => {
// //   //   setInventoryItems([
// //   //     ...inventoryItems,
// //   //     { id: inventoryItems.length + 1, itemName: '', quantity: '', unitPrice: '' }
// //   //   ]);
// //   // };

// //   // // Remove inventory item
// //   // const removeInventoryItem = (id) => {
// //   //   if (inventoryItems.length > 1) {
// //   //     setInventoryItems(inventoryItems.filter(item => item.id !== id));
// //   //   }
// //   // };

// //   // // Update inventory item
// //   // const updateInventoryItem = (id, field, value) => {
// //   //   setInventoryItems(
// //   //     inventoryItems.map(item => 
// //   //       item.id === id ? { ...item, [field]: value } : item
// //   //     )
// //   //   );
// //   // };

// //   const handleSubmit = async () => {
// //     if (!validateForm()) return;

// //     try {
// //       const { data: { user } } = await supabase.auth.getUser();
// //       if (!user) throw new Error('User not authenticated');

// //       // Filter out empty inventory items
// //       const validItems = inventoryItems.filter(
// //         item => item.itemName && item.quantity && item.unitPrice
// //       );

// //       // Create log entry
// //       const { data: logData, error: logError } = await supabase
// //         .from('business_logs')
// //         .insert({
// //           user_id: user.id,
// //           amount: parseFloat(amount),
// //           type,
// //           category,
// //           description,
// //           log_date: date.toISOString()
// //         })
// //         .select()
// //         .single();

// //       if (logError) throw logError;

// //       // Handle customer/supplier
// //       if (customerName) {
// //         const table = type === 'income' ? 'customers' : 'suppliers';
// //         const { data: entityData, error: entityError } = await supabase
// //           .from(table)
// //           .upsert(
// //             { 
// //               user_id: user.id,
// //               name: customerName,
// //               total_due: parseFloat(amount)
// //             },
// //             { onConflict: 'user_id,name', returning: 'representation' }
// //           )
// //           .select()
// //           .single();

// //         if (entityError) throw entityError;

// //         // Handle transaction (receivable/payable)
// //         const transactionTable = type === 'income' ? 'receivables' : 'payables';
// //         const { error: transactionError } = await supabase
// //           .from(transactionTable)
// //           .insert({
// //             user_id: user.id,
// //             [type === 'income' ? 'customer_id' : 'supplier_id']: entityData.id,
// //             amount: parseFloat(amount),
// //             description,
// //             due_date: date.toISOString(),
// //             status: 'pending'
// //           });

// //         if (transactionError) throw transactionError;
// //       }

// //       // Handle payment
// //       const { error: paymentError } = await supabase
// //         .from('payments')
// //         .insert({
// //           user_id: user.id,
// //           type: billingMethod,
// //           reference_id: logData.id,
// //           amount: parseFloat(amount),
// //           method: paymentMethod.toLowerCase(),
// //           payment_date: date.toISOString()
// //         });

// //       if (paymentError) throw paymentError;
    
// //       // Handle inventory items
// //       if (validItems.length > 0) {
// //         for (const item of validItems) {
// //           const { error: inventoryError } = await supabase
// //             .from('inventory')
// //             .upsert(
// //               {
// //                 user_id: user.id,
// //                 item_name: item.itemName,
// //                 quantity: parseInt(item.quantity),
// //                 price: parseFloat(item.unitPrice),
// //                 updated_at: new Date().toISOString()
// //               },
// //               { 
// //                 onConflict: 'user_id,item_name',
// //                 returning: 'minimal'
// //               }
// //             );
      
// //           if (inventoryError) throw inventoryError;
// //         }
// //       }

// //       // Create receipt
// //       const receiptItems = validItems.map(item => ({
// //         itemName: item.itemName,
// //         quantity: parseInt(item.quantity),
// //         unitPrice: parseFloat(item.unitPrice)
// //       }));

// //       const { data: receiptResponse, error: receiptError } = await supabase
// //         .from('receipts')
// //         .insert({
// //           user_id: user.id,
// //           customer_name: customerName,
// //           items: receiptItems,
// //           total_amount: parseFloat(amount),
// //           payment_method: paymentMethod.toLowerCase(),
// //           transaction_date: date.toISOString()
// //         })
// //         .select('id')
// //         .single();  

// //       if (receiptError) throw receiptError;
  
// //       // Navigate to receipt screen for both income and expense
// //       navigation.navigate('ReceiptScreen', {
// //         users,
// //         session,
// //         customerName,
// //         items: receiptItems,
// //         amount: parseFloat(amount).toFixed(2),
// //         date: date.toISOString(),
// //         paymentMethod,
// //         type,
// //         receiptId: receiptResponse.id,
// //       });

// //     } catch (error) {
// //       Alert.alert('Error', error.message);
// //     }
// //   };

// //   return (
// //     <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
// //       {/* Amount Input */}
// //       <TextInput
// //         style={styles.input}
// //         placeholder="Amount*"
// //         placeholderTextColor="#888"
// //         keyboardType="numeric"
// //         value={amount}
// //         onChangeText={setAmount}
// //       />

// //       {/* Transaction Type */}
// //       <View style={styles.typeContainer}>
// //         <TouchableOpacity
// //           style={[styles.typeButton, type === 'income' && styles.activeType]}
// //           onPress={() => setType('income')}
// //         >
// //           <Text style={styles.typeText}>Income</Text>
// //         </TouchableOpacity>
// //         <TouchableOpacity
// //           style={[styles.typeButton, type === 'expense' && styles.activeType]}
// //           onPress={() => setType('expense')}
// //         >
// //           <Text style={styles.typeText}>Expense</Text>
// //         </TouchableOpacity>
// //       </View>

// //       {/* Date Picker */}
// //       <TouchableOpacity
// //         style={styles.input}
// //         onPress={() => setShowDatePicker(true)}
// //       >
// //         <Text style={styles.dateText}>
// //           {date.toLocaleDateString()}
// //         </Text>
// //       </TouchableOpacity>
// //       {showDatePicker && (
// //         <DateTimePicker
// //           value={date}
// //           mode="date"
// //           display="default"
// //           onChange={(event, selectedDate) => {
// //             setShowDatePicker(false);
// //             selectedDate && setDate(selectedDate);
// //           }}
// //         />
// //       )}

// //       {/* Customer/Supplier Input */}
// //       <TextInput
// //         style={styles.input}
// //         placeholder="Customer/Supplier Name"
// //         placeholderTextColor="#888"
// //         value={customerName}
// //         onChangeText={setCustomerName}
// //       />

// //       {/* Billing Method */}
// //       <View style={styles.typeContainer}>
// //         <TouchableOpacity
// //           style={[styles.typeButton, billingMethod === 'receivable' && styles.activeType]}
// //           onPress={() => setBillingMethod('receivable')}
// //         >
// //           <Text style={styles.typeText}>Receivable</Text>
// //         </TouchableOpacity>
// //         <TouchableOpacity
// //           style={[styles.typeButton, billingMethod === 'payable' && styles.activeType]}
// //           onPress={() => setBillingMethod('payable')}
// //         >
// //           <Text style={styles.typeText}>Payable</Text>
// //         </TouchableOpacity>
// //       </View>

// //       {/* Payment Method Dropdown */}
// //       <DropDownPicker
// //         open={openPaymentMethod}
// //         value={paymentMethod}
// //         items={paymentItems}
// //         setOpen={setOpenPaymentMethod}
// //         setValue={setPaymentMethod}
// //         setItems={setPaymentItems}
// //         placeholder="Select Payment Method"
// //         style={styles.dropdown}
// //         textStyle={styles.dropdownText}
// //         dropDownContainerStyle={styles.dropdownContainer}
// //         zIndex={3000}
// //         zIndexInverse={1000}
// //       />

// //       {/* Inventory Section */}
// //       {/* <View style={styles.sectionHeaderContainer}>
// //         <Text style={styles.sectionHeader}>Inventory Details</Text>
// //         <TouchableOpacity onPress={addInventoryItem} style={styles.addButton}>
// //           <Icon name="add" size={20} color="#D2B48C" />
// //         </TouchableOpacity>
// //       </View>
      
// //       {inventoryItems.map((item) => (
// //         <View key={item.id} style={styles.itemContainer}>
// //           {inventoryItems.length > 1 && (
// //             <TouchableOpacity 
// //               onPress={() => removeInventoryItem(item.id)} 
// //               style={styles.removeButton}
// //             >
// //               <Icon name="close" size={18} color="#F44336" />
// //             </TouchableOpacity>
// //           )}
          
// //           <TextInput
// //             style={styles.input}
// //             placeholder="Item Name"
// //             placeholderTextColor="#888"
// //             value={item.itemName}
// //             onChangeText={(text) => updateInventoryItem(item.id, 'itemName', text)}
// //           />
          
// //           <View style={styles.row}>
// //             <TextInput
// //               style={[styles.input, styles.halfInput]}
// //               placeholder="Quantity"
// //               placeholderTextColor="#888"
// //               keyboardType="numeric"
// //               value={item.quantity}
// //               onChangeText={(text) => updateInventoryItem(item.id, 'quantity', text)}
// //             />
// //             <TextInput
// //               style={[styles.input, styles.halfInput]}
// //               placeholder="Unit Price"
// //               placeholderTextColor="#888"
// //               keyboardType="numeric"
// //               value={item.unitPrice}
// //               onChangeText={(text) => updateInventoryItem(item.id, 'unitPrice', text)}
// //             />
// //           </View>
// //         </View>
// //       ))} */}

      
// //         <View style={styles.sectionHeaderContainer}>
// //         <Text style={styles.sectionHeader}>Inventory Details</Text>
// //         <TouchableOpacity onPress={addInventoryItem} style={styles.addButton}>
// //           <Icon name="add" size={20} color="#D2B48C" />
// //         </TouchableOpacity>
// //       </View>
      
// //       {inventoryItems.map((item) => (
// //         <View key={item.id} style={styles.itemContainer}>
// //           {inventoryItems.length > 1 && (
// //             <TouchableOpacity 
// //               onPress={() => removeInventoryItem(item.id)} 
// //               style={styles.removeButton}
// //             >
// //               <Icon name="close" size={18} color="#F44336" />
// //             </TouchableOpacity>
// //           )}
          
// //           <TextInput
// //             style={styles.input}
// //             placeholder="Item Name"
// //             placeholderTextColor="#888"
// //             value={item.itemName}
// //             onChangeText={(text) => updateInventoryItem(item.id, 'itemName', text)}
// //           />
          
// //           <View style={styles.row}>
// //             <TextInput
// //               style={[styles.input, styles.halfInput]}
// //               placeholder="Quantity"
// //               placeholderTextColor="#888"
// //               keyboardType="numeric"
// //               value={item.quantity}
// //               onChangeText={(text) => updateInventoryItem(item.id, 'quantity', text)}
// //             />
// //             <TextInput
// //               style={[styles.input, styles.halfInput]}
// //               placeholder="Unit Price"
// //               placeholderTextColor="#888"
// //               keyboardType="numeric"
// //               value={item.unitPrice}
// //               onChangeText={(text) => updateInventoryItem(item.id, 'unitPrice', text)}
// //             />
// //           </View>
// //         </View>
// //       ))}

// //       {/* Description */}
// //       <TextInput
// //         style={[styles.input, styles.descriptionInput]}
// //         placeholder="Description"
// //         placeholderTextColor="#888"
// //         value={description}
// //         onChangeText={setDescription}
// //         multiline
// //         numberOfLines={3}
// //       />

// //       {/* Submit Button */}
// //       <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
// //         <Text style={styles.submitText}>Save & Generate Receipt</Text>
// //       </TouchableOpacity>
// //     </ScrollView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#121212',
// //   },
// //   contentContainer: {
// //     padding: 16,
// //     paddingBottom: 30,
// //   },
// //   input: {
// //     backgroundColor: '#1E1E1E',
// //     color: '#EAEAEA',
// //     padding: 16,
// //     borderRadius: 8,
// //     marginBottom: 16,
// //     fontSize: 16,
// //     borderWidth: 1,
// //     borderColor: '#333',
// //   },
// //   typeContainer: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     marginBottom: 16,
// //   },
// //   typeButton: {
// //     flex: 1,
// //     padding: 16,
// //     borderRadius: 8,
// //     backgroundColor: '#1E1E1E',
// //     marginHorizontal: 4,
// //     alignItems: 'center',
// //     borderWidth: 1,
// //     borderColor: '#333',
// //   },
// //   activeType: {
// //     backgroundColor: '#2D2D2D',
// //     borderColor: '#543A14',
// //   },
// //   typeText: {
// //     color: '#EAEAEA',
// //     fontWeight: 'bold',
// //   },
// //   submitButton: {
// //     backgroundColor: '#543A14',
// //     padding: 16,
// //     borderRadius: 8,
// //     alignItems: 'center',
// //     marginTop: 20,
// //   },
// //   submitText: {
// //     color: '#EAEAEA',
// //     fontWeight: 'bold',
// //     fontSize: 16,
// //   },
// //   row: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //   },
// //   halfInput: {
// //     width: '48%',
// //   },
// //   dropdown: {
// //     backgroundColor: '#1E1E1E',
// //     borderColor: '#333',
// //     marginBottom: 16,
// //   },
// //   dropdownText: {
// //     color: '#EAEAEA',
// //   },
// //   dropdownContainer: {
// //     backgroundColor: '#1E1E1E',
// //     borderColor: '#333',
// //   },
// //   sectionHeaderContainer: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginVertical: 10,
// //   },
// //   sectionHeader: {
// //     color: '#EAEAEA',
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //   },
// //   addButton: {
// //     backgroundColor: '#1E1E1E',
// //     padding: 8,
// //     borderRadius: 20,
// //     borderWidth: 1,
// //     borderColor: '#543A14',
// //   },
// //   dateText: {
// //     color: '#EAEAEA',
// //   },
// //   descriptionInput: {
// //     height: 100,
// //     textAlignVertical: 'top',
// //   },
// //   itemContainer: {
// //     marginBottom: 16,
// //     position: 'relative',
// //   },
// //   removeButton: {
// //     position: 'absolute',
// //     top: 10,
// //     right: 10,
// //     zIndex: 10,
// //     backgroundColor: '#1E1E1E',
// //     borderRadius: 15,
// //     width: 30,
// //     height: 30,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// // });

// // export default AddLogEntry;

//RECENT MOST SEXI
 
// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
// import { supabase } from '../lib/supabase';
// import DropDownPicker from 'react-native-dropdown-picker';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const AddLogEntry = ({ navigation, users, session }) => {
//   const [type, setType] = useState('income');
//   const [category, setCategory] = useState('');
//   const [description, setDescription] = useState('');
//   const [date, setDate] = useState(new Date());
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [customerName, setCustomerName] = useState('');
//   const [billingMethod, setBillingMethod] = useState('receivable');
//   const [paymentMethod, setPaymentMethod] = useState('cash');
//   const [totalAmount, setTotalAmount] = useState(0);
  
//   // Inventory items state
//   const [inventoryItems, setInventoryItems] = useState([
//     { id: Date.now(), itemName: '', quantity: '', unitPrice: '' }
//   ]);
  
//   // Dropdown states
//   const [openPaymentMethod, setOpenPaymentMethod] = useState(false);
//   const [paymentItems, setPaymentItems] = useState([
//     { label: 'Cash', value: 'cash' },
//     { label: 'Bank Transfer', value: 'bank transfer' },
//     { label: 'Credit Card', value: 'credit card' },
//     { label: 'UPI', value: 'upi' },
//     { label: 'Other', value: 'other' },
//   ]);

//   // Calculate total amount whenever inventory items change
//   useEffect(() => {
//     let calculatedTotal = 0;
    
//     for (const item of inventoryItems) {
//       const quantity = parseFloat(item.quantity) || 0;
//       const unitPrice = parseFloat(item.unitPrice) || 0;
      
//       if (!isNaN(quantity) && !isNaN(unitPrice)) {
//         calculatedTotal += quantity * unitPrice;
//       }
//     }
    
//     setTotalAmount(calculatedTotal);
//   }, [inventoryItems]);

//   const validateForm = () => {
//     // Validate inventory items
//     for (const item of inventoryItems) {
//       if (item.itemName && (!item.quantity || !item.unitPrice)) {
//         Alert.alert('Error', 'Please fill all inventory fields');
//         return false;
//       }
//     }
    
//     // Check if total amount is valid
//     if (totalAmount <= 0) {
//       Alert.alert('Error', 'Please add at least one inventory item with valid price and quantity');
//       return false;
//     }
    
//     return true;
//   };

//   // Add new inventory item
//   const addInventoryItem = () => {
//     setInventoryItems([
//       ...inventoryItems,
//       { id: Date.now(), itemName: '', quantity: '', unitPrice: '' }
//     ]);
//   };

//   // Remove inventory item
//   const removeInventoryItem = (id) => {
//     if (inventoryItems.length > 1) {
//       setInventoryItems(inventoryItems.filter(item => item.id !== id));
//     }
//   };

//   // Update inventory item
//   const updateInventoryItem = (id, field, value) => {
//     setInventoryItems(
//       inventoryItems.map(item => 
//         item.id === id ? { ...item, [field]: value } : item
//       )
//     );
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) return;

//     try {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) throw new Error('User not authenticated');

//       // Filter out empty inventory items
//       const validItems = inventoryItems.filter(
//         item => item.itemName && item.quantity && item.unitPrice
//       );

//       // Create log entry
//       const { data: logData, error: logError } = await supabase
//         .from('business_logs')
//         .insert({
//           user_id: user.id,
//           amount: totalAmount,
//           type,
//           category,
//           description,
//           log_date: date.toISOString()
//         })
//         .select()
//         .single();

//       if (logError) throw logError;

//       // Handle customer/supplier
//       if (customerName) {
//         const table = type === 'income' ? 'customers' : 'suppliers';
//         const { data: entityData, error: entityError } = await supabase
//           .from(table)
//           .upsert(
//             { 
//               user_id: user.id,
//               name: customerName,
//               total_due: totalAmount
//             },
//             { onConflict: 'user_id,name', returning: 'representation' }
//           )
//           .select()
//           .single();

//         if (entityError) throw entityError;

//         // Handle transaction (receivable/payable)
//         const transactionTable = type === 'income' ? 'receivables' : 'payables';
//         const { error: transactionError } = await supabase
//           .from(transactionTable)
//           .insert({
//             user_id: user.id,
//             [type === 'income' ? 'customer_id' : 'supplier_id']: entityData.id,
//             amount: totalAmount,
//             description,
//             due_date: date.toISOString(),
//             status: 'pending'
//           });

//         if (transactionError) throw transactionError;
//       }

//       // Handle payment
//       const { error: paymentError } = await supabase
//         .from('payments')
//         .insert({
//           user_id: user.id,
//           type: billingMethod,
//           reference_id: logData.id,
//           amount: totalAmount,
//           method: paymentMethod.toLowerCase(),
//           payment_date: date.toISOString()
//         });

//       if (paymentError) throw paymentError;
    
//       // Handle inventory items
//       if (validItems.length > 0) {
//         for (const item of validItems) {
//           const { error: inventoryError } = await supabase
//             .from('inventory')
//             .upsert(
//               {
//                 user_id: user.id,
//                 item_name: item.itemName,
//                 quantity: parseInt(item.quantity),
//                 price: parseFloat(item.unitPrice),
//                 updated_at: new Date().toISOString()
//               },
//               { 
//                 onConflict: 'user_id,item_name',
//                 returning: 'minimal'
//               }
//             );
      
//           if (inventoryError) throw inventoryError;
//         }
//       }

//       // Create receipt
//       const receiptItems = validItems.map(item => ({
//         itemName: item.itemName,
//         quantity: parseInt(item.quantity),
//         unitPrice: parseFloat(item.unitPrice)
//       }));

//       const { data: receiptResponse, error: receiptError } = await supabase
//         .from('receipts')
//         .insert({
//           user_id: user.id,
//           customer_name: customerName,
//           items: receiptItems,
//           total_amount: totalAmount,
//           payment_method: paymentMethod.toLowerCase(),
//           transaction_date: date.toISOString()
//         })
//         .select('id')
//         .single();  

//       if (receiptError) throw receiptError;
  
//       // Navigate to receipt screen for both income and expense
//       navigation.navigate('ReceiptScreen', {
//         users,
//         session,
//         customerName,
//         items: receiptItems,
//         amount: totalAmount.toFixed(1),
//         date: date.toISOString(),
//         paymentMethod,
//         type,
//         receiptId: receiptResponse.id,
//       });

//     } catch (error) {
//       Alert.alert('Error', error.message);
//     }
//   };

//   return (
//     <KeyboardAvoidingView 
//       style={styles.container} 
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       <ScrollView 
//         contentContainerStyle={styles.contentContainer}
//         nestedScrollEnabled={true}
//         showsVerticalScrollIndicator={false}
//         keyboardShouldPersistTaps="handled"
//       >
//         {/* Transaction Type */}
//         <View style={styles.typeContainer}>
//           <TouchableOpacity
//             style={[styles.typeButton, type === 'income' && styles.activeType]}
//             onPress={() => setType('income')}
//           >
//             <Text style={styles.typeText}>Income</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.typeButton, type === 'expense' && styles.activeType]}
//             onPress={() => setType('expense')}
//           >
//             <Text style={styles.typeText}>Expense</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Date Picker */}
//         <TouchableOpacity
//           style={styles.input}
//           onPress={() => setShowDatePicker(true)}
//         >
//           <View style={styles.dateInputContainer}>
//             <Icon name="event" size={20} color="#D2B48C" style={styles.dateIcon} />
//             <Text style={styles.dateText}>
//               {date.toLocaleDateString('en-GB', {
//                 day: '2-digit',
//                 month: 'short',
//                 year: 'numeric'
//               })}
//             </Text>
//           </View>
//         </TouchableOpacity>
//         {showDatePicker && (
//           <DateTimePicker
//             value={date}
//             mode="date"
//             display="default"
//             onChange={(event, selectedDate) => {
//               setShowDatePicker(false);
//               selectedDate && setDate(selectedDate);
//             }}
//           />
//         )}

//         {/* Customer/Supplier Input */}
//         <TextInput
//           style={styles.input}
//           placeholder="Customer/Supplier Name"
//           placeholderTextColor="#888"
//           value={customerName}
//           onChangeText={setCustomerName}
//         />

//         {/* Billing Method */}
//         <View style={styles.typeContainer}>
//           <TouchableOpacity
//             style={[styles.typeButton, billingMethod === 'receivable' && styles.activeType]}
//             onPress={() => setBillingMethod('receivable')}
//           >
//             <Text style={styles.typeText}>Receivable</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.typeButton, billingMethod === 'payable' && styles.activeType]}
//             onPress={() => setBillingMethod('payable')}
//           >
//             <Text style={styles.typeText}>Payable</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Payment Method Dropdown */}
//         <DropDownPicker
//           open={openPaymentMethod}
//           value={paymentMethod}
//           items={paymentItems}
//           setOpen={setOpenPaymentMethod}
//           setValue={setPaymentMethod}
//           setItems={setPaymentItems}
//           placeholder="Select Payment Method"
//           style={styles.dropdown}
//           textStyle={styles.dropdownText}
//           dropDownContainerStyle={styles.dropdownContainer}
//           zIndex={3000}
//           zIndexInverse={1000}
//           listMode="SCROLLVIEW"
//           scrollViewProps={{
//             nestedScrollEnabled: true,
//           }}
//           ArrowDownIconComponent={() => <Icon name="arrow-drop-down" size={20} color="#D2B48C" />}
//           ArrowUpIconComponent={() => <Icon name="arrow-drop-up" size={20} color="#D2B48C" />}
//         />

//         {/* Inventory Section */}
//         <View style={styles.sectionHeaderContainer}>
//           <Text style={styles.sectionHeader}>Inventory Details</Text>
//           <TouchableOpacity onPress={addInventoryItem} style={styles.addButton}>
//             <Icon name="add" size={20} color="#D2B48C" />
//           </TouchableOpacity>
//         </View>
        
//         {inventoryItems.map((item) => (
//           <View key={item.id} style={styles.itemContainer}>
//             {inventoryItems.length > 1 && (
//               <TouchableOpacity 
//                 onPress={() => removeInventoryItem(item.id)} 
//                 style={styles.removeButton}
//               >
//                 <Icon name="close" size={18} color="#F44336" />
//               </TouchableOpacity>
//             )}
            
//             <TextInput
//               style={styles.input}
//               placeholder="Item Name"
//               placeholderTextColor="#888"
//               value={item.itemName}
//               onChangeText={(text) => updateInventoryItem(item.id, 'itemName', text)}
//             />
            
//             <View style={styles.row}>
//               <TextInput
//                 style={[styles.input, styles.halfInput]}
//                 placeholder="Quantity"
//                 placeholderTextColor="#888"
//                 keyboardType="numeric"
//                 value={item.quantity}
//                 onChangeText={(text) => updateInventoryItem(item.id, 'quantity', text)}
//               />
//               <TextInput
//                 style={[styles.input, styles.halfInput]}
//                 placeholder="Unit Price"
//                 placeholderTextColor="#888"
//                 keyboardType="numeric"
//                 value={item.unitPrice}
//                 onChangeText={(text) => updateInventoryItem(item.id, 'unitPrice', text)}
//               />
//             </View>
            
//             {/* Item Total */}
//             {item.quantity && item.unitPrice && (
//               <Text style={styles.itemTotal}>
//                 Item Total: Rs{(parseFloat(item.quantity || 0) * parseFloat(item.unitPrice || 0)).toFixed(2)}
//               </Text>
//             )}
//           </View>
//         ))}

//         {/* Description */}
//         <TextInput
//           style={[styles.input, styles.descriptionInput]}
//           placeholder="Description"
//           placeholderTextColor="#888"
//           value={description}
//           onChangeText={setDescription}
//           multiline
//           numberOfLines={3}
//         />

//         {/* Total Amount Display */}
//         <View style={styles.totalDisplay}>
//           <Text style={styles.totalLabel}>TOTAL AMOUNT:</Text>
//           <Text style={styles.totalValue}>Rs{totalAmount.toFixed(2)}</Text>
//         </View>

//         {/* Submit Button */}
//         <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
//           <Text style={styles.submitText}>Save & Generate Receipt</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
//   contentContainer: {
//     padding: 16,
//     paddingBottom: 30,
//   },
//   input: {
//     backgroundColor: '#1E1E1E',
//     color: '#FFF0DC',
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 16,
//     fontSize: 16,
//     borderWidth: 1,
//     borderColor: '#333',
//   },
//   typeContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 16,
//   },
//   typeButton: {
//     flex: 1,
//     padding: 16,
//     borderRadius: 8,
//     backgroundColor: '#1E1E1E',
//     marginHorizontal: 4,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#333',
//   },
//   activeType: {
//     backgroundColor: '#543A14',
//     borderColor:  '#FFF0DC',
//     color : '#2D2D2D',
//   },
//   typeText: {
//     color: '#FFF0DC',
//     fontWeight: 'bold',
//   },
//   submitButton: {
//     backgroundColor: '#543A14',
//     padding: 16,
//     borderRadius: 24,
//     alignItems: 'center',
//     marginTop: 20,
//     borderWidth : 1,
//     borderColor : '#FFF0DC'
//   },
//   submitText: {
//     color: '#FFF0DC',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   halfInput: {
//     width: '48%',
//   },
//   dropdown: {
//     backgroundColor: '#1E1E1E',
//     borderColor: '#333',
//     marginBottom: 16,
//   },
//   dropdownText: {
//     color: '#FFF0DC',
//   },
//   dropdownContainer: {
//     backgroundColor: '#1E1E1E',
//     borderColor: '#333',
//   },
//   sectionHeaderContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginVertical: 10,
//   },
//   sectionHeader: {
//     color: '#FFF0DC',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   addButton: {
//     backgroundColor: '#1E1E1E',
//     padding: 8,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: '#543A14',
//   },
//   dateInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   dateIcon: {
//     marginRight: 10,
//   },
//   dateText: {
//     color: '#FFF0DC',
//   },
//   descriptionInput: {
//     height: 100,
//     textAlignVertical: 'top',
//   },
//   itemContainer: {
//     marginBottom: 16,
//     position: 'relative',
//   },
//   removeButton: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//     zIndex: 10,
//     backgroundColor: '#1E1E1E',
//     borderRadius: 15,
//     width: 30,
//     height: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   itemTotal: {
//     color: '#4CAF50',
//     textAlign: 'right',
//     marginTop: -10,
//     marginBottom: 10,
//     fontSize: 14,
//   },
//   totalDisplay: {
//     backgroundColor: '#1E1E1E',
//     padding: 16,
//     borderRadius: 8,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#543A14',
//   },
//   totalLabel: {
//     color: '#FFF0DC',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   totalValue: {
//     color: '#4CAF50',
//     fontWeight: 'bold',
//     fontSize: 18,
//   },
// });

// export default AddLogEntry;

// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
// import { supabase } from '../lib/supabase';
// import DropDownPicker from 'react-native-dropdown-picker';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const AddLogEntry = ({ navigation, users, session }) => {
//   const [type, setType] = useState('income');
//   const [category, setCategory] = useState('');
//   const [description, setDescription] = useState('');
//   const [date, setDate] = useState(new Date());
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [customerName, setCustomerName] = useState('');
//   const [billingMethod, setBillingMethod] = useState('receivable');
//   const [paymentMethod, setPaymentMethod] = useState('cash');
//   const [totalAmount, setTotalAmount] = useState(0);
  
//   // Inventory items state
//   const [inventoryItems, setInventoryItems] = useState([
//     { id: Date.now(), itemName: '', quantity: '', unitPrice: '' }
//   ]);
  
//   // Dropdown states
//   const [openPaymentMethod, setOpenPaymentMethod] = useState(false);
//   const [paymentItems, setPaymentItems] = useState([
//     { label: 'Cash', value: 'cash' },
//     { label: 'Bank Transfer', value: 'bank transfer' },
//     { label: 'Credit Card', value: 'credit card' },
//     { label: 'UPI', value: 'upi' },
//     { label: 'Other', value: 'other' },
//   ]);

//   // Calculate total amount whenever inventory items change
//   useEffect(() => {
//     let calculatedTotal = 0;
    
//     for (const item of inventoryItems) {
//       const quantity = parseFloat(item.quantity) || 0;
//       const unitPrice = parseFloat(item.unitPrice) || 0;
      
//       if (!isNaN(quantity) && !isNaN(unitPrice)) {
//         calculatedTotal += quantity * unitPrice;
//       }
//     }
    
//     setTotalAmount(calculatedTotal);
//   }, [inventoryItems]);

//   const validateForm = () => {
//     // Validate inventory items
//     for (const item of inventoryItems) {
//       if (item.itemName && (!item.quantity || !item.unitPrice)) {
//         Alert.alert('Error', 'Please fill all inventory fields');
//         return false;
//       }
//     }
    
//     // Check if total amount is valid
//     if (totalAmount <= 0) {
//       Alert.alert('Error', 'Please add at least one inventory item with valid price and quantity');
//       return false;
//     }
    
//     return true;
//   };

//   // Add new inventory item
//   const addInventoryItem = () => {
//     setInventoryItems([
//       ...inventoryItems,
//       { id: Date.now(), itemName: '', quantity: '', unitPrice: '' }
//     ]);
//   };

//   // Remove inventory item
//   const removeInventoryItem = (id) => {
//     if (inventoryItems.length > 1) {
//       setInventoryItems(inventoryItems.filter(item => item.id !== id));
//     }
//   };

//   // Update inventory item
//   const updateInventoryItem = (id, field, value) => {
//     setInventoryItems(
//       inventoryItems.map(item => 
//         item.id === id ? { ...item, [field]: value } : item
//       )
//     );
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) return;

//     // Additional validation for RLS compliance
//     if (type === 'expense' && !customerName) {
//       Alert.alert('Error', 'Supplier name is required for expenses');
//       return;
//     }

//     try {
//       const { data: { user }, error: userError } = await supabase.auth.getUser();
//       if (userError || !user) {
//         throw new Error('User not authenticated');
//       }

//       // Filter out empty inventory items
//       const validItems = inventoryItems.filter(
//         item => item.itemName && item.quantity && item.unitPrice
//       );

//       // Create log entry
//       const { data: logData, error: logError } = await supabase
//         .from('business_logs')
//         .insert({
//           user_id: user.id,
//           amount: totalAmount,
//           type,
//           category,
//           description,
//           log_date: date.toISOString()
//         })
//         .select()
//         .single();

//       if (logError) {
//         console.error('Log error:', logError);
//         throw new Error('Failed to save transaction: ' + logError.message);
//       }

//       // Handle customer/supplier
//       if (customerName) {
//         const table = type === 'income' ? 'customers' : 'suppliers';
        
//         try {
//           const { data: entityData, error: entityError } = await supabase
//             .from(table)
//             .upsert(
//               { 
//                 user_id: user.id,
//                 name: customerName,
//                 total_due: totalAmount
//               },
//               { 
//                 onConflict: 'user_id,name',
//                 returning: 'representation' 
//               }
//             )
//             .select()
//             .single();

//           if (entityError) {
//             if (entityError.code === '42501') {
//               Alert.alert(
//                 'Permission Error', 
//                 'You dont have permission to modify suppliers. Contact support.'
//               );
//             } else {
//               throw entityError;
//             }
//             return;
//           }

//           // Handle transaction (receivable/payable)
//           const transactionTable = type === 'income' ? 'receivables' : 'payables';
//           const { error: transactionError } = await supabase
//             .from(transactionTable)
//             .insert({
//               user_id: user.id,
//               [type === 'income' ? 'customer_id' : 'supplier_id']: entityData.id,
//               amount: totalAmount,
//               description,
//               due_date: date.toISOString(),
//               status: 'pending'
//             });

//           if (transactionError) {
//             console.error('Transaction error:', transactionError);
//             throw new Error('Failed to create transaction: ' + transactionError.message);
//           }
//         } catch (entityErr) {
//           console.error('Entity error:', entityErr);
//           Alert.alert(
//             'Database Error', 
//             `Failed to save ${type === 'income' ? 'customer' : 'supplier'} data`
//           );
//           return;
//         }
//       }

//       // Handle payment
//       const { error: paymentError } = await supabase
//         .from('payments')
//         .insert({
//           user_id: user.id,
//           type: billingMethod,
//           reference_id: logData.id,
//           amount: totalAmount,
//           method: paymentMethod.toLowerCase(),
//           payment_date: date.toISOString()
//         });

//       if (paymentError) {
//         console.error('Payment error:', paymentError);
//         throw new Error('Failed to save payment: ' + paymentError.message);
//       }
    
//       // Handle inventory items
//       if (validItems.length > 0) {
//         for (const item of validItems) {
//           const { error: inventoryError } = await supabase
//             .from('inventory')
//             .upsert(
//               {
//                 user_id: user.id,
//                 item_name: item.itemName,
//                 quantity: parseInt(item.quantity),
//                 price: parseFloat(item.unitPrice),
//                 updated_at: new Date().toISOString()
//               },
//               { 
//                 onConflict: 'user_id,item_name',
//                 returning: 'minimal'
//               }
//             );
      
//           if (inventoryError) {
//             console.error('Inventory error:', inventoryError);
//             throw new Error('Failed to update inventory: ' + inventoryError.message);
//           }
//         }
//       }

//       // Create receipt
//       const receiptItems = validItems.map(item => ({
//         itemName: item.itemName,
//         quantity: parseInt(item.quantity),
//         unitPrice: parseFloat(item.unitPrice)
//       }));

//       const { data: receiptResponse, error: receiptError } = await supabase
//         .from('receipts')
//         .insert({
//           user_id: user.id,
//           customer_name: customerName,
//           items: receiptItems,
//           total_amount: totalAmount,
//           payment_method: paymentMethod.toLowerCase(),
//           transaction_date: date.toISOString()
//         })
//         .select('id')
//         .single();  

//       if (receiptError) {
//         console.error('Receipt error:', receiptError);
//         throw new Error('Failed to generate receipt: ' + receiptError.message);
//       }
  
//       // Navigate to receipt screen for both income and expense
//       navigation.navigate('ReceiptScreen', {
//         users,
//         session,
//         customerName,
//         items: receiptItems,
//         amount: totalAmount.toFixed(2),
//         date: date.toISOString(),
//         paymentMethod,
//         type,
//         receiptId: receiptResponse.id,
//       });

//     } catch (error) {
//       console.error('Full error:', error);
//       Alert.alert(
//         'Operation Failed', 
//         error.message || 'An unexpected error occurred'
//       );
//     }
//   };

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
//       {/* Transaction Type */}
//       <View style={styles.typeContainer}>
//         <TouchableOpacity
//           style={[styles.typeButton, type === 'income' && styles.activeType]}
//           onPress={() => setType('income')}
//         >
//           <Text style={styles.typeText}>Income</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.typeButton, type === 'expense' && styles.activeType]}
//           onPress={() => setType('expense')}
//         >
//           <Text style={styles.typeText}>Expense</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Date Picker */}
//       <TouchableOpacity
//         style={styles.input}
//         onPress={() => setShowDatePicker(true)}
//       >
//         <View style={styles.dateInputContainer}>
//           <Icon name="event" size={20} color="#D2B48C" style={styles.dateIcon} />
//           <Text style={styles.dateText}>
//             {date.toLocaleDateString('en-GB', {
//               day: '2-digit',
//               month: 'short',
//               year: 'numeric'
//             })}
//           </Text>
//         </View>
//       </TouchableOpacity>
//       {showDatePicker && (
//         <DateTimePicker
//           value={date}
//           mode="date"
//           display="default"
//           onChange={(event, selectedDate) => {
//             setShowDatePicker(false);
//             selectedDate && setDate(selectedDate);
//           }}
//         />
//       )}

//       {/* Customer/Supplier Input */}
//       <TextInput
//         style={styles.input}
//         placeholder={type === 'income' ? 'Customer Name' : 'Supplier Name (Required)'}
//         placeholderTextColor="#888"
//         value={customerName}
//         onChangeText={setCustomerName}
//       />

//       {/* Billing Method */}
//       <View style={styles.typeContainer}>
//         <TouchableOpacity
//           style={[styles.typeButton, billingMethod === 'receivable' && styles.activeType]}
//           onPress={() => setBillingMethod('receivable')}
//         >
//           <Text style={styles.typeText}>Receivable</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.typeButton, billingMethod === 'payable' && styles.activeType]}
//           onPress={() => setBillingMethod('payable')}
//         >
//           <Text style={styles.typeText}>Payable</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Payment Method Dropdown */}
//       <DropDownPicker
//         open={openPaymentMethod}
//         value={paymentMethod}
//         items={paymentItems}
//         setOpen={setOpenPaymentMethod}
//         setValue={setPaymentMethod}
//         setItems={setPaymentItems}
//         placeholder="Select Payment Method"
//         style={styles.dropdown}
//         textStyle={styles.dropdownText}
//         dropDownContainerStyle={styles.dropdownContainer}
//         zIndex={3000}
//         zIndexInverse={1000}
//         ArrowDownIconComponent={() => <Icon name="arrow-drop-down" size={20} color="#D2B48C" />}
//         ArrowUpIconComponent={() => <Icon name="arrow-drop-up" size={20} color="#D2B48C" />}
//       />

//       {/* Inventory Section */}
//       <View style={styles.sectionHeaderContainer}>
//         <Text style={styles.sectionHeader}>Inventory Details</Text>
//         <TouchableOpacity onPress={addInventoryItem} style={styles.addButton}>
//           <Icon name="add" size={20} color="#D2B48C" />
//         </TouchableOpacity>
//       </View>
      
//       {inventoryItems.map((item) => (
//         <View key={item.id} style={styles.itemContainer}>
//           {inventoryItems.length > 1 && (
//             <TouchableOpacity 
//               onPress={() => removeInventoryItem(item.id)} 
//               style={styles.removeButton}
//             >
//               <Icon name="close" size={18} color="#F44336" />
//             </TouchableOpacity>
//           )}
          
//           <TextInput
//             style={styles.input}
//             placeholder="Item Name"
//             placeholderTextColor="#888"
//             value={item.itemName}
//             onChangeText={(text) => updateInventoryItem(item.id, 'itemName', text)}
//           />
          
//           <View style={styles.row}>
//             <TextInput
//               style={[styles.input, styles.halfInput]}
//               placeholder="Quantity"
//               placeholderTextColor="#888"
//               keyboardType="numeric"
//               value={item.quantity}
//               onChangeText={(text) => updateInventoryItem(item.id, 'quantity', text)}
//             />
//             <TextInput
//               style={[styles.input, styles.halfInput]}
//               placeholder="Unit Price"
//               placeholderTextColor="#888"
//               keyboardType="numeric"
//               value={item.unitPrice}
//               onChangeText={(text) => updateInventoryItem(item.id, 'unitPrice', text)}
//             />
//           </View>
          
//           {/* Item Total */}
//           {item.quantity && item.unitPrice && (
//             <Text style={styles.itemTotal}>
//               Item Total: Rs{(parseFloat(item.quantity || 0) * parseFloat(item.unitPrice || 0)).toFixed(2)}
//             </Text>
//           )}
//         </View>
//       ))}

//       {/* Total Amount Display */}
//       <View style={styles.totalDisplay}>
//         <Text style={styles.totalLabel}>TOTAL AMOUNT:</Text>
//         <Text style={styles.totalValue}>Rs{totalAmount.toFixed(2)}</Text>
//       </View>

//       {/* Description */}
//       <TextInput
//         style={[styles.input, styles.descriptionInput]}
//         placeholder="Description"
//         placeholderTextColor="#888"
//         value={description}
//         onChangeText={setDescription}
//         multiline
//         numberOfLines={3}
//       />

//       {/* Submit Button */}
//       <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
//         <Text style={styles.submitText}>Save & Generate Receipt</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#121212',
//   },
//   contentContainer: {
//     padding: 16,
//     paddingBottom: 30,
//   },
//   input: {
//     backgroundColor: '#1E1E1E',
//     color: '#FFF0DC',
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 16,
//     fontSize: 16,
//     borderWidth: 1,
//     borderColor: '#333',
//   },
//   typeContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 16,
//   },
//   typeButton: {
//     flex: 1,
//     padding: 16,
//     borderRadius: 8,
//     backgroundColor: '#1E1E1E',
//     marginHorizontal: 4,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#333',
//   },
//   activeType: {
//     backgroundColor: '#543A14',
//     borderColor:  '#FFF0DC',
//     color : '#2D2D2D',
//   },
//   typeText: {
//     color: '#FFF0DC',
//     fontWeight: 'bold',
//   },
//   submitButton: {
//     backgroundColor: '#543A14',
//     padding: 16,
//     borderRadius: 24,
//     alignItems: 'center',
//     marginTop: 20,
//     borderWidth : 1,
//     borderColor : '#FFF0DC'
//   },
//   submitText: {
//     color: '#FFF0DC',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   halfInput: {
//     width: '48%',
//   },
//   dropdown: {
//     backgroundColor: '#1E1E1E',
//     borderColor: '#333',
//     marginBottom: 16,
//   },
//   dropdownText: {
//     color: '#FFF0DC',
//   },
//   dropdownContainer: {
//     backgroundColor: '#1E1E1E',
//     borderColor: '#333',
//   },
//   sectionHeaderContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginVertical: 10,
//   },
//   sectionHeader: {
//     color: '#FFF0DC',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   addButton: {
//     backgroundColor: '#1E1E1E',
//     padding: 8,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: '#543A14',
//   },
//   dateInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   dateIcon: {
//     marginRight: 10,
//   },
//   dateText: {
//     color: '#FFF0DC',
//   },
//   descriptionInput: {
//     height: 100,
//     textAlignVertical: 'top',
//   },
//   itemContainer: {
//     marginBottom: 16,
//     position: 'relative',
//   },
//   removeButton: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//     zIndex: 10,
//     backgroundColor: '#1E1E1E',
//     borderRadius: 15,
//     width: 30,
//     height: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   itemTotal: {
//     color: '#4CAF50',
//     textAlign: 'right',
//     marginTop: -10,
//     marginBottom: 10,
//     fontSize: 14,
//   },
//   totalDisplay: {
//     backgroundColor: '#1E1E1E',
//     padding: 16,
//     borderRadius: 8,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#543A14',
//   },
//   totalLabel: {
//     color: '#FFF0DC',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   totalValue: {
//     color: '#4CAF50',
//     fontWeight: 'bold',
//     fontSize: 18,
//   },
// });

// export default AddLogEntry;




import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { supabase } from '../lib/supabase';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import Icon from '../components/IconWrapper';

const AddLogEntry = ({ navigation, users, session }) => {
  const [type, setType] = useState('income');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [billingMethod, setBillingMethod] = useState('receivable');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [totalAmount, setTotalAmount] = useState(0);
  
  // Inventory items state
  const [inventoryItems, setInventoryItems] = useState([
    { id: Date.now(), itemName: '', quantity: '', unitPrice: '' }
  ]);
  
  // Dropdown states
  const [openPaymentMethod, setOpenPaymentMethod] = useState(false);
  const [paymentItems, setPaymentItems] = useState([
    { label: 'Cash', value: 'cash' },
    { label: 'Bank Transfer', value: 'bank transfer' },
    { label: 'Credit Card', value: 'credit card' },
    { label: 'UPI', value: 'upi' },
    { label: 'Other', value: 'other' },
  ]);

  // Calculate total amount whenever inventory items change
  useEffect(() => {
    let calculatedTotal = 0;
    
    for (const item of inventoryItems) {
      const quantity = parseFloat(item.quantity) || 0;
      const unitPrice = parseFloat(item.unitPrice) || 0;
      
      if (!isNaN(quantity) && !isNaN(unitPrice)) {
        calculatedTotal += quantity * unitPrice;
      }
    }
    
    setTotalAmount(calculatedTotal);
  }, [inventoryItems]);

  const validateForm = () => {
    // Validate inventory items
    for (const item of inventoryItems) {
      if (item.itemName && (!item.quantity || !item.unitPrice)) {
        Alert.alert('Error', 'Please fill all inventory fields');
        return false;
      }
    }
    
    // Check if total amount is valid
    if (totalAmount <= 0) {
      Alert.alert('Error', 'Please add at least one inventory item with valid price and quantity');
      return false;
    }
    
    return true;
  };

  // Add new inventory item
  const addInventoryItem = () => {
    setInventoryItems([
      ...inventoryItems,
      { id: Date.now(), itemName: '', quantity: '', unitPrice: '' }
    ]);
  };

  // Remove inventory item
  const removeInventoryItem = (id) => {
    if (inventoryItems.length > 1) {
      setInventoryItems(inventoryItems.filter(item => item.id !== id));
    }
  };

  // Update inventory item
  const updateInventoryItem = (id, field, value) => {
    setInventoryItems(
      inventoryItems.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Filter out empty inventory items
      const validItems = inventoryItems.filter(
        item => item.itemName && item.quantity && item.unitPrice
      );

      // Create log entry
      const { data: logData, error: logError } = await supabase
        .from('business_logs')
        .insert({
          user_id: user.id,
          amount: totalAmount,
          type,
          category,
          description,
          log_date: date.toISOString()
        })
        .select()
        .single();

      if (logError) throw logError;

      // Handle customer/supplier
      if (customerName) {
        const table = type === 'income' ? 'customers' : 'suppliers';
        const { data: entityData, error: entityError } = await supabase
          .from(table)
          .upsert(
            { 
              user_id: user.id,
              name: customerName,
              total_due: totalAmount
            },
            { onConflict: 'user_id,name', returning: 'representation' }
          )
          .select()
          .single();

        if (entityError) throw entityError;

        // Handle transaction (receivable/payable)
        const transactionTable = type === 'income' ? 'receivables' : 'payables';
        const { error: transactionError } = await supabase
          .from(transactionTable)
          .insert({
            user_id: user.id,
            [type === 'income' ? 'customer_id' : 'supplier_id']: entityData.id,
            amount: totalAmount,
            description,
            due_date: date.toISOString(),
            status: 'pending'
          });

        if (transactionError) throw transactionError;
      }

      // Handle payment
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          type: billingMethod,
          reference_id: logData.id,
          amount: totalAmount,
          method: paymentMethod.toLowerCase(),
          payment_date: date.toISOString()
        });

      if (paymentError) throw paymentError;
    
      // Handle inventory items
      if (validItems.length > 0) {
        for (const item of validItems) {
          const { error: inventoryError } = await supabase
            .from('inventory')
            .upsert(
              {
                user_id: user.id,
                item_name: item.itemName,
                quantity: parseInt(item.quantity),
                price: parseFloat(item.unitPrice),
                updated_at: new Date().toISOString()
              },
              { 
                onConflict: 'user_id,item_name',
                returning: 'minimal'
              }
            );
      
          if (inventoryError) throw inventoryError;
        }
      }

      // Create receipt
      const receiptItems = validItems.map(item => ({
        itemName: item.itemName,
        quantity: parseInt(item.quantity),
        unitPrice: parseFloat(item.unitPrice)
      }));

      const { data: receiptResponse, error: receiptError } = await supabase
        .from('receipts')
        .insert({
          user_id: user.id,
          customer_name: customerName,
          items: receiptItems,
          total_amount: totalAmount,
          payment_method: paymentMethod.toLowerCase(),
          transaction_date: date.toISOString()
        })
        .select('id')
        .single();  

      if (receiptError) throw receiptError;
  
      // Navigate to receipt screen for both income and expense
      navigation.navigate('ReceiptScreen', {
        users,
        session,
        customerName,
        items: receiptItems,
        amount: totalAmount.toFixed(1),
        date: date.toISOString(),
        paymentMethod,
        type,
        receiptId: receiptResponse.id,
      });

    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.contentContainer}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Transaction Type */}
        <View style={styles.typeContainer}>
          <TouchableOpacity
            style={[styles.typeButton, type === 'income' && styles.activeType]}
            onPress={() => setType('income')}
          >
            <Text style={[styles.typeText, type === 'income' && styles.activeTypeText]}>Income</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, type === 'expense' && styles.activeType]}
            onPress={() => setType('expense')}
          >
            <Text style={[styles.typeText, type === 'expense' && styles.activeTypeText]}>Expense</Text>
          </TouchableOpacity>
        </View>

        {/* Date Picker */}
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDatePicker(true)}
        >
          <View style={styles.dateInputContainer}>
            <Icon name="event" size={20} color="#D2B48C" style={styles.dateIcon} />
            <Text style={styles.dateText}>
              {date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}
            </Text>
          </View>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              selectedDate && setDate(selectedDate);
            }}
          />
        )}

        {/* Customer/Supplier Input */}
        <TextInput
          style={styles.input}
          placeholder="Customer/Supplier Name"
          placeholderTextColor="#888"
          value={customerName}
          onChangeText={setCustomerName}
        />

        {/* Billing Method */}
        <View style={styles.typeContainer}>
          <TouchableOpacity
            style={[styles.typeButton, billingMethod === 'receivable' && styles.activeType]}
            onPress={() => setBillingMethod('receivable')}
          >
            <Text style={[styles.typeText, billingMethod === 'receivable' && styles.activeTypeText]}>Receivable</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, billingMethod === 'payable' && styles.activeType]}
            onPress={() => setBillingMethod('payable')}
          >
            <Text style={[styles.typeText, billingMethod === 'payable' && styles.activeTypeText]}>Payable</Text>
          </TouchableOpacity>
        </View>

        {/* Payment Method Dropdown */}
        <DropDownPicker
          open={openPaymentMethod}
          value={paymentMethod}
          items={paymentItems}
          setOpen={setOpenPaymentMethod}
          setValue={setPaymentMethod}
          setItems={setPaymentItems}
          placeholder="Select Payment Method"
          style={styles.dropdown}
          textStyle={styles.dropdownText}
          dropDownContainerStyle={styles.dropdownContainer}
          zIndex={3000}
          zIndexInverse={1000}
          listMode="SCROLLVIEW"
          scrollViewProps={{
            nestedScrollEnabled: true,
          }}
          ArrowDownIconComponent={() => <Icon name="arrow-drop-down" size={20} color="#D2B48C" />}
          ArrowUpIconComponent={() => <Icon name="arrow-drop-up" size={20} color="#D2B48C" />}
        />

        {/* Inventory Section */}
        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionHeader}>Inventory Details</Text>
          <TouchableOpacity onPress={addInventoryItem} style={styles.addButton}>
            <Icon name="add" size={20} color="#D2B48C" />
          </TouchableOpacity>
        </View>
        
        {inventoryItems.map((item) => (
          <View key={item.id} style={styles.itemContainer}>
            {inventoryItems.length > 1 && (
              <TouchableOpacity 
                onPress={() => removeInventoryItem(item.id)} 
                style={styles.removeButton}
              >
                <Icon name="close" size={18} color="#F44336" />
              </TouchableOpacity>
            )}
            
            <TextInput
              style={styles.input}
              placeholder="Item Name"
              placeholderTextColor="#888"
              value={item.itemName}
              onChangeText={(text) => updateInventoryItem(item.id, 'itemName', text)}
            />
            
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Quantity"
                placeholderTextColor="#888"
                keyboardType="numeric"
                value={item.quantity}
                onChangeText={(text) => updateInventoryItem(item.id, 'quantity', text)}
              />
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Unit Price"
                placeholderTextColor="#888"
                keyboardType="numeric"
                value={item.unitPrice}
                onChangeText={(text) => updateInventoryItem(item.id, 'unitPrice', text)}
              />
            </View>
            
            {/* Item Total */}
            {item.quantity && item.unitPrice && (
              <Text style={styles.itemTotal}>
                Item Total: Rs{(parseFloat(item.quantity || 0) * parseFloat(item.unitPrice || 0)).toFixed(2)}
              </Text>
            )}
          </View>
        ))}

        {/* Description */}
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Description"
          placeholderTextColor="#888"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />

        {/* Total Amount Display */}
        <View style={styles.totalDisplay}>
          <Text style={styles.totalLabel}>TOTAL AMOUNT:</Text>
          <Text style={styles.totalValue}>Rs{totalAmount.toFixed(2)}</Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Save & Generate Receipt</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 30,
  },
  input: {
    backgroundColor: '#1E1E1E',
    color: '#FFF0DC',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#1E1E1E',
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  activeType: {
    backgroundColor: '#543A14',
    borderColor: '#FFF0DC',
  },
  typeText: {
    color: '#FFF0DC',
    fontWeight: 'bold',
  },
  activeTypeText: {
    color: '#FFF0DC',
  },
  submitButton: {
    backgroundColor: '#543A14',
    padding: 16,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#FFF0DC'
  },
  submitText: {
    color: '#FFF0DC',
    fontWeight: 'bold',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  dropdown: {
    backgroundColor: '#1E1E1E',
    borderColor: '#333',
    marginBottom: 16,
  },
  dropdownText: {
    color: '#FFF0DC',
  },
  dropdownContainer: {
    backgroundColor: '#1E1E1E',
    borderColor: '#333',
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  sectionHeader: {
    color: '#FFF0DC',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#1E1E1E',
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#543A14',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    marginRight: 10,
  },
  dateText: {
    color: '#FFF0DC',
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  itemContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTotal: {
    color: '#4CAF50',
    textAlign: 'right',
    marginTop: -10,
    marginBottom: 10,
    fontSize: 14,
  },
  totalDisplay: {
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#543A14',
  },
  totalLabel: {
    color: '#FFF0DC',
    fontWeight: 'bold',
    fontSize: 16,
  },
  totalValue: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default AddLogEntry;