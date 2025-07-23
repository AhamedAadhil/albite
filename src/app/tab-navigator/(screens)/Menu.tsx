'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import {hooks} from '../../../hooks';
import {Routes} from '../../../routes';
import {components} from '../../../components';

export const Menu: React.FC = () => {
  const {menu} = hooks.useGetMenu();

  const renderHeader = () => {
    return (
      <components.Header
        user={true}
        userName={true}
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
        <ul
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 15,
          }}
        >
          {menu.map((item) => {
            const category = item.name.toLowerCase().replace(' ', '-');
            return (
              <li key={item.id}>
                <Link
                  href={`${Routes.MENU_LIST}/${category}`}
                  style={{position: 'relative'}}
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={90}
                    height={90}
                    sizes='100vw'
                    priority={true}
                    style={{width: '100%', height: '100%', borderRadius: 10}}
                  />
                  <div style={{position: 'absolute', left: 15, bottom: 10}}>
                    <span
                      className='t16 number-of-lines-1'
                      style={{color: 'var(--main-dark)'}}
                    >
                      {item.name}
                    </span>
                  </div>
                </Link>
              </li>
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
