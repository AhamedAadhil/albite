'use client';

import React, {useState} from 'react';
import Link from 'next/link';

import {svg} from '../../../svg';
import {items} from '../../../items';
import {hooks} from '../../../hooks';
import {Routes} from '../../../routes';
import {components} from '../../../components';

import type {DishType} from '../../../types';

type Props = {
  category: string;
};

export const MenuList: React.FC<Props> = ({category}) => {
  const {dishes, dishesLoading} = hooks.useGetDishes();

  const exists: DishType[] = dishes.filter((dish) =>
    dish.menu.includes(category),
  );

  const list = category === 'all' ? dishes : exists;

  const [search, setSearch] = useState('');
  const filteredDishes = list.filter((dish) =>
    dish.name.toLowerCase().includes(search.toLowerCase()),
  );

  const renderHeader = () => {
    return (
      <components.Header
        title='Menu'
        showGoBack={true}
        showBasket={true}
      />
    );
  };

  const renderSearch = () => {
    if (dishesLoading) return null;

    return (
      <section
        className='row-center container'
        style={{
          gap: 5,
          marginTop: 10,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 14,
        }}
      >
        <components.InputField
          inputType='search'
          placeholder='Search ...'
          containerStyle={{flex: 1, backgroundColor: 'var(--white-color)'}}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link
          href={Routes.FILTER}
          style={{
            width: 50,
            height: 50,
            backgroundColor: 'var(--white-color)',
            borderRadius: 10,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          className='center'
        >
          <svg.FilterSvg />
        </Link>
      </section>
    );
  };

  const renderDishes = () => {
    if (dishesLoading) return null;

    if (filteredDishes.length === 0) {
      return (
        <section
          className='container'
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <span className='t16'>No dishes found</span>
        </section>
      );
    }

    return (
      <section>
        <ul>
          {filteredDishes.map((dish, index, array) => {
            const isLast = index === array.length - 1;

            return (
              <items.MenuListItem
                dish={dish}
                key={dish.id}
                isLast={isLast}
              />
            );
          })}
        </ul>
      </section>
    );
  };

  const renderContent = () => {
    return (
      <main
        className='container scrollable'
        style={{paddingBottom: 20}}
      >
        {renderDishes()}
      </main>
    );
  };

  return (
    <components.Screen>
      {renderHeader()}
      {renderSearch()}
      {renderContent()}
    </components.Screen>
  );
};
