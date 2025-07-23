'use client';

import React from 'react';
import Image from 'next/image';
import {useRouter, usePathname} from 'next/navigation';

import {svg} from '../svg';
import {URLS} from '../config';
import {stores} from '../stores';
import {Routes} from '../routes';
import {TabScreens} from '../routes';

type Props = {
  user?: boolean;
  title?: string;
  userName?: boolean;
  document?: boolean;
  creditCard?: boolean;
  showGoBack?: boolean;
  showBasket?: boolean;
};

export const Header: React.FC<Props> = ({
  showGoBack,
  title,
  user,
  userName,
  showBasket,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const {total} = stores.useCartStore();
  const {setScreen} = stores.useTabStore();
  const {openModal} = stores.useModalStore();

  const renderGoBack = () => {
    if (!showGoBack) return null;
    return (
      <button
        onClick={() => router.back()}
        style={{left: '0px', padding: '0 20px', position: 'absolute'}}
      >
        <svg.GoBackSvg />
      </button>
    );
  };

  const renderUser = () => {
    if (!user && !userName) return null;
    return (
      <button
        style={{position: 'absolute', left: 0, padding: 20}}
        onClick={() => {
          openModal();
        }}
      >
        <div
          style={{gap: 10, alignItems: 'center', display: 'flex'}}
          className='clickable'
        >
          <Image
            src={`${URLS.MAIN_URL}/assets/users/01.jpg`}
            priority={true}
            alt='User Avatar'
            width={22}
            height={22}
          />
          {userName && <h5 className='t14 main-dark'>Briley Henderson</h5>}
        </div>
      </button>
    );
  };

  const renderTitle = () => {
    return (
      <div
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <h4
          className='main-dark'
          style={{fontSize: 16}}
        >
          {title}
        </h4>
      </div>
    );
  };

  const renderBasket = () => {
    if (!showBasket) return null;

    return (
      <button
        onClick={() => {
          setScreen(TabScreens.ORDER);
          if (pathname !== Routes.TAB_NAVIGATOR) {
            router.push(Routes.TAB_NAVIGATOR);
          }
        }}
        style={{
          height: '100%',
          width: 'auto',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          position: 'absolute',
          right: 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            backgroundColor: 'var(--main-turquoise)',
            padding: '5px 4px 3px 4px',
            borderRadius: '12px',
            right: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
          }}
        >
          <span
            style={{
              color: 'var(--white-color)',
              fontWeight: 700,
              marginBottom: 1,
              fontSize: 10,
            }}
          >
            ${total > 0 ? total.toFixed(2) : '0'}
          </span>
        </div>
        <svg.HeaderBasketSvg />
      </button>
    );
  };

  return (
    <>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          position: 'relative',
          height: 'var(--header-height)',
        }}
      >
        {renderGoBack()}
        {renderUser()}
        {renderTitle()}
        {renderBasket()}
      </header>
    </>
  );
};
