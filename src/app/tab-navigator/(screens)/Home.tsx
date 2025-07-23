'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, {useState} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import PuffLoader from 'react-spinners/PuffLoader';

import {items} from '../../../items';
import {hooks} from '../../../hooks';
import {Routes} from '../../../routes';
import {components} from '../../../components';

export const Home: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const {menu, menuLoading} = hooks.useGetMenu();
  const {dishes, dishesLoading} = hooks.useGetDishes();
  const {reviews, reviewsLoading} = hooks.useGetReviews();
  const {carousel, carouselLoading} = hooks.useGetCarousel();

  const isLoading =
    menuLoading || dishesLoading || reviewsLoading || carouselLoading;

  const handleSlideChange = (swiper: any) => {
    setActiveSlide(swiper.activeIndex);
  };

  const renderHeader = () => {
    return (
      <components.Header
        user={true}
        userName={true}
        showBasket={true}
      />
    );
  };

  const renderCategories = () => {
    return (
      <section style={{marginBottom: 30}}>
        <components.BlockHeading
          title='We offer'
          className='container'
          containerStyle={{marginBottom: 14}}
        />
        <Swiper
          spaceBetween={10}
          slidesPerView={3.5}
          onSlideChange={() => {}}
          onSwiper={(swiper) => {}}
          style={{padding: '0 20px'}}
        >
          {menu.map((item) => {
            return (
              <SwiperSlide key={item.id}>
                <Link
                  href={`${Routes.MENU_LIST}/all`}
                  className='clickable'
                  style={{position: 'relative'}}
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={90}
                    height={90}
                    sizes='100vw'
                    priority={true}
                    style={{width: '100%', height: '100%', borderRadius: 10}}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 10,
                      left: 15,
                      textAlign: 'center',
                      backgroundColor: 'var(--white-color)',
                      borderRadius: '0 0 10px 10px',
                      color: 'var(--main-dark)',
                    }}
                    className='t10 number-of-lines-1'
                  >
                    {item.name}
                  </span>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </section>
    );
  };

  const renderCarousel = () => {
    return (
      <section style={{marginBottom: 30, position: 'relative'}}>
        <Swiper
          slidesPerView={'auto'}
          pagination={{clickable: true}}
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
                    alt='Banner'
                    width={0}
                    height={0}
                    sizes='100vw'
                    priority={true}
                    className='clickable'
                    style={{width: '100%', height: 'auto'}}
                  />
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            bottom: 27,
            zIndex: 1,
            width: '100%',
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
                      ? 'var(--white-color)'
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
    return (
      <section style={{marginBottom: 30}}>
        <components.BlockHeading
          title='Recommended for you'
          className='container'
          containerStyle={{marginBottom: 14}}
        />
        <Swiper
          spaceBetween={14}
          slidesPerView={1.6}
          onSlideChange={() => {}}
          onSwiper={(swiper) => {}}
          style={{padding: '0 20px'}}
        >
          {dishes
            .filter((dish) => dish.isRecommended)
            .map((dish) => {
              return (
                <SwiperSlide key={dish.id}>
                  <items.RecommendedItem item={dish} />
                </SwiperSlide>
              );
            })}
        </Swiper>
      </section>
    );
  };

  const renderReviews = () => {
    return (
      <section style={{marginBottom: 20}}>
        <components.BlockHeading
          href={Routes.REVIEWS}
          title='Our Happy clients say'
          containerStyle={{marginLeft: 20, marginRight: 20, marginBottom: 14}}
        />
        <Swiper
          spaceBetween={14}
          slidesPerView={1.2}
          pagination={{clickable: true}}
          navigation={true}
          mousewheel={true}
          style={{padding: '0 20px'}}
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
      <main
        className='scrollable'
        style={{paddingTop: 10, height: '100%'}}
      >
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
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          inset: 0,
          height: '100%',
        }}
        className='flex-center'
      >
        <PuffLoader
          size={40}
          color={'#455A81'}
          aria-label='Loading Spinner'
          data-testid='loader'
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
