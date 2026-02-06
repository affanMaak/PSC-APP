// config/apis.js
import axios from 'axios'
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getBaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'https://admin.peshawarservicesclub.com/api';
    // return 'http://10.0.2.2:3000/api';
  } else {
    return 'https://admin.peshawarservicesclub.com/api';
  }
};

const base_url = getBaseUrl();
console.log('Using base URL:', base_url);

const api = axios.create({
  baseURL: base_url,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Token management functions
export const storeAuthData = async (tokens, userData) => {
  try {
    await AsyncStorage.setItem('access_token', tokens.access_token);
    await AsyncStorage.setItem('refresh_token', tokens.refresh_token);
    await AsyncStorage.setItem('user_data', JSON.stringify(userData));
    console.log('✅ Auth data stored');
  } catch (error) {
    console.error('Error storing auth data:', error);
  }
};

export const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem('access_token');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const userWho = async () => {
  try {
    console.log('🔍 Checking user active status...');
    const response = await api.get(`${base_url}/auth/user-who`);
    console.log('✅ User status active:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error checking user status:', error);
    throw error;
  }
};

export const registerFcmToken = async (memberId, fcmToken) => {
  try {
    console.log('🔄 Registering FCM token for member:', memberId);
    const response = await api.patch(`${base_url}/member/fcm-token?memberID=${memberId}`, { fcmToken });
    console.log('✅ FCM token registered:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error registering FCM token:', error);
    throw error;
  }
};

export const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};
export const getUserNotifications = async () => {
  try {
    const response = await api.get(`${base_url}/member/notifications`, {
      headers: {
        Authorization: `Bearer ${await getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

export const getMembershipNumber = async () => {
  try {
    const userData = await getUserData();
    // Try different possible field names for membership number
    return userData?.membershipNo ||
      userData?.membershipNumber ||
      userData?.memberId ||
      userData?.id ||
      '';
  } catch (error) {
    console.error('Error getting membership number:', error);
    return '';
  }
};

export const removeAuthData = async () => {
  try {
    await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user_data']);
    console.log('✅ Auth data removed');
  } catch (error) {
    console.error('Error removing auth data:', error);
  }
};

export const checkAuthStatus = async () => {
  try {
    const token = await getAuthToken();
    const userData = await getUserData();
    return {
      isAuthenticated: !!token,
      token: token,
      userData: userData
    };
  } catch (error) {
    console.error('Error checking auth status:', error);
    return { isAuthenticated: false, token: null, userData: null };
  }
};

export const banquetAPI = {
  getAllHalls: async () => {
    try {
      const response = await api.get(`${base_url}/hall/get/halls`);
      return response;
    } catch (error) {
      console.error("❌ Error fetching halls:", error.message);
      throw error;
    }
  },

  reserveHalls: async (payload) => {
    try {
      const response = await api.patch(`${base_url}/hall/reserve/halls`, payload);
      console.log(response)
      return response;
    } catch (error) {
      console.error("❌ Error reserving halls:", error.message);
      throw error;
    }
  },

  getHallReservations: async (hallId) => {
    try {
      const response = await api.get(`${base_url}/hall/reservations/${hallId}`);
      return response;
    } catch (error) {
      console.error("❌ Error fetching reservations:", error.message);
      throw error;
    }
  },

  getHallLogs: async (hallId, from, to) => {
    try {
      const response = await api.get(`${base_url}/hall/logs/${hallId}?from=${from}&to=${to}`);
      return response;
    } catch (error) {
      console.error("❌ Error fetching hall logs:", error.message);
      throw error;
    }
  },

  getHallVoucher: async (bookingId) => {
    try {
      const response = await api.get(`${base_url}/booking/voucher?bookingType=HALL&bookingId=${bookingId}`);
      return response;
    } catch (error) {
      console.error("❌ Error fetching hall voucher:", error.message);
      throw error;
    }
  },

  // UPDATED: Generate invoice with hallId as query parameter and proper payload for both member and guest
  memberBookingHall: async (hallId, payload) => {
    try {
      const token = await getAuthToken();

      console.log('🧾 Generating invoice for hall booking:', {
        hallId,
        payload,
        token: token ? 'Present' : 'Missing'
      });

      const headers = {
        'Content-Type': 'application/json',
        "Client-Type": "mobile",
      };

      // Add Authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await api.post(
        `${base_url}/payment/generate/invoice/hall?hallId=${hallId}`,
        payload,
        {
          headers: headers,
          timeout: 30000,
        }
      );

      return response;
    } catch (error) {
      console.error("❌ Error member booking hall:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  },
};


// Payment API functions
export const paymentAPI = {
  // Verify payment
  verifyPayment: async (invoiceNumber, transactionId) => {
    try {
      console.log('✅ Verifying payment:', invoiceNumber, transactionId);
      const response = await api.post('/payment/verify', {
        invoiceNumber,
        transactionId,
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error verifying payment:', error);
      throw error;
    }
  },
};
export const photoshootAPI = {
  // Get all photoshoots
  getAllPhotoshoots: async () => {
    try {
      console.log('🔄 Fetching all photoshoots...');
      const response = await api.get('/photoShoot/get/photoShoots', {
        withCredentials: true,
      });
      console.log('📊 Photoshoots response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching photoshoots:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  },

  // Get available photoshoots
  getAvailablePhotoshoots: async () => {
    try {
      console.log('🔄 Fetching available photoshoots...');
      const response = await api.get('/photoShoot/get/photoShoots/available', {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching available photoshoots:', error);
      throw error;
    }
  },

  // Generate invoice for photoshoot
  generateInvoicePhotoshoot: async (photoshootId, bookingData) => {
    try {
      console.log('🧾 Generating invoice for photoshoot:', photoshootId, bookingData);
      const token = getAuthToken()
      const response = await api.post(`${base_url}/payment/generate/invoice/photoshoot?photoshootId=${photoshootId}`,
        bookingData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            "Client-Type": "mobile",
          }
        }
      );
      console.log('✅ Invoice generation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error generating invoice:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  },
};

// Helper function for API calls
export const makeApiCall = async (apiFunction, ...args) => {
  try {
    console.log('📞 Making API call:', apiFunction.name);
    const result = await apiFunction(...args);
    console.log('✅ API call successful:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('❌ API call failed:', error);
    const errorMessage = error.response?.data?.message ||
      error.message ||
      'Something went wrong';
    return {
      success: false,
      message: errorMessage,
      status: error.response?.status
    };
  }
}

export const lawnAPI = {
  // Generate invoice for lawn booking
  generateInvoiceLawn: async (lawnId, payload) => {
    try {
      const token = await getAuthToken();

      console.log('🧾 Generating invoice for lawn booking:', {
        lawnId,
        payload,
        token: token ? 'Present' : 'Missing'
      });

      const headers = {
        'Content-Type': 'application/json',
        "Client-Type": "mobile",
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await api.post(
        `${base_url}/payment/generate/invoice/lawn?lawnId=${lawnId}`,
        payload,
        { headers, timeout: 30000 }
      );

      return response;
    } catch (error) {
      console.error("❌ Error in generateInvoiceLawn:", error);
      throw error;
    }
  },

  // Create lawn booking (THIS IS THE CRITICAL FIX)
  createLawnBooking: async (payload) => {
    try {
      console.log('🔄 Creating lawn booking...', payload);
      const token = await getAuthToken();

      // Try different possible endpoints
      const endpoints = [
        '/booking/member/booking/lawn', // Original
        '/payment/member/booking/lawn', // Alternative 1
        '/api/booking/member/booking/lawn', // Alternative 2
        '/booking/lawn', // Alternative 3
      ];

      let lastError = null;

      for (const endpoint of endpoints) {
        try {
          console.log(`🔄 Trying endpoint: ${endpoint}`);
          const headers = {
            'Content-Type': 'application/json',
            "Client-Type": "mobile",
          };

          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }

          const response = await api.post(
            `${base_url}${endpoint}`,
            payload,
            {
              headers: headers,
              timeout: 10000, // Shorter timeout for testing
            }
          );

          console.log(`✅ Success with endpoint: ${endpoint}`, response.data);
          return response;
        } catch (err) {
          console.log(`❌ Failed with endpoint ${endpoint}:`, err.message);
          lastError = err;
          continue;
        }
      }

      // If all endpoints failed
      throw lastError;

    } catch (error) {
      console.error('❌ Error in createLawnBooking:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url
      });
      throw error;
    }
  },
  getAvailableLawns: async () => {
    try {
      console.log('🔄 Fetching all lawns...');
      const response = await api.get('/lawn/get/lawns');
      return response;
    } catch (error) {
      console.error('❌ Error in getAvailableLawns:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get lawn names by category
  getLawnNames: async (categoryId) => {
    try {
      console.log('🔄 Fetching lawn names...');
      const response = await api.get(`/lawn/get/lawn/categories/names?catId=${categoryId}`);
      return response;
    } catch (error) {
      console.error('❌ Error in getLawnNames:', error.response?.data || error.message);
      throw error;
    }
  },

  // Admin: Reserve/Unreserve lawns (similar to hall reservation)
  reserveLawns: async (payload) => {
    try {
      console.log('🔄 Admin: Reserving/Unreserving lawns...');
      console.log('📤 Payload:', payload);

      const token = await getAuthToken();

      const response = await api.patch(
        `${base_url}/lawn/reserve/lawns`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          timeout: 30000,
        }
      );

      console.log('✅ Reserve response:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Error in reserveLawns:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  // Get lawn reservations
  getLawnReservations: async (lawnId) => {
    try {
      console.log('🔄 Fetching lawn reservations...');
      const token = await getAuthToken();

      const response = await api.get(
        `/lawn/reservations/${lawnId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response;
    } catch (error) {
      console.error('❌ Error in getLawnReservations:', error.response?.data || error.message);
      throw error;
    }
  },

  getLawnLogs: async (lawnId, from, to) => {
    try {
      const response = await api.get(`${base_url}/lawn/logs/${lawnId}?from=${from}&to=${to}`);
      return response;
    } catch (error) {
      console.error("❌ Error fetching lawn logs:", error.message);
      throw error;
    }
  },

  // Update lawn details
  updateLawn: async (payload) => {
    try {
      console.log('🔄 Updating lawn...');
      const token = await getAuthToken();

      const response = await api.patch(
        '/lawn/update/lawn',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response;
    } catch (error) {
      console.error('❌ Error in updateLawn:', error.response?.data || error.message);
      throw error;
    }
  },

  // Other existing functions...


  getLawnCategories: async () => {
    try {
      console.log('🔄 Fetching lawn categories...');
      const response = await api.get('/lawn/get/lawn/categories');
      return response;
    } catch (error) {
      console.error('❌ Error in getLawnCategories:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get lawns by category ID
  getLawnsByCategory: async (categoryId) => {
    try {
      console.log('🔄 Fetching lawns by category...');
      const response = await api.get(`/lawn/get/lawns/available?catId=${categoryId}`);
      return response;
    } catch (error) {
      console.error('❌ Error in getLawnsByCategory:', error.response?.data || error.message);
      throw error;
    }
  },

  // ... rest of your functions
};

export const voucherAPI = {
  getVouchers: async (bookingType, bookingId) => {
    try {
      console.log("📨 Fetching vouchers:", bookingType, bookingId);

      const response = await api.get(
        `/booking/voucher?bookingType=${bookingType}&bookingId=${bookingId}`
      );

      return response.data;
    } catch (error) {
      console.error("❌ Voucher API Error:", error.response?.data || error.message);
      throw error;
    }
  },
};

export const getAffiliatedClubs = async () => {
  try {
    const response = await api.get(`${base_url}/affiliation/clubs`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Failed to fetch affiliated clubs";
    throw new Error(message);
  }
};

export const getAffiliatedClubRequests = async (from, to, clubId) => {
  try {
    const params = {};
    if (from) params.from = from;
    if (to) params.to = to;
    if (clubId) params.clubId = clubId;

    // Note: This endpoint might return all requests if no filters are provided
    const response = await api.get(`${base_url}/affiliation/requests`, { params });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching club requests:", error.message);
    throw error;
  }
};
export const createAffiliatedClubRequest = async (requestData) => {
  try {
    // The web portal backend expects: affiliatedClubId, membershipNo, requestedDate
    const payload = {
      affiliatedClubId: requestData.affiliatedClubId,
      membershipNo: requestData.membershipNo, // This is a number in web portal
      requestedDate: requestData.requestedDate // Already in YYYY-MM-DD format
    };

    console.log('Sending payload:', payload);

    // Get token from AsyncStorage
    const token = await AsyncStorage.getItem('access_token');

    const response = await api.post(`${base_url}/affiliation/requests`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.log('API Error:', error.response?.data || error.message);

    let message = "Failed to create request";

    if (error.response) {
      if (error.response.status === 404) {
        message = "Club or member not found. Please check your membership number.";
      } else if (error.response.status === 400) {
        message = error.response.data?.message || "Invalid request data";
      } else if (error.response.status === 500) {
        message = "Server error. Please try again later.";
      } else {
        message = error.response.data?.message || message;
      }
    }

    throw new Error(message);
  }
};

export const getAds = async () => {
  try {
    const response = await axios.get(`${base_url}/content/ads`);
    return response.data;
  } catch (error) {
    throw {
      message: error?.response?.data?.message || "Error fetching ads",
      status: error?.response?.status || 500,
    };
  }
};
export const getEvents = async () => {
  try {
    const response = await axios.get(`${base_url}/content/events`, {
      withCredentials: true, // Add this if your API requires authentication
    });
    console.log('✅ API Response:', response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error('❌ API Error:', error);
    console.error('❌ Error details:', error.response?.data);
    throw {
      message: error?.response?.data?.message || "Error fetching events",
      status: error?.response?.status || 500,
    };
  }
};

export const getRules = async () => {
  try {
    const response = await axios.get(`${base_url}/content/rules?type=CLUB`);
    return response.data;
  } catch (error) {
    console.error('Error fetching rules:', error);
    throw {
      message: error.response?.data?.message || "Error fetching rules",
      status: error.response?.status || 500
    };
  }
};

export const getAboutUs = async () => {
  try {
    const response = await axios.get(`${base_url}/content/about-us`);
    return response.data;
  } catch (error) {
    console.error('Error fetching about us:', error);
    throw {
      message: error.response?.data?.message || "Error fetching about us",
      status: error.response?.status || 500
    };
  }
};

// Club History APIs
export const getClubHistory = async () => {
  try {
    const response = await axios.get(`${base_url}/content/history`);
    return response.data;
  } catch (error) {
    console.error('Error fetching club history:', error);
    throw {
      message: error.response?.data?.message || "Error fetching club history",
      status: error.response?.status || 500
    };
  }
};

export const getDashboardStats = async () => {
  try {
    console.log('Fetching dashboard stats...');

    // Get token manually first
    const token = await AsyncStorage.getItem('access_token');
    console.log('Token available:', !!token);

    const response = await api.get(`${base_url}/dashboard/stats`, {
      // Note: We're using the api instance which already has interceptors
      // So no need to manually add headers here
    });

    console.log('Dashboard stats fetched successfully');
    return response.data;
  } catch (error) {
    console.error('Dashboard API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config,
    });

    // If it's a 401, check if we have a token
    if (error.response?.status === 401) {
      const token = await AsyncStorage.getItem('access_token');
      console.log('Token on 401 error:', token);

      // If no token, throw specific error
      if (!token) {
        throw new Error('Not authenticated. Please login again.');
      }
    }

    throw new Error(
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Failed to load dashboard data'
    );
  }
};
export const getSports = async () => {
  try {
    console.log('🌐 Fetching sports from API...');

    // Check authentication first
    const authenticated = await isAuthenticated();
    console.log('User authenticated:', authenticated);

    const token = await getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Add authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('Using token for authentication');
    } else {
      console.log('No token available, trying without auth');
    }

    // Create timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 10000);
    });

    // Fetch promise
    const fetchPromise = fetch(`${base_url}/sport/get/sports`, {
      method: 'GET',
      headers: headers,
    });

    // Race between fetch and timeout
    const response = await Promise.race([fetchPromise, timeoutPromise]);

    console.log('Response status:', response.status);

    // Handle 403 - Forbidden (authentication issue)
    if (response.status === 403) {
      console.log('⚠️ Access forbidden - authentication required');

      // Try one more time without any auth headers
      try {
        console.log('Trying without any authentication headers...');
        const simpleResponse = await fetch(`${base_url}/sport/get/sports`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        if (simpleResponse.ok) {
          const data = await simpleResponse.json();
          console.log('✅ Got data without authentication');
          return {
            data: data,
            source: 'api',
            requiresAuth: false
          };
        }
      } catch (retryError) {
        console.log('Retry also failed:', retryError.message);
      }

      console.log('🚫 API requires authentication. Using mock data.');
      const mockData = getMockSports();
      return {
        data: mockData,
        source: 'mock',
        requiresAuth: true,
        message: 'Authentication required to access real data'
      };
    }

    // Handle no content or not found
    if (response.status === 204 || response.status === 404) {
      console.log('No sports found in database');
      const mockData = getMockSports();
      return {
        data: mockData,
        source: 'mock',
        message: 'No data available, showing demo'
      };
    }

    // Check if response is OK
    if (!response.ok) {
      console.log('Response not OK, status:', response.status);
      const mockData = getMockSports();
      return {
        data: mockData,
        source: 'mock',
        message: `API error: ${response.status}`
      };
    }

    const responseData = await response.json();

    // Check if data is valid
    if (!responseData) {
      console.log('Empty response');
      const mockData = getMockSports();
      return {
        data: mockData,
        source: 'mock',
        message: 'Empty response from server'
      };
    }

    // Handle different response formats
    let sportsData = [];
    if (Array.isArray(responseData)) {
      sportsData = responseData;
    } else if (responseData.data && Array.isArray(responseData.data)) {
      sportsData = responseData.data;
    } else if (typeof responseData === 'object') {
      sportsData = [responseData];
    }

    console.log(`✅ Got ${sportsData.length} sports from API`);
    return {
      data: sportsData,
      source: 'api',
      requiresAuth: false
    };

  } catch (error) {
    console.error('❌ Error fetching sports:', error.message || error);
    console.log('🔄 Using mock data due to error');
    const mockData = getMockSports();
    return {
      data: mockData,
      source: 'mock',
      message: error.message || 'Network error',
      error: true
    };
  }
};

export const isAuthenticated = async () => {
  try {
    const token = await AsyncStorage.getItem('access_token');
    return !!token;
  } catch (error) {
    console.log('Error checking authentication:', error);
    return false;
  }
};

// Test API connection without authentication
export const testApiConnection = async () => {
  try {
    // Try a simple endpoint that might not require auth
    const response = await fetch(`${base_url}/sport/get/sports`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log('API test response status:', response.status);

    if (response.status === 403) {
      return {
        ok: false,
        message: 'API requires authentication',
        status: 403
      };
    }

    return {
      ok: response.ok,
      status: response.status,
      message: response.ok ? 'Connected' : 'Failed'
    };
  } catch (error) {
    console.log('🌐 API connection test failed:', error.message);
    return {
      ok: false,
      message: error.message || 'Network error',
      status: 0
    };
  }
};

export const calendarAPI = {
  // Get all calendar data
  getAllCalendarData: async (params = {}) => {
    try {
      console.log('Fetching all calendar data with params:', params);

      const [rooms, halls, lawns, photoshoots] = await Promise.all([
        calendarAPI.getCalendarRooms(params),
        calendarAPI.getHalls(params),
        calendarAPI.getLawns(params),
        calendarAPI.getPhotoshoots(params),
      ]);

      // Normalize data structure
      const normalizedRooms = (rooms || []).map(room => ({
        id: room.id || room._id,
        roomNumber: room.roomNumber || room.roomNo || room.id,
        roomName: room.roomName || `Room ${room.roomNumber || room.roomNo || room.id}`,
        roomType: room.roomType || { type: 'Standard' },
        rate: room.rate || room.price || 0,
        status: room.status || 'AVAILABLE',
        bookings: Array.isArray(room.bookings) ? room.bookings : [],
        reservations: Array.isArray(room.reservations) ? room.reservations : [],
        outOfOrders: Array.isArray(room.outOfOrders) ? room.outOfOrders : [],
        // Include all original properties
        ...room
      }));

      console.log('Normalized rooms data:', {
        total: normalizedRooms.length,
        sample: normalizedRooms[0] ? {
          id: normalizedRooms[0].id,
          bookings: normalizedRooms[0].bookings.length,
          reservations: normalizedRooms[0].reservations.length
        } : 'No rooms'
      });

      return {
        rooms: normalizedRooms,
        halls: halls || [],
        lawns: lawns || [],
        photoshoots: photoshoots || []
      };
    } catch (error) {
      console.error('Error fetching all calendar data:', error);
      throw error;
    }
  },

  // Room endpoints
  getCalendarRooms: async (params = {}) => {
    try {
      console.log('Fetching rooms with params:', params);
      const response = await api.get(`${base_url}/room/calendar`, { params });
      const rooms = response.data || [];

      console.log('Raw rooms data received:', {
        count: rooms.length,
        firstRoom: rooms[0] || 'No rooms'
      });

      // Normalize room data
      return rooms.map(room => {
        const normalizedRoom = {
          id: room.id || room._id,
          roomNumber: room.roomNumber || room.roomNo || room.id,
          roomName: room.roomName || `Room ${room.roomNumber || room.roomNo || room.id}`,
          roomType: room.roomType || { type: 'Standard' },
          rate: room.rate || room.price || 0,
          status: room.status || 'AVAILABLE',
          bookings: [],
          reservations: [],
          outOfOrders: [],
          // Include all original properties
          ...room
        };

        // Ensure arrays are properly initialized and normalize internal structures if needed
        if (room.bookings && Array.isArray(room.bookings)) {
          normalizedRoom.bookings = room.bookings.map(booking => ({
            id: booking.id || booking._id,
            checkIn: booking.checkIn,
            checkOut: booking.checkOut,
            bookingDate: booking.bookingDate,
            paymentStatus: booking.paymentStatus,
            status: booking.status,
            memberName: booking.memberName,
            guestName: booking.guestName,
            totalPrice: booking.totalPrice,
            ...booking
          }));
        }

        if (room.reservations && Array.isArray(room.reservations)) {
          normalizedRoom.reservations = room.reservations.map(reservation => ({
            id: reservation.id || reservation._id,
            reservedFrom: reservation.reservedFrom,
            reservedTo: reservation.reservedTo,
            startDate: reservation.startDate,
            endDate: reservation.endDate,
            admin: reservation.admin,
            ...reservation
          }));
        }

        if (room.outOfOrders && Array.isArray(room.outOfOrders)) {
          normalizedRoom.outOfOrders = room.outOfOrders.map(order => ({
            id: order.id || order._id,
            startDate: order.startDate,
            endDate: order.endDate,
            reason: order.reason,
            ...order
          }));
        }

        return normalizedRoom;
      });
    } catch (error) {
      console.error('Error fetching calendar rooms:', error.message);
      return [];
    }
  },

  // Hall endpoints
  getHalls: async (params = {}) => {
    try {
      const response = await api.get('/hall/get/halls', { params });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching halls:', error.message);
      return [];
    }
  },

  // Lawn endpoints
  getLawns: async (params = {}) => {
    try {
      const response = await api.get('/lawn/get/lawns', { params });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching lawns:', error.message);
      return [];
    }
  },

  // Photoshoot endpoints
  getPhotoshoots: async (params = {}) => {
    try {
      const response = await api.get('/photoShoot/get/photoShoots', { params });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching photoshoots:', error.message);
      return [];
    }
  },
};

export const getHallRule = async () => {
  try {
    const response = await api.get(`${base_url}/booking/hall/rule`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      },
    });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching hall rule:', error.message);
    return [];
  }
}
export const getRoomRule = async () => {
  try {
    const response = await api.get(`${base_url}/booking/room/rule`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      },
    });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching hall rule:', error.message);
    return [];
  }
}
export const getLawnRule = async () => {
  try {
    const response = await api.get(`${base_url}/booking/lawn/rule`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      },
    });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching hall rule:', error.message);
    return [];
  }
}
export const getPhotoshootRule = async () => {
  try {
    const response = await api.get(`${base_url}/booking/photo/rule`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      },
    });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching hall rule:', error.message);
    return [];
  }
}
export const getMessingCategory = async () => {
  try {
    const response = await api.get(`${base_url}/messing/category`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      },
    });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching hall rule:', error.message);
    return [];
  }
}
export const getMessingItemsByCategory = async (catID) => {
  try {
    const response = await api.get(`${base_url}/messing/item/category/${catID}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      },
    });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching hall rule:', error.message);
    return [];
  }
}

export const getMessingSubCategoriesByCategory = async (catID) => {
  try {
    const response = await api.get(`${base_url}/messing/subcategory/category/${catID}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      },
    });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching subcategories:', error.message);
    return [];
  }
}

