import React from 'react';

import type {DishType} from '../types';

type Props = {
  dish: DishType;
  style?: React.CSSProperties;
};

export const DishName: React.FC<Props> = ({dish, style}) => {
  return (
    <span
      style={style}
      className='t14 number-of-lines-1'
    >
      {dish.name}
    </span>
  );
};
