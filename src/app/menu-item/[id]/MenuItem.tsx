'use client';

import React from 'react';
import Image from 'next/image';

import {svg} from '../../../svg';
import {hooks} from '../../../hooks';
import {Routes} from '../../../routes';
import {stores} from '../../../stores';
import {components} from '../../../components';

type Props = {
  menuItemId: string;
};

const MinusSvg = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={14}
      height={14}
      fill='none'
    >
      <path
        stroke='#0C1D2E'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.2}
        d='M2.898 7h8.114'
      />
    </svg>
  );
};

const PlusSvg = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={14}
      height={14}
      fill='none'
    >
      <path
        stroke='#0C1D2E'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.2}
        d='M6.955 2.917v8.166M2.898 7h8.114'
      />
    </svg>
  );
};

export const MenuItem: React.FC<Props> = ({menuItemId}) => {
  const {dishes} = hooks.useGetDishes();
  const {list: cart, addToCart, removeFromCart} = stores.useCartStore();
  const {
    list: wishlist,
    addToWishlist,
    removeFromWishlist,
  } = stores.useWishlistStore();

  const quantity =
    cart.find((item) => Number(item.id) === Number(menuItemId))?.quantity ?? 0;

  const dish = dishes.find((dish) => Number(dish.id) === Number(menuItemId));

  const ifInWishlist = wishlist.find((item) => item.id === dish?.id);

  if (!dish) {
    return (
      <section>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <p>Not found</p>
        </div>
      </section>
    );
  }

  const renderHeader = () => {
    return (
      <components.Header
        showGoBack={true}
        showBasket={true}
      />
    );
  };

  const renderImage = () => {
    return (
      <section
        style={{
          position: 'relative',
          height: '100%',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'var(--white-color)',
        }}
        className='flex-center'
      >
        <Image
          src={dish?.image ?? ''}
          alt={'Dish'}
          width={0}
          height={0}
          sizes='100vw'
          style={{width: '70%', height: 'auto'}}
        />
        {dish.isNew && (
          <Image
            alt={dish.name}
            width={58.09}
            height={50}
            src={'/assets/icons/14.png'}
            style={{position: 'absolute', top: 21, left: 20}}
          />
        )}
        {dish.isHot && (
          <Image
            alt='Hot'
            src={'/assets/icons/15.png'}
            priority={true}
            width={24}
            height={44}
            style={{
              left: 0,
              top: 0,
              marginLeft: 20,
              marginTop: 20,
              height: 'auto',
              position: 'absolute',
            }}
          />
        )}
        <button
          style={{
            position: 'absolute',
            top: 25,
            right: 23,
            borderRadius: 2,
          }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            if (ifInWishlist) {
              removeFromWishlist(dish);
            } else {
              addToWishlist(dish);
            }
          }}
        >
          <svg.HeartBigSvg dish={dish} />
        </button>
      </section>
    );
  };

  const renderDetails = () => {
    return (
      <section
        className='container'
        style={{marginBottom: 20, marginTop: 30}}
      >
        <div
          style={{
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h3
            className='number-of-lines-1'
            style={{textTransform: 'capitalize'}}
          >
            {dish?.name}
          </h3>
          <span
            className='t16'
            style={{marginLeft: 14, whiteSpace: 'nowrap'}}
          >
            {dish?.kcal} kcal - {dish?.weight}g
          </span>
        </div>
        <p className='t16'>{dish?.description}</p>
      </section>
    );
  };

  const renderPriceWithCounter = () => {
    return (
      <section className='container'>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'var(--white-color)',
            borderRadius: 'var(--border-radius)',
          }}
        >
          <div
            style={{
              paddingTop: '14px',
              paddingBottom: '14px',
              paddingLeft: '20px',
            }}
          >
            <span
              style={{
                fontSize: '20px',
                fontWeight: 'var(--fw-bold)',
                fontFamily: 'DM Sans',
              }}
            >
              ${dish?.price}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <button
              style={{padding: '20px'}}
              onClick={() => {
                removeFromCart(dish);
              }}
            >
              <MinusSvg />
            </button>

            <span className='t14'>{quantity}</span>

            <button
              style={{padding: '20px'}}
              onClick={() => {
                addToCart(dish);
              }}
            >
              <PlusSvg />
            </button>
          </div>
        </div>
      </section>
    );
  };

  const renderButton = () => {
    return (
      <section
        className='container'
        style={{paddingTop: 10, paddingBottom: 20}}
      >
        <components.Button
          label='+ Add to cart'
          onClick={() => addToCart(dish)}
          containerStyle={{marginBottom: 10}}
        />
        <components.Button
          label='Reviews'
          href={Routes.REVIEWS}
          colorScheme='secondary'
        />
      </section>
    );
  };

  const renderContent = () => {
    return (
      <div
        className='scrollable'
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {renderImage()}
        {renderDetails()}
        {renderPriceWithCounter()}
        {renderButton()}
      </div>
    );
  };

  return (
    <components.Screen>
      {renderHeader()}
      {renderContent()}
    </components.Screen>
  );
};
