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
          {carousel.map((item) => (
            <SwiperSlide key={item._id}>
              <Link href={item.link} passHref>
                <Image
                  src={item.image}
                  alt={item.title}
                  width={0}
                  height={0}
                  sizes="100vw"
                  priority={true}
                  className="clickable"
                  style={{ width: "100%", height: "auto" }}
                />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Pagination Dots */}
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
          {carousel.map((_, index) => (
            <div
              key={index}
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
          ))}
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

  // const renderAboutUs = () => {
  //   return (
  //     <section
  //       style={{
  //         backgroundColor: "var(--white-color)",

  //         borderRadius: 12,
  //         padding: 20,
  //         marginBottom: 30,
  //         marginLeft: 20,
  //         marginRight: 20,
  //         boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
  //         textAlign: "center",
  //         display: "flex",
  //         flexDirection: "column",
  //         alignItems: "center",
  //       }}
  //     >
  //       <h2 style={{ fontSize: 20, marginBottom: 10, fontWeight: "bold" }}>
  //         About Us
  //       </h2>
  //       <p
  //         style={{
  //           fontSize: 14,
  //           color: "#444",
  //           marginBottom: 16,
  //           maxWidth: 320,
  //           lineHeight: 1.5,
  //         }}
  //       >
  //         We’re not just serving food — we’re delivering moments. With love in
  //         every bite, our cloud kitchen blends tradition and innovation to bring
  //         your cravings to life. Discover who we are and why thousands trust us
  //         daily.
  //       </p>
  //       <Link
  //         href={Routes.ABOUT_US}
  //         style={{
  //           display: "inline-block",
  //           backgroundColor: "var(--main-turquoise)",
  //           color: "#fff",
  //           padding: "10px 20px",
  //           borderRadius: 8,
  //           fontWeight: "bold",
  //           fontSize: 14,
  //           textDecoration: "none",
  //         }}
  //       >
  //         Learn More
  //       </Link>
  //     </section>
  //   );
  // };

  const renderAboutUs = () => {
    return (
      <section
        style={{
          backgroundImage: `url("/assets/other/11.png")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          borderRadius: 12,
          padding: 20,
          marginBottom: 30,
          marginLeft: 20,
          marginRight: 20,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: "#fff", // Set text color to white for better contrast
        }}
      >
        <h2
          style={{
            fontSize: 20,
            marginBottom: 10,
            fontWeight: "bold",
            color: "#F9A826  ",
          }}
        >
          Who we are ?
        </h2>
        <p
          style={{
            fontSize: 14,
            marginBottom: 16,
            maxWidth: 320,
            lineHeight: 1.5,
            color: "#f0f0f0", // softer white
            textShadow: "0 1px 2px rgba(0,0,0,0.5)", // better readability
          }}
        >
          We’re not just serving food — we’re delivering moments. With love in
          every bite, our cloud kitchen blends tradition and innovation to bring
          your cravings to life. Discover who we are and why thousands trust us
          daily.
        </p>
        <Link
          href={Routes.ABOUT_US}
          style={{
            display: "inline-block",
            backgroundColor: "#ED1A25 ",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: 8,
            fontWeight: "bold",
            fontSize: 14,
            textDecoration: "none",
            backdropFilter: "blur(2px)",
          }}
        >
          Learn More
        </Link>
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

  const renderFooter = () => {
    return (
      <footer
        style={{
          backgroundColor: "#222",
          color: "#eee",
          padding: "40px 0",
          marginTop: 40,
          borderTop: "4px solid #ed1a25",
        }}
        aria-label="Footer"
      >
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            paddingLeft: 20,
            paddingRight: 20,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: 30,
          }}
        >
          {/* About Section */}
          <div style={{ flex: "1 1 220px", minWidth: 220 }}>
            <h3
              style={{
                fontWeight: "700",
                fontSize: 18,
                marginBottom: 12,
                color: "#f9a826",
              }}
            >
              About Albite
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "#ccc" }}>
              Albite Cloud Kitchen delivers fresh, flavorful meals with passion
              and innovation. Since 2006, we’ve been serving memorable food
              experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div style={{ flex: "1 1 180px", minWidth: 180 }}>
            <h3
              style={{
                fontWeight: "700",
                fontSize: 18,
                marginBottom: 12,
                color: "#f9a826",
              }}
            >
              Quick Links
            </h3>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                color: "#ccc",
                fontSize: 14,
              }}
            >
              <li style={{ marginBottom: 8 }}>
                <Link
                  href={Routes.ABOUT_US}
                  style={{ color: "#eee", textDecoration: "none" }}
                >
                  About Us
                </Link>
              </li>
              <li style={{ marginBottom: 8 }}>
                <Link
                  href={Routes.REVIEWS}
                  style={{ color: "#eee", textDecoration: "none" }}
                >
                  Reviews
                </Link>
              </li>
              <li style={{ marginBottom: 8 }}>
                <Link
                  href="/contact"
                  style={{ color: "#eee", textDecoration: "none" }}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div style={{ flex: "1 1 220px", minWidth: 220 }}>
            <h3
              style={{
                fontWeight: "700",
                fontSize: 18,
                marginBottom: 12,
                color: "#f9a826",
              }}
            >
              Contact Us
            </h3>
            <address
              style={{
                fontStyle: "normal",
                fontSize: 14,
                color: "#ccc",
                lineHeight: 1.6,
              }}
            >
              123 Cloud Kitchen Blvd
              <br />
              Food City, FC 45678
              <br />
              Phone: (123) 456-7890
              <br />
              Email:{" "}
              <a
                href="mailto:info@albite.com"
                style={{ color: "#f9a826", textDecoration: "none" }}
              >
                info@albite.com
              </a>
            </address>
          </div>

          {/* Social Media */}
          <div style={{ flex: "1 1 180px", minWidth: 180 }}>
            <h3
              style={{
                fontWeight: "700",
                fontSize: 18,
                marginBottom: 12,
                color: "#f9a826",
              }}
            >
              Follow Us
            </h3>
            <div style={{ display: "flex", gap: 12 }}>
              <a
                href="https://facebook.com/yourpage"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                style={{
                  color: "#eee",
                  fontSize: 24,
                  textDecoration: "none",
                }}
              >
                &#x1F426;
              </a>
              <a
                href="https://instagram.com/yourpage"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                style={{
                  color: "#eee",
                  fontSize: 24,
                  textDecoration: "none",
                }}
              >
                &#x1F4F8;
              </a>
              <a
                href="https://twitter.com/yourpage"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                style={{
                  color: "#eee",
                  fontSize: 24,
                  textDecoration: "none",
                }}
              >
                &#x1F426;
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div
          style={{
            textAlign: "center",
            fontSize: 12,
            color: "#777",
            marginTop: 30,
            userSelect: "none",
            paddingLeft: 20,
            paddingRight: 20,
          }}
        >
          © {new Date().getFullYear()} Albite Cloud Kitchen. All rights
          reserved.
        </div>
        {/* Designed by */}
        <div
          style={{
            textAlign: "center",
            fontSize: 9,
            color: "#777",
            marginTop: 0,
            userSelect: "none",
            paddingLeft: 20,
            paddingRight: 20,
          }}
        >
          <a
            href="https://wa.me/94766611917"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#777",
              textDecoration: "underline",
              transition: "all 0.3s ease",
              display: "inline-block",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.color = "#f9a826"; // gold highlight
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.color = "#777";
            }}
          >
            Designed and Developed by Ahamed Aathil
          </a>
        </div>
      </footer>
    );
  };

  const renderContent = () => {
    if (isLoading) return null;
    return (
      <main className="scrollable" style={{ paddingTop: 10, height: "100%" }}>
        {renderCarousel()}
        {renderCategories()}
        {renderRecommendedDishes()}
        {renderAboutUs()}
        {renderReviews()}
        {renderFooter()}
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
