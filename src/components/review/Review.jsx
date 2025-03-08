import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../../pages/login/UserContext"; // Import useUser to access current user context
import newRequest from "../../utils/newRequest"; // Assuming newRequest is a utility to handle API calls

const Review = () => {
  const { id } = useParams();  // Get the dynamic 'id' from the URL (gigId or productId)
  const { currentUser } = useUser(); // Access the current user from UserContext
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);

  // Fetch reviews for the specific gig/product by id
  const { data: reviews, isLoading, error } = useQuery({
    queryKey: ["reviews", id],
    queryFn: () => newRequest.get(`/api/reviews/product/${id}`).then((res) => res.data),
  });

  // Handle form submission to create a new review
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert("You must be logged in to submit a review.");
      return;
    }

    newRequest
      .post("/api/reviews", {
        productId: id,
        userId: currentUser.id, // Add the current user's ID to the review data
        rating,
        comment: reviewText,
      })
      .then(() => {
        // Optionally refetch the reviews to show the new review
        // window.location.reload(); or use React Query's refetch
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="review-section">
      <h2>Reviews for this Gig</h2>
      {isLoading ? (
        <p>Loading reviews...</p>
      ) : error ? (
        <p>Error loading reviews</p>
      ) : reviews && reviews.length === 0 ? (
        <p>No reviews yet for this gig.</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="review">
            <p>{review.comment}</p>
            <span>{review.rating} Stars</span>
          </div>
        ))
      )}

      <form onSubmit={handleSubmit}>
        <h3>Write a Review</h3>
        <div>
          <label>Rating:</label>
          <select onChange={(e) => setRating(Number(e.target.value))} value={rating}>
            <option value={0}>Select Rating</option>
            <option value={1}>1 Star</option>
            <option value={2}>2 Stars</option>
            <option value={3}>3 Stars</option>
            <option value={4}>4 Stars</option>
            <option value={5}>5 Stars</option>
          </select>
        </div>
        <div>
          <label>Comment:</label>
          <textarea onChange={(e) => setReviewText(e.target.value)} value={reviewText} />
        </div>
        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
};

export default Review;



