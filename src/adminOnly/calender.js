// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import {
//     View,
//     Text,
//     StyleSheet,
//     ScrollView,
//     TouchableOpacity,
//     Modal,
//     RefreshControl,
//     ActivityIndicator,
//     SafeAreaView,
//     Alert,
//     Dimensions,
//     Platform,
//     StatusBar,
//     TextInput,
//     FlatList,
//     ImageBackground,
// } from 'react-native';
// import { Calendar } from 'react-native-calendars';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { useAuth } from '../auth/contexts/AuthContext';
// import { calendarAPI } from '../../config/apis';
// import DateTimePicker from '@react-native-community/datetimepicker';

// const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// // Date Utilities
// const dateUtils = {
//     format: (date, formatStr) => {
//         if (!date) return '';
//         const d = new Date(date);
//         const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//         const fullMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
//         const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//         const fullDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

//         if (formatStr === 'MMM d') {
//             return `${months[d.getMonth()]} ${d.getDate()}`;
//         } else if (formatStr === 'EEE') {
//             return days[d.getDay()];
//         } else if (formatStr === 'MMM d, yyyy') {
//             return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
//         } else if (formatStr === 'MMMM d, yyyy') {
//             return `${fullMonths[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
//         } else if (formatStr === 'EEEE, MMMM d, yyyy') {
//             return `${fullDays[d.getDay()]}, ${fullMonths[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
//         } else if (formatStr === 'yyyy-MM-dd') {
//             const year = d.getFullYear();
//             const month = String(d.getMonth() + 1).padStart(2, '0');
//             const day = String(d.getDate()).padStart(2, '0');
//             return `${year}-${month}-${day}`;
//         } else if (formatStr === 'MMMM yyyy') {
//             return `${fullMonths[d.getMonth()]} ${d.getFullYear()}`;
//         } else if (formatStr === 'MM/yyyy') {
//             const month = String(d.getMonth() + 1).padStart(2, '0');
//             return `${month}/${d.getFullYear()}`;
//         } else if (formatStr === 'dd') {
//             return d.getDate().toString();
//         }
//         return d.toString();
//     },

//     parseISO: (dateString) => {
//         if (!dateString) return new Date();
//         if (dateString.includes('T')) {
//             return new Date(dateString);
//         }
//         return new Date(dateString + 'T00:00:00');
//     },

//     isSameDay: (date1, date2) => {
//         if (!date1 || !date2) return false;
//         const d1 = new Date(date1);
//         const d2 = new Date(date2);
//         return d1.getFullYear() === d2.getFullYear() &&
//             d1.getMonth() === d2.getMonth() &&
//             d1.getDate() === d2.getDate();
//     },

//     startOfMonth: (date) => {
//         const result = new Date(date);
//         result.setDate(1);
//         result.setHours(0, 0, 0, 0);
//         return result;
//     },

//     endOfMonth: (date) => {
//         const result = new Date(date);
//         result.setMonth(result.getMonth() + 1);
//         result.setDate(0);
//         result.setHours(23, 59, 59, 999);
//         return result;
//     },

//     isSameMonth: (date1, date2) => {
//         const d1 = new Date(date1);
//         const d2 = new Date(date2);
//         return d1.getFullYear() === d2.getFullYear() &&
//             d1.getMonth() === d2.getMonth();
//     },

//     startOfDay: (date) => {
//         const result = new Date(date);
//         result.setHours(0, 0, 0, 0);
//         return result;
//     },

//     addDays: (date, days) => {
//         const result = new Date(date);
//         result.setDate(result.getDate() + days);
//         return result;
//     },

//     differenceInDays: (date1, date2) => {
//         const d1 = new Date(date1);
//         const d2 = new Date(date2);
//         const diffTime = Math.abs(d2 - d1);
//         return Math.floor(diffTime / (1000 * 60 * 60 * 24));
//     },
// };

// const calender = ({ navigation }) => {
//     const [currentDate, setCurrentDate] = useState(new Date());
//     const [selectedFacilityType, setSelectedFacilityType] = useState('ROOMS');
//     const [selectedRoomType, setSelectedRoomType] = useState('ALL');
//     const [selectedRoom, setSelectedRoom] = useState(null);
//     const [selectedPeriod, setSelectedPeriod] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [refreshing, setRefreshing] = useState(false);
//     const [error, setError] = useState(null);

//     // New filter states
//     const [searchByMonth, setSearchByMonth] = useState(false);
//     const [selectedMonth, setSelectedMonth] = useState(new Date());
//     const [showMonthPicker, setShowMonthPicker] = useState(false);
//     const [searchByRoomMonth, setSearchByRoomMonth] = useState(false);
//     const [selectedRoomNumber, setSelectedRoomNumber] = useState('');

//     // Data states
//     const [rooms, setRooms] = useState([]);
//     const [halls, setHalls] = useState([]);
//     const [lawns, setLawns] = useState([]);
//     const [photoshoots, setPhotoshoots] = useState([]);

//     // Modal states
//     const [availableModalVisible, setAvailableModalVisible] = useState(false);
//     const [bookedModalVisible, setBookedModalVisible] = useState(false);
//     const [availableRooms, setAvailableRooms] = useState([]);
//     const [bookedRooms, setBookedRooms] = useState([]);

//     // Status filter state
//     const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL'); // ALL, AVAILABLE, MAINTENANCE, RESERVED, BOOKED

//     const { user } = useAuth();

//     // Helper function for status colors
//     const getStatusColor = (status) => {
//         switch (status) {
//             case 'AVAILABLE': return '#10B981'; // Green
//             case 'BOOKED': return '#002f79ff'; // Blue
//             case 'RESERVED': return '#F59E0B'; // Amber
//             case 'MAINTENANCE': return '#EF4444'; // Red
//             default: return '#002f79ff'; // Blue for ALL
//         }
//     };

//     // Helper function to get facility status on a specific date
//     const getFacilityStatusOnDate = useCallback((facility, date) => {
//         const today = dateUtils.startOfDay(date);

//         // Check bookings first
//         if (facility.bookings && Array.isArray(facility.bookings)) {
//             for (const booking of facility.bookings) {
//                 // Skip cancelled bookings
//                 if (booking.paymentStatus === 'CANCELLED' || booking.status === 'CANCELLED') {
//                     continue;
//                 }

//                 try {
//                     const checkIn = booking.checkIn ? dateUtils.parseISO(booking.checkIn) : null;
//                     const checkOut = booking.checkOut ? dateUtils.parseISO(booking.checkOut) : null;

//                     if (checkIn && checkOut) {
//                         const startDate = dateUtils.startOfDay(checkIn);
//                         const endDate = dateUtils.startOfDay(checkOut);

//                         if (today >= startDate && today <= endDate) {
//                             return 'BOOKED';
//                         }
//                     } else if (checkIn) {
//                         const checkInDate = dateUtils.startOfDay(checkIn);
//                         if (dateUtils.isSameDay(today, checkInDate)) {
//                             return 'BOOKED';
//                         }
//                     }
//                 } catch (err) {
//                     console.error('Error checking booking status:', err);
//                 }
//             }
//         }

//         // Check reservations
//         if (facility.reservations && Array.isArray(facility.reservations)) {
//             for (const reservation of facility.reservations) {
//                 try {
//                     const reservedFrom = reservation.reservedFrom ? dateUtils.parseISO(reservation.reservedFrom) : null;
//                     const reservedTo = reservation.reservedTo ? dateUtils.parseISO(reservation.reservedTo) : null;

//                     if (reservedFrom && reservedTo) {
//                         const startDate = dateUtils.startOfDay(reservedFrom);
//                         const endDate = dateUtils.startOfDay(reservedTo);

//                         if (today >= startDate && today <= endDate) {
//                             return 'RESERVED';
//                         }
//                     }
//                 } catch (err) {
//                     console.error('Error checking reservation status:', err);
//                 }
//             }
//         }

//         // Check out of order
//         if (facility.outOfOrders && Array.isArray(facility.outOfOrders)) {
//             for (const outOfOrder of facility.outOfOrders) {
//                 try {
//                     const startDate = outOfOrder.startDate ? dateUtils.parseISO(outOfOrder.startDate) : null;
//                     const endDate = outOfOrder.endDate ? dateUtils.parseISO(outOfOrder.endDate) : null;

//                     if (startDate && endDate) {
//                         const start = dateUtils.startOfDay(startDate);
//                         const end = dateUtils.startOfDay(endDate);

//                         if (today >= start && today <= end) {
//                             return 'MAINTENANCE';
//                         }
//                     }
//                 } catch (err) {
//                     console.error('Error checking outOfOrder status:', err);
//                 }
//             }
//         }

//         return 'AVAILABLE';
//     }, []);

//     // Build API params based on filters
//     const getApiParams = useCallback(() => {
//         const params = {};

//         if (searchByMonth && selectedMonth) {
//             const startOfMonth = dateUtils.startOfMonth(selectedMonth);
//             const endOfMonth = dateUtils.endOfMonth(selectedMonth);
//             params.startDate = dateUtils.format(startOfMonth, 'yyyy-MM-dd');
//             params.endDate = dateUtils.format(endOfMonth, 'yyyy-MM-dd');
//         }

//         if (searchByRoomMonth && selectedRoomNumber) {
//             params.roomNumber = selectedRoomNumber;
//         }

//         return params;
//     }, [searchByMonth, selectedMonth, searchByRoomMonth, selectedRoomNumber]);

//     // Fetch data function
//     const fetchData = useCallback(async () => {
//         if (!user) {
//             setLoading(false);
//             return;
//         }

//         try {
//             setLoading(true);
//             setError(null);

//             const params = getApiParams();

//             console.log('Fetching data with params:', params);

//             // Fetch data based on selected facility type
//             switch (selectedFacilityType) {
//                 case 'ROOMS':
//                     const roomsData = await calendarAPI.getCalendarRooms(params);
//                     console.log('Rooms data fetched:', roomsData?.length || 0, 'rooms');
//                     setRooms(roomsData || []);
//                     break;

//                 case 'HALLS':
//                     const hallsData = await calendarAPI.getHalls(params);
//                     console.log('Halls data fetched:', hallsData?.length || 0, 'halls');
//                     setHalls(hallsData || []);
//                     break;

//                 case 'LAWNS':
//                     const lawnsData = await calendarAPI.getLawns(params);
//                     console.log('Lawns data fetched:', lawnsData?.length || 0, 'lawns');
//                     setLawns(lawnsData || []);
//                     break;

//                 case 'PHOTOSHOOTS':
//                     const photoshootsData = await calendarAPI.getPhotoshoots(params);
//                     console.log('Photoshoots data fetched:', photoshootsData?.length || 0, 'photoshoots');
//                     setPhotoshoots(photoshootsData || []);
//                     break;

//                 default:
//                     break;
//             }

//         } catch (error) {
//             console.error('Error fetching calendar data:', error);
//             setError(error.message || 'Failed to load calendar data');
//         } finally {
//             setLoading(false);
//             setRefreshing(false);
//         }
//     }, [user, selectedFacilityType, getApiParams]);

//     // Initial load
//     useEffect(() => {
//         fetchData();
//     }, [fetchData]);

//     // Refresh function
//     const onRefresh = useCallback(() => {
//         setRefreshing(true);
//         fetchData();
//     }, [fetchData]);

//     // Get current facility data
//     const getCurrentFacilities = () => {
//         switch (selectedFacilityType) {
//             case 'ROOMS':
//                 return rooms;
//             case 'HALLS':
//                 return halls;
//             case 'LAWNS':
//                 return lawns;
//             case 'PHOTOSHOOTS':
//                 return photoshoots;
//             default:
//                 return [];
//         }
//     };

//     // Filter rooms based on selection
//     const filteredRooms = useMemo(() => {
//         return rooms.filter(room => {
//             const typeMatch = selectedRoomType === 'ALL' || room.roomType?.type === selectedRoomType;
//             const roomMatch = !selectedRoom || room.id?.toString() === selectedRoom;
//             return typeMatch && roomMatch;
//         });
//     }, [rooms, selectedRoomType, selectedRoom]);

//     // Get facilities to display
//     const getFacilitiesForDisplay = useMemo(() => {
//         if (selectedFacilityType === 'ROOMS') {
//             return filteredRooms;
//         }
//         return getCurrentFacilities();
//     }, [selectedFacilityType, filteredRooms]);

//     // Function to check if a room is booked for today
//     const isRoomBookedToday = useCallback((room) => {
//         const today = dateUtils.startOfDay(new Date());
//         const todayString = dateUtils.format(today, 'yyyy-MM-dd');

//         console.log(`Checking room ${room.roomNumber || room.roomNo || room.id} for today: ${todayString}`);

//         // Check bookings
//         if (room.bookings && Array.isArray(room.bookings)) {
//             console.log(`Room ${room.roomNumber || room.roomNo} has ${room.bookings.length} bookings`);
//             for (const booking of room.bookings) {
//                 // Skip cancelled bookings
//                 if (booking.paymentStatus === 'CANCELLED' || booking.status === 'CANCELLED') {
//                     console.log(`Skipping cancelled booking for room ${room.roomNumber || room.roomNo}`);
//                     continue;
//                 }

//                 try {
//                     const checkIn = booking.checkIn ? dateUtils.parseISO(booking.checkIn) : null;
//                     const checkOut = booking.checkOut ? dateUtils.parseISO(booking.checkOut) : null;

//                     if (checkIn && checkOut) {
//                         const startDate = dateUtils.startOfDay(checkIn);
//                         const endDate = dateUtils.startOfDay(checkOut);

//                         if (today >= startDate && today <= endDate) {
//                             console.log(`Room ${room.roomNumber || room.roomNo} is booked from ${dateUtils.format(startDate, 'yyyy-MM-dd')} to ${dateUtils.format(endDate, 'yyyy-MM-dd')}`);
//                             return true;
//                         }
//                     } else if (checkIn) {
//                         const checkInDate = dateUtils.startOfDay(checkIn);
//                         if (dateUtils.isSameDay(today, checkInDate)) {
//                             console.log(`Room ${room.roomNumber || room.roomNo} is booked for check-in on ${dateUtils.format(checkInDate, 'yyyy-MM-dd')}`);
//                             return true;
//                         }
//                     }
//                 } catch (err) {
//                     console.error('Error processing booking:', err);
//                 }
//             }
//         }

//         // Check reservations
//         if (room.reservations && Array.isArray(room.reservations)) {
//             console.log(`Room ${room.roomNumber || room.roomNo} has ${room.reservations.length} reservations`);
//             for (const reservation of room.reservations) {
//                 try {
//                     const reservedFrom = reservation.reservedFrom ? dateUtils.parseISO(reservation.reservedFrom) : null;
//                     const reservedTo = reservation.reservedTo ? dateUtils.parseISO(reservation.reservedTo) : null;

//                     if (reservedFrom && reservedTo) {
//                         const startDate = dateUtils.startOfDay(reservedFrom);
//                         const endDate = dateUtils.startOfDay(reservedTo);

//                         if (today >= startDate && today <= endDate) {
//                             console.log(`Room ${room.roomNumber || room.roomNo} is reserved from ${dateUtils.format(startDate, 'yyyy-MM-dd')} to ${dateUtils.format(endDate, 'yyyy-MM-dd')}`);
//                             return true;
//                         }
//                     }
//                 } catch (err) {
//                     console.error('Error processing reservation:', err);
//                 }
//             }
//         }

//         // Check out of order
//         if (room.outOfOrders && Array.isArray(room.outOfOrders)) {
//             console.log(`Room ${room.roomNumber || room.roomNo} has ${room.outOfOrders.length} out of orders`);
//             for (const outOfOrder of room.outOfOrders) {
//                 try {
//                     const startDate = outOfOrder.startDate ? dateUtils.parseISO(outOfOrder.startDate) : null;
//                     const endDate = outOfOrder.endDate ? dateUtils.parseISO(outOfOrder.endDate) : null;

//                     if (startDate && endDate) {
//                         const start = dateUtils.startOfDay(startDate);
//                         const end = dateUtils.startOfDay(endDate);

//                         if (today >= start && today <= end) {
//                             console.log(`Room ${room.roomNumber || room.roomNo} is out of order from ${dateUtils.format(start, 'yyyy-MM-dd')} to ${dateUtils.format(end, 'yyyy-MM-dd')}`);
//                             return true;
//                         }
//                     }
//                 } catch (err) {
//                     console.error('Error processing outOfOrder:', err);
//                 }
//             }
//         }

//         console.log(`Room ${room.roomNumber || room.roomNo} is available`);
//         return false;
//     }, []);

//     // Function to show available rooms modal
//     const showAvailableRoomsModal = useCallback(() => {
//         console.log('Total rooms:', rooms.length);
//         console.log('Checking available rooms for today...');

//         const available = rooms.filter(room => {
//             const isBooked = isRoomBookedToday(room);
//             return !isBooked;
//         });

//         console.log('Available rooms found:', available.length);
//         console.log('Available rooms details:', available.map(r => ({
//             roomNumber: r.roomNumber || r.roomNo,
//             id: r.id,
//             type: r.roomType?.type
//         })));

//         setAvailableRooms(available);
//         setAvailableModalVisible(true);
//         return available;
//     }, [rooms, isRoomBookedToday]);

//     // Function to show booked rooms modal
//     const showBookedRoomsModal = useCallback(() => {
//         console.log('Total rooms:', rooms.length);
//         console.log('Checking booked rooms for today...');

//         const booked = rooms.filter(room => {
//             const isBooked = isRoomBookedToday(room);
//             return isBooked;
//         });

//         console.log('Booked rooms found:', booked.length);
//         console.log('Booked rooms details:', booked.map(r => ({
//             roomNumber: r.roomNumber || r.roomNo,
//             id: r.id,
//             type: r.roomType?.type
//         })));

//         setBookedRooms(booked);
//         setBookedModalVisible(true);
//     }, [rooms, isRoomBookedToday]);

//     // Generate marked dates for calendar view with status filtering
//     const markedDates = useMemo(() => {
//         const facilities = getFacilitiesForDisplay;
//         const marks = {};

//         if (!facilities || facilities.length === 0) return marks;

//         // If status filter is selected, only count facilities with that status
//         if (selectedStatusFilter !== 'ALL') {
//             facilities.forEach(facility => {
//                 // Process bookings for BOOKED status
//                 if (selectedStatusFilter === 'BOOKED' && facility.bookings && Array.isArray(facility.bookings)) {
//                     facility.bookings.forEach(booking => {
//                         if (!booking) return;

//                         // Skip cancelled bookings
//                         if (booking.paymentStatus === 'CANCELLED' || booking.status === 'CANCELLED') return;

//                         try {
//                             const checkIn = booking.checkIn ? dateUtils.parseISO(booking.checkIn) : null;

//                             if (checkIn) {
//                                 // Only mark the check-in date (first day of booking)
//                                 const dateString = dateUtils.format(checkIn, 'yyyy-MM-dd');
//                                 if (!marks[dateString]) marks[dateString] = { count: 0 };
//                                 marks[dateString].count += 1;
//                             }
//                         } catch (err) {
//                             console.error('Error processing booking:', err);
//                         }
//                     });
//                 }

//                 // Process reservations for RESERVED status
//                 if (selectedStatusFilter === 'RESERVED' && facility.reservations && Array.isArray(facility.reservations)) {
//                     facility.reservations.forEach(reservation => {
//                         try {
//                             const startDate = dateUtils.parseISO(reservation.reservedFrom || reservation.startDate);

//                             if (startDate) {
//                                 // Only mark the start date
//                                 const dateString = dateUtils.format(startDate, 'yyyy-MM-dd');
//                                 if (!marks[dateString]) marks[dateString] = { count: 0 };
//                                 marks[dateString].count += 1;
//                             }
//                         } catch (err) {
//                             console.error('Error processing reservation:', err);
//                         }
//                     });
//                 }

//                 // Process out of order (maintenance) for MAINTENANCE status
//                 if (selectedStatusFilter === 'MAINTENANCE' && facility.outOfOrders && Array.isArray(facility.outOfOrders)) {
//                     facility.outOfOrders.forEach(outOfOrder => {
//                         try {
//                             const startDate = dateUtils.parseISO(outOfOrder.startDate);

