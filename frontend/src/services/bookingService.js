import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const bookingService = {
  /**
   * Search buses based on source, destination, and travel date
   * @param {string} source - Departure city
   * @param {string} destination - Arrival city
   * @param {string} date - Travel date (YYYY-MM-DD)
   * @returns {Promise} List of buses matching criteria
   */
  searchBuses: (source, destination, date) => {
    return apiClient.get('/buses/search', {
      params: {
        source,
        destination,
        date,
      },
    });
  },

  /**
   * Get seat availability for a specific bus
   * @param {number} busId - Bus ID
   * @returns {Promise} List of seats with availability
   */
  getSeats: (busId) => {
    return apiClient.get(`/buses/${busId}/seats`);
  },

  /**
   * Book a ticket for a user
   * @param {object} bookingData - Booking details {userId, busId, seatId}
   * @returns {Promise} Booking confirmation details
   */
  bookTicket: (bookingData) => {
    return apiClient.post('/bookings', bookingData);
  },

  /**
   * Get booking history for a user
   * @param {number} userId - User ID
   * @returns {Promise} List of all bookings for the user
   */
  getBookingHistory: (userId) => {
    return apiClient.get(`/bookings/user/${userId}`);
  },

  /**
   * Cancel an existing booking
   * @param {number} bookingId - Booking ID to cancel
   * @returns {Promise} Cancellation confirmation
   */
  cancelBooking: (bookingId) => {
    return apiClient.delete(`/bookings/${bookingId}`);
  },

  /**
   * Get specific booking details
   * @param {number} bookingId - Booking ID
   * @returns {Promise} Booking details
   */
  getBookingDetails: (bookingId) => {
    return apiClient.get(`/bookings/${bookingId}`);
  },
};

export default bookingService;
