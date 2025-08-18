import type { Metadata } from "next";

import { TrackYourOrder } from "./TrackYourOrder";

export const metadata: Metadata = {
  title: "Track Your Order",
  description: "Track your order.",
};

export default function Page() {
  return <TrackYourOrder />;
}
