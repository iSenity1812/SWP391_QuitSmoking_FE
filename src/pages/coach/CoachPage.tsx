"use client"

import CoachDashboard from "./CoachDashBoard"
import { AppointmentProvider } from "./AppointmentContext"
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export default function CoachPage() {
    const auth = useContext(AuthContext);

    return (
        <AppointmentProvider>
            <div className="coach-page-root">
                <div style={{ position: "fixed", top: 16, right: 32, zIndex: 1000 }}>
                    <button
                        onClick={() => auth?.logout()}
                        style={{
                            background: "#e53935",
                            color: "white",
                            border: "none",
                            borderRadius: 6,
                            padding: "8px 20px",
                            fontWeight: 600,
                            cursor: "pointer",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.12)"
                        }}
                    >
                        Đăng Xuất
                    </button>
                </div>
                <CoachDashboard />
            </div>
        </AppointmentProvider>
    )
}
