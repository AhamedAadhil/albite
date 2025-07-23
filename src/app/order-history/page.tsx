import type {Metadata} from 'next';

import {OrderHistory} from './OrderHistory';

export const metadata: Metadata = {
  title: 'Order History',
  description: 'View your order history.',
};

export default function NewPasswordPage() {
  return <OrderHistory />;
}
