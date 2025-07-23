'use client';

import React, {useState} from 'react';

import {svg} from '../../../svg';
import {hooks} from '../../../hooks';
import {components} from '../../../components';

export const Notifications: React.FC = () => {
  const {notifications} = hooks.useGetNotifications();

  const [readNotifications, setReadNotifications] = useState<Set<string>>(
    new Set(),
  );

  const handleMarkAsRead = (id: string) => {
    setReadNotifications((prev) => new Set(prev).add(id));
  };

  const renderHeader = () => {
    return (
      <components.Header
        user={true}
        showBasket={true}
        title='Notifications'
      />
    );
  };

  const renderContent = () => {
    return (
      <main className='container scrollable'>
        <ul style={{paddingTop: 10, paddingBottom: 20}}>
          {notifications.map((notification: any, index: number, array: any) => {
            const isLast = index === array.length - 1;
            const isRead = readNotifications.has(String(notification.id));

            return (
              <li
                key={notification.id}
                style={{
                  backgroundColor: 'var(--white-color)',
                  borderRadius: 10,
                  padding: 20,
                  marginBottom: isLast ? 0 : 14,
                }}
              >
                <section style={{opacity: isRead ? 0.5 : 1}}>
                  <div
                    style={{
                      gap: 8,
                      marginBottom: 14,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {notification.title === 'Order Out for Delivery' && (
                      <svg.NotificationCheckSvg />
                    )}
                    {notification.title === 'Limited-Time Deal' && (
                      <svg.GiftSvg />
                    )}
                    {notification.title === 'Reservation Confirmed' && (
                      <svg.NotificationCheckSvg />
                    )}
                    <h5 className='number-of-lines-1'>{notification.title}</h5>
                  </div>
                  <p
                    className='t14'
                    style={{marginBottom: 14}}
                  >
                    {notification.description}
                  </p>
                  <div
                    style={{display: 'flex', justifyContent: 'space-between'}}
                  >
                    <span className='t12'>{notification.date}</span>
                    {!isRead && (
                      <span
                        className='t12 clickable'
                        style={{color: 'var(--main-turquoise)'}}
                        onClick={() =>
                          handleMarkAsRead(String(notification.id))
                        }
                      >
                        Mark as read
                      </span>
                    )}
                  </div>
                </section>
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
