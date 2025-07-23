import type {Metadata} from 'next';

import {MenuItem} from './MenuItem';
import {getDishes} from '../../../data/getDishes';

import type {DishType} from '../../../types';

type Params = {
  params: Promise<{id: string}>;
};

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {id} = await params;
  const dishes = await getDishes();
  const dish = dishes?.find((dish: DishType) => Number(dish.id) === Number(id));

  return {
    title: dish ? dish.name : 'MenuItem',
    description: dish ? dish.description : 'MenuItem',
  };
}

export default async function MenuItemPage({params}: Params) {
  const menuItemId = (await params).id;

  return <MenuItem menuItemId={menuItemId} />;
}