//                             if (startDate) {
//                                 // Only mark the start date
//                                 const dateString = dateUtils.format(startDate, 'yyyy-MM-dd');
//                                 if (!marks[dateString]) marks[dateString] = { count: 0 };
//                                 marks[dateString].count += 1;
//                             }
//                         } catch (err) {
//                             console.error('Error processing outOfOrder:', err);
//                         }
//                     });
//                 }
//             });
//         } else {
//             // Original logic for ALL status
//             facilities.forEach(facility => {
//                 // Process bookings
//                 if (facility.bookings && Array.isArray(facility.bookings)) {
//                     facility.bookings.forEach(booking => {
//                         if (!booking) return;

//                         try {
//                             const checkIn = booking.checkIn ? dateUtils.parseISO(booking.checkIn) : null;

//                             if (checkIn) {
//                                 const dateString = dateUtils.format(checkIn, 'yyyy-MM-dd');
//                                 if (!marks[dateString]) marks[dateString] = { count: 0 };
//                                 marks[dateString].count += 1;
//                             }
//                         } catch (err) {
//                             console.error('Error processing booking:', err);
//                         }
//                     });
//                 }

//                 // Process reservations
//                 if (facility.reservations && Array.isArray(facility.reservations)) {
//                     facility.reservations.forEach(reservation => {
//                         try {
//                             const startDate = dateUtils.parseISO(reservation.reservedFrom || reservation.startDate);

//                             if (startDate) {
//                                 const dateString = dateUtils.format(startDate, 'yyyy-MM-dd');
//                                 if (!marks[dateString]) marks[dateString] = { count: 0 };
//                                 marks[dateString].count += 1;
//                             }
//                         } catch (err) {
//                             console.error('Error processing reservation:', err);
//                         }
//                     });
//                 }

//                 // Process out of order periods
//                 if (facility.outOfOrders && Array.isArray(facility.outOfOrders)) {
//                     facility.outOfOrders.forEach(outOfOrder => {
//                         try {
//                             const startDate = dateUtils.parseISO(outOfOrder.startDate);

//                             if (startDate) {
//                                 const dateString = dateUtils.format(startDate, 'yyyy-MM-dd');
//                                 if (!marks[dateString]) marks[dateString] = { count: 0 };
//                                 marks[dateString].count += 1;
//                             }
//                         } catch (err) {
//                             console.error('Error processing outOfOrder:', err);
//                         }
//                     });
//                 }
//             });
//         }

//         // Add custom styles to marked dates
//         Object.keys(marks).forEach(date => {
//             const count = marks[date].count;
//             marks[date].selected = count > 0;
//             marks[date].selectedColor = getStatusColor(selectedStatusFilter);
//             marks[date].selectedTextColor = '#FFFFFF';
//             marks[date].dots = [
//                 {
//                     key: 'status',
//                     color: getStatusColor(selectedStatusFilter),
//                     selectedDotColor: '#FFFFFF'
//                 }
//             ];
//         });

//         return marks;
//     }, [getFacilitiesForDisplay, selectedStatusFilter]);

//     // Get events for a specific date
//     const getEventsForDate = useCallback((dateString) => {
//         const facilities = getFacilitiesForDisplay;
//         const selectedDate = dateUtils.parseISO(dateString);
//         const eventsOnDate = [];

//         if (!facilities || facilities.length === 0) return eventsOnDate;

//         // Check if we need to filter by status
//         if (selectedStatusFilter !== 'ALL') {
//             facilities.forEach(facility => {
//                 const status = getFacilityStatusOnDate(facility, selectedDate);
//                 if (status === selectedStatusFilter) {
//                     eventsOnDate.push({
//                         facility,
//                         type: 'status',
//                         status: status,
//                     });
//                 }
//             });
//         } else {
//             // Original logic for ALL status
//             facilities.forEach(facility => {
//                 // Check bookings
//                 if (facility.bookings && Array.isArray(facility.bookings)) {
//                     facility.bookings.forEach(booking => {
//                         try {
//                             const checkIn = booking.checkIn ? dateUtils.parseISO(booking.checkIn) : null;
//                             const checkOut = booking.checkOut ? dateUtils.parseISO(booking.checkOut) : null;

//                             if (checkIn && checkOut) {
//                                 if (selectedDate >= dateUtils.startOfDay(checkIn) &&
//                                     selectedDate <= dateUtils.startOfDay(checkOut)) {
//                                     eventsOnDate.push({
//                                         facility,
//                                         type: 'booking',
//                                         data: booking,
//                                         isCancelled: booking.paymentStatus === 'CANCELLED' || booking.status === 'CANCELLED',
//                                         isConfirmed: booking.status === 'CONFIRMED' || booking.paymentStatus === 'PAID',
//                                     });
//                                 }
//                             } else if (dateUtils.isSameDay(selectedDate, checkIn)) {
//                                 eventsOnDate.push({
//                                     facility,
//                                     type: 'booking',
//                                     data: booking,
//                                     isCancelled: booking.paymentStatus === 'CANCELLED' || booking.status === 'CANCELLED',
//                                     isConfirmed: booking.status === 'CONFIRMED' || booking.paymentStatus === 'PAID',
//                                 });
//                             }
//                         } catch (err) {
//                             console.error('Error processing booking for date:', err);
//                         }
//                     });
//                 }

//                 // Check reservations
//                 if (facility.reservations && Array.isArray(facility.reservations)) {
//                     facility.reservations.forEach(reservation => {
//                         try {
//                             const startDate = dateUtils.parseISO(reservation.reservedFrom || reservation.startDate);
//                             const endDate = dateUtils.parseISO(reservation.reservedTo || reservation.endDate);

//                             if (selectedDate >= startDate && selectedDate <= endDate) {
//                                 eventsOnDate.push({
//                                     facility,
//                                     type: 'reservation',
//                                     data: reservation,
//                                 });
//                             }
//                         } catch (err) {
//                             console.error('Error processing reservation for date:', err);
//                         }
//                     });
//                 }

//                 // Check out of order periods
//                 if (facility.outOfOrders && Array.isArray(facility.outOfOrders)) {
//                     facility.outOfOrders.forEach(outOfOrder => {
//                         try {
//                             const startDate = dateUtils.parseISO(outOfOrder.startDate);
//                             const endDate = dateUtils.parseISO(outOfOrder.endDate);

//                             if (selectedDate >= startDate && selectedDate <= endDate) {
//                                 eventsOnDate.push({
//                                     facility,
//                                     type: 'outOfOrder',
//                                     data: outOfOrder,
//                                 });
//                             }
//                         } catch (err) {
//                             console.error('Error processing outOfOrder for date:', err);
//                         }
//                     });
//                 }
//             });
//         }

//         return eventsOnDate;
//     }, [getFacilitiesForDisplay, selectedStatusFilter, getFacilityStatusOnDate]);

//     // Custom Day Component
//     const DayComponent = ({ date, state, marking }) => {
//         const isToday = dateUtils.isSameDay(new Date(), date.dateString);
//         const count = marking?.count || 0;
//         const hasEvents = count > 0;

//         return (
//             <TouchableOpacity
//                 style={styles.dayWrapper}
//                 onPress={() => {
//                     const events = getEventsForDate(date.dateString);
//                     if (events.length > 0) {
//                         setSelectedPeriod({
//                             date: dateUtils.parseISO(date.dateString),
//                             events: events,
//                         });
//                     }
//                 }}
//                 activeOpacity={0.7}
//             >
//                 <View style={[
//                     styles.dayContainer,
//                     isToday && styles.todayContainer,
//                     hasEvents && styles.hasEventsContainer,
//                     marking?.selected && { backgroundColor: getStatusColor(selectedStatusFilter) }
//                 ]}>
//                     <Text style={[
//                         styles.dayText,
//                         state === 'disabled' && styles.disabledDayText,
//                         isToday && styles.todayText,
//                         marking?.selected && styles.selectedDayText
//                     ]}>
//                         {date.day}
//                     </Text>

//                     {count > 0 && (
//                         <View style={[
//                             styles.eventBadge,
//                             count > 3 && styles.eventBadgeHigh,
//                             count > 1 && count <= 3 && styles.eventBadgeMedium
//                         ]}>
//                             <Text style={styles.eventBadgeText}>
//                                 {count > 9 ? '9+' : count}
//                             </Text>
//                         </View>
//                     )}
//                 </View>
//             </TouchableOpacity>
//         );
//     };

//     // Get facility type display name
//     const getFacilityTypeName = (type) => {
//         const names = {
//             'ROOMS': 'Rooms',
//             'HALLS': 'Halls',
//             'LAWNS': 'Lawns',
//             'PHOTOSHOOTS': 'Photoshoots',
//         };
//         return names[type] || 'Rooms';
//     };

//     // Get facility name
//     const getFacilityName = (facility) => {
//         if (!facility) return 'Unknown Facility';

//         if (selectedFacilityType === 'ROOMS') {
//             return `Room ${facility.roomNumber || facility.roomNo || facility.roomName || facility.id || 'N/A'}`;
//         }
//         return facility.name || facility.title || `Facility ${facility.id || 'N/A'}`;
//     };

//     // Calculate statistics
//     const calculateStatistics = useMemo(() => {
//         const facilities = getFacilitiesForDisplay;
//         const total = facilities.length;

//         // Calculate based on current day booking status
//         let booked = 0;
//         let available = 0;
//         let reserved = 0;
//         let maintenance = 0;

//         const today = new Date();

//         facilities.forEach(facility => {
//             const status = getFacilityStatusOnDate(facility, today);
//             switch (status) {
//                 case 'BOOKED':
//                     booked++;
//                     break;
//                 case 'AVAILABLE':
//                     available++;
//                     break;
//                 case 'RESERVED':
//                     reserved++;
//                     break;
//                 case 'MAINTENANCE':
//                     maintenance++;
//                     break;
//             }
//         });

//         return {
//             total,
//             booked,
//             available,
//             reserved,
//             maintenance,
//             occupancyRate: total > 0 ? Math.round((booked / total) * 100) : 0,
//             availabilityRate: total > 0 ? Math.round((available / total) * 100) : 0,
//         };
//     }, [getFacilitiesForDisplay, getFacilityStatusOnDate]);

//     // Get unique room types
//     const roomTypes = useMemo(() => {
//         const types = [...new Set(rooms.map(room => room.roomType?.type).filter(Boolean))];
//         return types;
//     }, [rooms]);

//     // Get unique room numbers for search filter
//     const roomNumbers = useMemo(() => {
//         const numbers = [...new Set(rooms.map(room => room.roomNumber || room.roomNo).filter(Boolean))];
//         return numbers.sort((a, b) => a - b);
//     }, [rooms]);

//     // Handle month picker change
//     const onMonthChange = (event, selectedDate) => {
//         setShowMonthPicker(false);
//         if (selectedDate) {
//             setSelectedMonth(selectedDate);
//         }
//     };

//     // Reset filters
//     const resetFilters = () => {
//         setSearchByMonth(false);
//         setSearchByRoomMonth(false);
//         setSelectedRoomNumber('');
//         setSelectedMonth(new Date());
//         setSelectedRoomType('ALL');
//         setSelectedRoom(null);
//         setSelectedStatusFilter('ALL');
//     };

//     const renderRoomItem = ({ item, index }) => {
//         return (
//             <View style={styles.roomItemContainer}>
//                 <View style={styles.roomItemHeader}>
//                     <Text style={styles.roomNumber}>
//                         Room {item.roomNumber || item.roomNo || 'N/A'}
//                     </Text>
//                     <Text style={styles.roomType}>
//                         {item.roomType?.type || 'Standard'}
//                     </Text>
//                 </View>
//                 <View style={styles.roomDetails}>
//                     <Text style={styles.roomDetailText}>
//                         Status: {item.isBooked ? 'BOOKED' : item.isReserved ? 'RESERVED' : 'AVAILABLE'}
//                     </Text>
//                     {item.rate && (
//                         <Text style={styles.roomRate}>
//                             Rate: PKR {parseInt(item.rate).toLocaleString()}/night
//                         </Text>
//                     )}
//                 </View>
//             </View>
//         );
//     };

//     // Loading state
//     if (loading && !refreshing) {
//         return (
//             <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="large" color="#D9A46C" />
//                 <Text style={styles.loadingText}>Loading calendar data...</Text>
//             </View>
//         );
//     }

//     const stats = calculateStatistics;
//     const facilities = getFacilitiesForDisplay;

//     return (
//         <SafeAreaView style={styles.container}>
//             <StatusBar barStyle="dark-content" backgroundColor="#F2F0EC" />

//             {/* Notch Header with Image Background */}
//             <ImageBackground
//                 source={require('../../assets/notch.jpg')}
//                 style={styles.notch}
//                 imageStyle={styles.notchImage}
//             >
//                 <View style={styles.notchContent}>
//                     <TouchableOpacity
//                         style={styles.backButtonNotch}
//                         onPress={() => navigation.goBack()}
//                         activeOpacity={0.7}
//                     >
//                         <Icon name="arrow-back" size={28} color="#000" />
//                     </TouchableOpacity>
//                     <View style={styles.headerTitleContainer}>
//                         <Text style={styles.headerTitleNotch}>Facility Calendar</Text>
//                         <Text style={styles.welcomeTextSmall}>View bookings and schedules</Text>
//                     </View>
//                     <View style={{ width: 40 }} />
//                 </View>
//             </ImageBackground>

//             <ScrollView
//                 refreshControl={
//                     <RefreshControl
//                         refreshing={refreshing}
//                         onRefresh={onRefresh}
//                         colors={['#D9A46C']}
//                         tintColor="#D9A46C"
//                     />
//                 }
//                 style={styles.scrollView}
//                 showsVerticalScrollIndicator={false}
//             >
//                 {/* Error Banner */}
//                 {error && (
//                     <View style={styles.errorBanner}>
//                         <Text style={styles.errorBannerText}>
//                             {error.includes('404') ? 'Endpoint not found. Please check API configuration.' : error}
//                         </Text>
//                     </View>
//                 )}

//                 {/* Search Filters */}
//                 <View style={styles.filtersContainer}>
//                     <Text style={styles.sectionTitle}>Search Filters</Text>

//                     {/* Search by Month */}
//                     <View style={styles.filterRow}>
//                         <TouchableOpacity
//                             style={[
//                                 styles.filterToggle,
//                                 searchByMonth && styles.filterToggleActive
//                             ]}
//                             onPress={() => {
//                                 setSearchByMonth(!searchByMonth);
//                                 if (!searchByMonth) {
//                                     setSearchByRoomMonth(false);
//                                 }
//                             }}
//                             activeOpacity={0.7}
//                         >
//                             <Text style={[
//                                 styles.filterToggleText,
//                                 searchByMonth && styles.filterToggleTextActive
//                             ]}>
//                                 Search by Month
//                             </Text>
//                         </TouchableOpacity>

//                         {searchByMonth && (
//                             <TouchableOpacity
//                                 style={styles.monthPickerButton}
//                                 onPress={() => setShowMonthPicker(true)}
//                                 activeOpacity={0.7}
//                             >
//                                 <Text style={styles.monthPickerButtonText}>
//                                     {dateUtils.format(selectedMonth, 'MMMM yyyy')}
//                                 </Text>
//                                 <Text style={styles.monthPickerButtonIcon}>▼</Text>
//                             </TouchableOpacity>
//                         )}
//                     </View>

//                     {/* Search by Room + Month */}
//                     <View style={styles.filterRow}>
//                         <TouchableOpacity
//                             style={[
//                                 styles.filterToggle,
//                                 searchByRoomMonth && styles.filterToggleActive
//                             ]}
//                             onPress={() => {
//                                 setSearchByRoomMonth(!searchByRoomMonth);
//                                 if (!searchByRoomMonth) {
//                                     setSearchByMonth(false);
//                                 }
//                             }}
//                             activeOpacity={0.7}
//                         >
//                             <Text style={[
//                                 styles.filterToggleText,
//                                 searchByRoomMonth && styles.filterToggleTextActive
//                             ]}>
//                                 Search by Room + Month
//                             </Text>
//                         </TouchableOpacity>

//                         {searchByRoomMonth && (
//                             <View style={styles.roomMonthContainer}>
//                                 <TextInput
//                                     style={styles.roomNumberInput}
//                                     placeholder="Enter room number"
//                                     value={selectedRoomNumber}
//                                     onChangeText={setSelectedRoomNumber}
//                                     keyboardType="numeric"
//                                 />
//                                 <TouchableOpacity
//                                     style={styles.monthPickerButton}
//                                     onPress={() => setShowMonthPicker(true)}
//                                     activeOpacity={0.7}
//                                 >
//                                     <Text style={styles.monthPickerButtonText}>
//                                         {dateUtils.format(selectedMonth, 'MM/yyyy')}
//                                     </Text>
//                                     <Text style={styles.monthPickerButtonIcon}>▼</Text>
//                                 </TouchableOpacity>
//                             </View>
//                         )}
//                     </View>

//                     {/* Reset Filters */}
//                     {(searchByMonth || searchByRoomMonth || selectedRoomNumber || selectedRoomType !== 'ALL' || selectedStatusFilter !== 'ALL') && (
//                         <TouchableOpacity
//                             style={styles.resetButton}
//                             onPress={resetFilters}
//                             activeOpacity={0.7}
//                         >
//                             <Text style={styles.resetButtonText}>Reset Filters</Text>
//                         </TouchableOpacity>
//                     )}
//                 </View>

//                 {/* Month Picker Modal */}
//                 {showMonthPicker && (
//                     <Modal
//                         transparent={true}
//                         animationType="slide"
//                         visible={showMonthPicker}
//                         onRequestClose={() => setShowMonthPicker(false)}
//                     >
//                         <View style={styles.monthPickerOverlay}>
//                             <View style={styles.monthPickerContainer}>
//                                 <View style={styles.monthPickerHeader}>
//                                     <Text style={styles.monthPickerTitle}>Select Month</Text>
//                                     <TouchableOpacity
//                                         style={styles.monthPickerCloseButton}
//                                         onPress={() => setShowMonthPicker(false)}
//                                     >
//                                         <Text style={styles.monthPickerCloseText}>✕</Text>
//                                     </TouchableOpacity>
//                                 </View>
//                                 <DateTimePicker
//                                     value={selectedMonth}
//                                     mode="date"
//                                     display="spinner"
//                                     onChange={onMonthChange}
//                                     style={styles.dateTimePicker}
//                                 />
//                                 <View style={styles.monthPickerFooter}>
//                                     <TouchableOpacity
//                                         style={styles.monthPickerDoneButton}
//                                         onPress={() => setShowMonthPicker(false)}
//                                     >
//                                         <Text style={styles.monthPickerDoneText}>Done</Text>
//                                     </TouchableOpacity>
//                                 </View>
//                             </View>
//                         </View>
//                     </Modal>
//                 )}

//                 {/* Facility Type Filter */}
//                 <View style={styles.facilityTypeContainer}>
//                     <Text style={styles.sectionTitle}>Select Facility Type</Text>
//                     <ScrollView
//                         horizontal
//                         showsHorizontalScrollIndicator={false}
//                         contentContainerStyle={styles.facilityTypeButtonsContainer}
//                     >
//                         {['ROOMS', 'HALLS', 'LAWNS', 'PHOTOSHOOTS'].map((type) => (
//                             <TouchableOpacity
//                                 key={type}
//                                 style={[
//                                     styles.facilityTypeButton,
//                                     selectedFacilityType === type && styles.facilityTypeButtonActive,
//                                 ]}
//                                 onPress={() => {
//                                     setSelectedFacilityType(type);
//                                     setSelectedRoomType('ALL');
//                                     setSelectedRoom(null);
//                                     setSelectedRoomNumber('');
//                                     setSelectedStatusFilter('ALL');
//                                 }}
//                                 activeOpacity={0.7}
//                             >
//                                 <Text
//                                     style={[
//                                         styles.facilityTypeButtonText,
//                                         selectedFacilityType === type && styles.facilityTypeButtonTextActive,
//                                     ]}
//                                 >
//                                     {getFacilityTypeName(type)}
//                                 </Text>
//                             </TouchableOpacity>
//                         ))}
//                     </ScrollView>
//                 </View>

