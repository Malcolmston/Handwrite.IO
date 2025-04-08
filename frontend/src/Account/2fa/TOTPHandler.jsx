import React, { Component } from 'react';
import "../style/totp-styles.css";
import "../style/darkmode.css";

class TOTPHandler extends Component {
    constructor(props) {
        super(props);
        this.state = {
            secondsRemaining: 30,
            percentage: 100,
            timerColor: '#28a745',
            errorMessage: '',
            showError: false
        };

        // Refs
        this.totpInputRef = React.createRef();
    }

    componentDidMount() {
        // Initialize the countdown timer if we're on a TOTP verification page
        if (document.querySelector('.totp-code-input')) {
            this.startTOTPCountdown();
        }

        // Add event handlers to TOTP inputs
        const totpInputs = document.querySelectorAll('.totp-code-input');
        totpInputs.forEach(input => {
            input.addEventListener('input', this.formatTOTPInput);
            input.addEventListener('keydown', this.handleTOTPInputKeyDown);
        });
    }

    componentWillUnmount() {
        // Clear any timers
        if (this.countdownTimer) {
            clearTimeout(this.countdownTimer);
        }

        // Remove event listeners
        const totpInputs = document.querySelectorAll('.totp-code-input');
        totpInputs.forEach(input => {
            input.removeEventListener('input', this.formatTOTPInput);
            input.removeEventListener('keydown', this.handleTOTPInputKeyDown);
        });
    }

    /**
     * Start the countdown timer for TOTP code validity
     */
    startTOTPCountdown = () => {
        this.updateTOTPCountdown();
    };

    /**
     * Update the TOTP countdown timer
     */
    updateTOTPCountdown = () => {
        // Calculate seconds remaining in current TOTP period
        const now = new Date();
        const seconds = now.getSeconds();
        const milliseconds = now.getMilliseconds();

        // TOTP period is 30 seconds, so we calculate remaining time
        let secondsRemaining = 30 - (seconds % 30);
        let percentage = (secondsRemaining / 30) * 100;

        // Account for milliseconds for smoother countdown
        percentage -= (milliseconds / 1000) * (100 / 30);

        // Determine timer color based on time remaining
        let timerColor = '#28a745'; // Green for plenty of time
        if (secondsRemaining <= 5) {
            timerColor = '#dc3545'; // Red for urgency
        } else if (secondsRemaining <= 10) {
            timerColor = '#ffc107'; // Yellow for warning
        }

        // Update state
        this.setState({
            secondsRemaining,
            percentage,
            timerColor
        });

        // Schedule next update
        this.countdownTimer = setTimeout(this.updateTOTPCountdown, 100);
    };

    /**
     * Format TOTP input for better readability
     */
    formatTOTPInput = (e) => {
        const input = e.target;

        // Only allow digits
        let value = input.value.replace(/\D/g, '');

        // Limit to 6 digits
        if (value.length > 6) {
            value = value.slice(0, 6);
        }

        // Format with a space in the middle: XXX XXX
        if (value.length > 3) {
            value = value.slice(0, 3) + ' ' + value.slice(3);
        }

        input.value = value;

        // Auto-submit if 6 digits entered (for better UX)
        const digitsOnly = value.replace(/\s/g, '');
        if (digitsOnly.length === 6) {
            const form = input.closest('form');
            if (form && this.validateTOTPCode(digitsOnly)) {
                setTimeout(() => {
                    form.submit();
                }, 300); // Small delay for better UX
            }
        }
    };

    /**
     * Handle keydown events in TOTP input fields
     */
    handleTOTPInputKeyDown = (e) => {
        // Allow navigation keys
        if (['ArrowLeft', 'ArrowRight', 'Backspace', 'Delete', 'Tab'].includes(e.key)) {
            return;
        }

        // Block non-digit keys
        if (!/^\d$/.test(e.key)) {
            e.preventDefault();
        }

        // Prevent entering more than 6 digits
        const digitsOnly = e.target.value.replace(/\D/g, '');
        if (digitsOnly.length >= 6 && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
        }
    };

    /**
     * Validate TOTP code format (6 digits)
     */
    validateTOTPCode = (code) => {
        // Remove any spaces that might have been added for formatting
        const digitsOnly = code.replace(/\s/g, '');
        return /^\d{6}$/.test(digitsOnly);
    };

    /**
     * Handle form submission for TOTP validation
     */
    handleTOTPSubmit = (e) => {
        const form = e.target;
        const codeInput = form.querySelector('input[name="token"]');

        if (!this.validateTOTPCode(codeInput.value)) {
            e.preventDefault();
            this.showTOTPError('Please enter a valid 6-digit code');
        }
    };

    /**
     * Handle form submission for disabling TOTP
     */
    handleDisableTOTPSubmit = (e) => {
        if (!window.confirm('Are you sure you want to disable two-factor authentication? This will make your account less secure.')) {
            e.preventDefault();
            return;
        }

        const codeInput = e.target.querySelector('input[name="token"]');
        if (!this.validateTOTPCode(codeInput.value)) {
            e.preventDefault();
            this.showTOTPError('Please enter a valid 6-digit code');
        }
    };

    /**
     * Show error message
     */
    showTOTPError = (message) => {
        this.setState({
            errorMessage: message,
            showError: true
        });

        // Auto hide after 3 seconds
        setTimeout(() => {
            this.setState({ showError: false });
        }, 3000);
    };

    /**
     * Render timer component for TOTP verification
     */
    renderTOTPTimer() {
        const { secondsRemaining, percentage, timerColor } = this.state;

        return (
            <div className="totp-timer-container">
                <div className="totp-timer-label">Code refreshes in:</div>
                <div className="totp-timer">{secondsRemaining}</div>
                <div className="totp-timer-progress">
                    <div
                        className="totp-timer-bar"
                        style={{
                            width: `${percentage}%`,
                            backgroundColor: timerColor
                        }}
                    ></div>
                </div>
            </div>
        );
    }

    /**
     * Render error message
     */
    renderErrorMessage() {
        const { errorMessage, showError } = this.state;

        if (!showError) return null;

        return (
            <div className="totp-error alert alert-danger">
                {errorMessage}
            </div>
        );
    }

    render() {
        const { children } = this.props;

        // Attach TOTP handlers to form elements in children
        const childrenWithProps = React.Children.map(children, child => {
            // Only process React elements
            if (!React.isValidElement(child)) return child;

            // Clone the element to add event handlers
            return React.cloneElement(child, {
                ref: node => {
                    // Attach refs to forms
                    if (node) {
                        const verifyForm = node.querySelector('#verify-totp-form');
                        if (verifyForm) {
                            verifyForm.addEventListener('submit', this.handleTOTPSubmit);
                        }

                        const setupForm = node.querySelector('#setup-totp-form');
                        if (setupForm) {
                            setupForm.addEventListener('submit', this.handleTOTPSubmit);
                        }

                        const disableForm = node.querySelector('#disable-totp-form');
                        if (disableForm) {
                            disableForm.addEventListener('submit', this.handleDisableTOTPSubmit);
                        }
                    }
                }
            });
        });

        return (
            <div className="totp-handler">
                {this.renderErrorMessage()}
                {childrenWithProps}
            </div>
        );
    }
}

export default TOTPHandler;