export const getMessingItemsBySubCategory = async (subCatID) => {
  try {
    const response = await api.get(`${base_url}/messing/item/subcategory/${subCatID}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      },
    });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching items by subcategory:', error.message);
    return [];
  }
}

export const getCurrentAdmin = async () => {
  try {
    // First, check if there's a stored admin token
    const token = await AsyncStorage.getItem('adminToken') || await AsyncStorage.getItem('access_token');

    // Get user/admin data from storage
    const userDataStr = await AsyncStorage.getItem('user_data');
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      // Check if the user is an admin
      if (userData && (userData.role === 'ADMIN' || userData.role === 'SUPER_ADMIN')) {
        return {
          id: userData.id || userData.memberId,
          name: userData.name,
          email: userData.email,
          role: userData.role
        };
      }
    }

    // Fallback: check individual fields (legacy support)
    const adminId = await AsyncStorage.getItem('adminId');
    const adminName = await AsyncStorage.getItem('adminName');
    const adminEmail = await AsyncStorage.getItem('adminEmail');

    if (adminId) {
      return {
        id: parseInt(adminId),
        name: adminName || 'Admin',
        email: adminEmail,
      };
    }

    // If still nothing, try to fetch from API if we have a token
    if (token) {
      try {
        const response = await api.get('/auth/user-who');
        const user = response.data;
        if (user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN')) {
          return user;
        }
      } catch (e) {
        console.warn('Failed to fetch user-who in getCurrentAdmin:', e.message);
      }
    }

    return null;
  } catch (error) {
    console.error('Get current admin error:', error);
    return null;
  }
};

// Get all admins (from your original web portal code)
export const getAuthAdmins = async () => {
  try {
    const response = await api.get('/auth/admins');
    return response.data;
  } catch (error) {
    console.error('Get admins error:', error);
    throw error;
  }
};

// Get admin's reservations (updated from your web portal code)
export const getAdminReservations = async (adminId, filters = {}) => {
  try {
    const params = {
      adminId: adminId,
      ...filters,
    };

    const response = await api.get('/auth/reservations', { params });
    return response.data;
  } catch (error) {
    console.error('Get reservations error:', error);
    throw error;
  }
};

// Cancel reservation
export const cancelReservation = async (reservationId) => {
  try {
    const response = await api.delete(`/auth/reservations/${reservationId}`);
    return response.data;
  } catch (error) {
    console.error('Cancel reservation error:', error);
    throw error;
  }
};

// Update reservation
export const updateReservation = async (reservationId, updateData) => {
  try {
    const response = await api.put(`/auth/reservations/${reservationId}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Update reservation error:', error);
    throw error;
  }
};

// Login admin and store credentials
export const loginAdmin = async (email, password) => {
  try {
    const response = await api.post('/auth/login/admin', {
      email,
      password,
    });

    const { access_token, refresh_token, admin } = response.data;

    // Store in AsyncStorage using consistent keys
    await storeAuthData({ access_token, refresh_token }, {
      ...admin,
      role: admin.role || 'ADMIN'
    });

    // Also store admin specific keys for backward compatibility
    await AsyncStorage.setItem('adminToken', access_token);
    await AsyncStorage.setItem('adminId', admin.id.toString());
    await AsyncStorage.setItem('adminName', admin.name);
    await AsyncStorage.setItem('adminEmail', admin.email);

    return { admin, token: access_token };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Logout admin
export const logoutAdmin = async () => {
  try {
    await AsyncStorage.removeItem('adminToken');
    await AsyncStorage.removeItem('adminId');
    await AsyncStorage.removeItem('adminName');
    await AsyncStorage.removeItem('adminEmail');
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// Check if admin is logged in
export const isAdminLoggedIn = async () => {
  try {
    const token = await AsyncStorage.getItem('adminToken');
    return !!token;
  } catch (error) {
    console.error('Check login error:', error);
    return false;
  }
};

// Date formatting functions
export const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    };
    return date.toLocaleDateString('en-US', options);
  } catch (error) {
    return 'Invalid Date';
  }
};

export const formatDateTime = (dateString) => {
  try {
    const date = new Date(dateString);
    const dateOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    };
    const timeOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC'
    };

    const formattedDate = date.toLocaleDateString('en-US', dateOptions);
    const formattedTime = date.toLocaleTimeString('en-US', timeOptions);

    return `${formattedDate} at ${formattedTime}`;
  } catch (error) {
    return 'Invalid Date';
  }
};

