import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * TOTPInput Component
 *
 * A specialized input component for TOTP verification codes with
 * auto-formatting, validation, and auto-submission.
 */
class TOTPInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            secondsRemaining: 30,
            percentage: 100,
            timerColor: '#28a745'
        };

        this.inputRef = React.createRef();
        this.countdownTimer = null;
    }

    componentDidMount() {
        // Focus the input if autoFocus is true
        if (this.props.autoFocus && this.inputRef.current) {
            this.inputRef.current.focus();
        }

        // Start countdown timer if it should be shown
        if (this.props.showTimer) {
            this.startTOTPCountdown();
        }
    }

    componentWillUnmount() {
        // Clear any timers
        if (this.countdownTimer) {
            clearTimeout(this.countdownTimer);
        }
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
     * Handle input changes and format the TOTP code
     */
    handleChange = (e) => {
        // Only allow digits
        let value = e.target.value.replace(/\D/g, '');

        // Limit to 6 digits
        if (value.length > 6) {
            value = value.slice(0, 6);
        }

        // Format with a space in the middle: XXX XXX
        let formattedValue = value;
        if (value.length > 3) {
            formattedValue = value.slice(0, 3) + ' ' + value.slice(3);
        }

        this.setState({ value: formattedValue });

        // Call parent onChange if provided
        if (this.props.onChange) {
            this.props.onChange(formattedValue);
        }

        // Auto-submit if 6 digits entered and autoSubmit is enabled
        const digitsOnly = value.replace(/\s/g, '');
        if (digitsOnly.length === 6 && this.props.autoSubmit && this.isValidCode(digitsOnly)) {
            if (this.props.onComplete) {
                setTimeout(() => {
                    this.props.onComplete(digitsOnly);
                }, 300); // Small delay for better UX
            }
        }
    };

    /**
     * Handle keydown events to filter invalid input
     */
    handleKeyDown = (e) => {
        // Allow navigation keys
        if (['ArrowLeft', 'ArrowRight', 'Backspace', 'Delete', 'Tab'].includes(e.key)) {
            return;
        }

        // Block non-digit keys
        if (!/^\d$/.test(e.key)) {
            e.preventDefault();
        }

        // Prevent entering more than 6 digits
        const digitsOnly = this.state.value.replace(/\D/g, '');
        if (digitsOnly.length >= 6 && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
        }
    };

    /**
     * Validate if the code is a valid 6-digit TOTP code
     */
    isValidCode = (code) => {
        // Remove any spaces that might have been added for formatting
        const digitsOnly = code.replace(/\s/g, '');
        return /^\d{6}$/.test(digitsOnly);
    };

    /**
     * Render the countdown timer
     */
    renderTimer() {
        const { secondsRemaining, percentage, timerColor } = this.state;
        const { showTimerLabel } = this.props;

        return (
            <div className="totp-timer-container">
                {showTimerLabel && <div className="totp-timer-label">Code refreshes in:</div>}
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

    render() {
        const { value } = this.state;
        const {
            id,
            name,
            className,
            placeholder,
            required,
            autoFocus,
            autoComplete,
            showTimer,
            label
        } = this.props;

        return (
            <div className="totp-input-container">
                {label && <label htmlFor={id}>{label}</label>}

                <input
                    ref={this.inputRef}
                    type="text"
                    id={id}
                    name={name}
                    className={`totp-code-input ${className || ''}`}
                    value={value}
                    onChange={this.handleChange}
                    onKeyDown={this.handleKeyDown}
                    placeholder={placeholder || '000 000'}
                    pattern="[0-9 ]{6,7}"
                    maxLength="7"
                    required={required}
                    autoFocus={autoFocus}
                    autoComplete={autoComplete || 'off'}
                />

                {showTimer && this.renderTimer()}
            </div>
        );
    }
}

TOTPInput.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    className: PropTypes.string,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    autoFocus: PropTypes.bool,
    autoComplete: PropTypes.string,
    autoSubmit: PropTypes.bool,
    showTimer: PropTypes.bool,
    showTimerLabel: PropTypes.bool,
    label: PropTypes.string,
    onChange: PropTypes.func,
    onComplete: PropTypes.func
};

TOTPInput.defaultProps = {
    id: 'token',
    name: 'token',
    placeholder: '000 000',
    required: true,
    autoFocus: false,
    autoComplete: 'off',
    autoSubmit: true,
    showTimer: true,
    showTimerLabel: true
};

export default TOTPInput;
