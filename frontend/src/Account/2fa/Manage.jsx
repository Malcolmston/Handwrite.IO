import "../../style/totp-styles.css";
import "../../style/darkmode.css";
import React, { useState } from "react";
import TOTPInput from "./TOTPInput";

const Status = () => (
    <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" fill="none">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <path d="M9 12l2 2 4-4"></path>
    </svg>
);

const Manage = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [showError, setShowError] = useState(false);

    // Handle form submission
    const handleFormSubmit = (e) => {
        if (!window.confirm('Are you sure you want to disable two-factor authentication? This will make your account less secure.')) {
            e.preventDefault();
            return;
        }
    };

    // Handle TOTP completion
    const handleTOTPComplete = (code) => {
        // Auto-submit form when a valid code is entered
        document.getElementById('disable-totp-form').submit();
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
            <h1>Manage Two-Factor Authentication</h1>

            {/* Error message */}
            {showError && (
                <div className="totp-error alert alert-danger">
                    {errorMessage}
                </div>
            )}

            <div className="manage-2fa-container">
                <div className="status-card">
                    <div className="status-icon">
                        <Status />
                    </div>

                    <h2>Status: <span className="status-badge status-enabled">Enabled</span></h2>
                    <p>Two-factor authentication is currently active for your account.</p>
                    <p>
                        Your account is protected with an additional layer of security.
                        When you sign in, you'll need to provide your password and a
                        verification code from your authenticator app.
                    </p>
                </div>

                <div className="manage-section">
                    <h3>Recovery Options</h3>
                    <p>If you lose access to your authenticator app, you'll need a way to recover your account.</p>

                    <div className="recovery-info">
                        <p>
                            <strong>Note:</strong> Recovery codes are not yet implemented.
                            Make sure you always have access to your authenticator app or
                            disable 2FA before changing devices.
                        </p>
                    </div>
                </div>

                <div className="disable-2fa-section">
                    <h3>Disable Two-Factor Authentication</h3>
                    <p className="warning-text">
                        Warning: Disabling two-factor authentication will make your account less secure.
                    </p>
                    <p>
                        To disable two-factor authentication, enter a verification code from
                        your authenticator app and click the button below.
                    </p>

                    <form
                        id="disable-totp-form"
                        action="/oath/disable-2fa"
                        method="POST"
                        className="disable-form"
                        onSubmit={handleFormSubmit}
                    >
                        <div className="form-group">
                            <TOTPInput
                                id="token"
                                name="token"
                                label="Verification Code:"
                                autoFocus={true}
                                showTimer={true}
                                showTimerLabel={true}
                                autoSubmit={true}
                                onComplete={handleTOTPComplete}
                            />
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-danger">Disable 2FA</button>
                        </div>
                    </form>
                </div>

                <div className="back-link">
                    <a href="/dashboard" className="btn-primary">Back to Dashboard</a>
                </div>
            </div>
        </>
    );
};

export default Manage;
