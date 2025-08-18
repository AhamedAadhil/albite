// app/menu-item/[id]/page.tsx

import type { Metadata } from "next";
import { MenuItem } from "./MenuItem";

// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }): Promise<Metadata> {
//   const awaitedParams = await params;
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_BASE_URL}/api/dishes/${awaitedParams.id}`,
//     {
//       credentials: "include",
//       cache: "no-store",
//     }
//   );

//   const data = await res.json();
//   const dish = data?.dish;

//   return {
//     title: dish ? dish.name : "MenuItem",
//     description: dish ? dish.description : "MenuItem",
//   };
// }

export default async function MenuItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <MenuItem menuItemId={(await params).id} />;
}
