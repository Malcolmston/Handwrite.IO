import "../style/darkmode.css"
import "../style/tab.css"
import "../style/account.css"
import "../style/w3.css"

import { TabHooks } from '../Tab';
import ThemeToggle from "../Toggle/useTheme";
import Login from "./Login";
import Signup from "./SignUp";
import { useEffect, useState } from "react";

/**
 * Account component that handles user login and signup
 * @param {Object} props - Component props
 * @param {string} [props.defaultTab] - The default tab to select ("login" or "signup")
 * @param {string} [props.url] - The url to locate to
 * @param {Function} [props.onAuthEvent] - Event handler that receives authentication results
 */
function Account({ defaultTab, url, onAuthEvent }) {
    // State to track the current tab
    const [initialTab, setInitialTab] = useState(defaultTab || null);

    // Handle login success or failure
    const handleLoginResult = (result) => {
        // Handle the JWT token on successful login
        if (result.success) {
            // Store the JWT token in localStorage
            if (result.token) {
                localStorage.setItem('authToken', result.token);
            }

            // If there's a redirect URL, navigate to it
            if (result.redirect) {
                window.location.href = result.redirect;
            }
        }

        // Pass the event up to the parent component if onAuthEvent is provided
        if (onAuthEvent) {
            onAuthEvent(result);
        }
    };

    // Handle signup success or failure
    const handleSignupResult = (result) => {
        // Handle the JWT token on successful signup
        if (result.success) {
            // Store the JWT token in localStorage
            if (result.token) {
                localStorage.setItem('authToken', result.token);
            }

            // If there's a redirect URL, navigate to it
            if (result.redirect) {
                window.location.href = result.redirect;
            }
        }

        // Pass the event up to the parent component if onAuthEvent is provided
        if (onAuthEvent) {
            onAuthEvent(result);
        }
    };

    const tabs = [
        {
            id: "login",
            label: "Login",
            content: (
                <>
                    <Login
                        url={url}
                        onLoginSuccess={handleLoginResult}
                    />
                </>
            )
        },
        {
            id: "signup",
            label: "Sign up",
            content: (
                <>
                    <Signup
                        url={url}
                        onSignupSuccess={handleSignupResult}
                    />
                </>
            )
        },
    ];

    // Set the initial tab based on the prop
    useEffect(() => {
        if (defaultTab && (defaultTab === "login" || defaultTab === "signup")) {
            // This will override any saved tab in session storage
            setInitialTab(defaultTab);

            // Update session storage to match the prop
            if (typeof window !== 'undefined') {
                sessionStorage.setItem("handwrite-account-tabs", defaultTab);
            }
        }
    }, [defaultTab]);

    // Handle tab change event
    const handleTabChange = (tabId) => {
        console.log(`Tab changed to: ${tabId}`);
        // You can add analytics or other functionality here
    };

    return (
        <div className="head">
            <div className="header">
                <ThemeToggle />
            </div>

            <TabHooks
                tabs={tabs}
                storageKey="handwrite-account-tabs"
                externalLinks={true}
                onTabChange={handleTabChange}
                className="account-tabs"
                defaultTab={initialTab}  // Pass the initialTab to the TabHooks
            />
        </div>
    );
}

export default Account;
