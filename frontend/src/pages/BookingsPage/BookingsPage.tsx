import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './BookingsPage.module.css';
import { API_BASE_URL } from '../../constants/constants';
import { isBefore, startOfDay } from 'date-fns';

type Booking = {
  id: string;
  userId: string;
  bookingType: string;
  bookingDate: string;
  createdAt: string;
};

const BookingsPage: React.FC = () => {
  const { token } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);

  const [bookingType, setBookingType] = useState('RESTAURANT');
  const [bookingDate, setBookingDate] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error('Failed to fetch bookings');
      }
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError('');

    if (!bookingDate) {
      setError('Please select a booking date.');
      setCreating(false);
      return;
    }

    const selectedDate = new Date(bookingDate);
    const today = startOfDay(new Date());
    if (isBefore(selectedDate, today)) {
      setError('Booking date cannot be in the past.');
      setCreating(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookingType,
          bookingDate,
        }),
      });
      if (!res.ok) {
        throw new Error('Failed to create booking');
      }
      await fetchBookings();
      setBookingType('RESTAURANT');
      setBookingDate('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className={styles.bookingPageContainer}>
      <h2 className={styles.bookingPageTitle}>My Bookings</h2>

      <form className={styles.bookingForm} onSubmit={handleCreateBooking}>
        <div className={styles.formGroup}>
          <label htmlFor="bookingType" aria-label="Booking type">
            Booking Type
          </label>
          <select
            id="bookingType"
            value={bookingType}
            onChange={(e) => setBookingType(e.target.value)}
          >
            <option value="RESTAURANT">Restaurant</option>
            <option value="VIP_TOUR">VIP Tour</option>
            <option value="PHOTO_SESSION">Photo Session</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="bookingDate" aria-label="Booking Date">
            Booking Date
          </label>
          <input
            id="bookingDate"
            type="date"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className={styles.createBookingButton}
          disabled={creating}
          aria-label="Submit"
        >
          {creating ? 'Creating...' : 'Create Booking'}
        </button>
      </form>

      {error && <div className={styles.errorMessage}>{error}</div>}
      {loading && <p>Loading bookings...</p>}

      <div className={styles.bookingList}>
        {bookings.length === 0 && <div>You currently have no bookings.</div>}
        {bookings.map((booking) => (
          <div key={booking.id} className={styles.bookingCard}>
            <div className={styles.bookingType}>{booking.bookingType}</div>
            <div className={styles.bookingInfo}>
              Date: {new Date(booking.bookingDate).toLocaleDateString()}
            </div>
            <div className={styles.bookingInfo}>
              Created: {new Date(booking.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingsPage;
