"use client";

import AppNavWrapper from "../components/AppNavWrapper";
import { PrimaryColorButton } from "../components/Buttons";

export default function PerformancePage() {
    const button1 = <PrimaryColorButton>Previous Week</PrimaryColorButton>;
    const button2 = <PrimaryColorButton>Next Week</PrimaryColorButton>;

    return (
        <AppNavWrapper title="PERFORMANCE" button1={button1} button2={button2}>
            This is the performance page...
        </AppNavWrapper>
    )
}