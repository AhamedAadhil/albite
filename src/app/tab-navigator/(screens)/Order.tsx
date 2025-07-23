'use client';

import React from 'react';

import {svg} from '../../../svg';
import {items} from '../../../items';
import {stores} from '../../../stores';
import {Routes} from '../../../routes';
import {components} from '../../../components';

export const Order: React.FC = () => {
  const {list} = stores.useCartStore();

  const renderHeader = () => {
    return (
      <components.Header
        user={true}
        title='Order'
        showBasket={true}
      />
    );
  };

  const renderContent = () => {
    return (
      <main
        className='scrollable container'
        style={{paddingTop: 10, paddingBottom: 10}}
      >
        {/* DISHES */}
        <section style={{marginBottom: 20}}>
          <ul>
            {list.map((dish, index, array) => {
              const isLast = index === array.length - 1;
              return (
                <items.OrderItem
                  dish={dish}
                  key={dish.id}
                  isLast={isLast}
                />
              );
            })}
          </ul>
        </section>

        {/* APPLES PROMOCODE */}
        <section style={{marginBottom: '10%'}}>
          <button>
            <svg.ApplyPromocodeSvg />
          </button>
        </section>

        {/* SUMMARY */}
        <section style={{marginBottom: 20}}>
          <div
            style={{
              padding: 20,
              borderRadius: 10,
              border: '1px solid var(--main-turquoise)',
            }}
          >
            <ul>
              {/* SUBTOTAL */}
              <li
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 10,
                }}
              >
                <span
                  className='t14'
                  style={{color: 'var(--main-dark)', fontWeight: 500}}
                >
                  Subtotal
                </span>
                <span
                  className='t14'
                  style={{color: 'var(--main-dark)'}}
                >
                  {/* ${subtotal.toFixed(2)} */}
                </span>
              </li>
              {/* DISCOUNT */}
              <li
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 10,
                }}
              >
                <span className='t14'>Discount</span>
                {/* <span className='t14'>${discount}</span> */}
              </li>
              {/* DELIVERY */}
              <li
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: 14,
                  marginBottom: 20,
                  borderBottom: '1px solid #DBE9F5',
                }}
              >
                <span className='t14'>Delivery</span>
                {/* <span className='t14'>${delivery}</span> */}
              </li>
              {/* TOTAL */}
              <li
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <h4>Total</h4>
                {/* <h4>${total.toFixed(2)}</h4> */}
              </li>
            </ul>
          </div>
        </section>

        {/* BUTTON */}
        <section>
          <components.Button
            label='Checkout'
            href={Routes.CHECKOUT}
          />
        </section>
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
