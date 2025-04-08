import { useState, useEffect } from "react";
import ThemeToggle from "./Toggle/useTheme";
import { TabHooks } from "./Tab";
import Avatar from "./Avatar/Avatar";

import "./style/darkmode.css";
import "./style/tab.css";
import "./style/account.css";
import "./style/w3.css";

function Dashboard({url}) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [avatarModalOpen, setAvatarModalOpen] = useState(false);


    useEffect(() => {
        // Fetch user data when component mounts
        const fetchUserData = async () => {

            try {
                console.log("Fetching user data");

                let r = await (await fetch("/getsession")).json()


                if (r.token) {
                    localStorage.setItem('authToken', r.token);
                }

                const token = localStorage.getItem('authToken');


                if (!token) {
                    // Redirect to login if no token is found
                    window.location.href = '/account/login';
                    return;
                }

                const response = await fetch(`${url}/dashboard`, {
                    headers: {
                        'Authorization': token
                    }
                });

                if (response.status === 401) {
                    // Unauthorized - token may be expired
                    localStorage.removeItem('authToken');
                    window.location.href = '/account/login';
                    return;
                }

                const data = await response.json();

                if (data.success) {
                    // Check if there's a redirect instruction
                    if (data.redirect) {
                        window.location.href = data.redirect;
                        return;
                    }

                    setUserData(data.user);
                } else {
                    setError(data.message || 'Failed to load dashboard data');
                }
            } catch (err) {
                setError('Error loading dashboard: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [url]);

    const toggleAvatarModal = () => {
        setAvatarModalOpen(!avatarModalOpen);
    };

    const startRegistration = (username, fullName) => {
        // Implement fingerprint registration logic
        console.log(`Starting fingerprint registration for ${username}, ${fullName}`);
    };

    // Show loading state while fetching data
    if (loading) {
        return <div className="loading">Loading dashboard...</div>;
    }

    // Show error state if there was a problem
    if (error) {
        return <div className="error-message">{error}</div>;
    }

    // Ensure user data is available
    if (!userData) {
        return <div className="error-message">No user data available</div>;
    }

    // Format the created date
    const createdDate = new Date(userData.created);

    const tabs = [
        {
            id: "profile",
            label: "Profile",
            content: (
                <>
                    <div className="account-section">
                        <h2>Profile Information</h2>

                        <div className="profile-header">
                            <div className="profile-avatar">
                                <img
                                    src={`${url}/${userData.username}.png`}
                                    alt="Profile Picture"
                                    onError={(e) => {
                                        // Fallback to default avatar if image fails to load
                                        e.target.src = 'https://via.placeholder.com/150';
                                    }}
                                />
                                <button className="change-avatar" onClick={toggleAvatarModal}>
                                    Change Photo
                                </button>
                            </div>

                            <div className="profile-status">
                                <span className="status-badge">
                                    {userData.isPro || userData.isSubscribed ? "Pro" : "Basic"} Plan
                                </span>
                                <span className="member-since">
                                    {(userData.isPro || userData.isSubscribed ? "Member" : "User") +
                                        " since " + createdDate.getFullYear()}
                                </span>
                            </div>
                        </div>

                        <form className="account-form" onSubmit={(e) => e.preventDefault()}>
                            {avatarModalOpen && (
                                <div className="avatar-modal">
                                    <Avatar url={url} onSuccess={toggleAvatarModal}/>
                                </div>
                            )}

                            <div className="form-group">
                                <label htmlFor="fullName">Full Name</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    defaultValue={`${userData.firstname} ${userData.lastname}`}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    defaultValue={userData.email}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    defaultValue={userData.username}
                                    readOnly
                                />
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn-primary">Save Changes</button>
                                <button type="reset" className="btn-secondary">Cancel</button>
                            </div>
                        </form>
                    </div>
                </>
            )
        },
        {
            id: "security",
            label: "Security",
            content: (
                <>
                <div className="account-section">
                        <h2>Security Settings</h2>

                        <div className="security-info">
                            <div className="info-card">
                                <h3>Password</h3>
                                <p>Last changed {userData.lastPasswordChangeTime}</p>
                                <button className="btn-secondary">Change Password</button>
                            </div>
                        </div>

                        <div className="info-card">
                            <h3>Finger Authentication</h3>
                            <p>Currently {userData.hasFingerprint ? "enabled" : "disabled"}</p>

                            {
                                !userData.hasFingerprint ? (
                                    <button
                                        className="btn-secondary"
                                        onClick={() => startRegistration(userData.username, `${userData.firstname} ${userData.lastname}`)}
                                    >
                                        Enable Fingerprint
                                    </button>
                                ) : (
                                    <button className="btn-secondary" disabled>Fingerprint is enabled</button>
                                )
                            }
                        </div>

                        <div className="info-card totp-card">
                            <h3>Two-Factor Authentication</h3>
                            {
                                typeof userData.totpEnabled !== 'undefined' && userData.totpEnabled ?
                                    (
                                        <>
                                            <div className="status-wrapper">
                                                <p>Status: <span className="totp-status status-enabled">Enabled</span></p>
                                                <p className="totp-description">Your account is protected with an additional
                                                    layer of security.</p>
                                            </div>
                                            <a href="./2fa/oath/setup-2fa" className="btn-secondary manage-2fa-btn">Manage 2FA</a>
                                        </>
                                    ) : (
                                        <>
                                            <div className="status-wrapper">
                                                <p>Status: <span className="totp-status status-disabled">Disabled</span></p>
                                                <p className="totp-description">Enhance your account security by enabling
                                                    two-factor authentication.</p>
                                            </div>

                                            <a href="./2fa/oath/setup-2fa" className="btn-secondary manage-2fa-btn">Enable
                                                2FA</a>
                                        </>
                                    )
                            }
                        </div>
                    </div>
                </>
            )
        },
        {
            id: "preferences",
            label: "Preferences",
            content: (
                <>
                    <div className="account-section">
                        <h2>Account Preferences</h2>

                        <div className="preferences-list">
                            <div className="preference-item">
                                <div className="preference-info">
                                    <h3>Email Notifications</h3>
                                    <p>Receive updates about your account</p>
                                </div>
                                <label className="switch">
                                    <input type="checkbox" defaultChecked/>
                                    <span className="slider"></span>
                                </label>
                            </div>

                            <div className="preference-item">
                                <div className="preference-info">
                                    <h3>Dark Mode</h3>
                                    <p>Switch between light and dark theme</p>
                                </div>

                                <ThemeToggle/>
                            </div>
                        </div>
                    </div>
                </>
            )
        },
        {
            id: "billing",
            label: "Billing",
            content: (
                <>
                    <div className="account-section">
                        <h2>Billing Information</h2>

                        <div className="billing-summary">
                            <div className="plan-info">
                                <h3>Current Plan: {userData.isSubscribed ? "Admin" : "Basic"}</h3>
                                {userData.isSubscribed && (
                                    <p>$5/month • Renews on May 1, 2024</p>
                                )}

                                <button className="btn-secondary">Change Plan</button>
                            </div>

                            <div className="payment-method">
                                <h3>Payment Method</h3>
                                <div className="card-info">
                                    <span className="card-type">Visa ending in 4242</span>
                                    <span className="card-expiry">Expires 12/25</span>
                                </div>
                                <button className="btn-secondary">Update Payment Method</button>
                            </div>

                            <div className="billing-history">
                                <h3>Billing History</h3>
                                <table className="history-table">
                                    <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Invoice</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {(userData.isSubscribed || (userData.extra && userData.extra.length > 0)) &&
                                        userData.extra.map((item, index) => (
                                            <tr key={index}>
                                                <td>
                                                    {new Date(item.startDate).toLocaleDateString()}
                                                </td>
                                                <td>{item.price}</td>
                                                <td>{item.didPay ? 'Paid' : 'Pending'}</td>
                                                <td>
                                                    {item.didPay ? (
                                                        <a href={`/download/${index}`}>Download</a>
                                                    ) : (
                                                        <button className="btn-secondary">Pay</button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </>
            )
        }
    ];

    const handleTabChange = (tabId) => {
        console.log(`Tab changed to: ${tabId}`);
        // You can add analytics or other functionality here
    };

    return (
        <div className="head">
            <div className="header">
                <ThemeToggle/>
            </div>

            <TabHooks
                tabs={tabs}
                storageKey="handwrite-tabs"
                externalLinks={true}
                onTabChange={handleTabChange}
                className="main-tabs"
            />
        </div>
    );
}

export default Dashboard;
