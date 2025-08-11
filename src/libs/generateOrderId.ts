import { Order } from "@/models/order";

export async function generateOrderId() {
  let id: string = ""; // ✅ initialized
  let exists = true;

  while (exists) {
    const code = Math.random().toString(36).substr(2, 5).toUpperCase();
    id = `AB-${code}`;
    exists = !!(await Order.exists({ orderId: id }));
  }

  return id;
}
