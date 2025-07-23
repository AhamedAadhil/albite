'use client';

import Image from 'next/image';
import React, {useEffect} from 'react';
import {useRouter} from 'next/navigation';

import {svg} from '../svg';
import {URLS} from '../config';
import {Routes} from '../routes';
import {stores} from '../stores';
import {Switcher} from './Switcher';

const modalMenu = [
  {
    id: 1,
    title: 'Personal information',
    route: Routes.EDIT_PROFILE,
    switch: false,
  },
  {
    id: 2,
    title: 'My orders',
    route: Routes.ORDER_HISTORY,
    switch: false,
  },
  {
    id: 3,
    title: 'My orders Empty',
    route: Routes.ORDER_HISTORY_EMPTY,
    switch: false,
  },
  {
    id: 4,
    title: 'Promocodes & gift cards',
    route: Routes.PROMOCODES,
    switch: false,
  },
  {
    id: 5,
    title: 'Promocodes Empty',
    route: Routes.PROMOCODES_EMPTY,
    switch: false,
  },
  {
    id: 6,
    title: 'Onboarding',
    route: Routes.ONBOARDING,
    switch: false,
  },
  {
    id: 7,
    title: 'Notifications',
    route: '',
    switch: true,
  },
  {
    id: 8,
    title: 'Face ID',
    route: '',
    switch: true,
  },
  {
    id: 9,
    title: 'Support center',
    route: '',
    switch: false,
  },
  {
    id: 10,
    title: 'Sign out',
    route: Routes.SIGN_IN,
    switch: false,
  },
];

export const Modal: React.FC = () => {
  const router = useRouter();

  const {isOpen, closeModal} = stores.useModalStore();

  useEffect(() => {
    if (isOpen) {
      document.body.style.backgroundColor = '#fff';

      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', '#fff');
      }

      return () => {
        document.body.style.backgroundColor = '';
        if (metaThemeColor) {
          metaThemeColor.setAttribute('content', '');
        }
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(30, 37, 56, 0.6)',
        zIndex: 101,
      }}
      onClick={closeModal}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: '80%',
          backgroundColor: 'var(--white-color)',
          zIndex: 99999,
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div
          style={{
            paddingTop: '20%',
            paddingLeft: 20,
            paddingRight: 20,
            marginBottom: 27,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            paddingBottom: 20,
            borderBottom: '1px solid #DBE9F5',
          }}
        >
          <Image
            width={60}
            height={60}
            alt='user'
            style={{borderRadius: 30}}
            priority={true}
            src={`${URLS.MAIN_URL}/assets/users/01.jpg`}
          />
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <span
              className='t14'
              style={{
                color: 'var(--main-dark)',
                fontWeight: 500,
                marginBottom: 4,
              }}
            >
              Jordan Hebert
            </span>
            <span className='t14'>jordanhebert@mail.com</span>
          </div>
        </div>
        {/* Phone */}
        <ul style={{paddingLeft: 20, paddingRight: 20, paddingBottom: 20}}>
          {modalMenu.map((item, index, array) => {
            const isLast = index === array.length - 1;

            return (
              <li
                key={item.id}
                style={{
                  paddingTop: 6,
                  paddingBottom: 6,
                  marginBottom: isLast ? 0 : 6,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                onClick={() => {
                  if (item.route !== '') {
                    closeModal();
                    router.push(item.route);
                  }
                }}
                className='clickable'
              >
                <span
                  className='t16 number-of-lines-1'
                  style={
                    item.title === 'Sign out'
                      ? {color: '#FA5555'}
                      : {color: 'var(--main-dark)'}
                  }
                >
                  {item.title}
                </span>
                {item.route !== '' && item.title !== 'Sign out' && (
                  <svg.RightArrowSvg />
                )}
                {item.switch && <Switcher />}
              </li>
            );
          })}
        </ul>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '80%',
          transform: 'translateX(0%)',
        }}
        className='clickable'
        onClick={closeModal}
      >
        <svg.CrossSvg />
      </div>
    </div>
  );
};
