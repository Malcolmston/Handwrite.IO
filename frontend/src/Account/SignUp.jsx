import "../style/darkmode.css";
import "../style/tab.css";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFingerprint } from "@awesome.me/kit-2333bf7b7a/icons/duotone/regular";
import {base64URLDecode, base64URLEncode} from "./base64url";

function Signup(props) {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        username: '',
        password: ''
    });
    const [isWebAuthnSupported, setIsWebAuthnSupported] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showBiometricOption, setShowBiometricOption] = useState(false);
    const [error, setError] = useState('');

    // Check if WebAuthn is supported by the browser
    useEffect(() => {
        if (window.PublicKeyCredential) {
            setIsWebAuthnSupported(true);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Show biometric option when username and password are filled
        if ((name === 'username' || name === 'password') &&
            formData.username.trim() && formData.password.trim()) {
            setShowBiometricOption(true);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`${props.url}/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                // Store JWT token in localStorage
                if (result.token) {
                    localStorage.setItem('authToken', result.token);
                }

                // Emit signup event with success status and username
                if (props.onSignupSuccess) {
                    props.onSignupSuccess({
                        type: 'signup',
                        success: true,
                        username: formData.username,
                        token: result.token,
                        redirect: result.redirect
                    });
                }

                // Handle redirection
                if (result.redirect) {
                    window.location.href = result.redirect;
                }
            } else {
                setError(result.message || 'Signup failed. Please check your information.');

                // Emit signup event with failure status
                if (props.onSignupSuccess) {
                    props.onSignupSuccess({
                        type: 'signup',
                        success: false,
                        message: result.message || 'Signup failed'
                    });
                }
            }
        } catch (error) {
            setError('Signup failed: ' + error.message);

            // Emit signup event with failure status
            if (props.onSignupSuccess) {
                props.onSignupSuccess({
                    type: 'signup',
                    success: false,
                    message: error.message
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Start WebAuthn registration process
    async function startRegistration() {
        if (!isWebAuthnSupported) {
            alert("WebAuthn is not supported in this browser");
            return;
        }

        if (!formData.username.trim()) {
            alert("Please enter a username first");
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Get challenge from server
            const challengeResponse = await fetch(`${props.url}/signup/public-key/challenge`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    firstname: formData.firstname,
                    lastname: formData.lastname,
                    email: formData.email
                })
            });

            const challenge = await challengeResponse.json();

            // Create credential from authenticator
            const credential = await navigator.credentials.create({
                publicKey: {
                    challenge: base64URLDecode(challenge.challenge),
                    rp: challenge.rp,
                    user: {
                        id: base64URLDecode(challenge.user.id),
                        name: challenge.user.name,
                        displayName: challenge.user.displayName
                    },
                    pubKeyCredParams: challenge.pubKeyCredParams,
                    authenticatorSelection: {
                        ...challenge.authenticatorSelection,
                        requireResidentKey: true,  // Enable discoverable credentials
                        residentKey: "required"    // Require resident key storage
                    },
                    timeout: challenge.timeout,
                    attestation: challenge.attestation
                }
            });

            const response = credential.response;

            // Send credential to server for verification
            const verificationResponse = await fetch(`${props.url}/signup/public-key`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: credential.id,
                    rawId: base64URLEncode(credential.rawId),
                    type: credential.type,
                    response: {
                        clientDataJSON: base64URLEncode(response.clientDataJSON),
                        attestationObject: base64URLEncode(response.attestationObject)
                    },
                    authenticatorAttachment: credential.authenticatorAttachment,
                    clientExtensionResults: credential.getClientExtensionResults(),
                    username: formData.username,
                    firstname: formData.firstname,
                    lastname: formData.lastname,
                    email: formData.email
                })
            });

            const result = await verificationResponse.json();

            if (result.success) {
                // Store JWT token in localStorage
                if (result.token) {
                    localStorage.setItem('authToken', result.token);
                }

                // Emit signup event with success status and username
                if (props.onSignupSuccess) {
                    props.onSignupSuccess({
                        type: 'signup',
                        success: true,
                        username: formData.username,
                        token: result.token,
                        redirect: result.redirect
                    });
                }

                // Handle redirection
                if (result.redirect) {
                    window.location.href = result.redirect;
                } else {
                    window.location.href = `${props.url}/dashboard`;
                }
            } else {
                throw new Error(result.message || 'Registration failed');
            }
        } catch (error) {
            setError(`Registration failed: ${error.message}`);

            // Emit signup event with failure status
            if (props.onSignupSuccess) {
                props.onSignupSuccess({
                    type: 'signup',
                    success: false,
                    message: error.message
                });
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form className="account-form" onSubmit={handleSubmit}>
            <h2>Sign Up</h2>

            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
                <label htmlFor="signup-firstname">First Name</label>
                <input
                    type="text"
                    id="signup-firstname"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="signup-lastname">Last Name</label>
                <input
                    type="text"
                    id="signup-lastname"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="signup-email">Email</label>
                <input
                    type="email"
                    id="signup-email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="signup-username">Username</label>
                <input
                    type="text"
                    id="signup-username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="signup-password">Password</label>
                <input
                    type="password"
                    id="signup-password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="button-group">
                <input className="regular-button" type="submit" value="Sign Up" disabled={isLoading} />

                {isWebAuthnSupported && showBiometricOption && (
                    <button
                        type="button"
                        className="fingerprint-button btn-primary"
                        onClick={startRegistration}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Registering...' : 'Register Fingerprint'}
                        <FontAwesomeIcon icon={faFingerprint} size="lg" />
                    </button>
                )}
            </div>

            <div className="google-signin-container">
                <a href={`${props.url}/google/signup`} className="google-btn">
                    <span className="google-icon"></span>
                    Sign up with Google
                </a>
            </div>
        </form>
    );
}

export default Signup;
