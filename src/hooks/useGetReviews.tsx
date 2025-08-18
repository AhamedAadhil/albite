import axios from "axios";
import { useState, useEffect } from "react";
import { ReviewType } from "../types";

export const useGetReviews = (
  dishId: string
): {
  reviewsLoading: boolean;
  reviews: ReviewType[];
} => {
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState<boolean>(false);

  const getReviews = async () => {
    if (!dishId) {
      setReviews([]); // Clear reviews if no dishId
      return;
    }

    setReviewsLoading(true);
    try {
      // Append dishId as query param to URL
      const response = await axios.get(
        `/api/user/review?dishId=${encodeURIComponent(dishId)}`
      );
      if (response.data.success) {
        setReviews(response.data.data || []);
      } else {
        setReviews([]);
        console.error("Failed to fetch reviews:", response.data.message);
      }
    } catch (error) {
      console.error(error);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    getReviews();
  }, [dishId]);

  return { reviewsLoading, reviews };
};
