import React from 'react';

import {stores} from '../stores';
import type {DishType} from '../types';

type Props = {dish: DishType};

export const HeartSvg: React.FC<Props> = ({dish}) => {
  const {list} = stores.useWishlistStore();
  const ifInWishlist = list.find((item) => item.id === dish.id);

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={16}
      height={16}
      fill='none'
    >
      <path
        fill={ifInWishlist ? '#FA5555' : 'transparent'}
        stroke={ifInWishlist ? '#FA5555' : 'var(--text-color)'}
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M13.893 3.073a3.667 3.667 0 0 0-5.186 0L8 3.78l-.707-.707A3.668 3.668 0 0 0 2.107 8.26l.706.707L8 14.153l5.187-5.186.706-.707a3.667 3.667 0 0 0 0-5.187v0Z'
      />
    </svg>
  );
};
