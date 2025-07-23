import React from 'react';
import Image from 'next/image';

import {svg} from '../../svg';
import {URLS} from '../../config';
import {Routes} from '../../routes';
import {components} from '../../components';

export const EditProfile: React.FC = () => {
  const renderHeader = () => {
    return (
      <components.Header
        showGoBack={true}
        title='Edit profile'
      />
    );
  };

  const renderContent = () => {
    return (
      <main className='scrollable container'>
        <section
          style={{
            backgroundColor: 'var(--white-color)',
            paddingLeft: 20,
            paddingRight: 20,
            borderRadius: 10,
            paddingTop: 50,
            paddingBottom: 30,
            marginTop: 10,
          }}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: 100,
              marginLeft: 'auto',
              marginRight: 'auto',
              marginBottom: 30,
            }}
            className='center clickable'
          >
            <Image
              src={`${URLS.MAIN_URL}/assets/users/01.jpg`}
              alt='profile'
              width={0}
              height={0}
              priority={true}
              sizes='100vw'
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                backgroundColor: 'var(--main-dark)',
                position: 'absolute',
                inset: 0,
                opacity: 0.3,
                borderRadius: '50%',
                zIndex: 9999,
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 99999,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <svg.CameraSvg />
            </div>
          </div>
          <components.InputField
            type='text'
            inputType='username'
            placeholder='Enter your username'
            containerStyle={{marginBottom: 14}}
          />
          <components.InputField
            type='email'
            inputType='email'
            placeholder='Email'
            containerStyle={{marginBottom: 14}}
          />
          <components.InputField
            type='tel'
            inputType='phone'
            placeholder='Phone number'
            containerStyle={{marginBottom: 14}}
          />
          <components.InputField
            type='text'
            placeholder='Your address'
            inputType='location'
            containerStyle={{marginBottom: 20}}
          />
          <components.Button
            label='save changes'
            href={Routes.TAB_NAVIGATOR}
            containerStyle={{marginBottom: 20}}
          />
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
