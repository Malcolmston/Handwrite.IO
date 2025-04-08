import "../style/darkmode.css";
import "../style/tab.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFingerprint } from "@awesome.me/kit-2333bf7b7a/icons/duotone/regular";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {base64URLDecode, base64URLEncode} from "./base64url";

function Login(props) {
    const [isWebAuthnSupported, setIsWebAuthnSupported] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [requiresTOTP, setRequiresTOTP] = useState(false);
    const navigate = useNavigate();

    // Check if WebAuthn is supported by the browser
    useEffect(() => {
        if (window.PublicKeyCredential) {
            setIsWebAuthnSupported(true);
        }
    }, []);

    // Handle regular form submission with JavaScript
    async function login(event) {
        event.preventDefault();
        event.stopPropagation();

        setIsLoading(true);
        setError('');

        // Get form data
        const formData = new FormData(event.target);
        const username = formData.get('username');
        const password = formData.get('password');

        try {
            const response = await fetch(`${props.url}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();

            if (result.success) {
                setRequiresTOTP(result.requiresTOTP)
                // Check if 2FA verification is required
                if (result.requiresTOTP) {
                    // Emit login event with success status, username, and 2FA flag
                    if (props.onLoginSuccess) {
                        props.onLoginSuccess({
                            type: 'login',
                            success: true,
                            username: username,
                            requires2FA: true,
                            message: result.message
                        });
                    }

                    // Navigate to 2FA page with username in state
                    navigate('/2fa/verify-2fa', {
                        state: { username }
                    });
                } else {
                    // Regular successful login
                    if (props.onLoginSuccess) {
                        props.onLoginSuccess({
                            type: 'login',
                            success: true,
                            username: username,
                            token: result.token,
                            redirect: result.redirect
                        });
                    }

                    // Store JWT token in localStorage
                    if (result.token) {
                        localStorage.setItem('authToken', result.token);
                    }

                    // Handle redirection
                    if (result.redirect) {
                        navigate(result.redirect);
                    }
                }
            } else {
                setError(result.message || 'Login failed. Please check your credentials.');

                // Emit login event with failure status
                if (props.onLoginSuccess) {
                    props.onLoginSuccess({
                        type: 'login',
                        success: false,
                        message: result.message || 'Login failed'
                    });
                }
            }
        } catch (error) {
            setError('Login failed: ' + error.message);

            // Emit login event with failure status
            if (props.onLoginSuccess) {
                props.onLoginSuccess({
                    type: 'login',
                    success: false,
                    message: error.message
                });
            }
        } finally {
            setIsLoading(false);
        }
    }



    async function startLogin() {
        if (!isWebAuthnSupported) {
            alert("WebAuthn is not supported in this browser");
            return;
        }

        setIsLoading(true);


        try {
            var challenge = await (await fetch('/login/public-key/challenge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin'
            })).json();

            var assertion = await navigator.credentials.get({
                publicKey: {
                    challenge: base64URLDecode(challenge.challenge),
                    rpId: challenge.rpId,
                    timeout: 60000,
                    userVerification: 'required',
                    // No allowCredentials needed for discoverable credentials
                }
            });

            var result =  await (await fetch('/login/public-key', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify({
                    id: assertion.id,
                    type: assertion.type,
                    rawId: base64URLEncode(assertion.rawId),
                    response: {
                        clientDataJSON: base64URLEncode(assertion.response.clientDataJSON),
                        authenticatorData: base64URLEncode(assertion.response.authenticatorData),
                        signature: base64URLEncode(assertion.response.signature),
                        userHandle: assertion.response.userHandle
                            ? base64URLEncode(assertion.response.userHandle)
                            : null
                    }
                })
            })).json();


            if (result.ok) {
                navigate(result.location || "/dashboard");
            } else {
                throw new Error(result.error || 'Authentication failed');
            }
        } catch (error) {
            console.error('WebAuthn authentication error:', error);

            alert(`Authentication failed: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }



    return (
        <form className="account-form" onSubmit={login}>
            <h2>Login</h2>

            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
                <label htmlFor="login-username">Username</label>
                <input type="text" id="login-username" name="username" required={true} />
            </div>

            <div className="form-group">
                <label htmlFor="login-password">Password</label>
                <input type="password" id="login-password" name="password" required={true} />
            </div>

            <div className="button-group">
                <input className="regular-button" type="submit" value="Login" disabled={isLoading} />

                {isWebAuthnSupported && (
                    <button
                        type="button"
                        className="fingerprint-button btn-primary"
                        onClick={startLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Authenticating...' : 'Login with Fingerprint'}
                        <FontAwesomeIcon icon={faFingerprint} size="lg" />
                    </button>
                )}
            </div>

            <div className="google-signin-container">
                <a href={`${props.url}/google/login`} className="google-btn">
                    <span className="google-icon"></span>
                    Sign in with Google
                </a>
            </div>
        </form>
    );
}

export default Login;
