"use client";

import Navigation from "./components/Navigation/Navigation";
import { titleFont } from "./localFont";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { PrimaryColorButton } from "./components/Buttons";
import { useRedirectIfLoggedIn } from "./hooks/useRedirectIfLoggedIn";

// Full hero container
const HeroContainer = styled.section`
  position: relative;
  width: 100%;
  height: calc(100vh - 100px);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  overflow: hidden;
  background-color: var(--color-base-dark);
`;

// Centered content over the image
const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: bold;
  width: 100%;
  padding: 0;
`;

const EmphasizedSpan = styled.span`
  color: var(--color-primary);
`;

const SubTitle = styled.h2`
  color: var(--color-txt-secondary);
  font-size: 1.25rem;
  margin-bottom: 5rem;
`;

export default function Home() {
  // redirect to dashboard if logged in
  useRedirectIfLoggedIn();
  const router = useRouter();

  return (
    <>
      <Navigation />

      <HeroContainer>
        <Image
          src="/images/landing-page-bg.png"
          fill
          style={{ objectFit: "cover" }}
          alt="FFOracle landing page background"
          priority
        />

        <HeroContent>
          <Title className={titleFont.className}>
            Fantasy Football Management <EmphasizedSpan>Simplified</EmphasizedSpan>
          </Title>
          <SubTitle>
            Maximize your fantasy wins with AI-driven insights and up-to-date data
          </SubTitle>
          <PrimaryColorButton onClick={() => router.push("/signup")}>
            Get Started Now
          </PrimaryColorButton>
        </HeroContent>
      </HeroContainer>
    </>
  );
}
