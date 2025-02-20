import React, { useEffect, useState } from 'react';
import styles from './TicketsPage.module.css';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../constants/constants';
import { isBefore, startOfDay } from 'date-fns';

type Ticket = {
  id: string;
  userId: string;
  ticketDate: string;
  type: 'SINGLE' | 'FAMILY';
  price: number;
  createdAt: string;
};

const TicketsPage: React.FC = () => {
  const { token } = useAuth();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketDate, setTicketDate] = useState('');
  const [ticketType, setTicketType] = useState<'SINGLE' | 'FAMILY'>('SINGLE');
  const [error, setError] = useState('');
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoadingTickets(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/tickets`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error('Could not fetch tickets');
      }
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingTickets(false);
    }
  };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setPurchasing(true);

    if (!ticketDate) {
      setError('Please select a ticket date.');
      setPurchasing(false);
      return;
    }

    const selectedDate = new Date(ticketDate);
    const today = startOfDay(new Date());
    if (isBefore(selectedDate, today)) {
      setError('Ticket date cannot be in the past.');
      setPurchasing(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ticketDate,
          type: ticketType,
        }),
      });
      if (!res.ok) {
        throw new Error('Purchase failed');
      }
      await fetchTickets();
      setTicketDate('');
      setTicketType('SINGLE');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div className={styles.ticketPageContainer}>
      <h2 className={styles.ticketPageTitle}>My Tickets</h2>

      <form className={styles.purchaseForm} onSubmit={handlePurchase}>
        <label htmlFor="ticketDate" aria-label="Ticket Date">
          Ticket Date
        </label>
        <input
          id="ticketDate"
          type="date"
          value={ticketDate}
          onChange={(e) => setTicketDate(e.target.value)}
          required
        />

        <label htmlFor="ticketType" aria-label="Ticket Type">
          Ticket Type
        </label>
        <select
          id="ticketType"
          value={ticketType}
          onChange={(e) => setTicketType(e.target.value as 'SINGLE' | 'FAMILY')}
        >
          <option value="SINGLE">Single</option>
          <option value="FAMILY">Family</option>
        </select>

        <div>Ticket price: {ticketType === 'FAMILY' ? '$120' : '$50'}</div>

        <button
          className={styles.purchaseButton}
          type="submit"
          disabled={purchasing}
          aria-label="Purchase Ticket"
        >
          {purchasing ? 'Purchasing...' : 'Purchase Ticket'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loadingTickets ? <p>Loading your tickets...</p> : null}

      <div className={styles.ticketList}>
        {tickets.length === 0 && <div>You currently have no tickets.</div>}
        {tickets.map((ticket) => (
          <div key={ticket.id} className={styles.ticketCard}>
            <div className={styles.ticketType}>{ticket.type} Ticket</div>
            <div className={styles.ticketDate}>
              <div>Visit Date: </div>
              {new Date(ticket.ticketDate).toLocaleDateString()}
            </div>
            <div className={styles.ticketPrice}>Price: ${ticket.price}</div>
            <div>
              Purchased on: {new Date(ticket.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketsPage;
