import { useEffect, useState } from "react";

interface CarouselItem {
  _id: string;
  image: string;
  title: string;
  link: string;
}

export function useGetCarousel() {
  const [carousel, setCarousel] = useState<CarouselItem[]>([]);
  const [carouselLoading, setCarouselLoading] = useState(true);

  useEffect(() => {
    async function fetchCarousel() {
      try {
        const res = await fetch("/api/carousels", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message || "Failed to fetch carousel");

        setCarousel(data.data || []);
      } catch (error) {
        console.error("Carousel fetch failed:", error);
      } finally {
        setCarouselLoading(false);
      }
    }

    fetchCarousel();
  }, []);

  return { carousel, carouselLoading };
}
