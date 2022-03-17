import React from 'react';

export const Mfa: React.FC = () => {
  return (
    <div className="mfa-box">
      <h2>Please enter the 6-digit code</h2>
      <form>
        <input
          type="number"
          max={6}
          className="form__text-input"
          placeholder={'TOTP'}
        />
        <input type="submit" className="form__submit-button" value="Submit" />
      </form>
    </div>
  );
};
