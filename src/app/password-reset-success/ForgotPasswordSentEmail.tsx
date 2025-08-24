import React from 'react';
import Image from 'next/image';

import {URLS} from '../../config';
import {Routes} from '../../routes';
import {components} from '../../components';

export const ForgotPasswordSentEmail: React.FC = () => {
  const renderHeader = () => {
    return <components.Header />;
  };

  const renderContent = () => {
    return (
      <main className='scrollable container'>
        <section
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'var(--white-color)',
            borderRadius: '10px',
          }}
          className='container'
        >
          <Image
            src={`${URLS.MAIN_URL}/assets/images/09.jpg`}
            alt='Account created'
            width={0}
            height={0}
            sizes='100vw'
            priority={true}
            style={{marginBottom: '10%', width: '70%', height: 'auto'}}
          />
          <h2
            style={{
              marginBottom: 20,
              textAlign: 'center',
              textTransform: 'capitalize',
            }}
          >
            Your password has <br />
            been reset!
          </h2>
          <p
            className='t16'
            style={{marginBottom: 30, textAlign: 'center'}}
          >
            Log in with your new password to <br /> continue your journey.
          </p>
        </section>
      </main>
    );
  };

  const renderButton = () => {
    return (
      <section style={{padding: 20}}>
        <components.Button
          label='Done'
          href={Routes.SIGN_IN}
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