//                 {/* Status Filter Buttons */}
//                 <View style={styles.statusFilterContainer}>
//                     <Text style={styles.sectionTitle}>Filter by Status</Text>
//                     <ScrollView
//                         horizontal
//                         showsHorizontalScrollIndicator={false}
//                         contentContainerStyle={styles.statusFilterButtonsContainer}
//                     >
//                         {['ALL', 'AVAILABLE', 'BOOKED', 'RESERVED', 'MAINTENANCE'].map((status) => (
//                             <TouchableOpacity
//                                 key={status}
//                                 style={[
//                                     styles.statusFilterButton,
//                                     selectedStatusFilter === status && styles.statusFilterButtonActive,
//                                     selectedStatusFilter === status && { backgroundColor: getStatusColor(status) },
//                                 ]}
//                                 onPress={() => setSelectedStatusFilter(status)}
//                                 activeOpacity={0.7}
//                             >
//                                 <Text
//                                     style={[
//                                         styles.statusFilterButtonText,
//                                         selectedStatusFilter === status && styles.statusFilterButtonTextActive,
//                                     ]}
//                                 >
//                                     {status.charAt(0) + status.slice(1).toLowerCase()}
//                                 </Text>
//                             </TouchableOpacity>
//                         ))}
//                     </ScrollView>
//                 </View>

//                 {/* Room-specific filters */}
//                 {selectedFacilityType === 'ROOMS' && roomTypes.length > 0 && (
//                     <View style={styles.roomTypeContainer}>
//                         <Text style={styles.sectionTitle}>Filter by Room Type</Text>
//                         <ScrollView
//                             horizontal
//                             showsHorizontalScrollIndicator={false}
//                             contentContainerStyle={styles.roomTypeButtonsContainer}
//                         >
//                             <TouchableOpacity
//                                 style={[
//                                     styles.roomTypeButton,
//                                     selectedRoomType === 'ALL' && styles.roomTypeButtonActive,
//                                 ]}
//                                 onPress={() => setSelectedRoomType('ALL')}
//                                 activeOpacity={0.7}
//                             >
//                                 <Text
//                                     style={[
//                                         styles.roomTypeButtonText,
//                                         selectedRoomType === 'ALL' && styles.roomTypeButtonTextActive,
//                                     ]}
//                                 >
//                                     All Types
//                                 </Text>
//                             </TouchableOpacity>
//                             {roomTypes.map((type) => (
//                                 <TouchableOpacity
//                                     key={type}
//                                     style={[
//                                         styles.roomTypeButton,
//                                         selectedRoomType === type && styles.roomTypeButtonActive,
//                                     ]}
//                                     onPress={() => setSelectedRoomType(type)}
//                                     activeOpacity={0.7}
//                                 >
//                                     <Text
//                                         style={[
//                                             styles.roomTypeButtonText,
//                                             selectedRoomType === type && styles.roomTypeButtonTextActive,
//                                         ]}
//                                     >
//                                         {type}
//                                     </Text>
//                                 </TouchableOpacity>
//                             ))}
//                         </ScrollView>
//                     </View>
//                 )}

//                 {/* Statistics with Available and Booked Buttons */}
//                 <View style={styles.statsWrapper}>
//                     {/* Top Card - Total */}
//                     <View style={styles.statCardPrimary}>
//                         <View style={styles.statCardPrimaryHeader}>
//                             <Text style={styles.statCardPrimaryTitle}>Total {getFacilityTypeName(selectedFacilityType)}</Text>
//                             <View style={styles.statCardBadge}>
//                                 <Text style={styles.statCardBadgeText}>
//                                     {stats.occupancyRate}%
//                                 </Text>
//                             </View>
//                         </View>
//                         <View style={styles.statCardPrimaryContent}>
//                             <Text style={styles.statCardPrimaryNumber}>{stats.total}</Text>
//                             <Text style={styles.statCardPrimarySubtitle}>{getFacilityTypeName(selectedFacilityType).toLowerCase()}</Text>
//                         </View>
//                         <View style={styles.progressBarContainer}>
//                             <View style={[styles.progressBar, { width: `${stats.occupancyRate}%` }]} />
//                         </View>
//                     </View>

//                     {/* Middle Row - Booked & Available */}
//                     <View style={styles.statsRow}>
//                         {/* Booked Card */}
//                         <TouchableOpacity
//                             style={styles.statCardSecondary}
//                             onPress={() => {
//                                 if (selectedFacilityType === 'ROOMS') {
//                                     showBookedRoomsModal();
//                                 } else {
//                                     setSelectedStatusFilter('BOOKED');
//                                 }
//                             }}
//                             activeOpacity={0.7}
//                         >
//                             <Text style={styles.statCardSecondaryTitle}>Booked</Text>
//                             <Text style={styles.statCardSecondarySubtitle}>Currently occupied</Text>
//                             <Text style={[styles.statCardSecondaryNumber, styles.bookedNumber]}>
//                                 {stats.booked}
//                             </Text>
//                         </TouchableOpacity>

//                         {/* Available Card */}
//                         <TouchableOpacity
//                             style={styles.statCardSecondary}
//                             onPress={() => {
//                                 if (selectedFacilityType === 'ROOMS') {
//                                     showAvailableRoomsModal();
//                                 } else {
//                                     setSelectedStatusFilter('AVAILABLE');
//                                 }
//                             }}
//                             activeOpacity={0.7}
//                         >
//                             <Text style={styles.statCardSecondaryTitle}>Available</Text>
//                             <Text style={styles.statCardSecondarySubtitle}>Ready to book</Text>
//                             <Text style={[styles.statCardSecondaryNumber, styles.availableNumber]}>
//                                 {stats.available}
//                             </Text>
//                         </TouchableOpacity>
//                     </View>

//                     {/* Bottom Row - Reserved & Maintenance */}
//                     <View style={styles.statsRow}>
//                         {/* Reserved Card */}
//                         <TouchableOpacity
//                             style={styles.statCardSecondary}
//                             onPress={() => setSelectedStatusFilter('RESERVED')}
//                             activeOpacity={0.7}
//                         >
//                             <Text style={styles.statCardSecondaryTitle}>Reserved</Text>
//                             <Text style={styles.statCardSecondarySubtitle}>On hold</Text>
//                             <Text style={[styles.statCardSecondaryNumber, styles.reservedNumber]}>
//                                 {stats.reserved}
//                             </Text>
//                         </TouchableOpacity>

//                         {/* Maintenance Card */}
//                         <TouchableOpacity
//                             style={styles.statCardSecondary}
//                             onPress={() => setSelectedStatusFilter('MAINTENANCE')}
//                             activeOpacity={0.7}
//                         >
//                             <Text style={styles.statCardSecondaryTitle}>Maintenance</Text>
//                             <Text style={styles.statCardSecondarySubtitle}>Out of service</Text>
//                             <Text style={[styles.statCardSecondaryNumber, styles.maintenanceNumber]}>
//                                 {stats.maintenance}
//                             </Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>

//                 {/* Legend */}
//                 <View style={styles.legendContainer}>
//                     <Text style={styles.legendTitle}>Booking Status</Text>
//                     <View style={styles.legendItems}>
//                         <View style={styles.legendItem}>
//                             <View style={[styles.legendDot, styles.legendDotBooking]} />
//                             <Text style={styles.legendText}>Bookings</Text>
//                         </View>
//                         <View style={styles.legendItem}>
//                             <View style={[styles.legendDot, styles.legendDotReservation]} />
//                             <Text style={styles.legendText}>Reservations</Text>
//                         </View>
//                         <View style={styles.legendItem}>
//                             <View style={[styles.legendDot, styles.legendDotOutOfService]} />
//                             <Text style={styles.legendText}>Out of Service</Text>
//                         </View>
//                         <View style={styles.legendItem}>
//                             <View style={[styles.legendDot, styles.legendDotAvailable]} />
//                             <Text style={styles.legendText}>Available</Text>
//                         </View>
//                     </View>
//                 </View>

//                 {/* Calendar View */}
//                 <View style={styles.calendarCard}>
//                     <Calendar
//                         current={dateUtils.format(new Date(), 'yyyy-MM-dd')}
//                         dayComponent={DayComponent}
//                         markedDates={markedDates}
//                         theme={{
//                             calendarBackground: '#ffffff',
//                             textSectionTitleColor: '#6B7280',
//                             selectedDayBackgroundColor: getStatusColor(selectedStatusFilter),
//                             selectedDayTextColor: '#ffffff',
//                             todayTextColor: '#002f79ff',
//                             dayTextColor: '#374151',
//                             textDisabledColor: '#D1D5DB',
//                             arrowColor: '#002f79ff',
//                             monthTextColor: '#111827',
//                             textDayFontFamily: 'System',
//                             textMonthFontFamily: 'System',
//                             textDayHeaderFontFamily: 'System',
//                             textDayFontSize: 16,
//                             textMonthFontSize: 18,
//                             textDayHeaderFontSize: 14,
//                         }}
//                         style={styles.calendar}
//                     />
//                 </View>
//             </ScrollView>

//             {/* Available Rooms Modal */}
//             <Modal
//                 visible={availableModalVisible}
//                 transparent
//                 animationType="slide"
//                 onRequestClose={() => setAvailableModalVisible(false)}
//             >
//                 <View style={styles.modalOverlay}>
//                     <View style={styles.modalContainer}>
//                         <View style={styles.modalHeader}>
//                             <Text style={styles.modalTitle}>Available Rooms</Text>
//                             <TouchableOpacity
//                                 style={styles.modalCloseButton}
//                                 onPress={() => setAvailableModalVisible(false)}
//                             >
//                                 <Text style={styles.modalCloseText}>✕</Text>
//                             </TouchableOpacity>
//                         </View>

//                         <Text style={styles.modalSubtitle}>
//                             Rooms available for booking today ({dateUtils.format(new Date(), 'MMMM d, yyyy')})
//                         </Text>

//                         {/* Wrap FlatList in a View with flex: 1 */}
//                         <View style={styles.modalContentArea}>
//                             <FlatList
//                                 data={availableRooms}
//                                 renderItem={renderRoomItem}
//                                 keyExtractor={(item, index) => `available-${item.id || index}`}
//                                 style={styles.roomsList}
//                                 contentContainerStyle={[
//                                     styles.roomsListContent,
//                                     availableRooms.length === 0 && styles.emptyListContent
//                                 ]}
//                                 ListEmptyComponent={
//                                     <View style={styles.emptyListContainer}>
//                                         <Text style={styles.emptyListTitle}>No Available Rooms</Text>
//                                         <Text style={styles.emptyListText}>
//                                             All rooms are currently booked or out of service
//                                         </Text>
//                                     </View>
//                                 }
//                                 ListHeaderComponent={() => (
//                                     <Text style={styles.listHeader}>
//                                         Showing {availableRooms.length} available rooms
//                                     </Text>
//                                 )}
//                             />
//                         </View>

//                         <View style={styles.modalFooter}>
//                             <TouchableOpacity
//                                 style={styles.modalButton}
//                                 onPress={() => setAvailableModalVisible(false)}
//                             >
//                                 <Text style={styles.modalButtonText}>Close</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 </View>
//             </Modal>

//             {/* Booked Rooms Modal */}
//             <Modal
//                 visible={bookedModalVisible}
//                 transparent
//                 animationType="slide"
//                 onRequestClose={() => setBookedModalVisible(false)}
//             >
//                 <View style={styles.modalOverlay}>
//                     <View style={styles.modalContainer}>
//                         <View style={styles.modalHeader}>
//                             <Text style={styles.modalTitle}>Booked Rooms</Text>
//                             <TouchableOpacity
//                                 style={styles.modalCloseButton}
//                                 onPress={() => setBookedModalVisible(false)}
//                             >
//                                 <Text style={styles.modalCloseText}>✕</Text>
//                             </TouchableOpacity>
//                         </View>

//                         <Text style={styles.modalSubtitle}>
//                             Rooms booked for today ({dateUtils.format(new Date(), 'MMMM d, yyyy')})
//                         </Text>

//                         <View style={styles.modalContentArea}>
//                             <FlatList
//                                 data={bookedRooms}
//                                 renderItem={renderRoomItem}
//                                 keyExtractor={(item, index) => `booked-${item.id || index}`}
//                                 style={styles.roomsList}
//                                 contentContainerStyle={[
//                                     styles.roomsListContent,
//                                     bookedRooms.length === 0 && styles.emptyListContent
//                                 ]}
//                                 ListEmptyComponent={
//                                     <View style={styles.emptyListContainer}>
//                                         <Text style={styles.emptyListTitle}>No Booked Rooms</Text>
//                                         <Text style={styles.emptyListText}>
//                                             All rooms are currently available
//                                         </Text>
//                                     </View>
//                                 }
//                                 ListHeaderComponent={() => (
//                                     <Text style={styles.listHeader}>
//                                         Showing {bookedRooms.length} booked rooms
//                                     </Text>
//                                 )}
//                             />
//                         </View>

//                         <View style={styles.modalFooter}>
//                             <TouchableOpacity
//                                 style={styles.modalButton}
//                                 onPress={() => setBookedModalVisible(false)}
//                             >
//                                 <Text style={styles.modalButtonText}>Close</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 </View>
//             </Modal>

//             {/* Period Details Modal */}
//             <Modal
//                 visible={!!selectedPeriod}
//                 transparent
//                 animationType="slide"
//                 onRequestClose={() => setSelectedPeriod(null)}
//             >
//                 <View style={styles.modalOverlay}>
//                     <View style={styles.modalContainer}>
//                         <View style={styles.modalHeader}>
//                             <Text style={styles.modalTitle}>
//                                 {selectedPeriod?.date
//                                     ? dateUtils.format(selectedPeriod.date, 'MMMM d, yyyy')
//                                     : 'Booking Details'}
//                                 {selectedStatusFilter !== 'ALL' && ` - ${selectedStatusFilter}`}
//                             </Text>
//                             <TouchableOpacity
//                                 style={styles.modalCloseButton}
//                                 onPress={() => setSelectedPeriod(null)}
//                             >
//                                 <Text style={styles.modalCloseText}>✕</Text>
//                             </TouchableOpacity>
//                         </View>

//                         <ScrollView style={styles.modalContent}>
//                             {selectedPeriod?.events ? (
//                                 selectedPeriod.events.map((event, index) => {
//                                     if (selectedStatusFilter !== 'ALL' && event.type === 'status') {
//                                         // Render status-based items
//                                         return (
//                                             <View key={index} style={styles.periodCard}>
//                                                 <View style={styles.periodCardHeader}>
//                                                     <Text style={styles.periodFacilityName}>
//                                                         {getFacilityName(event.facility)}
//                                                     </Text>
//                                                     <View
//                                                         style={[
//                                                             styles.periodBadge,
//                                                             {
//                                                                 backgroundColor: getStatusColor(event.status),
//                                                             },
//                                                         ]}
//                                                     >
//                                                         <Text style={styles.periodBadgeText}>
//                                                             {event.status}
//                                                         </Text>
//                                                     </View>
//                                                 </View>

//                                                 {selectedFacilityType === 'ROOMS' && (
//                                                     <>
//                                                         <Text style={styles.periodDetail}>
//                                                             Type: {event.facility.roomType?.type || 'Standard'}
//                                                         </Text>
//                                                         {event.facility.rate && (
//                                                             <Text style={styles.periodDetail}>
//                                                                 Rate: PKR {parseInt(event.facility.rate).toLocaleString()}/night
//                                                             </Text>
//                                                         )}
//                                                     </>
//                                                 )}

//                                                 {selectedFacilityType === 'HALLS' && event.facility.capacity && (
//                                                     <Text style={styles.periodDetail}>
//                                                         Capacity: {event.facility.capacity} people
//                                                     </Text>
//                                                 )}

//                                                 {selectedFacilityType === 'LAWNS' && event.facility.area && (
//                                                     <Text style={styles.periodDetail}>
//                                                         Area: {event.facility.area} sq.ft
//                                                     </Text>
//                                                 )}

//                                                 {selectedFacilityType === 'PHOTOSHOOTS' && event.facility.duration && (
//                                                     <Text style={styles.periodDetail}>
//                                                         Duration: {event.facility.duration} hours
//                                                     </Text>
//                                                 )}
//                                             </View>
//                                         );
//                                     } else {
//                                         // Original period rendering for ALL status
//                                         return (
//                                             <View key={index} style={styles.periodCard}>
//                                                 <View style={styles.periodCardHeader}>
//                                                     <Text style={styles.periodFacilityName}>
//                                                         {getFacilityName(event.facility)}
//                                                     </Text>
//                                                     <View
//                                                         style={[
//                                                             styles.periodBadge,
//                                                             {
//                                                                 backgroundColor:
//                                                                     event.type === 'booking'
//                                                                         ? event.isCancelled
//                                                                             ? '#FEE2E2'
//                                                                             : event.isConfirmed
//                                                                                 ? '#F2F0EC'
//                                                                                 : '#F2F0EC'
//                                                                         : event.type === 'reservation'
//                                                                             ? '#FEF3C7'
//                                                                             : '#FEE2E2',
//                                                             },
//                                                         ]}
//                                                     >
//                                                         <Text
//                                                             style={[
//                                                                 styles.periodBadgeText,
//                                                                 {
//                                                                     color:
//                                                                         event.type === 'booking'
//                                                                             ? event.isCancelled
//                                                                                 ? '#991B1B'
//                                                                                 : event.isConfirmed
//                                                                                     ? '#92400E'
//                                                                                     : '#002f79ff'
//                                                                             : event.type === 'reservation'
//                                                                                 ? '#92400E'
//                                                                                 : '#991B1B',
//                                                                 },
//                                                             ]}
//                                                         >
//                                                             {event.isCancelled ? 'CANCELLED' :
//                                                                 event.isConfirmed ? 'CONFIRMED' :
//                                                                     event.type.toUpperCase()}
//                                                         </Text>
//                                                     </View>
//                                                 </View>

//                                                 {event.type === 'booking' && (
//                                                     <>
//                                                         {event.data.memberName && (
//                                                             <Text style={styles.periodDetail}>
//                                                                 Guest: {event.data.memberName}
//                                                             </Text>
//                                                         )}
//                                                         {event.data.guestName && (
//                                                             <Text style={styles.periodDetail}>
//                                                                 Guest: {event.data.guestName}
//                                                             </Text>
//                                                         )}
//                                                         {(event.data.checkIn || event.data.bookingDate) && (
//                                                             <Text style={styles.periodDetail}>
//                                                                 Date: {dateUtils.format(
//                                                                     dateUtils.parseISO(event.data.checkIn || event.data.bookingDate),
//                                                                     'MMM d, yyyy'
//                                                                 )}
//                                                                 {event.data.checkOut && ` to ${dateUtils.format(
//                                                                     dateUtils.parseISO(event.data.checkOut),
//                                                                     'MMM d, yyyy'
//                                                                 )}`}
//                                                             </Text>
//                                                         )}
//                                                         {event.data.totalPrice && (
//                                                             <Text style={styles.periodDetail}>
//                                                                 Amount: PKR {parseInt(event.data.totalPrice).toLocaleString()}
//                                                             </Text>
//                                                         )}
//                                                         {event.data.paymentStatus && (
//                                                             <View style={styles.paymentStatusContainer}>
//                                                                 <Text style={styles.periodDetail}>Payment: </Text>
//                                                                 <View
//                                                                     style={[
//                                                                         styles.paymentBadge,
//                                                                         {
//                                                                             backgroundColor:
//                                                                                 event.data.paymentStatus === 'PAID'
//                                                                                     ? '#D1FAE5'
//                                                                                     : event.data.paymentStatus === 'UNPAID'
//                                                                                         ? '#FEE2E2'
//                                                                                         : '#FEF3C7',
//                                                                         },
//                                                                     ]}
//                                                                 >
//                                                                     <Text
//                                                                         style={[
//                                                                             styles.paymentBadgeText,
//                                                                             {
//                                                                                 color:
//                                                                                     event.data.paymentStatus === 'PAID'
//                                                                                         ? '#065F46'
//                                                                                         : event.data.paymentStatus === 'UNPAID'
//                                                                                             ? '#991B1B'
//                                                                                             : '#92400E',
//                                                                             },
//                                                                         ]}
//                                                                     >
//                                                                         {event.data.paymentStatus}
//                                                                     </Text>
//                                                                 </View>
//                                                             </View>
//                                                         )}
//                                                     </>
//                                                 )}

