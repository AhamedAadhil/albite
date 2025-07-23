import React from 'react';
import Image from 'next/image';

import {components} from '../components';
import type {ReviewType} from '../types';

type Props = {
  review: ReviewType;
  containerStyle?: React.CSSProperties;
};

export const ReviewItem: React.FC<Props> = ({review, containerStyle}) => {
  return (
    <li
      style={{
        padding: 20,
        borderRadius: 10,
        backgroundColor: 'var(--white-color)',
        ...containerStyle,
      }}
    >
      <section
        style={{
          display: 'flex',
          alignItems: 'center',
          paddingBottom: 10,
          marginBottom: 10,
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <Image
          src={review.avatar || ''}
          width={0}
          height={0}
          sizes='100vw'
          alt={review.name}
          style={{width: 30, height: 30, borderRadius: 15, marginRight: 14}}
        />
        <div style={{width: '100%'}}>
          <div
            style={{
              marginBottom: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <h5 style={{lineHeight: 1.2}}>{review.name}</h5>
            <span
              className='t10'
              style={{lineHeight: 1.2}}
            >
              {review.date}
            </span>
          </div>
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <components.Rating rating={review.rating} />
            <button>
              <span
                className='t10'
                style={{lineHeight: 1.2, color: 'var(--main-turquoise)'}}
              >
                Reply
              </span>
            </button>
          </div>
        </div>
      </section>
      <section>
        <p className='t14 number-of-lines-2'>{review.comment}</p>
      </section>
    </li>
  );
};
