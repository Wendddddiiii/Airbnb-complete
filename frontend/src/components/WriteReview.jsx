import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { leaveReview } from './PostListing';

const WriteReview = () => {
  const navigate = useNavigate();
  const { listId, bookingId } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = async () => {
    try {
      const numericRating = parseInt(rating, 10);
      if (isNaN(numericRating)) {
        alert('Please enter a valid rating.');
        return;
      }
      const review = {
        rating: numericRating,
        comment
      };
      await leaveReview(listId, bookingId, review);
      navigate('/');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to leave a review. Please try again.');
    }
  };

  return (
    <>
      Leave your Rating&#x2B50;
      <input onChange={e => setRating(e.target.value)} type='text' /><br />
      Leave your Comment:
      <input onChange={e => setComment(e.target.value)} type='text' /><br />
      <button onClick={handleSubmit} type="button" className="btn btn-warning">Submit</button>
      <button onClick={() => navigate('/')} type="button" className="btn btn-warning">Cancel</button>
    </>
  );
};

export default WriteReview;
