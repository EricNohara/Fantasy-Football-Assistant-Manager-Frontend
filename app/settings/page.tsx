"use client";

import AppNavWrapper from "../components/AppNavWrapper";
import { PrimaryColorButton, SecondaryColorButton } from "../components/Buttons";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthProvider";

export default function SettingsPage() {
    const supabase = createClient();
    const router = useRouter();
    const { setIsLoggedIn } = useAuth();

    const handleDeleteUser = async () => {
        if (!confirm("Are you sure you want to delete your account? This cannot be undone.")) return;

        try {
            // get session
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.access_token) {
                alert("You must be logged in to delete your account.");
                return;
            }

            // call backend DELETE route
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/Users`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${session.access_token}`
                }
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Failed to delete account");
            }

            // delete auth user
            const deleteAuthRes = await fetch("/api/deleteUser", { method: "DELETE" });

            if (!deleteAuthRes.ok) {
                const data = await deleteAuthRes.json();
                throw new Error(data.error || "Failed to delete account");
            }

            alert("Account deleted successfully");

            // log out the user locally and redirect to landing page
            await supabase.auth.signOut();
            setIsLoggedIn(false);
            router.push("/");
        } catch (error: any) {
            alert(`Error deleting account: ${error.message || error}`);
        }

    }

    const button = <PrimaryColorButton>Save Changes</PrimaryColorButton>;
    const deleteUserButton = <SecondaryColorButton onClick={handleDeleteUser}>Delete User</SecondaryColorButton>;

    return (
        <AppNavWrapper title="SETTINGS" button2={button} button1={deleteUserButton}>
            This is the settings page...
        </AppNavWrapper>
    )
}