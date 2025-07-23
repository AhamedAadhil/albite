import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import {dish} from '../dish';

import {svg} from '../svg';
import {stores} from '../stores';
import {Routes} from '../routes';

import type {DishType} from '../types';

type Props = {
  item: DishType;
};

export const RecommendedItem: React.FC<Props> = ({item}) => {
  const {addToCart} = stores.useCartStore();
  const {
    list: wishlist,
    addToWishlist,
    removeFromWishlist,
  } = stores.useWishlistStore();

  const dishId = item.id;

  const ifInWishlist = wishlist.find((item) => item.id === dishId);

  return (
    <Link
      className='column clickable'
      href={`${Routes.MENU_ITEM}/${item.id}`}
      style={{
        backgroundColor: 'var(--white-color)',
        borderRadius: '10px',
        position: 'relative',
      }}
    >
      <Image
        src={item.image}
        alt='Dish'
        width={0}
        height={0}
        sizes='100vw'
        priority={true}
        style={{width: '100%', height: 'auto', borderRadius: '10px'}}
      />
      <button
        style={{
          position: 'absolute',
          right: 0,
          bottom: 72 - 15,
          padding: 15,
          borderRadius: 10,
        }}
        // onClick={(e) => {
        //   e.preventDefault();
        //   e.stopPropagation();
        //   addToWishlist(item);
        // }}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          if (ifInWishlist) {
            removeFromWishlist(item);
          } else {
            addToWishlist(item);
          }
        }}
      >
        <svg.HeartSvg dish={item} />
      </button>
      <div
        className='column'
        style={{padding: '14px'}}
      >
        <dish.DishName
          dish={item}
          style={{marginBottom: 3}}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <dish.DishPrice dish={item} />
          <button
            style={{
              position: 'absolute',
              padding: '14px',
              right: 0,
              bottom: 0,
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(item);
            }}
          >
            <svg.PlusSvg />
          </button>
        </div>
      </div>
    </Link>
  );
};
