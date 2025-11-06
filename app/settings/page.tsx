"use client";

import AppNavWrapper from "../components/AppNavWrapper";
import { PrimaryColorButton } from "../components/Buttons";

export default function SettingsPage() {
    const button = <PrimaryColorButton>Save Changes</PrimaryColorButton>;

    return (
        <AppNavWrapper title="SETTINGS" button1={button}>
            This is the settings page...
        </AppNavWrapper>
    )
}