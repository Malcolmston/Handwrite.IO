import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import "./ThemeToggle.css"

/**
 * ThemeToggle Component
 *
 * A component for toggling between light and dark theme modes
 * that works with the ErrorPage component.
 *
 * @component
 * @example
 * <ThemeToggle />
 */
const ThemeToggle = ({ className }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    // On component mount, check system preference or localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            setIsDarkMode(true);
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }, []);

    // Toggle theme function
    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);

        if (!isDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <div className={`theme-toggle ${className || ''}`}>
            <label className="switch" htmlFor="theme-toggle">
                <input
                    type="checkbox"
                    id="theme-toggle"
                    checked={isDarkMode}
                    onChange={toggleTheme}
                    aria-label="Toggle dark mode"
                />
                <span className="slider">
          <svg
              className="sun-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="currentColor"
          >
            <path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0-12a1 1 0 0 0 1-1V2a1 1 0 0 0-2 0v2a1 1 0 0 0 1 1zm0 14a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0v-2a1 1 0 0 0-1-1zm9-9h-2a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2zM5 12a1 1 0 0 0-1-1H2a1 1 0 0 0 0 2h2a1 1 0 0 0 1-1zm.64-6.36a1 1 0 0 0 1.42 0l1.42-1.42a1 1 0 0 0-1.42-1.42L5.64 4.22a1 1 0 0 0 0 1.42zm12.72 12.72a1 1 0 0 0-1.42 0l-1.42 1.42a1 1 0 0 0 1.42 1.42l1.42-1.42a1 1 0 0 0 0-1.42zM5.64 19.78l1.42-1.42a1 1 0 0 0-1.42-1.42l-1.42 1.42a1 1 0 0 0 1.42 1.42zm12.72-12.72a1 1 0 0 0 1.42-1.42l-1.42-1.42a1 1 0 0 0-1.42 1.42l1.42 1.42z"></path>
          </svg>

          <svg
              className="moon-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="currentColor"
          >
            <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"></path>
          </svg>
        </span>
            </label>
        </div>
    );
};

ThemeToggle.propTypes = {
    className: PropTypes.string
};

export default ThemeToggle;
