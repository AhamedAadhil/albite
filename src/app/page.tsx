import React from 'react';
import type {Metadata} from 'next';

import {Onboarding} from './Onboarding';

export const metadata: Metadata = {
  title: 'Onboarding',
  description:
    'Welcome to the onboarding page. Start your journey with us and explore the features we offer.',
};

export default function Start() {
  return <Onboarding />;
}
