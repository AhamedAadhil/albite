"use client";

import React, { useEffect, useState } from "react";

import { items } from "../../items";
import { components } from "../../components";
import axios from "axios";
import { renderLoader } from "@/components/Loader";

type ReviewType = {
  review: string;
  _id: string;
  rating: number;
  comment: string;
  date?: string;
  createdAt: Date;
  user?: {
    name: string;
    avatar?: string;
  };
};
export const Reviews: React.FC = () => {
  const [dishId, setDishId] = useState<string | null>(null);
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    const dishIdFromLocalStorage = localStorage.getItem("dishIdToFetchReviews");
    if (dishIdFromLocalStorage) {
      setDishId(dishIdFromLocalStorage);
    }
    const getReviews = async () => {
      if (!dishIdFromLocalStorage) {
        setReviews([]); // Clear reviews if no dishId
        return;
      }

      setReviewsLoading(true);
      try {
        // Append dishId as query param to URL
        const response = await axios.get(
          `/api/user/review?dishId=${encodeURIComponent(
            dishIdFromLocalStorage
          )}`
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
    getReviews();
  }, []);

  if (reviewsLoading) {
    return renderLoader();
  }
  const renderHeader = () => {
    return <components.Header showGoBack={true} title="Reviews" />;
  };

  const renderContent = () => {
    return (
      <main
        className="scrollable container"
        style={{ paddingTop: 10, paddingBottom: 20 }}
      >
        <ul>
          {reviews?.map((review, index, array) => {
            const isLast = index === array.length - 1;

            return (
              <items.ReviewItem
                key={review._id}
                review={review}
                containerStyle={{ marginBottom: isLast ? 0 : 14 }}
              />
            );
          })}
        </ul>
      </main>
    );
  };

  return (
    <components.Screen>
      {renderHeader()}
      {renderContent()}
    </components.Screen>
  );
};
