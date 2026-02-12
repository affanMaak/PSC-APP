
import { api, base_url, getAuthToken } from '../config/apis';

export const bookingService = {
  // Member room booking - returns invoice immediately
  memberBookingRoom: async (roomType, payload) => {
    try {
      const token = await getAuthToken();

      console.log('📤 Sending booking payload:', JSON.stringify(payload, null, 2));

      const response = await api.post(`${base_url}/payment/generate/invoice/room?roomType=${roomType}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      });

      console.log('✅ Invoice response:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Booking error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  // Get invoice for booking - available immediately after booking
  // bookingType can be: 'Room', 'Hall', 'Lawn', 'Photoshoot'
  getInvoice: async (bookingId, numericBookingId = null, bookingType = null) => {
    try {
      const token = await getAuthToken();

      if (!bookingId) {
        throw new Error('Booking ID is required');
      }

      console.log('🧾 Fetching invoice for booking:', { bookingId, numericBookingId, bookingType });

      // Build endpoints based on booking type
      const baseId = numericBookingId || bookingId;
      const typeUpper = (bookingType || 'Room').toUpperCase();

      // Type-specific endpoints
      const endpoints = [
        // Generic invoice endpoints (try first)
        `/booking/invoice?bookingId=${baseId}`,
        `/payment/invoice/${baseId}`,
        `/invoice/booking/${baseId}`,
        `/booking/get/invoice?bookingId=${baseId}`,

        // Type-specific voucher endpoints
        `/booking/voucher?bookingType=${typeUpper}&bookingId=${baseId}`,
        `/voucher/booking/${baseId}`,
      ];

      // Add type-specific endpoints based on booking type
      if (typeUpper === 'HALL') {
        endpoints.push(
          `/hall/invoice?bookingId=${baseId}`,
          `/booking/voucher?bookingType=HALL&bookingId=${baseId}`,
          `/halls/voucher/${baseId}`
        );
      } else if (typeUpper === 'LAWN') {
        endpoints.push(
          `/lawn/invoice?bookingId=${baseId}`,
          `/booking/voucher?bookingType=LAWN&bookingId=${baseId}`,
          `/lawns/voucher/${baseId}`
        );
      } else if (typeUpper === 'PHOTOSHOOT') {
        endpoints.push(
          `/photoshoot/invoice?bookingId=${baseId}`,
          `/booking/voucher?bookingType=PHOTOSHOOT&bookingId=${baseId}`,
          `/shoots/voucher/${baseId}`
        );
      } else {
        // Room booking (default)
        endpoints.push(
          `/booking/voucher?bookingType=ROOM&bookingId=${baseId}`,
        );
      }

      let lastError = null;

      for (const endpoint of endpoints) {
        try {
          console.log(`🔍 Trying invoice endpoint: ${endpoint}`);
          const response = await api.get(endpoint, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            timeout: 10000,
          });

          console.log('✅ Invoice response from', endpoint, ':', response.data);

          if (response.data) {
            // Handle array response
            if (Array.isArray(response.data) && response.data.length > 0) {
              return response.data[0];
            }
            // Handle wrapped response
            if (response.data.data) {
              return Array.isArray(response.data.data) ? response.data.data[0] : response.data.data;
            }
            // Handle voucher wrapper
            if (response.data.voucher) {
              return {
                ...response.data,
                ...response.data.voucher,
                invoiceNumber: response.data.voucher.voucher_no || response.data.voucher.voucherNumber,
                consumerNumber: response.data.voucher.consumer_number || response.data.voucher.consumerNumber
              };
            }
            // Direct object
            return response.data;
          }

        } catch (endpointError) {
          console.log(`❌ Invoice endpoint ${endpoint} failed:`, endpointError.message);
          lastError = endpointError;
          continue;
        }
      }

      throw lastError || new Error('Invoice not found');

    } catch (error) {
      console.error('❌ Invoice fetch error:', error.message);
      throw new Error(error.message || 'Failed to load invoice data');
    }
  },

  // Create local invoice as fallback
  createLocalInvoice: (bookingId, bookingData, roomType, selectedRoom, invoiceNo = null) => {
    console.log('🔄 Creating local invoice as fallback');

    const localInvoiceNo = invoiceNo || `INV-${bookingId}-${Date.now()}`;

    return {
      invoice_no: localInvoiceNo,
      invoiceNumber: localInvoiceNo,
      bookingId: bookingId,
      roomType: roomType?.name,
      roomNumber: selectedRoom?.roomNumber,
      checkIn: bookingData?.checkIn,
      checkOut: bookingData?.checkOut,
      numberOfAdults: bookingData?.numberOfAdults || 1,
      numberOfChildren: bookingData?.numberOfChildren || 0,
      numberOfRooms: bookingData?.numberOfRooms || 1,
      totalPrice: bookingData?.totalPrice,
      paymentMode: 'PENDING',
      status: 'PENDING_PAYMENT',
      issued_at: new Date().toISOString(),
      issued_by: 'System',
      note: 'This is your booking invoice. Complete payment to confirm your reservation.',
      isLocal: true,
      isInvoice: true
    };
  },

  // Get member bookings
  getMemberBookings: async () => {
    try {
      const token = await getAuthToken();
      const response = await api.get('/booking/get/bookings/all?bookingsFor=rooms', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching member bookings:', error);
      throw error;
    }
  },

  // Update booking
  updateBooking: async (payload) => {
    try {
      const token = await getAuthToken();
      const response = await api.patch('/booking/update/booking', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  },

  // Delete booking
  deleteBooking: async (consumer_number) => {
    console.log(consumer_number)
    try {
      const token = await getAuthToken();
      const response = await api.delete(`/booking/cancel-unpaid?consumer_number=${consumer_number}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  },
  cancelReqBooking: async (
    bookingFor,
    bookID,
    reason
  ) => {
    try {
      const response = await api.post(
        `/booking/cancelReqBooking?bookingFor=${bookingFor}&bookID=${bookID}${reason ? `&reason=${encodeURIComponent(reason)}` : ""}`
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Something went wrong";

      throw { message, status: error.response?.status || 500 };
    }
  },
  //view member history
  getMemberBookings: async (membershipNo) => {
    try {
      const token = await getAuthToken();
      console.log('📋 Fetching bookings for member:', membershipNo);

      // Try multiple endpoints if needed
      const endpoints = [
        `/booking/member/bookings?membershipNo=${membershipNo}`,
        `/booking/member/bookings/all?membership_no=${membershipNo}`,
        `/booking/get/bookings/all?membership_no=${membershipNo}`,
      ];

      let lastError = null;
      let responseData = null;

      for (const endpoint of endpoints) {
        try {
          console.log(`🔍 Trying endpoint: ${endpoint}`);
          const response = await api.get(endpoint, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log(`✅ Response from ${endpoint}:`, response.data);

          if (response.data &&
            (Array.isArray(response.data) ||
              response.data.bookings ||
              response.data.data ||
              response.data.Room)) {
            responseData = response.data;
            break;
          }

        } catch (endpointError) {
          console.log(`❌ Endpoint ${endpoint} failed:`, endpointError.message);
          lastError = endpointError;
          continue;
        }
      }

      if (!responseData) {
        throw lastError || new Error('No bookings found');
      }

      return responseData;
    } catch (error) {
      console.error('❌ Error fetching member bookings:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  // Get member's bookings by type - Enhanced
  getMemberBookingsByType: async (type, membershipNo) => {
    try {
      const token = await getAuthToken();
      console.log('📋 Fetching bookings for member:', membershipNo, 'type:', type);

      // Try different endpoints for type-specific bookings
      const endpoints = [
        `/booking/member/bookings/all?type=${type}&membership_no=${membershipNo}`,
        `/booking/member/bookings/all?type=${type}&membershipNo=${membershipNo}`,
        `/booking/get/bookings/all?type=${type}&membership_no=${membershipNo}`,
      ];

      let lastError = null;
      let responseData = null;

      for (const endpoint of endpoints) {
        try {
          console.log(`🔍 Trying endpoint: ${endpoint}`);
          const response = await api.get(endpoint, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log(`✅ Response from ${endpoint}:`, response.data);

          if (response.data) {
            responseData = response.data;
            break;
          }

        } catch (endpointError) {
          console.log(`❌ Endpoint ${endpoint} failed:`, endpointError.message);
          lastError = endpointError;
          continue;
        }
      }

      if (!responseData) {
        throw lastError || new Error(`No ${type} bookings found`);
      }

      return responseData;
    } catch (error) {
      console.error('❌ Error fetching member bookings by type:', error);
      throw error;
    }
  },

  //view admin history of member 
  getMemberBookingsAdmin: async (type, membershipNo) => {
    try {
      const token = await getAuthToken();
      console.log('👮 Admin fetching bookings for member:', membershipNo, 'type:', type);

      const response = await api.get(
        `/booking/member/bookings/all?type=${type}&membership_no=${membershipNo}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('✅ Admin bookings response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching admin bookings:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  // Admin: Collect payment (mark as paid)
  collectPayment: async (bookingId, amount) => {
    try {
      const token = await getAuthToken();
      const response = await api.post(
        `/payment/collect`,
        {
          bookingId: bookingId,
          amount: amount,
          paymentMethod: 'CASH', // or 'CARD', 'TRANSFER', etc.
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error collecting payment:', error);
      throw error;
    }
  },

  // Admin: Process refund
  processRefund: async (bookingId, refundAmount, reason) => {
    try {
      const token = await getAuthToken();
      const response = await api.post(
        `/payment/refund`,
        {
          bookingId: bookingId,
          refundAmount: refundAmount,
          reason: reason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  },

  // Admin: Update booking status
  updateBookingStatus: async (bookingId, status) => {
    try {
      const token = await getAuthToken();
      const response = await api.patch(
        `/booking/update/status`,
        {
          bookingId: bookingId,
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  },

  // Admin: Get all member IDs (for search suggestions)
  getAllMembers: async () => {
    try {
      const token = await getAuthToken();
      const response = await api.get('/members/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching members:', error);
      throw error;
    }
  },

};