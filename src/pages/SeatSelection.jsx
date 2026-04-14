import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import bookingService from '../services/bookingService';
import '../styles/SeatSelection.css';

function SeatSelection() {
  const { busId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [seats, setSeats] = useState([]);
  const [busInfo, setBusInfo] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchSeats();
  }, [busId]);

  const fetchSeats = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getSeats(busId);
      setSeats(response.data);
      
      // Extract bus information from response (assuming it's included)
      if (response.data.busInfo) {
        setBusInfo(response.data.busInfo);
      }
    } catch (err) {
      console.error('Error fetching seats:', err);
      setError('Failed to load seat information. Please go back and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (seatId, isBooked) => {
    if (isBooked) return; // Cannot select booked seats

    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((id) => id !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
    setError('');
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      setError('Please select at least one seat');
      return;
    }

    setBookingLoading(true);
    setError('');

    try {
      // Book each seat separately or in batch depending on API design
      const bookingPromises = selectedSeats.map((seatId) =>
        bookingService.bookTicket({
          userId: parseInt(userId),
          busId: parseInt(busId),
          seatId: seatId,
        })
      );

      const responses = await Promise.all(bookingPromises);
      
      // Navigate to booking history or confirmation page
      navigate('/booking-history', {
        state: { bookingConfirmed: true, bookings: responses },
      });
    } catch (err) {
      console.error('Booking error:', err);
      setError(
        err.response?.data?.message ||
        'Failed to complete booking. Please try again.'
      );
    } finally {
      setBookingLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="seat-selection-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading seat information...</p>
        </div>
      </div>
    );
  }

  // Group seats by row
  const seatsByRow = {};
  seats.forEach((seat) => {
    const row = seat.seatNumber.charAt(0);
    if (!seatsByRow[row]) {
      seatsByRow[row] = [];
    }
    seatsByRow[row].push(seat);
  });

  const totalSeats = seats.length;
  const bookedSeats = seats.filter((s) => s.isBooked).length;
  const totalFare = selectedSeats.length * (busInfo?.fare || 500);

  return (
    <div className="seat-selection-container">
      <button className="back-btn" onClick={handleBackClick}>
        ← Back
      </button>

      <div className="seat-header">
        <h1>Select Your Seats</h1>
        {busInfo && (
          <div className="bus-info">
            <p>
              <strong>{busInfo.busName}</strong> - {busInfo.source} to {busInfo.destination}
            </p>
            <p>Date: {busInfo.travelDate}</p>
          </div>
        )}
      </div>

      <div className="seat-layout">
        <div className="bus-illustration">
          <div className="driver-area">🚗 Driver</div>
          
          <div className="seats-grid">
            {Object.entries(seatsByRow).map(([row, rowSeats]) => (
              <div key={row} className="seat-row">
                <div className="row-label">{row}</div>
                <div className="row-seats">
                  {rowSeats.map((seat) => (
                    <button
                      key={seat.id}
                      className={`seat ${
                        seat.isBooked
                          ? 'booked'
                          : selectedSeats.includes(seat.id)
                          ? 'selected'
                          : 'available'
                      }`}
                      onClick={() => handleSeatClick(seat.id, seat.isBooked)}
                      disabled={seat.isBooked}
                      title={`Seat ${seat.seatNumber}`}
                    >
                      {seat.seatNumber}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="screen">🎬 SCREEN</div>
        </div>

        <div className="seat-legend">
          <div className="legend-item">
            <div className="legend-seat available"></div>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <div className="legend-seat selected"></div>
            <span>Selected</span>
          </div>
          <div className="legend-item">
            <div className="legend-seat booked"></div>
            <span>Booked</span>
          </div>
        </div>
      </div>

      <div className="seat-stats">
        <div className="stat">
          <span className="stat-label">Total Seats:</span>
          <span className="stat-value">{totalSeats}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Booked:</span>
          <span className="stat-value">{bookedSeats}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Available:</span>
          <span className="stat-value">{totalSeats - bookedSeats}</span>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="booking-summary">
        <h3>Booking Summary</h3>
        <div className="summary-row">
          <span>Selected Seats: </span>
          <span>{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</span>
        </div>
        <div className="summary-row">
          <span>Price per Seat:</span>
          <span>₹{busInfo?.fare.toFixed(2) || '500.00'}</span>
        </div>
        <div className="summary-row total">
          <span>Total Fare:</span>
          <span>₹{totalFare.toFixed(2)}</span>
        </div>
      </div>

      <div className="booking-actions">
        <button
          className="cancel-btn"
          onClick={handleBackClick}
          disabled={bookingLoading}
        >
          Cancel
        </button>
        <button
          className="confirm-btn"
          onClick={handleBooking}
          disabled={selectedSeats.length === 0 || bookingLoading}
        >
          {bookingLoading ? 'Processing...' : 'Confirm Booking'}
        </button>
      </div>
    </div>
  );
}

export default SeatSelection;
