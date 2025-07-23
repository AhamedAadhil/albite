import type {Metadata} from 'next';

import {Reviews} from './Reviews';

export const metadata: Metadata = {
  title: 'Reviews',
  description: 'Reviews.',
};

export default function Page() {
  return <Reviews />;
}
