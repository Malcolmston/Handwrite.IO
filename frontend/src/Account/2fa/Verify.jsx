import "../../style/totp-styles.css";
import "../../style/darkmode.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TOTPInput from "./TOTPInput";

const Icon = () => (
    <svg
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
);

function Verify(props) {
    const [errorMessage, setErrorMessage] = useState("");
    const [showError, setShowError] = useState(false);
    const [username, setUsername] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Get username from props
    useEffect(() => {
        if (props.username) {
            setUsername(props.username);
        }
    }, [props.username]);

    // Handle form submission
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Get the token from input
        const token = document.querySelector('input[name="token"]').value;

        if (!token || !username) {
            showTOTPError("Verification code and username are required");
            setIsLoading(false);
            return;
        }

        try {
            // Send the token to the login endpoint which handles 2FA verification
            const response = await fetch(`${props.url}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    token
                })
            });

            const result = await response.json();

            if (result.success) {
                // Store the JWT token in localStorage
                if (result.token) {
                    localStorage.setItem('authToken', result.token);
                    localStorage.setItem('auth_username', username);
                }

                // Call onVerifySuccess callback if provided
                if (props.onVerifySuccess) {
                    props.onVerifySuccess(true, username);
                }

                // Redirect to dashboard or specified location
                if (result.redirect) {
                    window.location.href = result.redirect;
                } else {
                    window.location.href = '/dashboard';
                }
            } else {
                showTOTPError(result.message || "Verification failed");
                setIsLoading(false);

                if (props.onVerifySuccess) {
                    props.onVerifySuccess(false, null, result.message || "Verification failed");
                }
            }
        } catch (error) {
            showTOTPError("An error occurred: " + error.message);
            setIsLoading(false);

            if (props.onVerifySuccess) {
                props.onVerifySuccess(false, null, error.message);
            }
        }
    };

    // Handle TOTP code completion
    const handleTOTPComplete = (code) => {
        // Since we're using fetch now, let's submit the form programmatically
        document.getElementById('verify-totp-form').dispatchEvent(
            new Event('submit', { cancelable: true, bubbles: true })
        );
    };

    // Show error message
    const showTOTPError = (message) => {
        setErrorMessage(message);
        setShowError(true);

        // Auto hide after 3 seconds
        setTimeout(() => {
            setShowError(false);
        }, 3000);
    };

    return (
        <>
            <h1>Two-Factor Authentication</h1>

            <div className="verify-container">
                <div className="verify-icon">
                    <Icon />
                </div>

                <h2>Security Verification</h2>
                <p>Please enter the 6-digit verification code from your authenticator app to complete login.</p>

                {/* Debug username */}
                <p className="debug-info" style={{fontSize: "0.8rem", color: "#666"}}>
                    Verifying for: {username || "No username detected"}
                </p>

                {/* Error message */}
                {showError && (
                    <div className="totp-error">
                        {errorMessage}
                    </div>
                )}

                <form
                    id="verify-totp-form"
                    className="verify-form"
                    onSubmit={handleFormSubmit}
                >
                    <input type="hidden" name="username" value={username || ''} />

                    <div className="form-group">
                        {/* Using the TOTPInput component instead of a plain input */}
                        <TOTPInput
                            id="token"
                            name="token"
                            autoFocus={true}
                            showTimer={true}
                            showTimerLabel={true}
                            autoSubmit={true}
                            onComplete={handleTOTPComplete}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Verifying...' : 'Verify and Login'}
                        </button>
                        <a href={`${props.url}/account/login`} className="btn-secondary">Cancel</a>
                    </div>
                </form>

                <div className="help-text">
                    <p>Open your authenticator app to view your verification code.</p>
                    <p>Don't have access to your authenticator app? <a href={`${props.url}/oath/recovery`}>Use a recovery code</a></p>
                </div>
            </div>

            <div className="footer-links">
                <a href={`${props.url}/account/login`}>Back to Login</a>
            </div>
        </>
    );
}

export default Verify;
