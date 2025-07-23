'use client';

import React from 'react';

import {items} from '../../../items';
import {stores} from '../../../stores';
import {components} from '../../../components';

export const Wishlist: React.FC = () => {
  const {list: wishlist} = stores.useWishlistStore();

  const renderHeader = () => {
    return (
      <components.Header
        user={true}
        showBasket={true}
        title='Favorite'
      />
    );
  };

  const renderContent = () => {
    return (
      <main
        className='scrollable container'
        style={{paddingTop: 10, paddingBottom: 20}}
      >
        <ul
          style={{
            display: 'grid',
            gap: 15,
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          {wishlist.map((dish) => {
            return (
              <items.WishlistItem
                dish={dish}
                key={dish.id}
              />
            );
          })}
        </ul>
      </main>
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
      {renderBottomTabBar()}
    </components.Screen>
  );
};
