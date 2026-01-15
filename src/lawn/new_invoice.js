const handleGenerateInvoice = async () => {
    // Validation
    if (!Object.keys(selectedDates).length) {
        Alert.alert('Error', 'Please select at least one booking date');
        return;
    }

    const todayVal = new Date();
    const todayStr = `${todayVal.getFullYear()}-${String(todayVal.getMonth() + 1).padStart(2, '0')}-${String(todayVal.getDate()).padStart(2, '0')}`;

    const dates = Object.keys(selectedDates);
    for (const dateStr of dates) {
        if (dateStr < todayStr) {
            Alert.alert('Error', `Booking date ${dateStr} cannot be in the past`);
            return false;
        }
    }
    if (!selectedEventType) {
        Alert.alert('Error', 'Please select an event type');
        return;
    }
    if (!selectedTimeSlot) {
        Alert.alert('Error', 'Please select a time slot');
        return;
    }
    if (!numberOfGuests || parseInt(numberOfGuests) < 1) {
        Alert.alert('Error', 'Please enter number of guests');
        return;
    }

    // Guest validation
    if (isGuest) {
        if (!guestName.trim()) {
            Alert.alert('Error', 'Please enter guest name');
            return;
        }
        if (!guestContact.trim() || guestContact.length < 10) {
            Alert.alert('Error', 'Please enter a valid phone number');
            return;
        }
    }

    // Member validation
    if (!isGuest && !isAuthenticated) {
        Alert.alert(
            'Authentication Required',
            'Please login to book a lawn.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Go to Login',
                    onPress: () => navigation.reset({
                        index: 0,
                        routes: [{ name: 'LoginScr' }],
                    })
                }
            ]
        );
        return;
    }

    // Check guest count against lawn capacity
    if (venue) {
        const guests = parseInt(numberOfGuests);
        if (venue.minGuests && guests < venue.minGuests) {
            Alert.alert('Error', `Minimum guests required: ${venue.minGuests}`);
            return;
        }
        if (venue.maxGuests && guests > venue.maxGuests) {
            Alert.alert('Error', `Maximum guests allowed: ${venue.maxGuests}`);
            return;
        }
    }

    setBookingLoading(true);

    try {
        // Check auth token
        const token = await getAuthToken();
        console.log('🔑 Auth token status:', token ? 'Present' : 'Missing');

        // Calculate start and end dates
        const sortedDates = Object.keys(selectedDates).sort();
        const startDate = sortedDates[0];
        const endDate = sortedDates[sortedDates.length - 1];

        // Create booking details for each selected date
        const bookingDetails = sortedDates.map(date => ({
            date: date,
            timeSlot: selectedTimeSlot,
            eventType: selectedEventType
        }));

        // Prepare booking data matching the backend API
        const payload = {
            bookingDate: startDate,
            endDate: endDate,
            bookingDetails: bookingDetails,
            eventTime: selectedTimeSlot,
            eventType: selectedEventType,
            numberOfGuests: parseInt(numberOfGuests),
            specialRequest: specialRequests || '',
            pricingType: isGuest ? 'guest' : 'member',
            membership_no: !isGuest ? membershipNo : null,
            guestName: isGuest ? guestName : null,
            guestContact: isGuest ? guestContact : null,
        };

        console.log('📤 Sending lawn booking payload:', payload);

        // Generate invoice for lawn booking
        // Note: Backend now creates the booking internally within this call
        const response = await lawnAPI.generateInvoiceLawn(venue.id, payload);

        console.log('✅ Invoice response:', response.data);

        if (response.data?.ResponseCode === '00') {
            Alert.alert(
                'Invoice Generated Successfully!',
                'Your lawn booking invoice has been created. Please complete the payment to confirm your reservation.',
                [
                    {
                        text: 'Proceed to Payment',
                        onPress: () => {
                            // Navigate to invoice/voucher screen
                            navigation.navigate('Voucher', {
                                invoiceData: response.data.Data || response.data,
                                bookingType: 'LAWN',
                                venue: venue,
                                bookingDetails: {
                                    ...payload,
                                    lawnName: venue.description,
                                    totalAmount: response.data.Data?.Amount || response.data.Amount,
                                    bookingSummary: response.data.Data?.BookingSummary,
                                    // Ensure invoiceNumber is passed if available
                                    invoiceNumber: response.data.Data?.InvoiceNumber || response.data.InvoiceNumber
                                }
                            });
                        }
                    },
                    {
                        text: 'View Details',
                        onPress: () => {
                            setShowBookingModal(false);
                        }
                    }
                ]
            );
        } else {
            throw new Error(response.data?.ResponseMessage || 'Failed to generate invoice');
        }

    } catch (error) {
        setBookingLoading(false);
        setShowBookingModal(false);

        console.error('❌ Lawn booking error:', error);

        let errorMessage = 'Failed to process booking. Please try again.';

        if (error.response?.status === 401) {
            errorMessage = 'Authentication failed. Please log in again.';
        } else if (error.response?.status === 400) {
            errorMessage = error.response.data?.message || 'Invalid booking data provided.';
        } else if (error.response?.status === 404) {
            errorMessage = 'Lawn not found or endpoint unavailable.';
        } else if (error.response?.status === 409) {
            errorMessage = error.response.data?.message || 'Lawn not available for selected date and time.';
        } else if (error.message) {
            errorMessage = error.message;
        }

        Alert.alert('Booking Failed', errorMessage);
    } finally {
        setBookingLoading(false);
    }
};
