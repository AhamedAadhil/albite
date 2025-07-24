"use client";

import React, { useState, useEffect } from "react";
import { svg } from "../svg";

type Props = {
  type?: string;
  value?: string;
  inputType: string;
  placeholder: string;
  autoCapitalize?: string;
  containerStyle?: React.CSSProperties;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isValid?: boolean;
};

export const InputField: React.FC<Props> = ({
  inputType,
  placeholder,
  type = "text",
  containerStyle,
  onChange,
  value,
  isValid,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  useEffect(() => {
    if (inputType === "email" && value) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsEmailValid(regex.test(value));
    }
  }, [inputType, value]);

  const resolvedType =
    inputType === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        borderRadius: 10,
        padding: "5px 0px 5px 5px",
        backgroundColor: "#E9F3F6",
        ...containerStyle,
      }}
    >
      {/* Leading Icons */}
      {inputType === "email" && <svg.EmailSvg />}
      {inputType === "username" && <svg.UserSvg />}
      {inputType === "password" && <svg.KeySvg />}
      {inputType === "code" && <svg.PasswordSvg />}
      {inputType === "country" && <svg.MapPinSvg />}
      {inputType === "promocode" && <svg.TagSvg />}
      {inputType === "amount" && <svg.DollarSvg />}
      {inputType === "phone" && <svg.PhoneSvg />}
      {inputType === "beneficiary-bank" && <svg.BriefcaseSvg />}
      {inputType === "iban-number" && <svg.HashSvg />}
      {inputType === "date" && <svg.CalendarSvg />}
      {inputType === "location" && <svg.MapPinSvg />}
      {inputType === "search" && <svg.SearchSvg />}

      {/* Input */}
      <input
        placeholder={placeholder}
        maxLength={50}
        type={resolvedType}
        style={{
          width: "100%",
          height: "100%",
          padding: 0,
          margin: 0,
          border: "none",
          outline: "none",
          backgroundColor: "transparent",
          fontSize: 16,
          color: "var(--main-dark)",
        }}
        value={value}
        onChange={onChange}
      />

      {/* Right Side Icon */}
      {/* Right Side Icon */}
      <div className="clickable" style={{ padding: "10px 19px" }}>
        {inputType === "email" && isEmailValid && <svg.CheckSvg />}
        {inputType === "phone" && isValid && <svg.CheckSvg />}
        {inputType === "password" && (
          <span
            onClick={togglePasswordVisibility}
            style={{ cursor: "pointer" }}
          >
            {showPassword ? <svg.EyeOnSvg /> : <svg.EyeOffSvg />}
          </span>
        )}
      </div>
    </div>
  );
};
