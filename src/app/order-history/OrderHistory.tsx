'use client';

import React, {useState} from 'react';

import {hooks} from '../../hooks';
import {Routes} from '../../routes';
import {components} from '../../components';

export const OrderHistory: React.FC = () => {
  const {orders} = hooks.useGetOrders();

  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set());

  const handleToggle = (id: number) => {
    setOpenAccordions((prev) => {
      const newSet = new Set(prev);
      const idStr = id.toString();
      if (newSet.has(idStr)) {
        newSet.delete(idStr);
      } else {
        newSet.add(idStr);
      }
      return newSet;
    });
  };

  const renderHeader = () => {
    return (
      <components.Header
        showGoBack={true}
        title='Order history'
      />
    );
  };

  const renderContent = () => {
    return (
      <main className='scrollable container'>
        <section
          className='accordion'
          style={{paddingTop: 10}}
        >
          {orders.map((order) => {
            const idStr = order.id.toString();
            const isOpen = openAccordions.has(idStr);
            return (
              <div key={order.id}>
                <details
                  open={isOpen}
                  style={{
                    borderRadius: 10,
                    marginBottom: 10,
                    backgroundColor: 'var(--white-color)',
                  }}
                  onToggle={() => handleToggle(order.id)}
                >
                  <summary
                    style={{
                      padding: 20,
                      borderBottom: isOpen ? '1px solid #DBE9F5' : 'none',
                    }}
                  >
                    <section
                      style={{
                        marginBottom: 6,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      {/* Date */}
                      <span
                        className='t14'
                        style={{
                          marginRight: 4,
                          fontWeight: 500,
                          color: 'var(--main-dark)',
                        }}
                      >
                        {order.date}
                      </span>
                      {/* Time */}
                      <span
                        className='t10'
                        style={{marginRight: 'auto', marginTop: 2}}
                      >
                        at {order.time}
                      </span>
                      <span
                        className='t14'
                        style={{fontWeight: 500, color: 'var(--main-dark)'}}
                      >
                        ${order.total}
                      </span>
                    </section>
                    <section
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span className='t12'>Order ID: {order.id}</span>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: 5,
                          backgroundColor:
                            order.status === 'delivered'
                              ? '#00B0B9'
                              : order.status === 'shipping'
                              ? '#FFA462'
                              : '#FA5555',
                          color: '#fff',
                          fontWeight: 500,
                          lineHeight: 1.2,
                        }}
                        className='t10'
                      >
                        {order.status}
                      </span>
                    </section>
                  </summary>
                  <section style={{padding: 20}}>
                    <ul>
                      {order.products.map((product) => {
                        return (
                          <li
                            key={product.id}
                            style={{
                              marginBottom: 8,
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <span className='t14'>{product.name}</span>
                            <span
                              style={{marginLeft: 'auto'}}
                              className='t14'
                            >
                              {product.quantity} x ${product.price}
                            </span>
                          </li>
                        );
                      })}
                      <li
                        style={{
                          marginBottom: 8,
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span className='t14'>Discount</span>
                        <span className='t14'>- ${order.discount}</span>
                      </li>
                      <li
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span className='t14'>Delivery</span>
                        <span className='t14'>${order.delivery}</span>
                      </li>
                    </ul>
                  </section>
                </details>
                {isOpen && order.status === 'shipping' && (
                  <components.Button
                    label='track order'
                    containerStyle={{marginBottom: 20}}
                    href={Routes.TRACK_YOUR_ORDER}
                  />
                )}
                {isOpen && order.status !== 'shipping' && (
                  <div
                    className='row-center'
                    style={{
                      marginBottom: 20,
                      gap: 15,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <components.Button
                      label='repeat order'
                      colorScheme='secondary'
                      containerStyle={{flex: 1}}
                      href={Routes.TAB_NAVIGATOR}
                    />
                    <components.Button
                      label='Leave review'
                      containerStyle={{flex: 1}}
                      href={Routes.LEAVE_A_REVIEW}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </section>
      </main>
    );
  };

  return (
    <components.Screen>
      {renderHeader()}
      {renderContent()}
    </components.Screen>
  );
};