export const formatDateForInput = (dateString) => {
  try {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  } catch (error) {
    return '';
  }
};

export const feedbackAPI = {
  getCategories: async () => {
    try {
      const response = await api.get(`${base_url}/feedback/categories`);
      return response.data;
    } catch (error) {
      console.error('Get categories error:', error);
      throw error;
    }
  },

  getSubCategories: async () => {
    try {
      const response = await api.get(`${base_url}/feedback/subcategories`);
      return response.data;
    } catch (error) {
      console.error('Get subcategories error:', error);
      throw error;
    }
  },

  // FIXED: This should call the CREATE endpoint, not add remark
  submitFeedback: async (feedbackData) => {
    try {
      const response = await api.post(`${base_url}/feedback`, feedbackData);
      return response.data;
    } catch (error) {
      console.error('Submit feedback error:', error);
      throw error;
    }
  },

  // Add remark to existing feedback (if needed later)
  addRemark: async (feedbackId, remarkData) => {
    try {
      const response = await api.post(`${base_url}/feedback/${feedbackId}/remark`, remarkData);
      return response.data;
    } catch (error) {
      console.error('Add remark error:', error);
      throw error;
    }
  },
};
// export const feedbackAPI = {
//   getCategories: async () => {
//     try {
//       const response = await api.get(`${base_url}/feedback/categories`);
//       return response.data;
//     } catch (error) {
//       console.error('Get categories error:', error);
//       throw error;
//     }
//   },
//   getSubCategories: async () => {
//     try {
//       const response = await api.get(`${base_url}/feedback/subcategories`);
//       return response.data;
//     } catch (error) {
//       console.error('Get subcategories error:', error);
//       throw error;
//     }
//   },
//   submitFeedback: async (feedbackData) => {
//     try {
//       const response = await api.post(`${base_url}/:id/remark`, feedbackData);
//       return response.data;
//     } catch (error) {
//       console.error('Submit feedback error:', error);
//       throw error;
//     }
//   },
// };

export { base_url, api };

