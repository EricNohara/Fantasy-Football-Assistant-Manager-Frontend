import { ReactNode, ButtonHTMLAttributes } from "react"
import { headerFont } from "../localFont"
import styled from "styled-components"

const ButtonBase = styled.button`
    padding: 0.5rem 1.5rem;
    font-size: 0.9rem;
    font-weight: bold;
    border: none;
    border-radius: var(--global-border-radius);
    color: white;
    transition: 0.2s ease;
`;

const PrimaryButton = styled(ButtonBase)`
  background-color: var(--color-primary);

  &:hover {
    background-color: var(--color-primary-hover);
    cursor: pointer;
  }
`;

const SecondaryButton = styled(ButtonBase)`
    background-color: var(--color-secondary);

    &:hover {
        background-color: var(--color-secondary-hover);
        cursor: pointer;
    }
`;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    href?: string;
}

export function PrimaryColorButton({ children, ...props }: ButtonProps) {
    return <PrimaryButton className={headerFont.className} {...props}>{children}</PrimaryButton>
}

export function SecondaryColorButton({ children, ...props }: ButtonProps) {
    return <SecondaryButton className={headerFont.className} {...props}>{children}</SecondaryButton>
}