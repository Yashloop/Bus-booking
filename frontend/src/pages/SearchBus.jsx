import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bookingService from '../services/bookingService';
import '../styles/SearchBus.css';

function SearchBus() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    source: '',
    destination: '',
    date: '',
  });
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
    }
  }, [navigate]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  // Handle search submission
  const handleSearch = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!searchParams.source.trim()) {
      setError('Please enter source city');
      return;
    }
    if (!searchParams.destination.trim()) {
      setError('Please enter destination city');
      return;
    }
    if (!searchParams.date) {
      setError('Please select travel date');
      return;
    }

    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const response = await bookingService.searchBuses(
        searchParams.source,
        searchParams.destination,
        searchParams.date
      );
      setBuses(response.data);
      
      if (response.data.length === 0) {
        setError('No buses available for the selected route and date');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(
        err.response?.data?.message ||
        'Failed to search buses. Please try again.'
      );
      setBuses([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle bus selection
  const handleSelectBus = (busId) => {
    navigate(`/seat-selection/${busId}`, {
      state: { searchParams },
    });
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="search-bus-container">
      <div className="search-header">
        <h1>🚌 Bus Ticket Booking</h1>
        <p>Find and book your perfect bus journey</p>
      </div>

      <div className="search-form-wrapper">
        <form onSubmit={handleSearch} className="search-form">
          <div className="form-group">
            <label htmlFor="source">From</label>
            <input
              type="text"
              id="source"
              name="source"
              placeholder="Enter departure city (e.g., Erode)"
              value={searchParams.source}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="destination">To</label>
            <input
              type="text"
              id="destination"
              name="destination"
              placeholder="Enter arrival city (e.g., Chennai)"
              value={searchParams.destination}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={searchParams.date}
              onChange={handleInputChange}
              min={today}
              required
            />
          </div>

          <button type="submit" className="search-btn" disabled={loading}>
            {loading ? 'Searching...' : 'Search Buses'}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}
      </div>

      {searched && !loading && buses.length > 0 && (
        <div className="buses-list">
          <h2>Available Buses</h2>
          <div className="buses-grid">
            {buses.map((bus) => (
              <div key={bus.id} className="bus-card">
                <div className="bus-header">
                  <h3>{bus.busName}</h3>
                  <span className="bus-number">Bus #{bus.busNumber}</span>
                </div>

                <div className="bus-details">
                  <div className="detail-row">
                    <span className="label">Route:</span>
                    <span className="value">{bus.source} → {bus.destination}</span>
                  </div>

                  <div className="detail-row">
                    <span className="label">Departure:</span>
                    <span className="value">{bus.departureTime}</span>
                  </div>

                  <div className="detail-row">
                    <span className="label">Arrival:</span>
                    <span className="value">{bus.arrivalTime}</span>
                  </div>

                  <div className="detail-row">
                    <span className="label">Available Seats:</span>
                    <span className="value seats-available">{bus.availableSeats}</span>
                  </div>

                  <div className="detail-row">
                    <span className="label">Fare per seat:</span>
                    <span className="value fare">₹{bus.fare.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  className="select-bus-btn"
                  onClick={() => handleSelectBus(bus.id)}
                  disabled={bus.availableSeats === 0}
                >
                  {bus.availableSeats > 0 ? 'Select Bus' : 'No Seats Available'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {searched && !loading && buses.length === 0 && !error && (
        <div className="no-results">
          <p>No buses found for your search criteria. Try different dates or cities.</p>
        </div>
      )}

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Searching for available buses...</p>
        </div>
      )}
    </div>
  );
}

export default SearchBus;
