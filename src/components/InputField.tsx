import React from 'react';

import {svg} from '../svg';

type Props = {
  type?: string;
  value?: string;
  inputType: string;
  placeholder: string;
  autoCapitalize?: string;
  containerStyle?: React.CSSProperties;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const InputField: React.FC<Props> = ({
  inputType,
  placeholder,
  type = 'text',
  containerStyle,
  onChange,
  value,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        borderRadius: 10,
        padding: '5px 0px 5px 5px',
        backgroundColor: '#E9F3F6',
        ...containerStyle,
      }}
    >
      {inputType === 'email' && <svg.EmailSvg />}
      {inputType === 'username' && <svg.UserSvg />}
      {inputType === 'password' && <svg.KeySvg />}
      {inputType === 'code' && <svg.PasswordSvg />}
      {inputType === 'country' && <svg.MapPinSvg />}
      {inputType === 'promocode' && <svg.TagSvg />}
      {inputType === 'amount' && <svg.DollarSvg />}
      {inputType === 'phone' && <svg.PhoneSvg />}
      {inputType === 'beneficiary-bank' && <svg.BriefcaseSvg />}
      {inputType === 'iban-number' && <svg.HashSvg />}
      {inputType === 'date' && <svg.CalendarSvg />}
      {inputType === 'location' && <svg.MapPinSvg />}
      {inputType === 'search' && <svg.SearchSvg />}
      <input
        placeholder={placeholder}
        maxLength={50}
        type={type}
        style={{
          width: '100%',
          height: '100%',
          padding: 0,
          margin: 0,
          border: 'none',
          outline: 'none',
          backgroundColor: 'transparent',
          fontSize: 16,
          color: 'var(--main-dark)',
        }}
        value={value}
        onChange={onChange}
      />
      <div
        className='clickable'
        style={{padding: '10px 19px'}}
      >
        {inputType === 'email' && <svg.CheckSvg />}
        {inputType === 'password' && <svg.EyeOffSvg />}
      </div>
    </div>
  );
};
