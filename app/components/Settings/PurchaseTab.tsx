"use client";

import { useState } from "react";
import styled from "styled-components";
import { headerFont } from "@/app/localFont";
import { PrimaryColorButton } from "@/app/components/Buttons";
import CheckoutWrapper from "../Payment/CheckOutWrapper";
import { Check } from "lucide-react";

const PurchaseContainer = styled.div`
  padding: 4rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  height: 100%;
  overflow-y: auto;
`;

const Title = styled.h2`
  font-size: 2rem;
  color: white;
  margin: 0 0 0.5rem 0;
  font-weight: bold;
`;

const Description = styled.p`
  color: var(--color-txt-3);
  font-size: 1rem;
  margin: 0 0 1rem 0;
`;

const TokenPackagesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 cards across */
  gap: 1rem;
  width: 100%;

  @media (max-width: 900px) {
    grid-template-columns: 1fr; /* stack on mobile */
  }
`;

const TokenPackage = styled.div<{ $isSelected: boolean }>`
  background-color: var(--color-base-dark-2);
  border: 4px solid
    ${({ $isSelected }) =>
    $isSelected ? "var(--color-primary)" : "var(--color-base-dark-4)"};
  border-radius: var(--global-border-radius);
  padding: 1.5rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  cursor: pointer;
  position: relative;

  box-shadow: ${({ $isSelected }) =>
    $isSelected
      ? "0 0 12px rgba(var(--color-primary-rgb), 0.4)"
      : "0 2px 6px rgba(0,0,0,0.25)"};

  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;

  ${({ $isSelected }) =>
    $isSelected &&
    `
      background-color: rgba(199, 80, 0, 0.12);
      transform: translateY(-4px);
    `}

  &:hover {
    border-color: var(--color-primary);
    transform: translateY(-4px);
    box-shadow: 0 0 14px rgba(var(--color-primary-rgb), 0.35);
  }
`;

const Checkmark = styled.div`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: var(--color-primary);
  color: black;
  border-radius: 50%;
  width: 26px;
  height: 26px;

  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 16px;
    height: 16px;
    stroke-width: 3px;
  }
`;

const PackageName = styled.h3`
  font-size: 1.6rem;
  color: white;
  font-weight: 700;
  margin: 0;
  text-align: center;
`;

const TokenIcon = styled.div`
  width: 80px;
  height: 80px;

  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
  }
`;

const TokenAmount = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--color-primary);
`;

const Price = styled.div`
  font-size: 1.1rem;
  color: var(--color-txt-3);
  margin-top: -0.5rem;
`;

const ConfirmButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 1rem 0;
  margin-top: auto;
  border-top: 2px solid var(--color-base-dark-3);
`;

interface IPurchaseTabProps {
  onSelectPackage?: (packageData: {
    id: string;
    name: string;
    tokens: number;
    price: number;
  }) => void;
}

export const tokenPackages = [
  {
    id: "starter",
    name: "Starter",
    tokens: 100,
    price: 9.99,
  },
  {
    id: "pro",
    name: "Pro",
    tokens: 500,
    price: 39.99,
  },
  {
    id: "elite",
    name: "Elite",
    tokens: 1000,
    price: 69.99,
  },
];

export default function PurchaseTab({ onSelectPackage }: IPurchaseTabProps) {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  const handleConfirmPurchase = () => {
    if (selectedPackage) {
      const selectedPkg = tokenPackages.find(pkg => pkg.id === selectedPackage);
      if (selectedPkg && onSelectPackage) {
        onSelectPackage(selectedPkg);
      }
      setShowCheckout(true);
    }
  };

  const handleCancelPurchase = () => {
    setShowCheckout(false);
    setSelectedPackage(null);
  };

  const selectedPkg = tokenPackages.find(pkg => pkg.id === selectedPackage);

  if (showCheckout && selectedPkg) {
    return (
      <PurchaseContainer>
        <CheckoutWrapper
          packageData={selectedPkg}
          onBack={handleCancelPurchase}
        />
      </PurchaseContainer>
    );
  }

  return (
    <PurchaseContainer>
      <div>
        <Title className={headerFont.className}>Purchase Tokens</Title>
        <Description>
          Tokens are used to generate AI-powered fantasy football advice and insights.
          Choose a package that fits your needs.
        </Description>
      </div>

      <TokenPackagesContainer>
        {tokenPackages.map((pkg) => (
          <TokenPackage
            key={pkg.id}
            $isSelected={selectedPackage === pkg.id}
            onClick={() => setSelectedPackage(pkg.id)}
          >
            {selectedPackage === pkg.id && (
              <Checkmark>
                <Check />
              </Checkmark>
            )}

            <PackageName className={headerFont.className}>{pkg.name}</PackageName>

            <TokenIcon>
              <img src="images/token-icon.png" alt="Token Icon" />
            </TokenIcon>

            <TokenAmount className={headerFont.className}>
              {pkg.tokens} Tokens
            </TokenAmount>

            <Price className={headerFont.className}>${pkg.price}</Price>
          </TokenPackage>
        ))}
      </TokenPackagesContainer>

      <ConfirmButtonContainer>
        <PrimaryColorButton
          onClick={handleConfirmPurchase}
          disabled={!selectedPackage}
        >
          {selectedPackage
            ? `Confirm Purchase: $${selectedPkg?.price}`
            : "Select a Package"}
        </PrimaryColorButton>
      </ConfirmButtonContainer>
    </PurchaseContainer>
  );
}
