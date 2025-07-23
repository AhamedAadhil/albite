'use client';

import React from 'react';

import {svg} from '../../svg';
import {Routes} from '../../routes';
import {stores} from '../../stores';
import {components} from '../../components';

export const Checkout: React.FC = () => {
  const {total, discount, delivery, list} = stores.useCartStore();

  const renderHeader = () => {
    return (
      <components.Header
        title='Checkout'
        showGoBack={true}
      />
    );
  };

  const renderContent = () => {
    return (
      <main
        className='scrollable container'
        style={{paddingTop: 10, paddingBottom: 10}}
      >
        {/* SUMMARY */}
        <section
          style={{
            padding: 20,
            borderRadius: 10,
            marginBottom: 14,
            border: '1px solid var(--main-turquoise)',
          }}
        >
          <div
            style={{
              paddingBottom: 20,
              marginBottom: 20,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--border-color)',
            }}
          >
            <span
              className='t18'
              style={{color: 'var(--main-dark)', textTransform: 'capitalize'}}
            >
              My order
            </span>
            <span
              className='t18'
              style={{color: 'var(--main-dark)'}}
            >
              ${total.toFixed(2)}
            </span>
          </div>
          <ul>
            {list.map((dish) => {
              return (
                <li
                  key={dish.id}
                  style={{
                    marginBottom: 8,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <span className='t14'>{dish.name}</span>
                  <span className='t14'>
                    {dish.quantity} x ${dish.price}
                  </span>
                </li>
              );
            })}
          </ul>
          <div
            style={{
              marginBottom: 8,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span className='t14'>Discount</span>
            <span className='t14'>- ${discount}</span>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span className='t14'>Delivery</span>
            <span className='t14'>${delivery}</span>
          </div>
        </section>

        {/* SHIPPING DETAILS */}
        <section
          style={{
            padding: 20,
            borderRadius: 10,
            marginBottom: 14,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--white-color)',
          }}
          className='clickable'
        >
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <span
              className='t14 number-of-lines-1'
              style={{
                fontWeight: 500,
                marginBottom: 8,
                color: 'var(--main-dark)',
                textTransform: 'capitalize',
              }}
            >
              Shipping details
            </span>
            <span className='t12 number-of-lines-1'>
              8000 S Kirkland Ave, Chicago, IL 6065...
            </span>
          </div>
          <svg.RightArrowSvg />
        </section>

        {/* PAYMENT METHOD */}
        <section
          style={{
            padding: 20,
            borderRadius: 10,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--white-color)',
          }}
          className='clickable'
        >
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <span
              className='t14 number-of-lines-1'
              style={{
                fontWeight: 500,
                marginBottom: 8,
                color: 'var(--main-dark)',
                textTransform: 'capitalize',
              }}
            >
              Payment method
            </span>
            <span className='t12 number-of-lines-1'>4947 **** **** 3157</span>
          </div>
          <svg.RightArrowSvg />
        </section>
      </main>
    );
  };

  const renderButton = () => {
    return (
      <section style={{padding: 20}}>
        <components.Button
          label='Confirm order'
          href={Routes.ORDER_SUCCESSFUL}
        />
      </section>
    );
  };

  return (
    <components.Screen>
      {renderHeader()}
      {renderContent()}
      {renderButton()}
    </components.Screen>
  );
};
