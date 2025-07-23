import type {Metadata} from 'next';

import {MenuList} from './MenuList';

export const metadata: Metadata = {
  title: 'Menu List',
  description: 'List of menu items.',
};

type Params = {
  params: Promise<{category: string}>;
};

export default async function Page({params}: Params) {
  const category = (await params).category;

  return <MenuList category={category} />;
}
