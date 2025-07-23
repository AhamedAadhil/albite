import React from 'react';

import {svg} from '../../svg';
import {components} from '../../components';

const progress = [
  {
    id: 1,
    title: 'Order Confirmed',
    description: 'Your order has been confirmed',
    status: 'done',
  },
  {
    id: 2,
    title: 'Order is Being Cooked',
    description: 'Estimated for 9:02 pm',
    status: 'done',
  },
  {
    id: 3,
    title: 'Courier Delivering',
    description: 'Estimated for 9:12 pm',
    status: 'pending',
  },
  {
    id: 4,
    title: 'Receiving',
    description: 'Estimated for 9:32 pm',
    status: 'pending',
  },
];

export const TrackYourOrder: React.FC = () => {
  const renderHeader = () => {
    return (
      <components.Header
        showGoBack={true}
        title='Track your order'
      />
    );
  };

  const renderContent = () => {
    return (
      <main className='scrollable container'>
        <section
          style={{
            padding: 20,
            marginTop: 10,
            borderRadius: 10,
            marginBottom: 10,
            border: '1px solid #00B0B9',
          }}
        >
          <div
            style={{
              gap: 14,
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <span className='t14'>Your order:</span>
            <span
              className='t14'
              style={{fontWeight: 500, color: 'var(--main-turquoise)'}}
            >
              456654
            </span>
          </div>
          <div
            style={{
              gap: 14,
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <span className='t14'>Date:</span>
            <span
              className='t14'
              style={{fontWeight: 500, color: 'var(--main-turquoise)'}}
            >
              Aug 31 at 8:32 pm
            </span>
          </div>
        </section>
        <section
          style={{
            borderRadius: 10,
            padding: 30,
            backgroundColor: 'var(--white-color)',
          }}
        >
          {progress.map((item, index, array) => {
            const isLast = index === array.length - 1;

            return (
              <div
                style={{display: 'flex'}}
                key={item.id}
              >
                <section
                  style={{
                    marginRight: 24,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: isLast ? 0 : 7,
                      backgroundColor:
                        item.status === 'done'
                          ? '#00B0B9'
                          : 'var(--white-color)',
                      border: '1px solid #00B0B9',
                    }}
                  >
                    {item.status === 'done' && <svg.StatusCheckSvg />}
                  </div>
                  {!isLast && (
                    <div
                      style={{
                        width: 2,
                        height: 30,
                        marginBottom: 6,
                        borderRadius: 1,
                        backgroundColor: '#00B0B9',
                      }}
                    />
                  )}
                </section>
                <section style={{display: 'flex', flexDirection: 'column'}}>
                  <span
                    className='t14'
                    style={{
                      marginBottom: 6,
                      color: 'var(--main-dark)',
                      fontWeight: 500,
                    }}
                  >
                    {item.title}
                  </span>
                  <span className='t14'>{item.description}</span>
                </section>
              </div>
            );
          })}
        </section>
      </main>
    );
  };

  const renderFooter = () => {
    return (
      <footer style={{padding: 20}}>
        <components.Button label='Chat support' />
      </footer>
    );
  };

  return (
    <components.Screen>
      {renderHeader()}
      {renderContent()}
      {renderFooter()}
    </components.Screen>
  );
};
