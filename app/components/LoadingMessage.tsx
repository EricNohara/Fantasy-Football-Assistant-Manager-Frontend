import { useEffect, useState, useRef, useMemo } from "react";
import LoadingSpinner from "./LoadingSpinner";
import styled, { keyframes } from "styled-components";

const MessageContainer = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
`;

const fadeSlide = keyframes`
  0% { opacity: 0; transform: translateY(6px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const AnimatedMessage = styled.div`
    animation: ${fadeSlide} 0.5s ease-out;
    text-align: center;
    font-size: 1.1rem;
`;

interface LoadingMessageProps {
    message?: string;        // legacy single message
    messages?: string[];     // new cycling messages
    intervalMs?: number;     // base interval before randomization
}

export default function LoadingMessage({
    message,
    messages,
    intervalMs = 2000,
}: LoadingMessageProps) {
    const singleMessage = message ?? (messages?.length ? null : "Loading...");

    const activeMessages = useMemo(() => {
        return singleMessage
            ? [singleMessage]
            : messages ?? ["Loading..."];
    }, [singleMessage, messages]);

    const [index, setIndex] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (activeMessages.length <= 1) return;
        if (index === activeMessages.length - 1) return;

        const randomDelay = Math.floor(Math.random() * 2000);
        const delay = intervalMs + randomDelay;

        timerRef.current = setTimeout(() => {
            setIndex((prev) => prev + 1);
        }, delay);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [index, activeMessages, intervalMs]);

    return (
        <MessageContainer>
            <LoadingSpinner size={50} />
            <AnimatedMessage key={index}>
                {activeMessages[index]}
            </AnimatedMessage>
        </MessageContainer>
    );
}