//                                                 {event.type === 'reservation' && (
//                                                     <>
//                                                         <Text style={styles.periodDetail}>
//                                                             Reserved by: {event.data.admin?.name || 'Admin'}
//                                                         </Text>
//                                                         <Text style={styles.periodDetail}>
//                                                             Period: {dateUtils.format(
//                                                                 dateUtils.parseISO(event.data.reservedFrom || event.data.startDate),
//                                                                 'MMM d, yyyy'
//                                                             )} - {dateUtils.format(
//                                                                 dateUtils.parseISO(event.data.reservedTo || event.data.endDate),
//                                                                 'MMM d, yyyy'
//                                                             )}
//                                                         </Text>
//                                                     </>
//                                                 )}

//                                                 {event.type === 'outOfOrder' && (
//                                                     <>
//                                                         <Text style={styles.periodDetail}>
//                                                             Reason: {event.data.reason || 'Maintenance'}
//                                                         </Text>
//                                                         <Text style={styles.periodDetail}>
//                                                             Period: {dateUtils.format(
//                                                                 dateUtils.parseISO(event.data.startDate),
//                                                                 'MMM d, yyyy'
//                                                             )} - {dateUtils.format(
//                                                                 dateUtils.parseISO(event.data.endDate),
//                                                                 'MMM d, yyyy'
//                                                             )}
//                                                         </Text>
//                                                     </>
//                                                 )}
//                                             </View>
//                                         );
//                                     }
//                                 })
//                             ) : null}
//                         </ScrollView>

//                         <View style={styles.modalFooter}>
//                             <TouchableOpacity
//                                 style={styles.modalButton}
//                                 onPress={() => setSelectedPeriod(null)}
//                             >
//                                 <Text style={styles.modalButtonText}>Close</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 </View>
//             </Modal>
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#F2F0EC',
//     },
//     scrollView: {
//         flex: 1,
//     },
//     loadingContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#F2F0EC',
//     },
//     loadingText: {
//         marginTop: 16,
//         fontSize: 16,
//         color: '#64748B',
//         fontWeight: '500',
//     },
//     header: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         backgroundColor: '#F2F0EC',
//         paddingTop: 16,
//         paddingBottom: 16,
//         paddingHorizontal: 16,
//         borderBottomWidth: 1,
//         borderBottomColor: '#E5E7EB',
//     },
//     backButton: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingVertical: 8,
//         paddingRight: 12,
//     },
//     backIcon: {
//         fontSize: 28,
//         color: '#D9A46C',
//         fontWeight: '300',
//         marginRight: 2,
//     },
//     backText: {
//         fontSize: 16,
//         color: '#D9A46C',
//         fontWeight: '400',
//     },
//     headerTitle: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: '#111827',
//         textAlign: 'center',
//         flex: 1,
//     },
//     headerRight: {
//         width: 60,
//     },
//     refreshButton: {
//         padding: 8,
//     },
//     refreshIcon: {
//         fontSize: 20,
//         color: '#D9A46C',
//         fontWeight: '600',
//     },

//     errorBanner: {
//         backgroundColor: '#FEE2E2',
//         marginHorizontal: 16,
//         marginTop: 10,
//         padding: 12,
//         borderRadius: 12,
//         borderWidth: 1,
//         borderColor: '#FCA5A5',
//     },

