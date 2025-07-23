'use client';

import Image from 'next/image';
import React, {useState} from 'react';
import {useRouter} from 'next/navigation';

import {URLS} from '../../config';
import {Routes} from '../../routes';
import {components} from '../../components';

export const LeaveAReview: React.FC = () => {
  const router = useRouter();

  const [rating, setRating] = useState<number>(0);

  const renderHeader = () => {
    return (
      <components.Header
        showGoBack={true}
        title='Leave a review'
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
            marginBottom: 20,
            borderRadius: 10,
            backgroundColor: 'var(--white-color)',
          }}
        >
          <Image
            width={0}
            height={0}
            sizes='100vw'
            alt='rate service'
            className='status-img'
            style={{
              margin: '0 auto',
              marginBottom: 14,
              width: '60%',
              height: 'auto',
            }}
            src={`${URLS.MAIN_URL}/assets/images/08.jpg`}
          />
          <h2
            style={{
              textTransform: 'capitalize',
              textAlign: 'center',
              marginBottom: 14,
            }}
          >
            Please rate the quality of <br /> service for the order!
          </h2>
          <components.RatingStars
            rating={rating}
            setRating={setRating}
            containerStyle={{marginBottom: 20}}
          />
          <p
            className='t16'
            style={{textAlign: 'center'}}
          >
            Your comments and suggestions help <br /> us improve the service
            quality better!
          </p>
          <div style={{marginBottom: 20}}>
            <textarea
              placeholder='Enter your comment'
              style={{
                height: 127,
                width: '100%',
                padding: 14,
                marginTop: 20,
                borderRadius: 10,
                border: 'none',
                fontSize: 16,
                fontFamily: 'DM Sans',
                color: '#748BA0',
                backgroundColor: '#E9F3F6',
                resize: 'none',
              }}
            />
          </div>
          <components.Button
            label='Send review'
            onClick={() => {
              router.push(Routes.TAB_NAVIGATOR);
            }}
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
