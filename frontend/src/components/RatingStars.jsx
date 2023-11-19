import React from 'react';

const FullStar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path fill="#ffd055" d="M12 .587l3.668 7.425 8.332 1.212-6.001 5.848 1.416 8.263L12 18.897l-7.415 3.9 1.415-8.263-6-5.848 8.33-1.212z" />
  </svg>
);

const HalfStar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path fill="#ffd055" d="M12 0l3.515 7.124 7.898 1.15-5.72 5.569 1.349 7.869L12 18.179V0z" />
    <path fill="#e4e5e9" d="M12 0v18.179l-6.742 3.533 1.349-7.869-5.72-5.569 7.898-1.15L12 0z" />
  </svg>
);

const EmptyStar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path fill="#e4e5e9" d="M12 .587l3.668 7.425 8.332 1.212-6.001 5.848 1.416 8.263L12 18.897l-7.415 3.9 1.415-8.263-6-5.848 8.33-1.212z" />
  </svg>
);
const RatingStars = ({ rating }) => {
  // Convert the rating out of 10 to a 5-star scale
  const starRating = rating / 2;

  // Calculate full, half, and empty stars
  const fullStars = Math.floor(starRating);
  const halfStar = starRating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  // Ensure that the number of stars doesn't exceed 5
  const totalStars = fullStars + halfStar + emptyStars;
  const adjustedEmptyStars = totalStars > 5 ? 5 - fullStars - halfStar : emptyStars;

  return (
    <div>
      {[...Array(fullStars)].map((_, i) => <FullStar key={i} />)}
      {halfStar === 1 && <HalfStar />}
      {[...Array(adjustedEmptyStars)].map((_, i) => <EmptyStar key={i} />)}
    </div>
  );
};

export default RatingStars;
