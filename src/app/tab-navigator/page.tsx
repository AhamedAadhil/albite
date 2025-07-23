import React from 'react';
import type {Metadata} from 'next';

import {TabNavigator} from './TabNavigator';

export const metadata: Metadata = {
  title: 'Tab Navigator',
  description:
    'Explore various tabs and navigate through different sections of the application seamlessly using the Tab Navigator.',
};

export default async function TabNavigatorPage() {
  return <TabNavigator />;
}
