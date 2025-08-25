"use client";

import React, { useState } from "react";
import Link from "next/link";

import { toast } from "react-hot-toast";

// import { svg } from "../../svg";
import { Routes } from "../../routes";
import { components } from "../../components";
import { useRouter } from "next/navigation";

export const SignUp: React.FC = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("+94");
  const [isMobileValid, setIsMobileValid] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const Emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validate form fields
  const isFormValid =
    username.trim() !== "" &&
    email.trim() !== "" &&
    password.trim().length >= 6 &&
    isMobileValid;

  // Handle form submission
  const handleSubmit = async () => {
    const userData = {
      username,
      mobile,
      email,
      password,
    };

    try {
      // console.log("User Data:", userData);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      toast.success(data.message || "Signup successful!");
      localStorage.setItem("pending_user_id", data.userId);
      router.replace(Routes.CONFIRMATION_CODE);
    } catch (err: any) {
      toast.error(err.message || "An error occurred during signup.");
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
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            borderRadius: "10px",
            backgroundColor: "var(--white-color)",
          }}
          className="container"
        >
          {/* SIGN UP */}
          <h1 style={{ marginBottom: "30px", textTransform: "capitalize" }}>
            Sign up
          </h1>

          {/* INPUT FIELDS */}
          <section>
            <components.InputField
              type="text"
              inputType="username"
              placeholder="Enter your name"
              containerStyle={{ marginBottom: "10px" }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <components.InputField
              type="tel"
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

                // validate Sri Lankan mobile number
                const sriLankaMobileRegex = /^(?:\+94|0)?7[01245678]\d{7}$/;
                setIsMobileValid(sriLankaMobileRegex.test(val));
              }}
              isValid={isMobileValid}
            />
            {mobile && mobile.length > 3 && !isMobileValid && (
              <p
                style={{ color: "red", fontSize: "12px", marginBottom: "10px" }}
              >
                * Provide valid Sri Lankan mobile number only.
              </p>
            )}
            <components.InputField
              type="email"
              inputType="email"
              placeholder="Enter your email"
              containerStyle={{ marginBottom: "10px" }}
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
            />
            {email && !Emailregex.test(email) && (
              <p
                style={{ color: "red", fontSize: "12px", marginBottom: "10px" }}
              >
                * Email address invalid.
              </p>
            )}
            <components.InputField
              type="password"
              inputType="password"
              placeholder="Enter your password"
              containerStyle={{ marginBottom: "14px" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {password && password.length < 6 && (
              <p
                style={{ color: "red", fontSize: "12px", marginBottom: "10px" }}
              >
                * Password must be at least 6 characters.
              </p>
            )}
          </section>

          {/* SIGN IN BUTTON */}
          <section style={{ marginBottom: "14px" }}>
            <components.Button
              label="Sign up"
              // href={Routes.VERIFY_YOUR_PHONE_NUMBER}
              onClick={handleSubmit}
              disabled={!isFormValid}
              style={{
                backgroundColor: "#f9a826",
                color: "white",
                border: "#f9a826",
              }}
            />
          </section>

          {/* REGISTER */}
          <section>
            <p className="t16" style={{ marginBottom: "20px" }}>
              Already have an account?{" "}
              <Link href={Routes.SIGN_IN} style={{ color: "#f9a826" }}>
                Sign in.
              </Link>
            </p>
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
