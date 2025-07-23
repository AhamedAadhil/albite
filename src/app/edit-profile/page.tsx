import type {Metadata} from 'next';

import {EditProfile} from './EditProfile';

export const metadata: Metadata = {
  title: 'Edit Profile',
  description: 'Edit your profile information.',
};

export default function NewPasswordPage() {
  return <EditProfile />;
}
