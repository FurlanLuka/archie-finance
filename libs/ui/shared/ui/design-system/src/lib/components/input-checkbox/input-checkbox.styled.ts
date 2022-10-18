import styled from 'styled-components';

export interface InputCheckboxProps {
  small?: boolean;
}

export const InputCheckbox = styled.label<InputCheckboxProps>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-left: ${({ small }) => (small ? '1.5rem' : '2.5rem')};
  margin-bottom: 0.75rem;

  :last-child {
    margin-bottom: 0;
  }

  input {
    position: absolute;
    left: 0;
    height: ${({ small }) => (small ? '0.875rem' : '1.25rem')};
    width: ${({ small }) => (small ? '0.875rem' : '1.25rem')};
    margin: 0;
    cursor: pointer;

    ~ p {
      cursor: pointer;
    }

    :checked ~ p {
      font-weight: 700;
    }

    :checked:after {
      display: block;
    }

    :disabled {
      pointer-events: none;

      ~ p {
        color: ${({ theme }) => theme.inputRadioDisabled};
        pointer-events: none;
      }

      :after {
        background-color: ${({ theme }) => theme.inputRadioDisabled};
      }
    }

    :before {
      content: '';
      position: absolute;
      top: -1px;
      left: -1px;
      width: 100%;
      height: 100%;
      background-color: ${({ theme }) => theme.backgroundPrimary};
      border: 1px solid ${({ theme }) => theme.inputRadio};
      border-radius: 0.25rem;
    }

    :after {
      content: '';
      position: absolute;
      top: -1px;
      left: -1px;
      display: none;
      background-image: url('data:image/svg+xml; utf8,<svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.555398 4.99432L1.90767 3.625L4.66335 6.33523L10.6236 0.397727L11.9872 1.76705L4.66335 9.0625L0.555398 4.99432Z" fill="white"/></svg>');
      background-repeat: no-repeat;
      background-position: center;
      background-size: ${({ small }) => (small ? '0.5rem' : '0.75rem')};
      background-color: ${({ theme }) => theme.inputRadioFilled};
      width: calc(100% + 2px);
      height: calc(100% + 2px);
      border-radius: 0.25rem;
    }
  }
`;
