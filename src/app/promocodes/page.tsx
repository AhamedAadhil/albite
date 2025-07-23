import type {Metadata} from 'next';

import {Promocodes} from './Promocodes';

export const metadata: Metadata = {
  title: 'Promocodes',
  description: 'Promocodes.',
};

export default function Page() {
  return <Promocodes />;
}
