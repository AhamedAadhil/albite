import type {Metadata} from 'next';

import {SignIn} from './SignIn';

export const metadata: Metadata = {
  title: 'Sign In',
  description:
    'Welcome to the sign-in page. Please enter your credentials to continue.',
};

export default function SignInPage() {
  return <SignIn />;
}
