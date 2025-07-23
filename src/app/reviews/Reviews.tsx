'use client';

import React from 'react';

import {hooks} from '../../hooks';
import {items} from '../../items';
import {components} from '../../components';

export const Reviews: React.FC = () => {
  const {reviews} = hooks.useGetReviews();

  const renderHeader = () => {
    return (
      <components.Header
        showGoBack={true}
        title='Reviews'
      />
    );
  };

  const renderContent = () => {
    return (
      <main
        className='scrollable container'
        style={{paddingTop: 10, paddingBottom: 20}}
      >
        <ul>
          {reviews?.map((review, index, array) => {
            const isLast = index === array.length - 1;

            return (
              <items.ReviewItem
                key={review.id}
                review={review}
                containerStyle={{marginBottom: isLast ? 0 : 14}}
              />
            );
          })}
        </ul>
      </main>
    );
  };

  return (
    <components.Screen>
      {renderHeader()}
      {renderContent()}
    </components.Screen>
  );
};
