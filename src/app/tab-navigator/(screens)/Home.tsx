"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import PuffLoader from "react-spinners/PuffLoader";

import { items } from "../../../items";
import { hooks } from "../../../hooks";
import { Routes } from "../../../routes";
import { components } from "../../../components";

import { customMenu } from "../data";

export const Home: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const { menuLoading } = hooks.useGetMenu();
  const { dishes } = hooks.useGetDishes();
  const { recommendedDishes, recommendedLoading } =
    hooks.useGetRecommendedDishes();

  const { reviews, reviewsLoading } = hooks.useGetReviews();
  const { carousel, carouselLoading } = hooks.useGetCarousel();

  const isLoading =
    menuLoading || recommendedLoading || reviewsLoading || carouselLoading;

  const handleSlideChange = (swiper: any) => {
    setActiveSlide(swiper.activeIndex);
  };

  const renderHeader = () => {
    return <components.Header user={true} userName={true} showBasket={true} />;
  };

  const renderCategories = () => {
    return (
      <section style={{ marginBottom: 30 }}>
        <components.BlockHeading
          title="We offer"
          className="container"
          containerStyle={{ marginBottom: 14 }}
        />
        <Swiper
          spaceBetween={10}
          breakpoints={{
            320: { slidesPerView: 2.2 },
            480: { slidesPerView: 2.8 },
            768: { slidesPerView: 3.5 },
            1024: { slidesPerView: 4 },
          }}
          style={{ padding: "0 20px" }}
        >
          {customMenu.map((item) => {
            return (
              <SwiperSlide key={item.id}>
                <div
                  className="clickable"
                  style={{
                    position: "relative",
                    opacity: item.isAvailable ? 1 : 0.5,
                    pointerEvents: item.isAvailable ? "auto" : "none",
                  }}
                >
                  {/* Image Container */}
                  <div
                    style={{
                      position: "relative",
                      aspectRatio: "1 / 1",
                      width: "100%",
                      borderRadius: 10,
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 40vw, 20vw"
                      priority
                      style={{
                        objectFit: "cover",
                        filter: item.isAvailable ? "none" : "grayscale(100%)",
                      }}
                    />
                  </div>

                  {/* Category Label */}
                  <span
                    style={{
                      position: "absolute",
                      bottom: 10,
                      left: 10,
                      backgroundColor: "#fef102",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      color: "#ed1a25",
                      fontWeight: "700",
                      fontSize: "12px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "calc(100% - 20px)",
                    }}
                    className="number-of-lines-1"
                  >
                    {item.name}
                  </span>

                  {/* Coming Soon Badge */}
                  {!item.isAvailable && (
                    <span
                      style={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        backgroundColor: "#ed1a25",
                        color: "#fff",
                        padding: "2px 6px",
                        borderRadius: 4,
                        fontSize: 10,
                        fontWeight: "bold",
                        zIndex: 2,
                      }}
                    >
                      Coming Soon
                    </span>
                  )}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </section>
    );
  };

  const renderCarousel = () => {
    return (
      <section style={{ marginBottom: 30, position: "relative" }}>
        <Swiper
          slidesPerView={"auto"}
          pagination={{ clickable: true }}
          navigation={true}
          mousewheel={true}
          onSlideChange={handleSlideChange}
        >
          {carousel.map((banner, index) => {
            return (
              <SwiperSlide key={banner.id}>
                <Link href={`${Routes.MENU_ITEM}/${dishes[index].id}`}>
                  <Image
                    src={banner.banner}
                    alt="Banner"
                    width={0}
                    height={0}
                    sizes="100vw"
                    priority={true}
                    className="clickable"
                    style={{ width: "100%", height: "auto" }}
                  />
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            bottom: 27,
            zIndex: 1,
            width: "100%",
            gap: 6,
          }}
        >
          {carousel.map((_, index) => {
            return (
              <div
                key={_.id}
                style={{
                  width: 8,
                  height: activeSlide === index ? 20 : 8,
                  borderRadius: 10,
                  backgroundColor:
                    activeSlide === index
                      ? "var(--white-color)"
                      : `rgba(255, 255, 255, 0.5)`,
                }}
              />
            );
          })}
        </div>
      </section>
    );
  };

  const renderRecommendedDishes = () => {
    if (recommendedDishes.length === 0) return null;

    return (
      <section style={{ marginBottom: 30 }}>
        <components.BlockHeading
          title="Recommended for you"
          className="container"
          containerStyle={{ marginBottom: 14 }}
        />
        <Swiper
          spaceBetween={14}
          slidesPerView={1.6}
          style={{ padding: "0 20px" }}
        >
          {recommendedDishes.map((dish) => (
            <SwiperSlide key={dish._id}>
              <items.RecommendedItem item={dish} />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    );
  };

  const renderReviews = () => {
    return (
      <section style={{ marginBottom: 20 }}>
        <components.BlockHeading
          href={Routes.REVIEWS}
          title="Our Happy clients say"
          containerStyle={{ marginLeft: 20, marginRight: 20, marginBottom: 14 }}
        />
        <Swiper
          spaceBetween={14}
          slidesPerView={1.2}
          pagination={{ clickable: true }}
          navigation={true}
          mousewheel={true}
          style={{ padding: "0 20px" }}
        >
          {reviews.map((review: any) => {
            return (
              <SwiperSlide key={review.id}>
                <items.ReviewItem review={review} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </section>
    );
  };

  const renderContent = () => {
    if (isLoading) return null;
    return (
      <main className="scrollable" style={{ paddingTop: 10, height: "100%" }}>
        {renderCarousel()}
        {renderCategories()}
        {renderRecommendedDishes()}
        {renderReviews()}
      </main>
    );
  };

  const renderLoader = () => {
    if (!isLoading) return null;

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          inset: 0,
          height: "100%",
        }}
        className="flex-center"
      >
        <PuffLoader
          size={40}
          color={"#455A81"}
          aria-label="Loading Spinner"
          data-testid="loader"
          speedMultiplier={1}
        />
      </div>
    );
  };

  const renderModal = () => {
    return <components.Modal />;
  };

  const renderBottomTabBar = () => {
    return <components.BottomTabBar />;
  };

  return (
    <components.Screen>
      {renderHeader()}
      {renderContent()}
      {renderModal()}
      {renderLoader()}
      {renderBottomTabBar()}
    </components.Screen>
  );
};
