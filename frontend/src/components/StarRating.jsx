import React, { useState } from 'react';

const StarRating = ({ initialRating = 0, onRate, disabled = false }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (ratingValue) => {
    if (!disabled) setHoverRating(ratingValue);
  };

  const handleMouseLeave = () => {
    if (!disabled) setHoverRating(0);
  };

  const handleClick = (ratingValue) => {
    if (!disabled && onRate) {
      onRate(ratingValue);
    }
  };

  return (
    <div className="d-flex align-items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hoverRating || initialRating);
        return (
          <button
            key={star}
            type="button"
            className="btn btn-link p-0 text-decoration-none border-0"
            style={{
              fontSize: '1.4rem',
              color: isFilled ? '#ffc107' : '#e4e5e9',
              cursor: disabled ? 'default' : 'pointer',
              transition: 'color 0.15s ease-in-out, transform 0.1s ease-in-out',
              transform: hoverRating === star ? 'scale(1.2)' : 'scale(1.0)',
            }}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(star)}
            disabled={disabled}
            aria-label={`Rate ${star} out of 5 stars`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
// Add interactive 5-star rating with hover effects, click handling, and disabled state support.