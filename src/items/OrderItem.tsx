import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import {Routes} from '../routes';
import {stores} from '../stores';
import {dish as dishItem} from '../dish';

import type {DishType} from '../types';

type Props = {dish: DishType; isLast: boolean};

const MinusSvg: React.FC = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={21}
      height={21}
      fill='none'
    >
      <rect
        width={21}
        height={21}
        fill='#E6F3F8'
        rx={10.5}
      />
      <path
        stroke='#0C1D2E'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.2}
        d='M6.125 10.5h8.75'
      />
    </svg>
  );
};

const PlusSvg: React.FC = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={21}
      height={21}
      fill='none'
    >
      <rect
        width={21}
        height={21}
        fill='#E6F3F8'
        rx={10.5}
      />
      <path
        stroke='#0C1D2E'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.2}
        d='M10.5 6.125v8.75M6.125 10.5h8.75'
      />
    </svg>
  );
};

export const OrderItem: React.FC<Props> = ({dish, isLast}) => {
  const {addToCart, removeFromCart} = stores.useCartStore();

  return (
    <li>
      <Link
        href={`${Routes.MENU_ITEM}/${dish.id}`}
        style={{
          paddingRight: 0,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          position: 'relative',
          marginBottom: isLast ? 0 : 14,
          borderRadius: 'var(--border-radius)',
          backgroundColor: 'var(--white-color)',
        }}
      >
        <Image
          src={dish.image}
          alt={'dish'}
          width={0}
          height={0}
          sizes='100vw'
          style={{
            width: '20%',
            height: 'auto',
            borderRadius: 10,
            marginRight: 4,
            marginLeft: 4,
          }}
        />
        <div style={{marginRight: 'auto'}}>
          <dishItem.DishName
            dish={dish}
            style={{marginBottom: 4}}
          />
          <span
            style={{marginBottom: 14}}
            className='t10 number-of-lines-1'
          >
            {dish.kcal} kcal - {dish.weight} g
          </span>
          <dishItem.DishPrice dish={dish} />
        </div>
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <button
            style={{padding: '14px 14px 4px 14px', borderRadius: 4}}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              removeFromCart(dish);
            }}
          >
            <MinusSvg />
          </button>
          <span
            className='t12'
            style={{lineHeight: 1}}
          >
            {dish.quantity}
          </span>
          <button
            style={{padding: '4px 14px 14px 14px', borderRadius: 4}}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              addToCart(dish);
            }}
          >
            <PlusSvg />
          </button>
          {dish.isNew && (
            <Image
              alt='New'
              width={34}
              height={29}
              src={'/assets/icons/14.png'}
              style={{left: 7, top: 7, position: 'absolute'}}
            />
          )}
          {dish.isHot && (
            <Image
              src={'/assets/icons/15.png'}
              priority={true}
              alt='Hot'
              width={13}
              height={24}
              style={{left: 7, top: 7, position: 'absolute'}}
            />
          )}
        </div>
      </Link>
    </li>
  );
};
