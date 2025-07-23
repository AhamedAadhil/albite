'use client';

import React from 'react';

import {stores} from '../../stores';
import {TabScreens} from '../../routes';

import {Home} from './(screens)/Home';
import {Menu} from './(screens)/Menu';
import {Order} from './(screens)/Order';
import {Wishlist} from './(screens)/Wishlist';
import {OrderEmpty} from './(screens)/OrderEmpty';
import {WishListEmpty} from './(screens)/WishlistEmpty';
import {Notifications} from './(screens)/Notifications';

export const TabNavigator: React.FC = () => {
  const {screen} = stores.useTabStore();
  const {list: cart} = stores.useCartStore();
  const {list: wishlist} = stores.useWishlistStore();

  const renderScreens = () => {
    if (screen === TabScreens.HOME) {
      return <Home />;
    }

    if (screen === TabScreens.ORDER && cart.length === 0) {
      return <OrderEmpty />;
    }

    if (screen === TabScreens.MENU) {
      return <Menu />;
    }

    if (screen === TabScreens.ORDER && cart.length > 0) {
      return <Order />;
    }

    if (screen === TabScreens.FAVORITE && wishlist.length > 0) {
      return <Wishlist />;
    }

    if (screen === TabScreens.FAVORITE && wishlist.length === 0) {
      return <WishListEmpty />;
    }

    if (screen === TabScreens.NOTIFICATIONS) {
      return <Notifications />;
    }
  };

  return renderScreens();
};
