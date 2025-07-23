import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import {svg} from '../svg';
import {Routes} from '../routes';
import {stores} from '../stores';
import {dish as dishItem} from '../dish';

type Props = {dish: DishType};

import type {DishType} from '../types';

export const WishlistItem: React.FC<Props> = ({dish}) => {
  const {addToCart} = stores.useCartStore();

  const {
    list: wishlist,
    addToWishlist,
    removeFromWishlist,
  } = stores.useWishlistStore();

  const ifInWishlist = wishlist.find((item) => item.id === dish.id);

  return (
    <li
      style={{
        backgroundColor: 'var(--white-color)',
        borderRadius: 10,
        position: 'relative',
      }}
    >
      <Link href={`${Routes.MENU_ITEM}/${dish.id}`}>
        <Image
          src={dish.image}
          alt={'dish'}
          width={0}
          height={0}
          sizes='100vw'
          style={{
            width: '90%',
            height: 'auto',
            borderRadius: 10,
            margin: '0 auto',
          }}
        />
        {dish.isNew && (
          <Image
            alt='New'
            width={33.69}
            height={29}
            src={'/assets/icons/14.png'}
            style={{left: 14, top: 14, position: 'absolute'}}
          />
        )}
        {dish.isHot && (
          <Image
            src={'/assets/icons/15.png'}
            priority={true}
            alt='Hot'
            width={18}
            height={33}
            style={{left: 14, top: 14, position: 'absolute'}}
          />
        )}
        <button
          style={{
            position: 'absolute',
            padding: 14,
            right: 0,
            bottom: 72 - 15,
            borderRadius: 10,
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
          <svg.HeartSvg dish={dish} />
        </button>
        <div style={{padding: 14, paddingTop: 0}}>
          <div style={{marginRight: 14}}>
            <dishItem.DishName
              dish={dish}
              style={{marginBottom: 3}}
            />
          </div>
          <dishItem.DishPrice dish={dish} />
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              addToCart(dish);
            }}
            style={{
              position: 'absolute',
              padding: 14,
              right: 0,
              bottom: 0,
              borderRadius: 10,
            }}
          >
            <svg.PlusSvg />
          </button>
        </div>
      </Link>
    </li>
  );
};