//     errorBannerText: {
//         fontSize: 14,
//         color: '#991B1B',
//         fontWeight: '500',
//         textAlign: 'center',
//     },
//     // Filters Container
//     filtersContainer: {
//         backgroundColor: '#FFFFFF',
//         marginHorizontal: 16,
//         marginTop: 16,
//         padding: 16,
//         borderRadius: 16,
//         shadowColor: '#1E3A5F',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.06,
//         shadowRadius: 8,
//         elevation: 3,
//     },
//     sectionTitle: {
//         fontSize: 16,
//         fontWeight: '700',
//         color: '#2A241E',
//         marginBottom: 12,
//     },
//     filterRow: {
//         marginBottom: 12,
//     },
//     filterToggle: {
//         paddingHorizontal: 16,
//         paddingVertical: 12,
//         borderRadius: 12,
//         backgroundColor: '#F1F5F9',
//         borderWidth: 1,
//         borderColor: '#E2E8F0',
//     },
//     filterToggleActive: {
//         backgroundColor: '#BCA382',
//         borderColor: '#BCA382',
//     },
//     filterToggleText: {
//         fontSize: 14,
//         color: '#64748B',
//         fontWeight: '600',
//         textAlign: 'center',
//     },
//     filterToggleTextActive: {
//         color: '#FFFFFF',
//         fontWeight: '700',
//     },
//     monthPickerButton: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         backgroundColor: '#FFFFFF',
//         paddingHorizontal: 16,
//         paddingVertical: 12,
//         borderRadius: 12,
//         borderWidth: 1,
//         borderColor: '#E2E8F0',
//         marginTop: 8,
//     },
//     monthPickerButtonText: {
//         fontSize: 14,
//         color: '#374151',
//         fontWeight: '500',
//     },
//     monthPickerButtonIcon: {
//         fontSize: 12,
//         color: '#6B7280',
//     },
//     roomMonthContainer: {
//         marginTop: 8,
//     },
//     roomNumberInput: {
//         backgroundColor: '#FFFFFF',
//         paddingHorizontal: 16,
//         paddingVertical: 12,
//         borderRadius: 12,
//         borderWidth: 1,
//         borderColor: '#E2E8F0',
//         fontSize: 14,
//         color: '#374151',
//         marginBottom: 8,
//     },
//     resetButton: {
//         backgroundColor: '#EF4444',
//         paddingHorizontal: 16,
//         paddingVertical: 12,
//         borderRadius: 12,
//         alignItems: 'center',
//         marginTop: 8,
//     },
//     resetButtonText: {
//         fontSize: 14,
//         color: '#FFFFFF',
//         fontWeight: '600',
//     },
//     // Month Picker Modal
//     monthPickerOverlay: {
//         flex: 1,
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     monthPickerContainer: {
//         backgroundColor: '#FFFFFF',
//         borderRadius: 20,
//         width: '90%',
//         maxWidth: 400,
//     },
//     monthPickerHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         padding: 20,
//         borderBottomWidth: 1,
//         borderBottomColor: '#E5E7EB',
//     },
//     monthPickerTitle: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: '#111827',
//     },
//     monthPickerCloseButton: {
//         width: 32,
//         height: 32,
//         borderRadius: 16,
//         backgroundColor: '#F3F4F6',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     monthPickerCloseText: {
//         fontSize: 16,
//         color: '#6B7280',
//         fontWeight: '600',
//     },
//     dateTimePicker: {
//         height: 200,
//     },
//     monthPickerFooter: {
//         padding: 20,
//         borderTopWidth: 1,
//         borderTopColor: '#E5E7EB',
//     },
//     monthPickerDoneButton: {
//         backgroundColor: '#BCA382',
//         paddingVertical: 14,
//         borderRadius: 12,
//         alignItems: 'center',
//     },
//     monthPickerDoneText: {
//         fontSize: 16,
//         color: '#FFFFFF',
//         fontWeight: '600',
//     },
//     // Facility Type Filter Styles
//     facilityTypeContainer: {
//         marginHorizontal: 16,
//         marginTop: 16,
//     },
//     facilityTypeButtonsContainer: {
//         flexDirection: 'row',
//         paddingVertical: 4,
//     },
//     facilityTypeButton: {
//         paddingHorizontal: 20,
//         paddingVertical: 12,
//         borderRadius: 12,
//         backgroundColor: '#F1F5F9',
//         marginRight: 10,
//         minHeight: 44,
//         justifyContent: 'center',
//         borderWidth: 1,
//         borderColor: '#E2E8F0',
//         shadowColor: '#1E3A5F',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.05,
//         shadowRadius: 4,
//         elevation: 2,
//     },
//     facilityTypeButtonActive: {
//         backgroundColor: '#BCA382',
//         borderColor: '#BCA382',
//     },
//     facilityTypeButtonText: {
//         fontSize: 14,
//         color: '#64748B',
//         fontWeight: '600',
//     },
//     facilityTypeButtonTextActive: {
//         color: '#FFFFFF',
//         fontWeight: '700',
//     },
//     // Stats Styles
//     statsWrapper: {
//         marginHorizontal: 16,
//         marginTop: 16,
//         gap: 12,
//     },
//     statCardPrimary: {
//         backgroundColor: '#2A241E',
//         borderRadius: 20,
//         padding: 20,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 8 },
//         shadowOpacity: 0.25,
//         shadowRadius: 16,
//         elevation: 8,
//     },
//     statCardPrimaryHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 16,
//     },
//     statCardPrimaryTitle: {
//         fontSize: 14,
//         color: '#94A3B8',
//         fontWeight: '500',
//     },
//     statCardBadge: {
//         backgroundColor: '#3D352D',
//         paddingHorizontal: 12,
//         paddingVertical: 6,
//         borderRadius: 8,
//         borderWidth: 1,
//         borderColor: '#D9A46C',
//     },
//     statCardBadgeText: {
//         fontSize: 14,
//         color: '#D9A46C',
//         fontWeight: '700',
//     },
//     statCardPrimaryContent: {
//         flexDirection: 'row',
//         alignItems: 'baseline',
//         marginBottom: 16,
//     },
//     statCardPrimaryNumber: {
//         fontSize: 52,
//         fontWeight: 'bold',
//         color: '#FFFFFF',
//         marginRight: 8,
//     },
//     statCardPrimarySubtitle: {
//         fontSize: 18,
//         color: '#94A3B8',
//         fontWeight: '500',
//     },
//     progressBarContainer: {
//         height: 6,
//         backgroundColor: '#334155',
//         borderRadius: 3,
//         overflow: 'hidden',
//     },
//     progressBar: {
//         height: '100%',
//         backgroundColor: '#D9A46C',
//         borderRadius: 3,
//     },
//     statsRow: {
//         flexDirection: 'row',
//         gap: 12,
//     },
//     statCardSecondary: {
//         flex: 1,
//         backgroundColor: '#2A241E',
//         borderRadius: 20,
//         padding: 18,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 6 },
//         shadowOpacity: 0.2,
//         shadowRadius: 12,
//         elevation: 6,
//     },
//     statCardSecondaryTitle: {
//         fontSize: 16,
//         color: '#FFFFFF',
//         fontWeight: '600',
//         marginBottom: 4,
//     },
//     statCardSecondarySubtitle: {
//         fontSize: 12,
//         color: '#64748B',
//         fontWeight: '500',
//         marginBottom: 16,
//     },
//     statCardSecondaryNumber: {
//         fontSize: 36,
//         fontWeight: 'bold',
//         color: '#FFFFFF',
//     },
//     bookedNumber: {
//         color: '#D9A46C',
//     },
//     availableNumber: {
//         color: '#34D399',
//     },
//     // Room Type Filter Styles
//     roomTypeContainer: {
//         marginHorizontal: 16,
//         marginTop: 16,
//         backgroundColor: '#FFFFFF',
//         padding: 16,
//         borderRadius: 16,
//         shadowColor: '#1E3A5F',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.06,
//         shadowRadius: 8,
//         elevation: 3,
//     },
//     roomTypeButtonsContainer: {
//         flexDirection: 'row',
//         paddingVertical: 4,
//     },
//     roomTypeButton: {
//         paddingHorizontal: 16,
//         paddingVertical: 10,
//         borderRadius: 20,
//         backgroundColor: '#F1F5F9',
//         marginRight: 10,
//         minHeight: 38,
//         justifyContent: 'center',
//         borderWidth: 1,
//         borderColor: '#E2E8F0',
//     },
//     roomTypeButtonActive: {
//         backgroundColor: '#BCA382',
//         borderColor: '#BCA382',
//     },
//     roomTypeButtonText: {
//         fontSize: 13,
//         color: '#64748B',
//         fontWeight: '600',
//     },
//     roomTypeButtonTextActive: {
//         color: '#FFFFFF',
//         fontWeight: '700',
//     },
//     // Status Filter Styles
//     statusFilterContainer: {
//         marginHorizontal: 16,
//         marginTop: 16,
//         backgroundColor: '#FFFFFF',
//         padding: 16,
//         borderRadius: 16,
//         shadowColor: '#1E3A5F',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.06,
//         shadowRadius: 8,
//         elevation: 3,
//     },
//     statusFilterButtonsContainer: {
//         flexDirection: 'row',
//         paddingVertical: 4,
//     },
//     statusFilterButton: {
//         paddingHorizontal: 16,
//         paddingVertical: 10,
//         borderRadius: 20,
//         backgroundColor: '#F1F5F9',
//         marginRight: 10,
//         minHeight: 38,
//         justifyContent: 'center',
//         borderWidth: 1,
//         borderColor: '#E2E8F0',
//     },
//     statusFilterButtonActive: {
//         backgroundColor: '#BCA382',
//         borderColor: '#BCA382',
//     },
//     statusFilterButtonText: {
//         fontSize: 13,
//         color: '#64748B',
//         fontWeight: '600',
//     },
//     statusFilterButtonTextActive: {
//         color: '#FFFFFF',
//         fontWeight: '700',
//     },
//     legendContainer: {
//         backgroundColor: '#FFFFFF',
//         marginHorizontal: 16,
//         marginTop: 16,
//         padding: 16,
//         borderRadius: 16,
//         shadowColor: '#1E3A5F',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.06,
//         shadowRadius: 8,
//         elevation: 3,
//     },
//     legendTitle: {
//         fontSize: 16,
//         fontWeight: '700',
//         color: '#2A241E',
//         marginBottom: 14,
//     },
//     legendItems: {
//         flexDirection: 'row',
//         flexWrap: 'wrap',
//         gap: 20,
//     },
//     legendItem: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 10,
//     },
//     legendDot: {
//         width: 14,
//         height: 14,
//         borderRadius: 7,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.15,
//         shadowRadius: 4,
//         elevation: 2,
//     },
//     legendDotBooking: {
//         backgroundColor: '#002f79ff',
//     },
//     legendDotReservation: {
//         backgroundColor: '#F59E0B',
//     },
//     legendDotOutOfService: {
//         backgroundColor: '#EF4444',
//     },
//     legendText: {
//         fontSize: 14,
//         color: '#475569',
//         fontWeight: '500',
//     },
//     // Calendar Styles
//     calendarCard: {
//         backgroundColor: '#FFFFFF',
//         marginHorizontal: 16,
//         marginTop: 16,
//         marginBottom: 24,
//         borderRadius: 20,
//         shadowColor: '#1E3A5F',
//         shadowOffset: { width: 0, height: 6 },
//         shadowOpacity: 0.1,
//         shadowRadius: 16,
//         elevation: 6,
//         overflow: 'hidden',
//         paddingBottom: 10,
//     },
//     calendar: {
//         borderRadius: 20,
//     },
//     // Custom Day Styles
//     dayWrapper: {
//         width: 45,
//         height: 45,
//         alignItems: 'center',
//         justifyContent: 'center'
//     },
//     dayContainer: {
//         width: 38,
//         height: 38,
//         borderRadius: 19,
//         alignItems: 'center',
//         justifyContent: 'center',
//         position: 'relative',
//     },
//     todayContainer: {
//         borderWidth: 1.5,
//         borderColor: '#002f79ff' // Blue for today
//     },
//     hasEventsContainer: {
//         // Additional styles for days with events
//     },
//     dayText: {
//         fontSize: 15,
//         color: '#374151',
//         fontWeight: '500',
//     },
//     disabledDayText: {
//         color: '#D1D5DB',
//     },
//     todayText: {
//         color: '#002f79ff', // Blue for today
//         fontWeight: '700',
//     },
//     selectedDayText: {
//         color: '#FFFFFF',
//         fontWeight: '700',
//     },
//     // Badge Styles
//     eventBadge: {
//         position: 'absolute',
//         top: -2,
//         right: -2,
//         backgroundColor: '#002f79ff', // Blue badge
//         width: 16,
//         height: 16,
//         borderRadius: 8,
//         borderWidth: 2,
//         borderColor: '#FFFFFF',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     eventBadgeHigh: {
//         backgroundColor: '#EF4444',
//     },
//     eventBadgeMedium: {
//         backgroundColor: '#F59E0B',
//     },
//     eventBadgeText: {
//         color: '#FFFFFF',
//         fontSize: 8,
//         fontWeight: 'bold',
//     },
//     // Modal Styles
//     modalOverlay: {
//         flex: 1,
//         backgroundColor: 'rgba(15, 23, 42, 0.6)',
//         justifyContent: 'flex-end',
//     },

//     modalHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingVertical: 18,
//         paddingHorizontal: 24,
//         borderBottomWidth: 1,
//         borderBottomColor: '#E2E8F0',
//     },
//     modalTitle: {
//         fontSize: 20,
//         fontWeight: '700',
//         color: '#1E293B',
//     },
//     modalCloseButton: {
//         width: 36,
//         height: 36,
//         borderRadius: 18,
//         backgroundColor: '#F1F5F9',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     modalCloseText: {
//         fontSize: 18,
//         color: '#64748B',
//         fontWeight: '600',
//     },
//     modalSubtitle: {
//         fontSize: 14,
//         color: '#64748B',
//         paddingHorizontal: 24,
//         paddingVertical: 12,
//         backgroundColor: '#F8FAFC',
//         borderBottomWidth: 1,
//         borderBottomColor: '#E2E8F0',
//     },
//     modalContent: {
//         padding: 24,
//         maxHeight: 400,
//     },
//     modalFooter: {
//         padding: 20,
//         paddingBottom: 34,
//         borderTopWidth: 1,
//         borderTopColor: '#E2E8F0',
//     },
//     modalButton: {
//         backgroundColor: '#BCA382',
//         paddingVertical: 16,
//         borderRadius: 14,
//         alignItems: 'center',
//         shadowColor: '#BCA382',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.3,
//         shadowRadius: 8,
//         elevation: 4,
//     },
//     modalButtonText: {
//         color: '#FFFFFF',
//         fontSize: 16,
//         fontWeight: '700',
//     },
//     // Room List Styles
//     roomsList: {
//         flex: 1,
//         width: '100%',
//     },
//     roomsListContent: {
//         padding: 16,
//         paddingBottom: 80,
//     },
//     emptyListContent: {
//         flexGrow: 1,
//         justifyContent: 'center',
//     },

//     emptyListContainer: {
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: 40,
//     },
//     emptyListTitle: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: '#374151',
//         marginBottom: 8,
//     },
//     emptyListText: {
//         fontSize: 14,
//         color: '#6B7280',
//         textAlign: 'center',
//         lineHeight: 20,
//     },
//     periodCard: {
//         padding: 18,
//         backgroundColor: '#F8FAFC',
//         borderRadius: 14,
//         marginBottom: 14,
//         borderWidth: 1,
//         borderColor: '#E2E8F0',
//     },
//     periodCardHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 14,
//     },
//     periodFacilityName: {
//         fontSize: 17,
//         fontWeight: '700',
//         color: '#1E293B',
//         flex: 1,
//     },
//     periodBadge: {
//         paddingHorizontal: 12,
//         paddingVertical: 6,
//         borderRadius: 20,
//     },
//     periodBadgeText: {
//         fontSize: 11,
//         fontWeight: '700',
//         letterSpacing: 0.3,
//     },
//     periodDetail: {
//         fontSize: 14,
//         color: '#64748B',
//         marginBottom: 8,
//         lineHeight: 20,
//     },
//     paymentStatusContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 10,
//         marginTop: 10,
//         paddingTop: 10,
//         borderTopWidth: 1,
//         borderTopColor: '#E2E8F0',
//     },
//     paymentBadge: {
//         paddingHorizontal: 12,
//         paddingVertical: 6,
//         borderRadius: 20,
//     },
//     paymentBadgeText: {
//         fontSize: 11,
//         fontWeight: '700',
//         letterSpacing: 0.3,
//     },
//     listHeader: {
//         fontSize: 14,
//         color: '#64748B',
//         marginBottom: 12,
//         fontWeight: '500',
//         textAlign: 'center',
//     },

//     // Make room items more visible
//     roomItemContainer: {
//         backgroundColor: '#FFFFFF',
//         borderRadius: 12,
//         padding: 16,
//         marginBottom: 12,
//         borderWidth: 1,
//         borderColor: '#E2E8F0',
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//         elevation: 3,
//     },

//     roomItemHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 12,
//     },

//     roomNumber: {
//         fontSize: 18,
//         fontWeight: '700',
//         color: '#1E293B',
//     },

//     roomType: {
//         fontSize: 12,
//         fontWeight: '600',
//         color: '#FFFFFF',
//         backgroundColor: '#BCA382',
//         paddingHorizontal: 10,
//         paddingVertical: 4,
//         borderRadius: 6,
//     },

//     roomDetails: {
//         marginTop: 4,
//     },

//     roomDetailText: {
//         fontSize: 14,
//         color: '#475569',
//         marginBottom: 6,
//         lineHeight: 20,
//     },

//     roomRate: {
//         fontSize: 15,
//         color: '#2A241E',
//         fontWeight: '600',
//         marginTop: 8,
//         paddingTop: 8,
//         borderTopWidth: 1,
//         borderTopColor: '#E2E8F0',
//     },

//     // Make modal container taller
//     modalContainer: {
//         backgroundColor: '#FFFFFF',
//         borderTopLeftRadius: 28,
//         borderTopRightRadius: 28,
//         height: '90%', // Changed from maxHeight to height
//         maxHeight: '90%',
//     },

//     // Add this to ensure modal content area takes space
//     modalContentArea: {
//         flex: 1,
//     },
//     notch: {
//         paddingTop: 45,
//         paddingBottom: 20,
//         paddingHorizontal: 20,
//         borderBottomEndRadius: 30,
//         borderBottomStartRadius: 30,
//         overflow: 'hidden',
//         minHeight: 120,
//     },
//     notchImage: {
//         resizeMode: 'cover',
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         borderBottomLeftRadius: 25,
//         borderBottomRightRadius: 25,
//     },
//     notchContent: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//     },
//     backButtonNotch: {
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginLeft: 10,
//     },
//     headerTitleContainer: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     headerTitleNotch: {
//         fontSize: 22,
//         fontWeight: 'bold',
//         color: '#000',
//         textAlign: 'center',
//     },
//     welcomeTextSmall: {
//         fontSize: 14,
//         color: '#333',
//         textAlign: 'center',
//         marginTop: 2,
//     },
// });

// export default calender;


import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
    RefreshControl,
    ActivityIndicator,
    SafeAreaView,
    Alert,
    Dimensions,
    Platform,
    StatusBar,
    TextInput,
    FlatList,
    ImageBackground,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../auth/contexts/AuthContext';
import { calendarAPI } from '../../config/apis';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameDay,
    addMonths,
    subMonths,
    addDays,
    differenceInDays,
    isWithinInterval,
    addWeeks,
    subWeeks
} from 'date-fns';
import {
    Bed,
    Building,
    Trees,
    Camera,
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Users,
    Info,
    AlertTriangle,
    Clock,
    CheckCircle,
    XCircle,
    Menu,
    X,
    Search,
    RefreshCw,
    MapPin,
    DollarSign
} from 'lucide-react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Fixed Date Utilities
const dateUtils = {
    format: (date, formatStr) => {
        if (!date) return '';
        const d = new Date(date);
        if (isNaN(d.getTime())) return '';

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const fullMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const fullDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        if (formatStr === 'MMM d') {
            return `${months[d.getMonth()]} ${d.getDate()}`;
        } else if (formatStr === 'EEE') {
            return days[d.getDay()];
        } else if (formatStr === 'MMM d, yyyy') {
            return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
        } else if (formatStr === 'MMMM d, yyyy') {
            return `${fullMonths[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
        } else if (formatStr === 'EEEE, MMMM d, yyyy') {
            return `${fullDays[d.getDay()]}, ${fullMonths[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
        } else if (formatStr === 'yyyy-MM-dd') {
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        } else if (formatStr === 'MMMM yyyy') {
            return `${fullMonths[d.getMonth()]} ${d.getFullYear()}`;
        } else if (formatStr === 'MM/yyyy') {
            const month = String(d.getMonth() + 1).padStart(2, '0');
            return `${month}/${d.getFullYear()}`;
        } else if (formatStr === 'dd') {
            return String(d.getDate());
        } else if (formatStr === 'dd/MM/yyyy') {
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            return `${day}/${month}/${year}`;
        }
        return d.toDateString();
    },

    parseISO: (dateString) => {
        if (!dateString) return new Date();
        try {
            let date;
            if (typeof dateString === 'string') {
                if (dateString.includes('T')) {
                    date = new Date(dateString);
                } else if (dateString.includes('-')) {
                    // Handle YYYY-MM-DD format
                    const parts = dateString.split('-');
                    if (parts.length === 3) {
                        date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
                    } else {
                        date = new Date(dateString);
                    }
                } else {
                    date = new Date(dateString);
                }
            } else if (dateString instanceof Date) {
                date = new Date(dateString);
            } else if (dateString.timestamp) {
                date = new Date(dateString.timestamp);
            } else {
                date = new Date();
            }

            if (isNaN(date.getTime())) {
                console.warn('Invalid date string:', dateString);
                return new Date();
            }
            return date;
        } catch (error) {
            console.error('Error parsing date:', error);
            return new Date();
        }
    },

    isSameDay: (date1, date2) => {
        if (!date1 || !date2) return false;
        const d1 = dateUtils.parseISO(date1);
        const d2 = dateUtils.parseISO(date2);
        if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return false;
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    },

    startOfMonth: (date) => {
        const result = new Date(date);
        result.setDate(1);
        result.setHours(0, 0, 0, 0);
        return result;
    },

    endOfMonth: (date) => {
        const result = new Date(date);
        result.setMonth(result.getMonth() + 1);
        result.setDate(0);
        result.setHours(23, 59, 59, 999);
        return result;
    },

    addDays: (date, days) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    },

    startOfDay: (date) => {
        const result = new Date(date);
        result.setHours(0, 0, 0, 0);
        return result;
    },

    endOfDay: (date) => {
        const result = new Date(date);
        result.setHours(23, 59, 59, 999);
        return result;
    },

    isDateBetween: (date, startDate, endDate) => {
        const checkDate = dateUtils.startOfDay(date);
        const start = dateUtils.startOfDay(startDate);
        const end = dateUtils.endOfDay(endDate);
        return checkDate >= start && checkDate <= end;
    }
};

// Robust Date Parsing Utility
const parseBookingDate = (dateString) => {
    if (!dateString) return new Date();

    // Handle different date formats
    let date;

    // If it's a Date object already
    if (dateString instanceof Date) return dateString;

    // If it's a string with T (ISO format)
    if (typeof dateString === 'string' && dateString.includes('T')) {
        date = new Date(dateString);
    }
    // If it's just a date string
    else if (typeof dateString === 'string') {
        // Try parsing as ISO
        date = new Date(dateString);

        // If invalid, try adding time
        if (isNaN(date.getTime())) {
            date = new Date(dateString + 'T00:00:00');
        }
    }
    // If it's a number (timestamp)
    else if (typeof dateString === 'number') {
        date = new Date(dateString);
    }

    // If still invalid, return today
    if (!date || isNaN(date.getTime())) {
        console.warn('Invalid date, using today:', dateString);
        return new Date();
    }

    return date;
};

// Data Normalization Helper
const normalizeEvents = (facilities, facilityType) => {
    const normalized = [];
    facilities.forEach(facility => {
        const periods = [];

        // Bookings logic
        if (facility.bookings && Array.isArray(facility.bookings)) {
            facility.bookings.forEach((item, index) => {
                const booking = facilityType === 'ROOMS' ? item.booking : item;
                if (!booking) return;

                let start, end;
                try {
                    if (facilityType === 'ROOMS') {
                        start = parseBookingDate(booking.checkIn);
                        end = parseBookingDate(booking.checkOut);
                    } else if (facilityType === 'PHOTOSHOOTS') {
                        start = parseBookingDate(booking.startTime || booking.bookingDate);
                        end = parseBookingDate(booking.endTime || booking.bookingDate);
                    } else {
                        // HALLS and LAWNS (Flat structure)
                        start = parseBookingDate(booking.bookingDate);
                        if (booking.endDate) {
                            end = parseBookingDate(booking.endDate);
                        } else if (booking.numberOfDays > 1) {
                            end = addDays(start, booking.numberOfDays - 1);
                        } else {
                            end = parseBookingDate(booking.bookingDate);
                        }
                    }
                } catch (e) {
                    console.error("Error parsing dates for booking:", booking.id, e);
                    return;
                }


                if (isNaN(start.getTime()) || isNaN(end.getTime())) return;

                periods.push({
                    id: `booking-${booking.id}`,
                    type: 'booking',
                    start,
                    end,
                    status: booking.paymentStatus || 'PENDING',
                    title: booking.memberName || booking.guestName || 'Guest',
                    data: booking
                });
            });
        }

        // Reservations logic
        if (facility.reservations && Array.isArray(facility.reservations)) {
            facility.reservations.forEach(res => {
                const start = parseBookingDate(res.reservedFrom);
                const end = parseBookingDate(res.reservedTo);
                if (isNaN(start.getTime()) || isNaN(end.getTime())) return;

                periods.push({
                    id: `res-${res.id}`,
                    type: 'reservation',
                    start,
                    end,
                    status: 'RESERVED',
                    title: res.admin?.name || 'Reserved',
                    data: res
                });
            });
        }

        // Out of Orders logic
        if (facility.outOfOrders && Array.isArray(facility.outOfOrders)) {
            facility.outOfOrders.forEach(ooo => {
                const start = parseBookingDate(ooo.startDate);
                const end = parseBookingDate(ooo.endDate);
                if (isNaN(start.getTime()) || isNaN(end.getTime())) return;

                periods.push({
                    id: `ooo-${ooo.id}`,
                    type: 'maintenance',
                    start,
                    end,
                    status: 'MAINTENANCE',
                    title: ooo.reason || 'Maintenance',
                    data: ooo
                });
            });
        }

        normalized.push({
            id: facility.id,
            name: getFacilityDisplayName(facility, facilityType),
            type: facilityType,
            category: facility.roomType?.type || '',
            capacity: facility.capacity || facility.maxGuests || 0,
            periods: periods.filter(p => p.start !== null)
        });
    });

    return normalized;
};

const getFacilityDisplayName = (facility, type) => {
    switch (type) {
        case 'ROOMS': return `Room ${facility.roomNumber || facility.roomNo}`;
        case 'HALLS': return facility.name || `Hall ${facility.id}`;
        case 'LAWNS': return facility.description || `Lawn ${facility.id}`;
        case 'PHOTOSHOOTS': return facility.description || `Shoot ${facility.id}`;
        default: return 'Facility';
    }
};

// Horizontal Timeline Scheduler Component
const HorizontalTimeline = ({ facilities, dateRange, dayWidth = 70, onEventPress, selectedFacilityType }) => {
    const timelineStart = dateRange[0];
    const timelineEnd = dateRange[dateRange.length - 1];

    const getStatusColor = (type, status) => {
        if (type === 'maintenance') return '#EF4444';
        if (type === 'reservation') return '#F59E0B';
        if (status === 'PAID') return '#002f79';
        if (status === 'HALF_PAID') return '#3B82F6';
        return '#93C5FD'; // UNPAID/Pending
    };

    const renderFacilityRow = ({ item: facility }) => {
        return (
            <View style={styles.timelineRow}>
                {/* Facility Label (Fixed Left Area) */}
                <View style={styles.facilityLabelArea}>
                    <Text style={styles.facilityNameText} numberOfLines={1}>
                        {facility.name}
                    </Text>
                    <View style={styles.facilitySubDetails}>
                        {facility.category ? (
                            <Text style={styles.facilityCategoryText} numberOfLines={1}>
                                {facility.category}
                            </Text>
                        ) : null}
                        {facility.capacity > 0 ? (
                            <View style={styles.capacityBadge}>
                                <Users size={10} color="#64748B" />
                                <Text style={styles.capacityTextMini}>{facility.capacity}</Text>
                            </View>
                        ) : null}
                    </View>
                </View>

                {/* Grid and Bars Area */}
                <View style={[styles.timelineGrid, { width: dateRange.length * dayWidth }]}>
                    {/* Vertical Hour/Day Lines */}
                    {dateRange.map((date, idx) => (
                        <View
                            key={idx}
                            style={[
                                styles.timelineGridLine,
                                { left: idx * dayWidth, width: dayWidth },
                                isSameDay(date, new Date()) && styles.timelineTodayLine
                            ]}
                        />
                    ))}

                    {/* Timeline Bars */}
                    {facility.periods.map((period, index) => {
                        // Check overlap with visible range
                        const overlaps = (() => {
                            const periodStart = period.start;
                            const periodEnd = period.end;

                            // Simple overlap check: periods overlap if one starts before the other ends
                            const doesOverlap = periodStart <= timelineEnd && periodEnd >= timelineStart;

                            return doesOverlap;
                        })();

                        if (!overlaps) return null;

                        const clippedStart = period.start < timelineStart ? timelineStart : period.start;
                        const clippedEnd = period.end > timelineEnd ? timelineEnd : period.end;

                        const startOffset = differenceInDays(clippedStart, timelineStart);
                        const duration = differenceInDays(clippedEnd, clippedStart) + 1;

                        const left = startOffset * dayWidth;
                        const width = duration * dayWidth;

                        return (
                            <TouchableOpacity
                                key={period.id}
                                activeOpacity={0.8}
                                onPress={() => onEventPress(period, facility)}
                                style={[
                                    styles.horizontalBar,
                                    {
                                        left,
                                        width: width - 4,
                                        backgroundColor: getStatusColor(period.type, period.status),
                                        zIndex: period.type === 'maintenance' ? 10 : 5,
                                        top: period.type === 'booking' ? 10 : 35
                                    }
                                ]}
                            >
                                <Text style={styles.horizontalBarText} numberOfLines={1}>
                                    {period.title}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        );
    };

    return (
        <View style={styles.timelineWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View>
                    {/* Timeline Header Row (Dates) */}
                    <View style={styles.timelineHeaderRow}>
                        <View style={styles.facilityLabelArea}>
                            <Text style={styles.timelineHeaderLabel}>Facility</Text>
                        </View>
                        {dateRange.map((date, idx) => (
                            <View key={idx} style={[styles.timelineDateHeader, { width: dayWidth }, isSameDay(date, new Date()) && styles.todayHeaderCell]}>
                                <Text style={styles.timelineDateText}>{format(date, 'MMM d')}</Text>
                                <Text style={styles.timelineDayText}>{format(date, 'EEE')}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Facility Rows List */}
                    <View style={{ flex: 1 }}>
                        <FlatList
                            data={facilities}
                            renderItem={renderFacilityRow}
                            keyExtractor={item => `${item.id}-${item.type}`}
                            scrollEnabled={false}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

// Custom Day Component to fix text rendering warnings
const CustomDayComponent = React.memo(({ date, state, marking, onDatePress, selectedStatusFilter, getStatusColor }) => {
    const isToday = dateUtils.isSameDay(new Date(), date.dateString);
    const isSelected = marking?.selected;
    const count = marking?._count || 0;

    return (
        <TouchableOpacity
            style={styles.dayWrapper}
            onPress={() => onDatePress(date.dateString)}
            activeOpacity={0.7}
            disabled={state === 'disabled'}
        >
            <View style={[
                styles.dayContainer,
                isToday && !isSelected && styles.todayContainer,
                isSelected && { backgroundColor: getStatusColor(selectedStatusFilter) }
            ]}>
                <Text style={[
                    styles.dayText,
                    state === 'disabled' && styles.disabledDayText,
                    isToday && !isSelected && styles.todayText,
                    isSelected && styles.selectedDayText
                ]}>
                    {String(date.day)}
                </Text>

                {count > 0 && (
                    <View style={[
                        styles.eventBadge,
                        count > 9 && styles.eventBadgeHigh,
                        count > 5 && count <= 9 && styles.eventBadgeMedium
                    ]}>
                        <Text style={styles.eventBadgeText}>
                            {count}
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
});

const calender = ({ navigation }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedFacilityType, setSelectedFacilityType] = useState('ROOMS');
    const [selectedRoomType, setSelectedRoomType] = useState('ALL');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('CALENDAR'); // 'CALENDAR' or 'TIMELINE'

    const dateRange = useMemo(() => {
        const start = startOfMonth(currentDate);
        const end = endOfMonth(currentDate);
        return eachDayOfInterval({ start, end });
    }, [currentDate]);

    // Filter states
    const [searchByMonth, setSearchByMonth] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [showMonthPicker, setShowMonthPicker] = useState(false);
    const [searchByRoomMonth, setSearchByRoomMonth] = useState(false);
    const [selectedRoomNumber, setSelectedRoomNumber] = useState('');

    // Data states
    const [rooms, setRooms] = useState([]);
    const [halls, setHalls] = useState([]);
    const [lawns, setLawns] = useState([]);
    const [photoshoots, setPhotoshoots] = useState([]);

    // Modal states
    const [availableModalVisible, setAvailableModalVisible] = useState(false);
    const [bookedModalVisible, setBookedModalVisible] = useState(false);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [bookedRooms, setBookedRooms] = useState([]);

    // Status filter state
    const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
    const [selectedPeriod, setSelectedPeriod] = useState(null);

    const { user } = useAuth();



    // Helper function for status colors
    const getStatusColor = (status) => {
        switch (status) {
            case 'AVAILABLE': return '#10B981';
            case 'BOOKED': return '#002f79ff';
            case 'RESERVED': return '#F59E0B';
            case 'MAINTENANCE': return '#EF4444';
            default: return '#002f79ff';
        }
    };

    // Helper function to get facility status on a specific date
    const getFacilityStatusOnDate = useCallback((facility, date) => {
        try {
            const checkDate = dateUtils.startOfDay(date);

            // 1. Check out of orders (MAINTENANCE - highest priority)
            if (facility.outOfOrders && Array.isArray(facility.outOfOrders)) {
                for (const order of facility.outOfOrders) {
                    if (!order) continue;

                    const startDate = order.startDate ? dateUtils.parseISO(order.startDate) : null;
                    const endDate = order.endDate ? dateUtils.parseISO(order.endDate) : null;

                    if (startDate && endDate) {
                        if (checkDate >= dateUtils.startOfDay(startDate) &&
                            checkDate <= dateUtils.endOfDay(endDate)) {
                            return 'MAINTENANCE';
                        }
                    }
                }
            }

            // 2. Check bookings (BOOKED - second priority)
            if (facility.bookings && Array.isArray(facility.bookings)) {
                for (const booking of facility.bookings) {
                    if (!booking) continue;

                    // Skip cancelled bookings
                    const isCancelled =
                        booking.paymentStatus === 'CANCELLED' ||
                        booking.status === 'CANCELLED' ||
                        booking.bookingStatus === 'CANCELLED';

                    if (isCancelled) continue;

                    // Handle nested booking for ROOMS or flat for others
                    const b = booking.booking || booking;

                    const checkIn = (b.checkIn || b.bookingDate) ?
                        dateUtils.parseISO(b.checkIn || b.bookingDate) : null;
                    const checkOut = (b.checkOut || b.endDate || b.bookingDate) ?
                        dateUtils.parseISO(b.checkOut || b.endDate || b.bookingDate) : null;

                    if (checkIn && checkOut) {
                        if (checkDate >= dateUtils.startOfDay(checkIn) &&
                            checkDate <= dateUtils.endOfDay(checkOut)) {
                            return 'BOOKED';
                        }
                    }
                }
            }

            // 3. Check reservations (RESERVED - third priority)
            if (facility.reservations && Array.isArray(facility.reservations)) {
                for (const reservation of facility.reservations) {
                    if (!reservation) continue;

                    const reservedFrom = reservation.reservedFrom ?
                        dateUtils.parseISO(reservation.reservedFrom) : null;
                    const reservedTo = reservation.reservedTo ?
                        dateUtils.parseISO(reservation.reservedTo) : null;

                    if (reservedFrom && reservedTo) {
                        if (checkDate >= dateUtils.startOfDay(reservedFrom) &&
                            checkDate <= dateUtils.endOfDay(reservedTo)) {
                            return 'RESERVED';
                        }
                    }
                }
            }

            // 4. Default to AVAILABLE
            return 'AVAILABLE';
        } catch (error) {
            console.error('Error in getFacilityStatusOnDate:', error);
            return 'AVAILABLE';
        }
    }, []);

    // Build API params based on filters
    const getApiParams = useCallback(() => {
        const params = {};

        if (searchByMonth && selectedMonth) {
            const startOfMonth = dateUtils.startOfMonth(selectedMonth);
            const endOfMonth = dateUtils.endOfMonth(selectedMonth);
            params.startDate = dateUtils.format(startOfMonth, 'yyyy-MM-dd');
            params.endDate = dateUtils.format(endOfMonth, 'yyyy-MM-dd');
        }

        if (searchByRoomMonth && selectedRoomNumber) {
            params.roomNumber = selectedRoomNumber;
        }

        return params;
    }, [searchByMonth, selectedMonth, searchByRoomMonth, selectedRoomNumber]);

    // Fetch data function
    const fetchData = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const params = getApiParams();

            // Use getAllCalendarData to get normalized data
            const allData = await calendarAPI.getAllCalendarData(params);

            // Set all data
            setRooms(allData.rooms || []);
            setHalls(allData.halls || []);
            setLawns(allData.lawns || []);
            setPhotoshoots(allData.photoshoots || []);

        } catch (error) {
            console.error('Error fetching calendar data:', error);
            setError(error.message || 'Failed to load calendar data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user, getApiParams]);

    // Initial load
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Refresh function
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData();
    }, [fetchData]);

    // Get current facility data
    const getCurrentFacilities = () => {
        switch (selectedFacilityType) {
            case 'ROOMS':
                return rooms;
            case 'HALLS':
                return halls;
            case 'LAWNS':
                return lawns;
            case 'PHOTOSHOOTS':
                return photoshoots;
            default:
                return [];
        }
    };

    // Filter rooms based on selection
    const filteredRooms = useMemo(() => {
        return rooms.filter(room => {
            const typeMatch = selectedRoomType === 'ALL' || room.roomType?.type === selectedRoomType;
            return typeMatch;
        });
    }, [rooms, selectedRoomType]);

    // Get facilities to display
    const getFacilitiesForDisplay = useMemo(() => {
        let facilities = [];
        if (selectedFacilityType === 'ROOMS') {
            facilities = filteredRooms;
        } else {
            facilities = getCurrentFacilities();
        }

        // Apply status filter to the facilities list
        if (selectedStatusFilter === 'ALL') {
            return facilities;
        } else {
            const today = new Date(); // Or the currently selected date if applicable
            return facilities.filter(facility => {
                const status = getFacilityStatusOnDate(facility, today);
                return status === selectedStatusFilter;
            });
        }
    }, [selectedFacilityType, filteredRooms, getCurrentFacilities, selectedStatusFilter, getFacilityStatusOnDate]);

    const normalizedFacilities = useMemo(() => {
        return normalizeEvents(getFacilitiesForDisplay, selectedFacilityType);
    }, [getFacilitiesForDisplay, selectedFacilityType]);

    // Function to check if a room is booked for today
    const isRoomBookedToday = useCallback((room) => {
        try {
            const today = new Date();
            const status = getFacilityStatusOnDate(room, today);
            return status === 'BOOKED';
        } catch (error) {
            console.error('Error in isRoomBookedToday:', error);
            return false;
        }
    }, [getFacilityStatusOnDate]);

    // Function to show available rooms/facilities modal
    const showAvailableRoomsModal = useCallback(() => {
        const facilities = getCurrentFacilities();
        const available = facilities.filter(facility => {
            const status = getFacilityStatusOnDate(facility, new Date());
            return status === 'AVAILABLE';
        });

        setAvailableRooms(available);
        setAvailableModalVisible(true);
    }, [getCurrentFacilities, getFacilityStatusOnDate]);

    // Function to show booked rooms/facilities modal
    const showBookedRoomsModal = useCallback(() => {
        const facilities = getCurrentFacilities();
        const booked = facilities.filter(facility => {
            const status = getFacilityStatusOnDate(facility, new Date());
            return status === 'BOOKED';
        });

        setBookedRooms(booked);
        setBookedModalVisible(true);
    }, [getCurrentFacilities, getFacilityStatusOnDate]);

    // Generate marked dates for calendar view
    const markedDates = useMemo(() => {
        const facilities = getCurrentFacilities(); // Use all facilities for marking, then filter for display
        const marks = {};

        if (!facilities || facilities.length === 0) {
            return marks;
        }

        // Date range for the current calendar view
        const start = dateUtils.startOfMonth(currentDate);
        const end = dateUtils.endOfMonth(currentDate);

        // Loop through each day of the month
        for (let day = new Date(start); day <= end; day = dateUtils.addDays(day, 1)) {
            const dateString = dateUtils.format(day, 'yyyy-MM-dd');
            let count = 0;

            // Count facilities based on status filter
            facilities.forEach(facility => {
                const status = getFacilityStatusOnDate(facility, day);

                if (selectedStatusFilter === 'ALL') {
                    // Count all non-available facilities
                    if (status !== 'AVAILABLE') {
                        count++;
                    }
                } else if (selectedStatusFilter === 'AVAILABLE') {
                    // Count available facilities
                    if (status === 'AVAILABLE') {
                        count++;
                    }
                } else {
                    // Count specific status
                    if (status === selectedStatusFilter) {
                        count++;
                    }
                }
            });

            if (count > 0) {
                marks[dateString] = {
                    selected: true,
                    selectedColor: getStatusColor(selectedStatusFilter),
                    selectedTextColor: '#FFFFFF',
                    customStyles: {
                        container: {
                            backgroundColor: getStatusColor(selectedStatusFilter),
                            borderRadius: 20,
                        },
                        text: {
                            color: '#FFFFFF',
                            fontWeight: 'bold',
                        }
                    },
                    _count: count // Using _count to avoid conflicts with calendar library
                };
            }
        }

        // Always mark today
        const todayString = dateUtils.format(new Date(), 'yyyy-MM-dd');
        if (!marks[todayString]) {
            marks[todayString] = {
                customStyles: {
                    container: {
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        borderColor: '#002f79ff',
                        borderRadius: 20,
                    },
                    text: {
                        color: '#002f79ff',
                        fontWeight: 'bold',
                    }
                }
            };
        }

        return marks;
    }, [getCurrentFacilities, selectedStatusFilter, currentDate, getFacilityStatusOnDate]);

    // Get events for a specific date
    const getEventsForDate = useCallback((dateString) => {
        const facilities = getCurrentFacilities(); // Use all facilities to get events
        const selectedDate = dateUtils.parseISO(dateString);
        const eventsOnDate = [];

        if (!facilities || facilities.length === 0) return eventsOnDate;

        facilities.forEach(facility => {
            const status = getFacilityStatusOnDate(facility, selectedDate);

            // Only add event if it matches the current status filter or if filter is 'ALL'
            if (selectedStatusFilter === 'ALL' || status === selectedStatusFilter) {
                eventsOnDate.push({
                    facility,
                    type: 'status',
                    status: status,
                    date: selectedDate
                });
            }
        });

        return eventsOnDate;
    }, [getCurrentFacilities, selectedStatusFilter, getFacilityStatusOnDate]);

    // Handle date press
    const handleDatePress = useCallback((dateString) => {
        const events = getEventsForDate(dateString);
        if (events.length > 0) {
            setSelectedPeriod({
                date: dateUtils.parseISO(dateString),
                events: events,
            });
        } else {
            setSelectedPeriod(null); // Clear selected period if no events
        }
    }, [getEventsForDate]);

    // Get facility type display name
    const getFacilityTypeName = (type) => {
        const names = {
            'ROOMS': 'Rooms',
            'HALLS': 'Halls',
            'LAWNS': 'Lawns',
            'PHOTOSHOOTS': 'Photoshoots',
        };
        return names[type] || 'Rooms';
    };

    const stats = useMemo(() => {
        const facilities = getCurrentFacilities(); // Use all facilities for stats
        const total = facilities.length;

        let booked = 0;
        let available = 0;
        let reserved = 0;
        let maintenance = 0;
        let totalBookings = 0;
        let activeBookings = 0;
        let cancelledBookings = 0;
        let upcomingBookings = 0;

        const today = new Date();

        facilities.forEach(facility => {
            const status = getFacilityStatusOnDate(facility, today);
            switch (status) {
                case 'BOOKED':
                    booked++;
                    break;
                case 'AVAILABLE':
                    available++;
                    break;
                case 'RESERVED':
                    reserved++;
                    break;
                case 'MAINTENANCE':
                    maintenance++;
                    break;
            }

            // Count all bookings for this facility
            if (facility.bookings && Array.isArray(facility.bookings)) {
                facility.bookings.forEach(booking => {
                    if (!booking) return;

                    totalBookings++;

                    const isCancelled =
                        booking.paymentStatus === 'CANCELLED' ||
                        booking.status === 'CANCELLED' ||
                        booking.bookingStatus === 'CANCELLED';

                    if (isCancelled) {
                        cancelledBookings++;
                        return;
                    }

                    // Check if booking is active (today is between check-in and check-out)
                    const checkIn = booking.checkIn ? dateUtils.parseISO(booking.checkIn) : null;
                    const checkOut = booking.checkOut ? dateUtils.parseISO(booking.checkOut) : null;

                    if (checkIn && checkOut) {
                        const isActive = today >= dateUtils.startOfDay(checkIn) &&
                            today <= dateUtils.endOfDay(checkOut);

                        if (isActive) {
                            activeBookings++;
                        } else if (checkIn > today) {
                            upcomingBookings++;
                        }
                    }
                });
            }
        });

        return {
            total,
            booked,
            available,
            reserved,
            maintenance,
            totalBookings,
            activeBookings,
            cancelledBookings,
            upcomingBookings,
            occupancyRate: total > 0 ? Math.round((booked / total) * 100) : 0,
            availabilityRate: total > 0 ? Math.round((available / total) * 100) : 0,
            bookingCancellationRate: totalBookings > 0 ?
                Math.round((cancelledBookings / totalBookings) * 100) : 0,
        };
    }, [getCurrentFacilities, getFacilityStatusOnDate]);

    const getStatForStatus = useCallback((status) => {
        switch (status) {
            case 'BOOKED': return stats.booked;
            case 'AVAILABLE': return stats.available;
            case 'RESERVED': return stats.reserved;
            case 'MAINTENANCE': return stats.maintenance;
            case 'ALL': return stats.total;
            default: return 0;
        }
    }, [stats]);

    // Get unique room types
    const roomTypes = useMemo(() => {
        const types = [...new Set(rooms.map(room => room.roomType?.type).filter(Boolean))];
        return types;
    }, [rooms]);

    // Handle month picker change
    const onMonthChange = (event, selectedDate) => {
        setShowMonthPicker(false);
        if (selectedDate) {
            setSelectedMonth(selectedDate);
        }
    };

    // Reset filters
    const resetFilters = () => {
        setSearchByMonth(false);
        setSearchByRoomMonth(false);
        setSelectedRoomNumber('');
        setSelectedMonth(new Date());
        setSelectedRoomType('ALL');
        setSelectedStatusFilter('ALL');
    };

    const renderRoomItem = ({ item, index }) => {
        const today = new Date();
        const status = getFacilityStatusOnDate(item, today);
        const name = getFacilityDisplayName(item, selectedFacilityType);

        // Get current active booking
        const activeBookingWrapper = item.bookings?.find(booking => {
            const b = selectedFacilityType === 'ROOMS' ? booking.booking : booking;
            if (!b) return false;

            const isCancelled =
                b.paymentStatus === 'CANCELLED' ||
                b.status === 'CANCELLED';
            if (isCancelled) return false;

            const checkIn = parseBookingDate(b.checkIn || b.bookingDate);
            const checkOut = parseBookingDate(b.checkOut || b.endDate || b.bookingDate);

            return today >= dateUtils.startOfDay(checkIn) && today <= dateUtils.endOfDay(checkOut);
        });

        const activeBooking = selectedFacilityType === 'ROOMS' ? activeBookingWrapper?.booking : activeBookingWrapper;

        return (
            <View style={styles.roomItemContainer}>
                <View style={styles.roomItemHeader}>
                    <View style={styles.roomHeaderLeft}>
                        <Text style={styles.roomNumber}>
                            {name}
                        </Text>
                        <View style={[
                            styles.statusBadge,
                            { backgroundColor: getStatusColor(status) }
                        ]}>
                            <Text style={styles.statusBadgeText}>
                                {status}
                            </Text>
                        </View>
                    </View>
                    {activeBooking && (
                        <View style={styles.bookingBadge}>
                            <Icon name="event" size={14} color="#FFFFFF" />
                            <Text style={styles.bookingBadgeText}>
                                Active Booking
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.roomDetails}>
                    {selectedFacilityType === 'ROOMS' && (
                        <Text style={styles.roomDetailText}>
                            Type: {item.roomType?.type || 'Standard'}
                        </Text>
                    )}
                    {item.rate && (
                        <Text style={styles.roomRate}>
                            Rate: PKR {parseInt(item.rate).toLocaleString()}{selectedFacilityType === 'ROOMS' ? '/night' : ''}
                        </Text>
                    )}
                </View>

                {activeBooking && (
                    <View style={styles.bookingDetails}>
                        <View style={styles.bookingDetailRow}>
                            <Icon name="person" size={16} color="#64748B" />
                            <Text style={styles.bookingDetailText}>
                                Guest: {activeBooking.memberName || activeBooking.member?.Name || activeBooking.guestName || 'N/A'}
                            </Text>
                        </View>
                        <View style={styles.bookingDetailRow}>
                            <Icon name="date-range" size={16} color="#64748B" />
                            <Text style={styles.bookingDetailText}>
                                Dates: {(activeBooking.checkIn || activeBooking.bookingDate) ?
                                    dateUtils.format(parseBookingDate(activeBooking.checkIn || activeBooking.bookingDate), 'MMM d') : 'N/A'
                                } - {(activeBooking.checkOut || activeBooking.endDate || activeBooking.bookingDate) ?
                                    dateUtils.format(parseBookingDate(activeBooking.checkOut || activeBooking.endDate || activeBooking.bookingDate), 'MMM d') : 'N/A'
                                }
                            </Text>
                        </View>
                        {activeBooking.paymentStatus && (
                            <View style={[
                                styles.paymentBadge,
                                {
                                    backgroundColor: activeBooking.paymentStatus === 'PAID' ? '#10B981' :
                                        activeBooking.paymentStatus === 'PENDING' ? '#F59E0B' : '#EF4444'
                                }
                            ]}>
                                <Text style={styles.paymentBadgeText}>
                                    {activeBooking.paymentStatus}
                                </Text>
                            </View>
                        )}
                    </View>
                )}
            </View>
        );
    };

    // Loading state
    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#D9A46C" />
                <Text style={styles.loadingText}>Loading calendar data...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F2F0EC" />

            {/* Notch Header with Image Background */}
            <ImageBackground
                source={require('../../assets/notch.jpg')}
                style={styles.notch}
                imageStyle={styles.notchImage}
            >
                <View style={styles.notchContent}>
                    <TouchableOpacity
                        style={styles.backButtonNotch}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.7}
                    >
                        <Icon name="arrow-back" size={28} color="#000" />
                    </TouchableOpacity>
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerTitleNotch}>Facility Calendar</Text>
                        <Text style={styles.welcomeTextSmall}>View bookings and schedules</Text>
                    </View>
                    <View style={{ width: 40 }} />
                </View>
            </ImageBackground>

            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#D9A46C']}
                        tintColor="#D9A46C"
                    />
                }
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                {/* Error Banner */}
                {error && (
                    <View style={styles.errorBanner}>
                        <Icon name="error" size={20} color="#991B1B" />
                        <Text style={styles.errorBannerText}>
                            {error}
                        </Text>
                    </View>
                )}

                {/* Search Filters */}
                <View style={styles.filtersContainer}>
                    <Text style={styles.sectionTitle}>Search Filters</Text>

                    {/* Search by Month */}
                    <View style={styles.filterRow}>
                        <TouchableOpacity
                            style={[
                                styles.filterToggle,
                                searchByMonth && styles.filterToggleActive
                            ]}
                            onPress={() => {
                                setSearchByMonth(!searchByMonth);
                                if (!searchByMonth) {
                                    setSearchByRoomMonth(false);
                                }
                            }}
                            activeOpacity={0.7}
                        >
                            <Text style={[
                                styles.filterToggleText,
                                searchByMonth && styles.filterToggleTextActive
                            ]}>
                                Search by Month
                            </Text>
                        </TouchableOpacity>

                        {searchByMonth && (
                            <TouchableOpacity
                                style={styles.monthPickerButton}
                                onPress={() => setShowMonthPicker(true)}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.monthPickerButtonText}>
                                    {dateUtils.format(selectedMonth, 'MMMM yyyy')}
                                </Text>
                                <Icon name="keyboard-arrow-down" size={20} color="#6B7280" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Search by Room + Month */}
                    <View style={styles.filterRow}>
                        <TouchableOpacity
                            style={[
                                styles.filterToggle,
                                searchByRoomMonth && styles.filterToggleActive
                            ]}
                            onPress={() => {
                                setSearchByRoomMonth(!searchByRoomMonth);
                                if (!searchByRoomMonth) {
                                    setSearchByMonth(false);
                                }
                            }}
                            activeOpacity={0.7}
                        >
                            <Text style={[
                                styles.filterToggleText,
                                searchByRoomMonth && styles.filterToggleTextActive
                            ]}>
                                Search by Room + Month
                            </Text>
                        </TouchableOpacity>

                        {searchByRoomMonth && (
                            <View style={styles.roomMonthContainer}>
                                <TextInput
                                    style={styles.roomNumberInput}
                                    placeholder="Enter room number"
                                    value={selectedRoomNumber}
                                    onChangeText={setSelectedRoomNumber}
                                    keyboardType="numeric"
                                />
                                <TouchableOpacity
                                    style={styles.monthPickerButton}
                                    onPress={() => setShowMonthPicker(true)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.monthPickerButtonText}>
                                        {dateUtils.format(selectedMonth, 'MM/yyyy')}
                                    </Text>
                                    <Icon name="keyboard-arrow-down" size={20} color="#6B7280" />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    {/* Reset Filters */}
                    {(searchByMonth || searchByRoomMonth || selectedRoomNumber || selectedRoomType !== 'ALL' || selectedStatusFilter !== 'ALL') && (
                        <TouchableOpacity
                            style={styles.resetButton}
                            onPress={resetFilters}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.resetButtonText}>Reset All Filters</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* View Mode Toggle */}
                <View style={styles.viewModeToggleContainer}>
                    <Text style={styles.sectionTitle}>Select View</Text>
                    <View style={styles.viewModeButtonsRow}>
                        <TouchableOpacity
                            style={[styles.viewModeButton, viewMode === 'CALENDAR' && styles.viewModeButtonActive]}
                            onPress={() => setViewMode('CALENDAR')}
                        >
                            <CalendarIcon size={18} color={viewMode === 'CALENDAR' ? '#FFF' : '#64748B'} />
                            <Text style={[styles.viewModeButtonText, viewMode === 'CALENDAR' && styles.viewModeButtonTextActive]}>Calendar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.viewModeButton, viewMode === 'TIMELINE' && styles.viewModeButtonActive]}
                            onPress={() => setViewMode('TIMELINE')}
                        >
                            <Menu size={18} color={viewMode === 'TIMELINE' ? '#FFF' : '#64748B'} />
                            <Text style={[styles.viewModeButtonText, viewMode === 'TIMELINE' && styles.viewModeButtonTextActive]}>Timeline</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Month Picker Modal */}
                {showMonthPicker && (
                    <Modal
                        transparent={true}
                        animationType="slide"
                        visible={showMonthPicker}
                        onRequestClose={() => setShowMonthPicker(false)}
                    >
                        <View style={styles.monthPickerOverlay}>
                            <View style={styles.monthPickerContainer}>
                                <View style={styles.monthPickerHeader}>
                                    <Text style={styles.monthPickerTitle}>Select Month</Text>
                                    <TouchableOpacity
                                        style={styles.monthPickerCloseButton}
                                        onPress={() => setShowMonthPicker(false)}
                                    >
                                        <Icon name="close" size={24} color="#6B7280" />
                                    </TouchableOpacity>
                                </View>
                                <DateTimePicker
                                    value={selectedMonth}
                                    mode="date"
                                    display="spinner"
                                    onChange={onMonthChange}
                                    style={styles.dateTimePicker}
                                />
                                <View style={styles.monthPickerFooter}>
                                    <TouchableOpacity
                                        style={styles.monthPickerDoneButton}
                                        onPress={() => setShowMonthPicker(false)}
                                    >
                                        <Text style={styles.monthPickerDoneText}>Done</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                )}

                {/* Facility Type Filter */}
                <View style={styles.facilityTypeContainer}>
                    <Text style={styles.sectionTitle}>Select Facility Type</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.facilityTypeButtonsContainer}
                    >
                        {['ROOMS', 'HALLS', 'LAWNS', 'PHOTOSHOOTS'].map((type) => (
                            <TouchableOpacity
                                key={type}
                                style={[
                                    styles.facilityTypeButton,
                                    selectedFacilityType === type && styles.facilityTypeButtonActive,
                                ]}
                                onPress={() => {
                                    setSelectedFacilityType(type);
                                    setSelectedRoomType('ALL');
                                    setSelectedRoomNumber('');
                                    setSelectedStatusFilter('ALL');
                                }}
                                activeOpacity={0.7}
                            >
                                <Text
                                    style={[
                                        styles.facilityTypeButtonText,
                                        selectedFacilityType === type && styles.facilityTypeButtonTextActive,
                                    ]}
                                >
                                    {getFacilityTypeName(type)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Status Filter Buttons */}
                <View style={styles.statusFilterContainer}>
                    <Text style={styles.sectionTitle}>Filter by Status</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.statusFilterButtonsContainer}
                    >
                        {['ALL', 'AVAILABLE', 'BOOKED', 'RESERVED', 'MAINTENANCE'].map((status) => (
                            <TouchableOpacity
                                key={status}
                                style={[
                                    styles.statusFilterButton,
                                    selectedStatusFilter === status && styles.statusFilterButtonActive,
                                    selectedStatusFilter === status && { backgroundColor: getStatusColor(status) },
                                ]}
                                onPress={() => {
                                    setSelectedStatusFilter(status);
                                    if (status === 'BOOKED') {
                                        showBookedRoomsModal();
                                    } else if (status === 'AVAILABLE') {
                                        showAvailableRoomsModal();
                                    }
                                }}
                                activeOpacity={0.7}
                            >
                                <Text
                                    style={[
                                        styles.statusFilterButtonText,
                                        selectedStatusFilter === status && styles.statusFilterButtonTextActive,
                                    ]}
                                >
                                    {status.charAt(0) + status.slice(1).toLowerCase()}
                                </Text>
                                <View style={[
                                    styles.statusFilterCounter,
                                    selectedStatusFilter === status && styles.statusFilterCounterActive
                                ]}>
                                    <Text style={[
                                        styles.statusFilterCounterText,
                                        selectedStatusFilter === status && styles.statusFilterCounterTextActive
                                    ]}>
                                        {getStatForStatus(status)}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Room-specific filters */}
                {selectedFacilityType === 'ROOMS' && roomTypes.length > 0 && (
                    <View style={styles.roomTypeContainer}>
                        <Text style={styles.sectionTitle}>Filter by Room Type</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.roomTypeButtonsContainer}
                        >
                            <TouchableOpacity
                                style={[
                                    styles.roomTypeButton,
                                    selectedRoomType === 'ALL' && styles.roomTypeButtonActive,
                                ]}
                                onPress={() => setSelectedRoomType('ALL')}
                                activeOpacity={0.7}
                            >
                                <Text
                                    style={[
                                        styles.roomTypeButtonText,
                                        selectedRoomType === 'ALL' && styles.roomTypeButtonTextActive,
                                    ]}
                                >
                                    All Types
                                </Text>
                            </TouchableOpacity>
                            {roomTypes.map((type) => (
                                <TouchableOpacity
                                    key={type}
                                    style={[
                                        styles.roomTypeButton,
                                        selectedRoomType === type && styles.roomTypeButtonActive,
                                    ]}
                                    onPress={() => setSelectedRoomType(type)}
                                    activeOpacity={0.7}
                                >
                                    <Text
                                        style={[
                                            styles.roomTypeButtonText,
                                            selectedRoomType === type && styles.roomTypeButtonTextActive,
                                        ]}
                                    >
                                        {type}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Statistics with Available and Booked Buttons */}
                <View style={styles.statsWrapper}>
                    {/* Bookings Summary Card */}
                    <View style={styles.bookingsSummaryCard}>
                        <View style={styles.bookingsSummaryHeader}>
                            <Icon name="event-note" size={24} color="#D9A46C" />
                            <Text style={styles.bookingsSummaryTitle}>Bookings Overview</Text>
                            <View style={styles.bookingsSummaryDateBadge}>
                                <Text style={styles.bookingsSummaryDate}>
                                    {dateUtils.format(new Date(), 'MMM d, yyyy')}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.bookingsSummaryGrid}>
                            {/* Total Bookings */}
                            <View style={styles.summaryItem}>
                                <View style={[styles.summaryIconContainer, { backgroundColor: '#3B82F6' }]}>
                                    <Icon name="event" size={20} color="#FFFFFF" />
                                </View>
                                <View style={styles.summaryContent}>
                                    <Text style={styles.summaryNumber}>{stats.totalBookings}</Text>
                                    <Text style={styles.summaryLabel}>Total Bookings</Text>
                                </View>
                            </View>

                            {/* Active Bookings */}
                            <View style={styles.summaryItem}>
                                <View style={[styles.summaryIconContainer, { backgroundColor: '#10B981' }]}>
                                    <Icon name="event-available" size={20} color="#FFFFFF" />
                                </View>
                                <View style={styles.summaryContent}>
                                    <Text style={styles.summaryNumber}>{stats.activeBookings}</Text>
                                    <Text style={styles.summaryLabel}>Active Now</Text>
                                </View>
                            </View>

                            {/* Upcoming Bookings */}
                            <View style={styles.summaryItem}>
                                <View style={[styles.summaryIconContainer, { backgroundColor: '#F59E0B' }]}>
                                    <Icon name="upcoming" size={20} color="#FFFFFF" />
                                </View>
                                <View style={styles.summaryContent}>
                                    <Text style={styles.summaryNumber}>{stats.upcomingBookings}</Text>
                                    <Text style={styles.summaryLabel}>Upcoming</Text>
                                </View>
                            </View>

                            {/* Cancelled Bookings */}
                            <View style={styles.summaryItem}>
                                <View style={[styles.summaryIconContainer, { backgroundColor: '#EF4444' }]}>
                                    <Icon name="cancel" size={20} color="#FFFFFF" />
                                </View>
                                <View style={styles.summaryContent}>
                                    <Text style={styles.summaryNumber}>{stats.cancelledBookings}</Text>
                                    <Text style={styles.summaryLabel}>Cancelled</Text>
                                </View>
                            </View>
                        </View>

                        {/* Cancellation Rate */}
                        {stats.totalBookings > 0 && (
                            <View style={styles.cancellationRateContainer}>
                                <View style={styles.rateHeader}>
                                    <Text style={styles.rateLabel}>Cancellation Rate</Text>
                                    <Text style={styles.rateValue}>{stats.bookingCancellationRate}%</Text>
                                </View>
                                <View style={styles.rateBar}>
                                    <View
                                        style={[
                                            styles.rateBarFill,
                                            {
                                                width: `${Math.min(stats.bookingCancellationRate, 100)}%`,
                                                backgroundColor: stats.bookingCancellationRate > 20 ? '#EF4444' :
                                                    stats.bookingCancellationRate > 10 ? '#F59E0B' : '#10B981'
                                            }
                                        ]}
                                    />
                                </View>
                            </View>
                        )}
                    </View>

                    {/* Top Card - Total */}
                    <View style={styles.statCardPrimary}>
                        <View style={styles.statCardPrimaryHeader}>
                            <Text style={styles.statCardPrimaryTitle}>Total {getFacilityTypeName(selectedFacilityType)}</Text>
                            <View style={styles.statCardBadge}>
                                <Text style={styles.statCardBadgeText}>
                                    {stats.occupancyRate}%
                                </Text>
                            </View>
                        </View>
                        <View style={styles.statCardPrimaryContent}>
                            <Text style={styles.statCardPrimaryNumber}>{stats.total}</Text>
                            <Text style={styles.statCardPrimarySubtitle}>{getFacilityTypeName(selectedFacilityType).toLowerCase()}</Text>
                        </View>
                        <View style={styles.progressBarContainer}>
                            <View style={[styles.progressBar, { width: `${stats.occupancyRate}%` }]} />
                        </View>
                    </View>

                    {/* Middle Row - Booked & Available */}
                    <View style={styles.statsRow}>
                        {/* Booked Card */}
                        <TouchableOpacity
                            style={styles.statCardSecondary}
                            onPress={() => showBookedRoomsModal()}
                            activeOpacity={0.7}
                        >
                            <View style={styles.statCardSecondaryHeader}>
                                <Text style={styles.statCardSecondaryTitle}>Booked</Text>
                                <View style={[styles.statIconContainer, { backgroundColor: '#002f79ff' }]}>
                                    <Icon name="event-busy" size={20} color="#FFFFFF" />
                                </View>
                            </View>
                            <Text style={styles.statCardSecondarySubtitle}>Currently occupied</Text>
                            <Text style={[styles.statCardSecondaryNumber, styles.bookedNumber]}>
                                {stats.booked}
                            </Text>
                        </TouchableOpacity>

                        {/* Available Card */}
                        <TouchableOpacity
                            style={styles.statCardSecondary}
                            onPress={() => showAvailableRoomsModal()}
                            activeOpacity={0.7}
                        >
                            <View style={styles.statCardSecondaryHeader}>
                                <Text style={styles.statCardSecondaryTitle}>Available</Text>
                                <View style={[styles.statIconContainer, { backgroundColor: '#10B981' }]}>
                                    <Icon name="event-available" size={20} color="#FFFFFF" />
                                </View>
                            </View>
                            <Text style={styles.statCardSecondarySubtitle}>Ready to book</Text>
                            <Text style={[styles.statCardSecondaryNumber, styles.availableNumber]}>
                                {stats.available}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Bottom Row - Reserved & Maintenance */}
                    <View style={styles.statsRow}>
                        {/* Reserved Card */}
                        <TouchableOpacity
                            style={styles.statCardSecondary}
                            onPress={() => setSelectedStatusFilter('RESERVED')}
                            activeOpacity={0.7}
                        >
                            <View style={styles.statCardSecondaryHeader}>
                                <Text style={styles.statCardSecondaryTitle}>Reserved</Text>
                                <View style={[styles.statIconContainer, { backgroundColor: '#F59E0B' }]}>
                                    <Icon name="schedule" size={20} color="#FFFFFF" />
                                </View>
                            </View>
                            <Text style={styles.statCardSecondarySubtitle}>On hold</Text>
                            <Text style={[styles.statCardSecondaryNumber, styles.reservedNumber]}>
                                {stats.reserved}
                            </Text>
                        </TouchableOpacity>

                        {/* Maintenance Card */}
                        <TouchableOpacity
                            style={styles.statCardSecondary}
                            onPress={() => setSelectedStatusFilter('MAINTENANCE')}
                            activeOpacity={0.7}
                        >
                            <View style={styles.statCardSecondaryHeader}>
                                <Text style={styles.statCardSecondaryTitle}>Maintenance</Text>
                                <View style={[styles.statIconContainer, { backgroundColor: '#EF4444' }]}>
                                    <Icon name="build" size={20} color="#FFFFFF" />
                                </View>
                            </View>
                            <Text style={styles.statCardSecondarySubtitle}>Out of service</Text>
                            <Text style={[styles.statCardSecondaryNumber, styles.maintenanceNumber]}>
                                {stats.maintenance}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Legend */}
                <View style={styles.legendContainer}>
                    <Text style={styles.legendTitle}>Booking Status Legend</Text>
                    <View style={styles.legendItems}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, styles.legendDotBooking]} />
                            <Text style={styles.legendText}>Booked</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, styles.legendDotAvailable]} />
                            <Text style={styles.legendText}>Available</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, styles.legendDotReservation]} />
                            <Text style={styles.legendText}>Reserved</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, styles.legendDotOutOfService]} />
                            <Text style={styles.legendText}>Maintenance</Text>
                        </View>
                    </View>
                </View>

                {/* Calendar View */}
                <View style={styles.calendarCard}>
                    <View style={styles.calendarHeader}>
                        <Text style={styles.calendarTitle}>
                            {dateUtils.format(currentDate, 'MMMM yyyy')}
                        </Text>
                        <View style={styles.calendarNavButtons}>
                            <TouchableOpacity
                                style={styles.navButton}
                                onPress={() => {
                                    const prevMonth = new Date(currentDate);
                                    prevMonth.setMonth(prevMonth.getMonth() - 1);
                                    setCurrentDate(prevMonth);
                                }}
                            >
                                <Icon name="chevron-left" size={24} color="#002f79ff" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.todayButton}
                                onPress={() => setCurrentDate(new Date())}
                            >
                                <Text style={styles.todayButtonText}>Today</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.navButton}
                                onPress={() => {
                                    const nextMonth = new Date(currentDate);
                                    nextMonth.setMonth(nextMonth.getMonth() + 1);
                                    setCurrentDate(nextMonth);
                                }}
                            >
                                <Icon name="chevron-right" size={24} color="#002f79ff" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Calendar
                        current={dateUtils.format(currentDate, 'yyyy-MM-dd')}
                        onMonthChange={(month) => {
                            setCurrentDate(new Date(month.timestamp));
                        }}
                        dayComponent={(props) => (
                            <CustomDayComponent
                                {...props}
                                onDatePress={handleDatePress}
                                selectedStatusFilter={selectedStatusFilter}
                                getStatusColor={getStatusColor}
                            />
                        )}
                        markedDates={markedDates}
                        theme={{
                            calendarBackground: '#ffffff',
                            textSectionTitleColor: '#6B7280',
                            selectedDayBackgroundColor: getStatusColor(selectedStatusFilter),
                            selectedDayTextColor: '#ffffff',
                            todayTextColor: '#002f79ff',
                            dayTextColor: '#374151',
                            textDisabledColor: '#D1D5DB',
                            arrowColor: '#002f79ff',
                            monthTextColor: '#111827',
                            textDayFontFamily: 'System',
                            textMonthFontFamily: 'System',
                            textDayHeaderFontFamily: 'System',
                            textDayFontSize: 16,
                            textMonthFontSize: 18,
                            textDayHeaderFontSize: 14,
                        }}
                        style={styles.calendar}
                    />
                </View>

                {/* Timeline View */}
                {viewMode === 'TIMELINE' && (
                    <HorizontalTimeline
                        facilities={normalizedFacilities}
                        dateRange={dateRange}
                        selectedFacilityType={selectedFacilityType}
                        onEventPress={(period, facility) => {
                            // Map timeline event back to existing handleDatePress or similar
                            // For now, let's just show details
                            setSelectedPeriod({
                                date: period.start,
                                events: [{
                                    facility: { ...facility, ...period.data },
                                    type: 'status',
                                    status: period.status,
                                    date: period.start
                                }]
                            });
                        }}
                    />
                )}

                {/* Occupancy State Table - Only for Rooms */}
                {selectedFacilityType === 'ROOMS' && roomTypes.length > 0 && (
                    <View style={styles.occupancyTableContainer}>
                        <View style={styles.occupancyTableHeader}>
                            <Text style={styles.occupancyTableTitle}>Rooms Occupancy State</Text>
                            <Text style={styles.occupancyTableDate}>
                                Date: {dateUtils.format(new Date(), 'dd/MM/yyyy')}
                            </Text>
                        </View>

                        <View style={styles.table}>
                            {/* Table Header Row */}
                            <View style={[styles.tableRow, styles.tableHeaderRow]}>
                                <View style={[styles.tableCell, styles.categoryCell]}>
                                    <Text style={styles.tableHeaderText}>Rooms Category</Text>
                                </View>
                                <View style={styles.tableCell}>
                                    <Text style={styles.tableHeaderText}>Qty</Text>
                                </View>
                                <View style={styles.tableCell}>
                                    <Text style={styles.tableHeaderText}>Occupied</Text>
                                </View>
                                <View style={styles.tableCell}>
                                    <Text style={styles.tableHeaderText}>Available</Text>
                                </View>
                                <View style={styles.tableCell}>
                                    <Text style={styles.tableHeaderText}>Reserved</Text>
                                </View>
                                <View style={styles.tableCell}>
                                    <Text style={styles.tableHeaderText}>Maintenance</Text>
                                </View>
                            </View>

                            {/* Table Body */}
                            {roomTypes.map((type) => {
                                const roomsInType = rooms.filter(r => r.roomType?.type === type);
                                const qty = roomsInType.length;
                                const occupied = roomsInType.filter(r =>
                                    getFacilityStatusOnDate(r, new Date()) === 'BOOKED'
                                ).length;
                                const available = roomsInType.filter(r =>
                                    getFacilityStatusOnDate(r, new Date()) === 'AVAILABLE'
                                ).length;
                                const reserved = roomsInType.filter(r =>
                                    getFacilityStatusOnDate(r, new Date()) === 'RESERVED'
                                ).length;
                                const maintenance = roomsInType.filter(r =>
                                    getFacilityStatusOnDate(r, new Date()) === 'MAINTENANCE'
                                ).length;

                                return (
                                    <View key={type} style={styles.tableRow}>
                                        <View style={[styles.tableCell, styles.categoryCell]}>
                                            <Text style={styles.tableBodyText}>{type}</Text>
                                        </View>
                                        <View style={styles.tableCell}>
                                            <Text style={styles.tableBodyText}>{String(qty).padStart(2, '0')}</Text>
                                        </View>
                                        <View style={styles.tableCell}>
                                            <Text style={[styles.tableBodyText, styles.bookedText]}>
                                                {String(occupied).padStart(2, '0')}
                                            </Text>
                                        </View>
                                        <View style={styles.tableCell}>
                                            <Text style={[styles.tableBodyText, styles.availableText]}>
                                                {String(available).padStart(2, '0')}
                                            </Text>
                                        </View>
                                        <View style={styles.tableCell}>
                                            <Text style={[styles.tableBodyText, styles.reservedText]}>
                                                {String(reserved).padStart(2, '0')}
                                            </Text>
                                        </View>
                                        <View style={styles.tableCell}>
                                            <Text style={[styles.tableBodyText, styles.maintenanceText]}>
                                                {String(maintenance).padStart(2, '0')}
                                            </Text>
                                        </View>
                                    </View>
                                );
                            })}

                            {/* Total Row */}
                            {roomTypes.length > 0 && (
                                <View style={[styles.tableRow, styles.totalRow]}>
                                    <View style={[styles.tableCell, styles.categoryCell]}>
                                        <Text style={[styles.tableBodyText, styles.boldText]}>Total</Text>
                                    </View>
                                    <View style={styles.tableCell}>
                                        <Text style={[styles.tableBodyText, styles.boldText]}>
                                            {String(stats.total).padStart(2, '0')}
                                        </Text>
                                    </View>
                                    <View style={styles.tableCell}>
                                        <Text style={[styles.tableBodyText, styles.boldText, styles.bookedText]}>
                                            {String(stats.booked).padStart(2, '0')}
                                        </Text>
                                    </View>
                                    <View style={styles.tableCell}>
                                        <Text style={[styles.tableBodyText, styles.boldText, styles.availableText]}>
                                            {String(stats.available).padStart(2, '0')}
                                        </Text>
                                    </View>
                                    <View style={styles.tableCell}>
                                        <Text style={[styles.tableBodyText, styles.boldText, styles.reservedText]}>
                                            {String(stats.reserved).padStart(2, '0')}
                                        </Text>
                                    </View>
                                    <View style={styles.tableCell}>
                                        <Text style={[styles.tableBodyText, styles.boldText, styles.maintenanceText]}>
                                            {String(stats.maintenance).padStart(2, '0')}
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Available Rooms Modal */}
            <Modal
                visible={availableModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setAvailableModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Available Rooms</Text>
                            <TouchableOpacity
                                style={styles.modalCloseButton}
                                onPress={() => setAvailableModalVisible(false)}
                            >
                                <Icon name="close" size={24} color="#64748B" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.modalSubtitle}>
                            Rooms available for booking today ({dateUtils.format(new Date(), 'MMMM d, yyyy')})
                        </Text>

                        <View style={styles.modalContentArea}>
                            {availableRooms.length === 0 ? (
                                <View style={styles.emptyListContainer}>
                                    <Icon name="event-busy" size={60} color="#94A3B8" />
                                    <Text style={styles.emptyListTitle}>No Available Rooms</Text>
                                    <Text style={styles.emptyListText}>
                                        All rooms are currently booked, reserved, or under maintenance
                                    </Text>
                                </View>
                            ) : (
                                <FlatList
                                    data={availableRooms}
                                    renderItem={renderRoomItem}
                                    keyExtractor={(item, index) => `available-${item.id || index}`}
                                    style={styles.roomsList}
                                    contentContainerStyle={styles.roomsListContent}
                                    ListHeaderComponent={
                                        <Text style={styles.listHeader}>
                                            Showing {availableRooms.length} available rooms
                                        </Text>
                                    }
                                />
                            )}
                        </View>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => setAvailableModalVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Booked Rooms Modal */}
            <Modal
                visible={bookedModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setBookedModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Booked Rooms</Text>
                            <TouchableOpacity
                                style={styles.modalCloseButton}
                                onPress={() => setBookedModalVisible(false)}
                            >
                                <Icon name="close" size={24} color="#64748B" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.modalSubtitle}>
                            Rooms booked for today ({dateUtils.format(new Date(), 'MMMM d, yyyy')})
                        </Text>

                        <View style={styles.modalContentArea}>
                            {bookedRooms.length === 0 ? (
                                <View style={styles.emptyListContainer}>
                                    <Icon name="event-available" size={60} color="#94A3B8" />
                                    <Text style={styles.emptyListTitle}>No Booked Rooms</Text>
                                    <Text style={styles.emptyListText}>
                                        All rooms are currently available
                                    </Text>
                                </View>
                            ) : (
                                <View style={styles.roomsListContainer}>
                                    <View style={styles.listHeaderContainer}>
                                        <Text style={styles.listHeader}>
                                            Showing {bookedRooms.length} booked rooms
                                        </Text>
                                        <View style={styles.bookingsCountBadge}>
                                            <Icon name="event" size={16} color="#002f79ff" />
                                            <Text style={styles.bookingsCountText}>
                                                Active Bookings: {stats.activeBookings}
                                            </Text>
                                        </View>
                                    </View>
                                    <FlatList
                                        data={bookedRooms}
                                        renderItem={renderRoomItem}
                                        keyExtractor={(item, index) => `booked-${item.id || index}`}
                                        style={styles.roomsList}
                                        contentContainerStyle={styles.roomsListContent}
                                    />
                                </View>
                            )}
                        </View>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => setBookedModalVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Period Details Modal */}
            <Modal
                visible={!!selectedPeriod}
                transparent
                animationType="slide"
                onRequestClose={() => setSelectedPeriod(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {selectedPeriod?.date
                                    ? dateUtils.format(selectedPeriod.date, 'MMMM d, yyyy')
                                    : 'Booking Details'}
                                {selectedStatusFilter !== 'ALL' && ` - ${selectedStatusFilter}`}
                            </Text>
                            <TouchableOpacity
                                style={styles.modalCloseButton}
                                onPress={() => setSelectedPeriod(null)}
                            >
                                <Icon name="close" size={24} color="#64748B" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalContentArea}>
                            <ScrollView style={styles.modalContent}>
                                {selectedPeriod?.events && selectedPeriod.events.length > 0 ? (
                                    selectedPeriod.events.map((event, index) => (
                                        <View key={index} style={styles.periodCard}>
                                            <View style={styles.periodCardHeader}>
                                                <Text style={styles.periodFacilityName}>
                                                    {selectedFacilityType === 'ROOMS'
                                                        ? `Room ${event.facility.roomNumber || event.facility.roomNo || 'N/A'}`
                                                        : event.facility.name || event.facility.title || `Facility ${event.facility.id || 'N/A'}`
                                                    }
                                                </Text>
                                                <View
                                                    style={[
                                                        styles.periodBadge,
                                                        { backgroundColor: getStatusColor(event.status) },
                                                    ]}
                                                >
                                                    <Text style={styles.periodBadgeText}>
                                                        {event.status}
                                                    </Text>
                                                </View>
                                            </View>

                                            {selectedFacilityType === 'ROOMS' && (
                                                <>
                                                    <Text style={styles.periodDetail}>
                                                        Type: {event.facility.roomType?.type || 'Standard'}
                                                    </Text>
                                                    {event.facility.rate && (
                                                        <Text style={styles.periodDetail}>
                                                            Rate: PKR {parseInt(event.facility.rate).toLocaleString()}/night
                                                        </Text>
                                                    )}
                                                </>
                                            )}
                                        </View>
                                    ))
                                ) : (
                                    <View style={styles.emptyListContainer}>
                                        <Icon name="info" size={60} color="#94A3B8" />
                                        <Text style={styles.emptyListTitle}>No Events Found</Text>
                                        <Text style={styles.emptyListText}>
                                            No bookings or events found for this date
                                        </Text>
                                    </View>
                                )}
                            </ScrollView>
                        </View>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => setSelectedPeriod(null)}
                            >
                                <Text style={styles.modalButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F0EC',
    },
    scrollView: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F2F0EC',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#64748B',
        fontWeight: '500',
    },
    errorBanner: {
        backgroundColor: '#FEE2E2',
        marginHorizontal: 16,
        marginTop: 10,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FCA5A5',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    errorBannerText: {
        fontSize: 14,
        color: '#991B1B',
        fontWeight: '500',
        flex: 1,
    },
    // Filters Container
    filtersContainer: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginTop: 16,
        padding: 16,
        borderRadius: 16,
        shadowColor: '#1E3A5F',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2A241E',
        marginBottom: 12,
    },
    filterRow: {
        marginBottom: 12,
    },
    filterToggle: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    filterToggleActive: {
        backgroundColor: '#BCA382',
        borderColor: '#BCA382',
    },
    filterToggleText: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '600',
        textAlign: 'center',
    },
    filterToggleTextActive: {
        color: '#FFFFFF',
        fontWeight: '700',
    },
    monthPickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginTop: 8,
    },
    monthPickerButtonText: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '500',
    },
    roomMonthContainer: {
        marginTop: 8,
    },
    roomNumberInput: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        fontSize: 14,
        color: '#374151',
        marginBottom: 8,
    },
    resetButton: {
        backgroundColor: '#EF4444',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    resetButtonText: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    // Month Picker Modal
    monthPickerOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    monthPickerContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        width: '90%',
        maxWidth: 400,
    },
    monthPickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    monthPickerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    monthPickerCloseButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dateTimePicker: {
        height: 200,
    },
    monthPickerFooter: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    monthPickerDoneButton: {
        backgroundColor: '#BCA382',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    monthPickerDoneText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    // Facility Type Filter Styles
    facilityTypeContainer: {
        marginHorizontal: 16,
        marginTop: 16,
    },
    facilityTypeButtonsContainer: {
        flexDirection: 'row',
        paddingVertical: 4,
    },
    facilityTypeButton: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#F1F5F9',
        marginRight: 10,
        minHeight: 44,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    facilityTypeButtonActive: {
        backgroundColor: '#BCA382',
        borderColor: '#BCA382',
    },
    facilityTypeButtonText: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '600',
    },
    facilityTypeButtonTextActive: {
        color: '#FFFFFF',
        fontWeight: '700',
    },
    // Stats Styles
    statsWrapper: {
        marginHorizontal: 16,
        marginTop: 16,
        gap: 12,
    },
    // Bookings Summary Styles
    bookingsSummaryCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 6,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    bookingsSummaryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    bookingsSummaryTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
        flex: 1,
        marginLeft: 12,
    },
    bookingsSummaryDateBadge: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    bookingsSummaryDate: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '600',
    },
    bookingsSummaryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 16,
    },
    summaryItem: {
        flex: 1,
        minWidth: '45%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    summaryIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    summaryContent: {
        flex: 1,
    },
    summaryNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 2,
    },
    summaryLabel: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '500',
    },
    cancellationRateContainer: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
    },
    rateHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    rateLabel: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    rateValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
    },
    rateBar: {
        height: 6,
        backgroundColor: '#E2E8F0',
        borderRadius: 3,
        overflow: 'hidden',
    },
    rateBarFill: {
        height: '100%',
        borderRadius: 3,
    },
    statCardPrimary: {
        backgroundColor: '#2A241E',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 8,
    },
    statCardPrimaryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    statCardPrimaryTitle: {
        fontSize: 14,
        color: '#94A3B8',
        fontWeight: '500',
    },
    statCardBadge: {
        backgroundColor: '#3D352D',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D9A46C',
    },
    statCardBadgeText: {
        fontSize: 14,
        color: '#D9A46C',
        fontWeight: '700',
    },
    statCardPrimaryContent: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 16,
    },
    statCardPrimaryNumber: {
        fontSize: 52,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginRight: 8,
    },
    statCardPrimarySubtitle: {
        fontSize: 18,
        color: '#94A3B8',
        fontWeight: '500',
    },
    progressBarContainer: {
        height: 6,
        backgroundColor: '#334155',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#D9A46C',
        borderRadius: 3,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    statCardSecondary: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 6,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    statCardSecondaryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    statCardSecondaryTitle: {
        fontSize: 16,
        color: '#1E293B',
        fontWeight: '600',
    },
    statIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statCardSecondarySubtitle: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '500',
        marginBottom: 12,
    },
    statCardSecondaryNumber: {
        fontSize: 36,
        fontWeight: 'bold',
    },
    bookedNumber: {
        color: '#002f79ff',
    },
    availableNumber: {
        color: '#10B981',
    },
    reservedNumber: {
        color: '#F59E0B',
    },
    maintenanceNumber: {
        color: '#EF4444',
    },
    // Room Type Filter Styles
    roomTypeContainer: {
        marginHorizontal: 16,
        marginTop: 16,
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 16,
        shadowColor: '#1E3A5F',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    roomTypeButtonsContainer: {
        flexDirection: 'row',
        paddingVertical: 4,
    },
    roomTypeButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        marginRight: 10,
        minHeight: 38,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    roomTypeButtonActive: {
        backgroundColor: '#BCA382',
        borderColor: '#BCA382',
    },
    roomTypeButtonText: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '600',
    },
    roomTypeButtonTextActive: {
        color: '#FFFFFF',
        fontWeight: '700',
    },
    // Status Filter Styles
    statusFilterContainer: {
        marginHorizontal: 16,
        marginTop: 16,
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 16,
        shadowColor: '#1E3A5F',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    statusFilterButtonsContainer: {
        flexDirection: 'row',
        paddingVertical: 4,
    },
    statusFilterButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        marginRight: 10,
        minHeight: 38,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    statusFilterButtonActive: {
        backgroundColor: '#BCA382',
        borderColor: '#BCA382',
    },
    statusFilterButtonText: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '600',
    },
    statusFilterButtonTextActive: {
        color: '#FFFFFF',
        fontWeight: '700',
    },
    legendContainer: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginTop: 16,
        padding: 16,
        borderRadius: 16,
        shadowColor: '#1E3A5F',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    legendTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2A241E',
        marginBottom: 14,
    },
    legendItems: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 20,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    legendDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
    },
    legendDotBooking: {
        backgroundColor: '#002f79ff',
    },
    legendDotReservation: {
        backgroundColor: '#F59E0B',
    },
    legendDotOutOfService: {
        backgroundColor: '#EF4444',
    },
    legendDotAvailable: {
        backgroundColor: '#10B981',
    },
    legendText: {
        fontSize: 14,
        color: '#475569',
        fontWeight: '500',
    },
    // Calendar Styles
    calendarCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 24,
        borderRadius: 20,
        shadowColor: '#1E3A5F',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 6,
        overflow: 'hidden',
        paddingBottom: 10,
    },
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    calendarTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
    },
    calendarNavButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    navButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    todayButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: '#F1F5F9',
    },
    todayButtonText: {
        fontSize: 14,
        color: '#002f79ff',
        fontWeight: '600',
    },
    calendar: {
        borderRadius: 20,
    },
    // Custom Day Styles
    dayWrapper: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 2,
    },
    dayContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    todayContainer: {
        borderWidth: 2,
        borderColor: '#002f79ff',
    },
    dayText: {
        fontSize: 15,
        color: '#374151',
        fontWeight: '500',
    },
    disabledDayText: {
        color: '#D1D5DB',
    },
    todayText: {
        color: '#002f79ff',
        fontWeight: '700',
    },
    selectedDayText: {
        color: '#FFFFFF',
        fontWeight: '700',
    },
    // Event Badge Styles
    eventBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#002f79ff',
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    eventBadgeHigh: {
        backgroundColor: '#EF4444',
    },
    eventBadgeMedium: {
        backgroundColor: '#F59E0B',
    },
    eventBadgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        height: '90%',
        maxHeight: '90%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 18,
        paddingHorizontal: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1E293B',
    },
    modalCloseButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#64748B',
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: '#F8FAFC',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    modalContentArea: {
        flex: 1,
    },
    modalContent: {
        flex: 1,
        padding: 20,
    },
    modalFooter: {
        padding: 20,
        paddingBottom: 34,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
    },
    modalButton: {
        backgroundColor: '#BCA382',
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    // Room List Styles
    roomsList: {
        flex: 1,
        width: '100%',
    },
    roomsListContent: {
        padding: 16,
        paddingBottom: 80,
    },
    roomsListContainer: {
        flex: 1,
    },
    emptyListContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyListTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#374151',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyListText: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 20,
    },
    listHeader: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 12,
        fontWeight: '500',
        textAlign: 'center',
    },
    listHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    bookingsCountBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        gap: 6,
    },
    bookingsCountText: {
        fontSize: 12,
        color: '#002f79ff',
        fontWeight: '600',
    },
    // Room Item Styles
    roomItemContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    roomItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    roomHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
    },
    roomNumber: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    bookingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#002f79ff',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        gap: 4,
    },
    bookingBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    roomDetails: {
        marginTop: 4,
    },
    roomDetailText: {
        fontSize: 14,
        color: '#475569',
        marginBottom: 6,
        lineHeight: 20,
    },
    roomRate: {
        fontSize: 15,
        color: '#2A241E',
        fontWeight: '600',
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
    },
    bookingDetails: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
    },
    bookingDetailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6,
    },
    bookingDetailText: {
        fontSize: 14,
        color: '#475569',
        flex: 1,
    },
    paymentBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginTop: 8,
    },
    paymentBadgeText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#FFFFFF',
        textTransform: 'uppercase',
    },
    // Period Card Styles
    periodCard: {
        padding: 18,
        backgroundColor: '#F8FAFC',
        borderRadius: 14,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    periodCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
    },
    periodFacilityName: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1E293B',
        flex: 1,
    },
    periodBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    periodBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.3,
        color: '#FFFFFF',
    },
    periodDetail: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 8,
        lineHeight: 20,
    },
    // Notch Styles
    notch: {
        paddingTop: 45,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomEndRadius: 30,
        borderBottomStartRadius: 30,
        overflow: 'hidden',
        minHeight: 120,
    },
    notchImage: {
        resizeMode: 'cover',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
    },
    notchContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backButtonNotch: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitleNotch: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
    },
    welcomeTextSmall: {
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
        marginTop: 2,
    },
    // Occupancy Table Styles
    occupancyTableContainer: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginBottom: 24,
        padding: 16,
        borderRadius: 20,
        shadowColor: '#1E3A5F',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 6,
    },
    occupancyTableHeader: {
        alignItems: 'center',
        marginBottom: 20,
    },
    occupancyTableTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
        textDecorationLine: 'underline',
        marginBottom: 4,
    },
    occupancyTableDate: {
        fontSize: 14,
        color: '#333',
    },
    table: {
        borderWidth: 1,
        borderColor: '#000',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#000',
    },
    tableHeaderRow: {
        backgroundColor: '#F8FAFC',
    },
    tableCell: {
        flex: 1,
        padding: 8,
        borderRightWidth: 1,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryCell: {
        flex: 1.5,
    },
    tableHeaderText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#000',
        textAlign: 'center',
    },
    tableBodyText: {
        fontSize: 14,
        color: '#000',
        textAlign: 'center',
    },
    totalRow: {
        backgroundColor: '#F1F5F9',
    },
    boldText: {
        fontWeight: 'bold',
    },
    bookedText: {
        color: '#002f79ff',
        fontWeight: '600',
    },
    availableText: {
        color: '#10B981',
        fontWeight: '600',
    },
    reservedText: {
        color: '#F59E0B',
        fontWeight: '600',
    },
    maintenanceText: {
        color: '#EF4444',
        fontWeight: '600',
    },
    // View Mode Toggle Styles
    viewModeToggleContainer: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginTop: 16,
        padding: 16,
        borderRadius: 16,
        shadowColor: '#1E3A5F',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    viewModeButtonsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    viewModeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        gap: 8,
    },
    viewModeButtonActive: {
        backgroundColor: '#002f79',
        borderColor: '#002f79',
    },
    viewModeButtonText: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '600',
    },
    viewModeButtonTextActive: {
        color: '#FFFFFF',
        fontWeight: '700',
    },
    // Filter Counter Styles
    statusFilterCounter: {
        backgroundColor: '#E2E8F0',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        marginLeft: 8,
    },
    statusFilterCounterActive: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    statusFilterCounterText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#64748B',
    },
    statusFilterCounterTextActive: {
        color: '#FFFFFF',
    },
    // Timeline Styles
    timelineWrapper: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginBottom: 24,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    timelineHeaderRow: {
        flexDirection: 'row',
        backgroundColor: '#F8FAFC',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    timelineHeaderLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    timelineDateHeader: {
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRightWidth: 1,
        borderRightColor: '#E2E8F0',
    },
    timelineDateText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#1E293B',
    },
    timelineDayText: {
        fontSize: 10,
        color: '#64748B',
        textTransform: 'uppercase',
    },
    timelineRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        minHeight: 70,
    },
    facilityLabelArea: {
        width: 120,
        padding: 10,
        backgroundColor: '#F8FAFC',
        borderRightWidth: 1,
        borderRightColor: '#E2E8F0',
        justifyContent: 'center',
    },
    facilityNameText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#1E293B',
    },
    facilitySubDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 6,
    },
    facilityCategoryText: {
        fontSize: 9,
        color: '#64748B',
        maxWidth: 60,
    },
    capacityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        backgroundColor: '#E2E8F0',
        paddingHorizontal: 4,
        borderRadius: 4,
    },
    capacityTextMini: {
        fontSize: 9,
        fontWeight: '700',
        color: '#64748B',
    },
    timelineGrid: {
        position: 'relative',
        height: '100%',
    },
    timelineGridLine: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        borderRightWidth: 1,
        borderRightColor: '#F1F5F9',
    },
    timelineTodayLine: {
        backgroundColor: 'rgba(59, 130, 246, 0.05)',
    },
    todayHeaderCell: {
        backgroundColor: '#DBEAFE',
    },
    horizontalBar: {
        position: 'absolute',
        height: 22,
        borderRadius: 6,
        paddingHorizontal: 6,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    horizontalBarText: {
        fontSize: 10,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});

export default calender;