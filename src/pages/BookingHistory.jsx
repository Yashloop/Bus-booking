import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import bookingService from '../services/bookingService';
import '../styles/BookingHistory.css';

function BookingHistory() {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelingId, setCancelingId] = useState(null);
  const [expandedBookingId, setExpandedBookingId] = useState(null);
  const userId = localStorage.getItem('userId');

  // Check if user is authenticated
  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }
    fetchBookingHistory();
  }, [userId, navigate]);

  const fetchBookingHistory = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await bookingService.getBookingHistory(userId);
      setBookings(response.data);
    } catch (err) {
      console.error('Error fetching booking history:', err);
      setError('Failed to load booking history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setCancelingId(bookingId);
    try {
      await bookingService.cancelBooking(bookingId);
      // Remove from list or update status
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId
            ? { ...booking, bookingStatus: 'CANCELLED' }
            : booking
        )
      );
    } catch (err) {
      console.error('Error canceling booking:', err);
      alert(
        err.response?.data?.message ||
        'Failed to cancel booking. Please try again.'
      );
    } finally {
      setCancelingId(null);
    }
  };

  const handleSearchAgain = () => {
    navigate('/search');
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'status-confirmed';
      case 'CANCELLED':
        return 'status-cancelled';
      case 'COMPLETED':
        return 'status-completed';
      default:
        return 'status-pending';
    }
  };

  const getStatusDisplay = (status) => {
    const statusMap = {
      CONFIRMED: '✓ Confirmed',
      CANCELLED: '✕ Cancelled',
      COMPLETED: '✓ Completed',
      PENDING: '⏳ Pending',
    };
    return statusMap[status] || status;
  };

  // Show confirmation message if just booked
  const bookingConfirmed = location.state?.bookingConfirmed;

  return (
    <div className="booking-history-container">
      <div className="history-header">
        <h1>My Bookings</h1>
        <button className="new-booking-btn" onClick={handleSearchAgain}>
          + New Booking
        </button>
      </div>

      {bookingConfirmed && (
        <div className="success-message">
          <h3>✓ Booking Confirmed!</h3>
          <p>Your ticket has been successfully booked. Check the details below.</p>
        </div>
      )}

      {error && !loading && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchBookingHistory}>Retry</button>
        </div>
      )}

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading your bookings...</p>
        </div>
      )}

      {!loading && bookings.length === 0 ? (
        <div className="no-bookings">
          <div className="empty-icon">📋</div>
          <h2>No Bookings Yet</h2>
          <p>You haven't booked any tickets. Start your journey today!</p>
          <button className="search-btn" onClick={handleSearchAgain}>
            Search for Buses
          </button>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className={`booking-card ${getStatusStyle(booking.bookingStatus)}`}
            >
              <div className="booking-header">
                <div className="booking-info">
                  <h3>{booking.busName}</h3>
                  <span className={`status-badge ${getStatusStyle(booking.bookingStatus)}`}>
                    {getStatusDisplay(booking.bookingStatus)}
                  </span>
                </div>
                <div className="booking-id">Booking ID: #{booking.id}</div>
              </div>

              <div className="route-info">
                <div className="route-point">
                  <div className="point-label">From</div>
                  <div className="point-value">{booking.source}</div>
                </div>
                <div className="route-arrow">→</div>
                <div className="route-point">
                  <div className="point-label">To</div>
                  <div className="point-value">{booking.destination}</div>
                </div>
              </div>

              <div className="booking-details">
                <div className="detail-group">
                  <div className="detail">
                    <span className="label">Seat Number:</span>
                    <span className="value">{booking.seatNumber}</span>
                  </div>
                  <div className="detail">
                    <span className="label">Fare:</span>
                    <span className="value">₹{booking.fare.toFixed(2)}</span>
                  </div>
                </div>

                <div className="detail-group">
                  <div className="detail">
                    <span className="label">Travel Date:</span>
                    <span className="value">{new Date(booking.travelDate).toLocaleDateString()}</span>
                  </div>
                  <div className="detail">
                    <span className="label">Departure Time:</span>
                    <span className="value">{booking.departureTime}</span>
                  </div>
                </div>

                <div className="detail-group">
                  <div className="detail">
                    <span className="label">Booking Time:</span>
                    <span className="value">
                      {new Date(booking.bookingTime).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                className="expand-btn"
                onClick={() =>
                  setExpandedBookingId(
                    expandedBookingId === booking.id ? null : booking.id
                  )
                }
              >
                {expandedBookingId === booking.id ? '▼ Less Details' : '▶ More Details'}
              </button>

              {expandedBookingId === booking.id && (
                <div className="expanded-details">
                  <div className="detail-row">
                    <span className="label">Bus Number:</span>
                    <span className="value">{booking.busNumber}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Arrival Time:</span>
                    <span className="value">{booking.arrivalTime}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Passenger Name:</span>
                    <span className="value">{booking.passengerName || 'N/A'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Mobile:</span>
                    <span className="value">{booking.mobileNumber || 'N/A'}</span>
                  </div>
                </div>
              )}

              <div className="booking-actions">
                {booking.bookingStatus === 'CONFIRMED' && (
                  <button
                    className="cancel-booking-btn"
                    onClick={() => handleCancelBooking(booking.id)}
                    disabled={cancelingId === booking.id}
                  >
                    {cancelingId === booking.id ? 'Canceling...' : 'Cancel Booking'}
                  </button>
                )}
                {booking.bookingStatus === 'CANCELLED' && (
                  <div className="cancellation-info">
                    <p>This booking has been cancelled.</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookingHistory;
