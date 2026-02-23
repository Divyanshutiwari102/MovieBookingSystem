import React, { useState, useEffect } from 'react';
import { showAPI } from '../../services/api';

const SEAT_CATEGORIES = [
  { type: 'RECLINER', label: 'Recliner', price: 499, color: 'bg-purple-500', count: 10 },
  { type: 'PREMIUM', label: 'Premium', price: 350, color: 'bg-blue-500', count: 20 },
  { type: 'EXECUTIVE', label: 'Executive', price: 250, color: 'bg-green-500', count: 30 },
  { type: 'NORMAL', label: 'Normal', price: 150, color: 'bg-gray-400', count: 50 },
];

const generateMockSeats = () => {
  let seats = [];
  let id = 1;
  SEAT_CATEGORIES.forEach((cat) => {
    const rows = Math.ceil(cat.count / 10);
    for (let r = 0; r < rows; r++) {
      const rowLetter = String.fromCharCode(65 + id % 20);
      for (let c = 1; c <= 10; c++) {
        seats.push({
          id: id++,
          row: `${cat.type[0]}${r + 1}`,
          number: c,
          type: cat.type,
          price: cat.price,
          status: Math.random() < 0.25 ? 'BOOKED' : 'AVAILABLE',
          label: `${rowLetter}${c}`,
        });
      }
    }
  });
  return seats;
};

const SeatLayout = ({ showId, onSeatsChange }) => {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const res = await showAPI.getById(showId);
        const data = res.data?.seats || [];
        setSeats(data.length ? data : generateMockSeats());
      } catch {
        setSeats(generateMockSeats());
      } finally {
        setIsLoading(false);
      }
    };
    if (showId) fetchSeats();
    else {
      setSeats(generateMockSeats());
      setIsLoading(false);
    }
  }, [showId]);

  const toggleSeat = (seat) => {
    if (seat.status === 'BOOKED') return;
    setSelectedSeats((prev) => {
      const next = prev.find((s) => s.id === seat.id)
        ? prev.filter((s) => s.id !== seat.id)
        : [...prev, seat];
      onSeatsChange?.(next);
      return next;
    });
  };

  const total = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  const byCat = SEAT_CATEGORIES.map((cat) => ({
    ...cat,
    seats: seats.filter((s) => s.type === cat.type),
  }));

  if (isLoading) return <div className="text-center py-8 text-gray-500">Loading seats...</div>;

  return (
    <div className="select-none">
      {/* Screen */}
      <div className="text-center mb-8">
        <div className="inline-block">
          <div className="h-2 bg-gradient-to-r from-transparent via-gray-400 to-transparent w-80 rounded-full mx-auto mb-1" />
          <p className="text-xs text-gray-400 uppercase tracking-widest">Screen this way</p>
        </div>
      </div>

      {/* Seat grid by category */}
      {byCat.map((cat) => (
        <div key={cat.type} className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-3 h-3 rounded-sm ${cat.color}`} />
            <span className="text-sm font-semibold text-gray-700">{cat.label}</span>
            <span className="text-xs text-gray-500">₹{cat.price}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {cat.seats.map((seat) => {
              const isSelected = selectedSeats.find((s) => s.id === seat.id);
              const isBooked = seat.status === 'BOOKED';
              return (
                <button
                  key={seat.id}
                  onClick={() => toggleSeat(seat)}
                  disabled={isBooked}
                  title={`${seat.label} - ₹${seat.price}`}
                  className={`w-7 h-7 text-xs rounded font-mono transition-all
                    ${isBooked ? 'bg-gray-200 text-gray-400 cursor-not-allowed' :
                      isSelected ? `${cat.color} text-white scale-110 shadow-md` :
                      'bg-green-100 hover:bg-green-200 text-green-800 border border-green-300'}`}
                >
                  {seat.number}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 text-xs text-gray-500">
        <div className="flex items-center gap-1.5"><div className="w-4 h-4 bg-green-100 border border-green-300 rounded-sm" /> Available</div>
        <div className="flex items-center gap-1.5"><div className="w-4 h-4 bg-blue-500 rounded-sm" /> Selected</div>
        <div className="flex items-center gap-1.5"><div className="w-4 h-4 bg-gray-200 rounded-sm" /> Booked</div>
      </div>

      {/* Summary */}
      {selectedSeats.length > 0 && (
        <div className="mt-6 bg-gray-50 rounded-xl p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">
                {selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''} selected:
                {' '}<span className="font-semibold text-gray-800">{selectedSeats.map((s) => s.label).join(', ')}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-xl font-bold text-gray-800">₹{total}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatLayout;
