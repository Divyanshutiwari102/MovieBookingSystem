import React, { useState, useEffect } from 'react';
import { showAPI } from '../../services/api';

// Group seats by type for display
const groupByType = (seats) => {
  const order = ['RECLINER', 'PREMIUM', 'NORMAL'];
  const groups = {};
  seats.forEach((s) => {
    const type = s.seat?.seatType || s.seatType || 'NORMAL';
    if (!groups[type]) groups[type] = [];
    groups[type].push(s);
  });
  return order.filter((t) => groups[t]).map((t) => ({ type: t, seats: groups[t] }));
};

const TYPE_CONFIG = {
  RECLINER: { label: 'Recliner',  color: 'bg-purple-500', selectedColor: 'bg-purple-600' },
  PREMIUM:  { label: 'Premium',   color: 'bg-blue-500',   selectedColor: 'bg-blue-600'   },
  NORMAL:   { label: 'Normal',    color: 'bg-gray-400',   selectedColor: 'bg-gray-600'   },
};

const SeatLayout = ({ showId, onSeatsChange }) => {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSeats = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await showAPI.getById(showId);
        // ✅ API returns availableSeats (not seats)
        const data = res.data?.availableSeats || res.data?.seats || [];
        if (data.length > 0) {
          setSeats(data);
        } else {
          setError('No seats available for this show.');
        }
      } catch (e) {
        setError('Could not load seats. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (showId) fetchSeats();
    else {
      setError('No show selected.');
      setIsLoading(false);
    }
  }, [showId]);

  const toggleSeat = (seat) => {
    // seat.status comes from API: AVAILABLE / BOOKED / LOCKED
    if (seat.status !== 'AVAILABLE') return;

    setSelectedSeats((prev) => {
      const already = prev.find((s) => s.id === seat.id);
      const next = already
        ? prev.filter((s) => s.id !== seat.id)
        : [...prev, seat];
      onSeatsChange?.(next);
      return next;
    });
  };

  const total = selectedSeats.reduce((sum, s) => sum + (s.price || 0), 0);
  const groups = groupByType(seats);

  if (isLoading) return (
    <div className="text-center py-10 text-gray-400">
      <div className="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full mx-auto mb-3" />
      Loading seats...
    </div>
  );

  if (error) return (
    <div className="text-center py-10 text-gray-400">{error}</div>
  );

  return (
    <div className="select-none">
      {/* Screen */}
      <div className="text-center mb-8">
        <div className="h-1.5 bg-gradient-to-r from-transparent via-red-400 to-transparent w-3/4 mx-auto rounded-full mb-2" />
        <p className="text-xs text-gray-400 uppercase tracking-widest">SCREEN</p>
      </div>

      {/* Seat Groups */}
      {groups.map(({ type, seats: groupSeats }) => {
        const config = TYPE_CONFIG[type] || TYPE_CONFIG.NORMAL;
        // Get price from first seat of this type
        const price = groupSeats[0]?.price || 0;

        return (
          <div key={type} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-3 h-3 rounded-sm ${config.color}`} />
              <span className="text-sm font-semibold text-gray-700">{config.label}</span>
              <span className="text-xs text-gray-500">₹{price}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {groupSeats.map((seat) => {
                const seatNum = seat.seat?.seatNumber || seat.seatNumber || '?';
                const isSelected = selectedSeats.find((s) => s.id === seat.id);
                const isBooked = seat.status !== 'AVAILABLE';

                return (
                  <button
                    key={seat.id}
                    onClick={() => toggleSeat(seat)}
                    disabled={isBooked}
                    title={`${seatNum} - ₹${seat.price}${isBooked ? ' (Booked)' : ''}`}
                    className={`w-8 h-8 text-xs rounded font-mono transition-all
                      ${isBooked
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : isSelected
                          ? `${config.selectedColor} text-white scale-110 shadow-md ring-2 ring-white/30`
                          : 'bg-green-100 hover:bg-green-200 text-green-800 border border-green-300'
                      }`}
                  >
                    {seatNum.replace(/[A-Z]/gi, '')}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 bg-green-100 border border-green-300 rounded-sm" /> Available
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 bg-blue-500 rounded-sm" /> Selected
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 bg-gray-200 rounded-sm" /> Booked
        </div>
      </div>

      {/* Selection Summary */}
      {selectedSeats.length > 0 && (
        <div className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">
                {selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''} selected:
                <span className="font-semibold text-gray-800 ml-1">
                  {selectedSeats.map((s) => s.seat?.seatNumber || s.seatNumber || s.id).join(', ')}
                </span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Total</p>
              <p className="text-xl font-bold text-gray-800">₹{total}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatLayout;
