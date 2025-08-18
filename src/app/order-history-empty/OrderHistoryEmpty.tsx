import { components } from "@/components";
import { URLS } from "@/config";
import { Routes } from "@/routes";
import Image from "next/image";

export const OrderHistoryEmpty: React.FC = () => {
  return (
    <section
      style={{
        borderRadius: 10,
        backgroundColor: "var(--white-color)",
        padding: 40,
        margin: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <Image
        src={`${URLS.MAIN_URL}/assets/images/10.jpg`}
        alt="No orders"
        width={350}
        height={350}
        priority={true}
        style={{ marginBottom: 20, borderRadius: 8 }}
      />
      <h2 style={{ marginBottom: 10 }}>No Order History Yet!</h2>
      <p
        className="t16"
        style={{ maxWidth: 300, marginBottom: 20, color: "#666" }}
      >
        It looks like you haven’t placed any orders yet. Explore our menu and
        start your first order now!
      </p>
      <components.Button
        label="Explore Our Menu"
        href={`${Routes.MENU_LIST}/all`}
        containerStyle={{ minWidth: 200, maxWidth: 300, width: "100%" }}
      />
    </section>
  );
};
