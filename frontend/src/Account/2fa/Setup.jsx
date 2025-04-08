import "../../style/totp-styles.css";
import "../../style/darkmode.css";
import React, { useState } from "react";
import TOTPInput from "./TOTPInput";

// Convert SVG elements to proper React components
const AppIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none">
        <path d="M5 12h14M12 5l7 7-7 7"></path>
    </svg>
);

const SetupIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
);

const Setup = (props) => {
    const [errorMessage, setErrorMessage] = useState("");
    const [showError, setShowError] = useState(false);

    // Handle TOTP code completion
    const handleTOTPComplete = (code) => {
        // Auto-submit form when a valid code is entered
        document.getElementById('setup-totp-form').submit();
    };

    // Handle form submission
    const handleFormSubmit = (e) => {
        // Additional form handling if needed
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
            <h1>Setup Two-Factor Authentication</h1>

            {/* Error message */}
            {showError && (
                <div className="totp-error alert alert-danger">
                    {errorMessage}
                </div>
            )}

            <div className="setup-instructions">
                <div className="setup-steps">
                    <div className="step-number">1</div>
                    <div className="step-content">
                        <h3>Download an authenticator app</h3>
                        <p>Install an authenticator app on your mobile device:</p>
                        <div className="app-links">
                            <a
                                href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="app-link"
                            >
                <span className="app-icon">
                  <AppIcon />
                </span>
                                Google Authenticator (Android)
                            </a>
                            <a
                                href="https://apps.apple.com/us/app/google-authenticator/id388497605"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="app-link"
                            >
                <span className="app-icon">
                  <AppIcon />
                </span>
                                Google Authenticator (iOS)
                            </a>
                            <a
                                href="https://authy.com/download/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="app-link"
                            >
                <span className="app-icon">
                  <AppIcon />
                </span>
                                Authy (Android/iOS)
                            </a>
                        </div>
                    </div>
                </div>

                <div className="step-divider"></div>

                <div className="setup-steps">
                    <div className="step-number">2</div>
                    <div className="step-content">
                        <h3>Scan this QR code</h3>
                        <p>Open your authenticator app and scan this QR code:</p>

                        <div className="qr-code-container">
                            {typeof props.qrCodeDataUrl !== 'undefined' && props.qrCodeDataUrl ? (
                                <img src={props.qrCodeDataUrl} alt="QR Code for 2FA Setup" />
                            ) : (
                                <p>QR code generation failed. Please try again.</p>
                            )}
                        </div>

                        <div className="manual-setup">
                            <p>Or enter this code manually if you can't scan the QR code:</p>
                            <div className="secret-key">
                                <code>
                                    {typeof props.manualEntryKey !== 'undefined'
                                        ? props.manualEntryKey
                                        : 'Not available'}
                                </code>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="step-divider"></div>

                <div className="setup-steps">
                    <div className="step-number">3</div>
                    <div className="step-content">
                        <h3>Verify setup</h3>
                        <p>Enter the 6-digit verification code from your authenticator app:</p>

                        <form
                            id="setup-totp-form"
                            action="/oath/enable-2fa"
                            method="POST"
                            className="verify-form"
                            onSubmit={handleFormSubmit}
                        >
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
                                />
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn-primary">
                                    Verify and Enable 2FA
                                </button>
                                <a href="/dashboard" className="btn-secondary">
                                    Cancel
                                </a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="setup-note">
                <SetupIcon />
                <p>
                    Important: Store your backup codes in a safe place. If you lose your
                    device, you'll need these codes to regain access to your account.
                </p>
            </div>
        </>
    );
};

export default Setup;
