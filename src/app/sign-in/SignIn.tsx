"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { svg } from "../../svg";
import { Routes } from "../../routes";
import { components } from "../../components";
import { useAuthStore } from "@/stores/useAuthStore";

export const SignIn: React.FC = () => {
  const router = useRouter();
  const [mobile, setMobile] = useState("+94");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useAuthStore();

  // Validate form fields
  const isFormValid = mobile.trim().length > 3 && password.trim().length >= 6;

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Sign in failed");
      }

      // Persist user in Zustand store
      login(data.user);

      toast.success(data.message || "Signed in successfully!");
      router.replace(Routes.TAB_NAVIGATOR);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.");
    }
  };

  const renderHeader = () => {
    return <components.Header showGoBack={true} />;
  };

  const renderContent = () => {
    return (
      <main className="scrollable container" style={{ paddingTop: 10 }}>
        <section
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            borderRadius: "10px",
            backgroundColor: "var(--white-color)",
          }}
          className="container"
        >
          <h1 style={{ marginBottom: 30 }}>Welcome back to Albite.lk!</h1>
          <span className="t16" style={{ marginBottom: 30 }}>
            Sign in to continue
          </span>

          {/* INPUT FIELDS */}
          <section>
            <components.InputField
              inputType="phone"
              placeholder="+94XXXXXXXXX"
              containerStyle={{ marginBottom: "10px" }}
              value={mobile}
              onChange={(e) => {
                let val = e.target.value;
                if (!val.startsWith("+94")) {
                  val = "+94" + val.replace(/^0+/, "");
                }
                setMobile(val);
              }}
            />
            <components.InputField
              inputType="password"
              placeholder="Enter your password"
              containerStyle={{ marginBottom: "14px" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </section>

          {/* REMEMBER ME */}
          <section
            style={{
              marginBottom: 40,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                gap: "10px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
              className="clickable"
              onClick={() => setRememberMe(!rememberMe)}
            >
              <div
                style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "4px",
                  backgroundColor: "#E6EFF8",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {rememberMe && <svg.InputCheckSvg />}
              </div>
              <span className="t16">Remember me</span>
            </div>
            <span
              className="t16 main-color clickable"
              style={{ color: "var(--main-turquoise)" }}
              onClick={() => router.push(Routes.FORGOT_PASSWORD)}
            >
              Lost your password?
            </span>
          </section>

          {/* SIGN IN BUTTON */}
          <section style={{ marginBottom: 14 }}>
            <components.Button
              label="Sign In"
              onClick={handleSubmit}
              disabled={!isFormValid}
            />
          </section>

          {/* REGISTER */}
          <section>
            <span className="t16">
              No account?{" "}
              <Link
                href={Routes.SIGN_UP}
                style={{ color: "var(--main-turquoise)" }}
              >
                Sign up.
              </Link>
            </span>
          </section>
        </section>
      </main>
    );
  };

  // const renderSocials = () => {
  //   const btnStyle: React.CSSProperties = {
  //     width: "100%",
  //     backgroundColor: "var(--white-color)",
  //     height: 50,
  //     display: "flex",
  //     justifyContent: "center",
  //     alignItems: "center",
  //     borderTopLeftRadius: 10,
  //     borderTopRightRadius: 10,
  //     borderBottomLeftRadius: 10,
  //     borderBottomRightRadius: 10,
  //   };

  //   return (
  //     <section
  //       className="container"
  //       style={{ paddingTop: 10, paddingBottom: 10 }}
  //     >
  //       <ul
  //         style={{
  //           display: "grid",
  //           gridTemplateColumns: "1fr 1fr",
  //           gap: "15px",
  //         }}
  //       >
  //         <li style={btnStyle} className="clickable">
  //           <svg.FacebookSvg />
  //         </li>
  //         <li style={btnStyle} className="clickable">
  //           <svg.GoogleSvg />
  //         </li>
  //       </ul>
  //     </section>
  //   );
  // };

  return (
    <components.Screen>
      {renderHeader()}
      {renderContent()}
      {/* {renderSocials()} */}
    </components.Screen>
  );
};
