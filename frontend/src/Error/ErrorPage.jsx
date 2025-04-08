/**
 * @fileoverview ErrorPage Component
 * @description A React component for displaying HTTP error pages with SVG illustrations
 * @author malcolm stone
 * @version 1.0.0
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import "../style/darkmode.css"
import './ErrorPage.css';

class ErrorPage extends Component {
    /**
     * Constructor - initializes component with standard and custom HTTP error codes
     * @param {Object} props - Component props
     */
    constructor(props) {
        super(props);

        // Standard HTTP error codes and their messages
        const standardErrors = {
            // 3xx - Redirection
            300: 'Multiple Choices',
            301: 'Moved Permanently',
            302: 'Found',
            303: 'See Other',
            304: 'Not Modified',
            307: 'Temporary Redirect',
            308: 'Permanent Redirect',

            // 4xx - Client Errors
            400: 'Bad Request',
            401: 'Unauthorized',
            402: 'Payment Required',
            403: 'Forbidden',
            404: 'Not Found',
            405: 'Method Not Allowed',
            406: 'Not Acceptable',
            407: 'Proxy Authentication Required',
            408: 'Request Timeout',
            409: 'Conflict',
            410: 'Gone',
            411: 'Length Required',
            412: 'Precondition Failed',
            413: 'Payload Too Large',
            414: 'URI Too Long',
            415: 'Unsupported Media Type',
            416: 'Range Not Satisfiable',
            417: 'Expectation Failed',
            418: 'I\'m a Teapot',
            421: 'Misdirected Request',
            422: 'Unprocessable Entity',
            423: 'Locked',
            424: 'Failed Dependency',
            425: 'Too Early',
            426: 'Upgrade Required',
            428: 'Precondition Required',
            429: 'Too Many Requests',
            431: 'Request Header Fields Too Large',
            451: 'Unavailable For Legal Reasons',

            // 5xx - Server Errors
            500: 'Internal Server Error',
            501: 'Not Implemented',
            502: 'Bad Gateway',
            503: 'Service Unavailable',
            504: 'Gateway Timeout',
            505: 'HTTP Version Not Supported',
            506: 'Variant Also Negotiates',
            507: 'Insufficient Storage',
            508: 'Loop Detected',
            510: 'Not Extended',
            511: 'Network Authentication Required'
        };

        // Custom error codes and messages
        const customErrors = {
            // Custom client errors
            460: 'Client Closed Request',
            499: 'Client Closed Request',

            // Custom server errors
            520: 'Web Server Returned Unknown Error',
            521: 'Web Server Is Down',
            522: 'Connection Timed Out',
            523: 'Origin Is Unreachable',
            524: 'A Timeout Occurred',
            525: 'SSL Handshake Failed',
            526: 'Invalid SSL Certificate',
            527: 'Railgun Error',
            530: 'Origin DNS Error'
        };

        // Merge standard and custom error messages
        this.state = {
            errorMessages: { ...standardErrors, ...customErrors }
        };
    }

    /**
     * Determines the category of an HTTP error code
     * @param {Number} error - The HTTP error code
     * @returns {String} The error category name
     */
    getErrorCategory(error) {
        if (error >= 300 && error < 400) return 'Redirection';
        if (error >= 400 && error < 500) return 'Client Error';
        if (error >= 500 && error <= 599) return 'Server Error';
        return 'Unknown Error';
    }

    /**
     * Validates if the provided error code is within the acceptable HTTP error range
     * @param {Number} error - The HTTP error code to validate
     * @returns {Boolean} True if the error code is valid, false otherwise
     */
    isValidError(error) {
        return error >= 300 && error <= 599;
    }

    /**
     * Gets the appropriate color for the error category
     * @param {Number} error - The HTTP error code
     * @returns {String} Hex color code for the error category
     */
    getErrorColor(error) {
        if (error >= 300 && error < 400) return '#3498db'; // Blue for redirections
        if (error >= 400 && error < 500) return '#e74c3c'; // Red for client errors
        if (error >= 500 && error <= 599) return '#f39c12'; // Orange for server errors
        return '#95a5a6'; // Gray for unknown
    }

    /**
     * Gets the appropriate SVG path for the error icon based on error category
     * @param {Number} error - The HTTP error code
     * @returns {String} SVG path data for the error icon
     */
    getSvgPath(error) {
        // Different SVG paths based on error category
        if (error >= 300 && error < 400) {
            // Redirection icon (arrow in a circle)
            return "M150,0 C167.614,0 182,14.3858 182,32 C182,49.6142 167.614,64 150,64 C132.386,64 118,49.6142 118,32 C118,14.3858 132.386,0 150,0 Z M150,118 L150,118 L150,38 L150,38 L148,38 C148,40.209 146.209,42 144,42 L144,42 L100,42 C97.791,42 96,40.209 96,38 L96,38 L96,26 C96,23.791 97.791,22 100,22 L100,22 L144,22 C146.209,22 148,23.791 148,26 L148,26 L148,38 L150,38 L150,38 L152,38 L152,26 C152,23.791 153.791,22 156,22 L156,22 L200,22 C202.209,22 204,23.791 204,26 L204,26 L204,38 C204,40.209 202.209,42 200,42 L200,42 L156,42 C153.791,42 152,40.209 152,38 L152,38 L150,38 L150,38 L150,118 L170,168 L130,168 L150,118 Z";
        } else if (error >= 400 && error < 500) {
            // Client error icon (X mark)
            return "M169.12,128.93l49.39-49.4a12,12,0,0,0-17-17l-49.4,49.4-49.4-49.4a12,12,0,0,0-17,17l49.4,49.4-49.4,49.39a12,12,0,0,0,17,17l49.4-49.39,49.39,49.39a12,12,0,0,0,17-17Z";
        } else {
            // Server error icon (server/message bubble)
            return "M216,64V168.24A15.76,15.76,0,0,1,200.24,184H170.34l-10,19.2a8,8,0,0,1-14.24.21L136.05,184H55.76A15.76,15.76,0,0,1,40,168.24V64A16,16,0,0,1,56,48H200A16,16,0,0,1,216,64ZM176,96a12,12,0,1,0-12,12A12,12,0,0,0,176,96Zm-56,0a12,12,0,1,0-12,12A12,12,0,0,0,120,96Zm84,52a8,8,0,0,0-8-8H80a8,8,0,0,0,0,16H196A8,8,0,0,0,204,148Z";
        }
    }

    /**
     * Gets a specific error's explanation if available
     * @param {Number} error - The HTTP error code
     * @returns {String} Explanation for the error code
     */
    getErrorExplanation(error) {
        const explanations = {
            // 3xx explanations
            301: 'The requested resource has been permanently moved to a new location.',
            302: 'The requested resource has been temporarily moved to a different location.',
            304: 'The resource has not been modified since the last request.',

            // 4xx explanations
            400: 'The server cannot process the request due to a client error.',
            401: 'Authentication is required to access this resource.',
            403: 'You do not have permission to access this resource.',
            404: 'The requested resource could not be found on this server.',
            405: 'The request method is not supported for this resource.',
            408: 'The server timed out waiting for the request.',
            410: 'The requested resource is no longer available and has been permanently removed.',
            418: 'The server refuses to brew coffee because it is a teapot.',
            429: 'You have sent too many requests in a given amount of time.',
            451: 'The requested resource is unavailable for legal reasons.',

            // 5xx explanations
            500: 'The server encountered an unexpected condition that prevented it from fulfilling the request.',
            501: 'The server does not support the functionality required to fulfill the request.',
            502: 'The server received an invalid response from an upstream server.',
            503: 'The server is currently unable to handle the request due to temporary overloading or maintenance.',
            504: 'The server did not receive a timely response from an upstream server.',
            520: 'The origin server returned an unexpected response.',
            521: 'The origin server has refused the connection.',
            522: 'The connection to the origin server timed out.'
        };

        return explanations[error] || null;
    }

    render() {
        const { error, msg } = this.props;
        const { errorMessages } = this.state;

        // Check if the error is in the valid range
        if (!this.isValidError(error)) {
            return (
                <div className="error-page invalid-error">
                    <h1>Invalid Error Code</h1>
                    <p>The provided error code ({error}) is not within the valid range (300-599).</p>
                </div>
            );
        }

        const defaultMessage = errorMessages[error] || `Error ${error}`;
        const errorCategory = this.getErrorCategory(error);
        const errorColor = this.getErrorColor(error);
        const svgPath = this.getSvgPath(error);
        const explanation = this.getErrorExplanation(error);

        // Get category for data attribute
        const categoryAttr = error >= 300 && error < 400 ? 'redirect' :
            error >= 400 && error < 500 ? 'client' :
                error >= 500 && error <= 599 ? 'server' : 'unknown';

        return (
            <div className="error-page" data-category={categoryAttr}>
                <div className="error-background">
                    <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
                        <path d={svgPath} />
                    </svg>
                </div>

                <div className="error-content">
                    <div className="error-code">
                        <h1>{error}</h1>
                    </div>
                    <div className="error-category">
                        <h2>{errorCategory}</h2>
                    </div>
                    <div className="error-message">
                        <p className="error-title">{msg || defaultMessage}</p>
                        {explanation && <p className="error-explanation">{explanation}</p>}
                    </div>
                    <div className="error-actions">
                        <button onClick={() => window.history.back()}>Go Back</button>
                        <button onClick={() => window.location.href = '/'}>Home</button>
                    </div>
                </div>
            </div>
        );
    }
}

ErrorPage.propTypes = {
    error: PropTypes.number.isRequired,
    msg: PropTypes.string
};

ErrorPage.defaultProps = {
    msg: null
};

/**
 * ErrorPage Component documentation
 *
 * @component
 * @example
 * // Basic usage with just an error code
 * <ErrorPage error={404} />
 *
 * // Usage with custom error message
 * <ErrorPage error={500} msg="System is undergoing maintenance" />
 *
 * // Usage with CloudFlare custom error code
 * <ErrorPage error={522} />
 */
export default ErrorPage;
