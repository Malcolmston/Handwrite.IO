import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './style/tab.css';

/**
 * Tab component that allows adding/removing tabs and stores active tab in session storage
 *
 * @component
 * @example
 * const tabs = [
 *   { id: 'mission', label: 'Our Mission', content: <MissionContent /> },
 *   { id: 'why', label: 'Why Us', content: <WhyUsContent /> },
 * ];
 *
 * function MyPage() {
 *   const [myTabs, setMyTabs] = useState(tabs);
 *
 *   const addTab = () => {
 *     setMyTabs([...myTabs, {
 *       id: 'new-tab',
 *       label: 'New Tab',
 *       content: <div>New tab content</div>
 *     }]);
 *   };
 *
 *   const removeTab = (tabId) => {
 *     setMyTabs(myTabs.filter(tab => tab.id !== tabId));
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={addTab}>Add Tab</button>
 *       <Tab
 *         tabs={myTabs}
 *         storageKey="my-page-tabs"
 *         onRemoveTab={removeTab}
 *       />
 *     </div>
 *   );
 * }
 */
class Tab extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: this.getSavedActiveTab() || (props.tabs[0]?.id || null)
        };
    }

    /**
     * Retrieves the active tab from session storage
     * @returns {string|null} The active tab ID or null if not found
     */
    getSavedActiveTab() {
        const { storageKey } = this.props;
        if (typeof window !== 'undefined' && storageKey) {
            return sessionStorage.getItem(storageKey);
        }
        return null;
    }

    /**
     * Handles tab click and updates session storage
     * @param {string} tabId - The ID of the clicked tab
     */
    handleTabClick = (tabId) => {
        const { storageKey, onTabChange } = this.props;

        this.setState({ activeTab: tabId });

        if (typeof window !== 'undefined' && storageKey) {
            sessionStorage.setItem(storageKey, tabId);
        }

        if (onTabChange) {
            onTabChange(tabId);
        }
    };

    /**
     * Handles tab removal
     * @param {Event} e - The click event
     * @param {string} tabId - The ID of the tab to remove
     */
    handleRemoveTab = (e, tabId) => {
        e.stopPropagation();
        const { onRemoveTab } = this.props;

        if (onRemoveTab) {
            onRemoveTab(tabId);

            // If the active tab is being removed, select another tab
            if (this.state.activeTab === tabId) {
                const { tabs } = this.props;
                const remainingTabs = tabs.filter(tab => tab.id !== tabId);

                if (remainingTabs.length > 0) {
                    this.handleTabClick(remainingTabs[0].id);
                } else {
                    this.setState({ activeTab: null });
                    if (typeof window !== 'undefined' && this.props.storageKey) {
                        sessionStorage.removeItem(this.props.storageKey);
                    }
                }
            }
        }
    };

    componentDidUpdate(prevProps) {
        // If tabs change, check if the active tab still exists
        if (prevProps.tabs !== this.props.tabs) {
            const activeTabExists = this.props.tabs.some(tab => tab.id === this.state.activeTab);

            if (!activeTabExists && this.props.tabs.length > 0) {
                this.handleTabClick(this.props.tabs[0].id);
            } else if (!activeTabExists) {
                this.setState({ activeTab: null });
                if (typeof window !== 'undefined' && this.props.storageKey) {
                    sessionStorage.removeItem(this.props.storageKey);
                }
            }
        }
    }

    render() {
        const { tabs, allowRemoval, externalLinks, className } = this.props;
        const { activeTab } = this.state;

        return (
            <div className={`tab-component ${className || ''}`}>
                <div className="tab">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`tablinks ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => this.handleTabClick(tab.id)}
                        >
                            {externalLinks && tab.isExternal ? (
                                <a href={tab.link} target="_blank" rel="noopener noreferrer">
                                    {tab.label} {tab.icon && <i className={tab.icon}></i>}
                                </a>
                            ) : (
                                <>
                                    {tab.label}
                                    {allowRemoval && (
                                        <span
                                            className="tab-close"
                                            onClick={(e) => this.handleRemoveTab(e, tab.id)}
                                        >
                      &times;
                    </span>
                                    )}
                                </>
                            )}
                        </button>
                    ))}
                </div>

                {tabs.map(tab => (
                    <div
                        key={tab.id}
                        id={tab.id}
                        className={`tabcontent ${activeTab === tab.id ? 'active' : ''}`}
                    >
                        {tab.content}
                    </div>
                ))}
            </div>
        );
    }
}

Tab.propTypes = {
    /**
     * Array of tab objects
     */
    tabs: PropTypes.arrayOf(
        PropTypes.shape({
            /**
             * Unique identifier for the tab
             */
            id: PropTypes.string.isRequired,
            /**
             * Display text for the tab
             */
            label: PropTypes.string.isRequired,
            /**
             * Content to display when tab is active
             */
            content: PropTypes.node.isRequired,
            /**
             * Whether the tab links to an external page
             */
            isExternal: PropTypes.bool,
            /**
             * URL for external link tabs
             */
            link: PropTypes.string,
            /**
             * Icon class for the tab (e.g., 'fa-solid fa-arrow-up-right-from-square')
             */
            icon: PropTypes.string
        })
    ).isRequired,
    /**
     * Key to use for storing active tab in session storage
     */
    storageKey: PropTypes.string,
    /**
     * Whether to show remove buttons on tabs
     */
    allowRemoval: PropTypes.bool,
    /**
     * Whether to support external link tabs
     */
    externalLinks: PropTypes.bool,
    /**
     * Callback for tab changes
     */
    onTabChange: PropTypes.func,
    /**
     * Callback for tab removal
     */
    onRemoveTab: PropTypes.func,
    /**
     * Additional CSS class names
     */
    className: PropTypes.string
};

Tab.defaultProps = {
    storageKey: 'tab-active-id',
    allowRemoval: false,
    externalLinks: false
};

export default Tab;
/**
 * Functional component version with hooks and defaultTab support
 */
export const TabHooks = ({
                             tabs,
                             storageKey = 'tab-active-id',
                             allowRemoval = false,
                             externalLinks = false,
                             onTabChange,
                             onRemoveTab,
                             className = '',
                             defaultTab = null // Add defaultTab prop with null default value
                         }) => {
    // Get initial active tab from defaultTab, session storage, or use first tab
    const getInitialActiveTab = () => {
        // First priority: use the defaultTab if provided
        if (defaultTab && tabs.some(tab => tab.id === defaultTab)) {
            return defaultTab;
        }

        // Second priority: use session storage if available
        if (typeof window !== 'undefined' && storageKey) {
            const saved = sessionStorage.getItem(storageKey);
            if (saved && tabs.some(tab => tab.id === saved)) {
                return saved;
            }
        }

        // Last resort: use the first tab
        return tabs[0]?.id || null;
    };

    const [activeTab, setActiveTab] = useState(getInitialActiveTab);

    // Effect to handle defaultTab changes
    useEffect(() => {
        if (defaultTab && tabs.some(tab => tab.id === defaultTab) && activeTab !== defaultTab) {
            setActiveTab(defaultTab);

            // Update session storage
            if (typeof window !== 'undefined' && storageKey) {
                sessionStorage.setItem(storageKey, defaultTab);
            }

            // Call the onTabChange callback if provided
            if (onTabChange) {
                onTabChange(defaultTab);
            }
        }
    }, [defaultTab, tabs]);

    // Handle tab click
    const handleTabClick = (tabId) => {
        setActiveTab(tabId);

        if (typeof window !== 'undefined' && storageKey) {
            sessionStorage.setItem(storageKey, tabId);
        }

        if (onTabChange) {
            onTabChange(tabId);
        }
    };

    // Handle tab removal
    const handleRemoveTab = (e, tabId) => {
        e.stopPropagation();

        if (onRemoveTab) {
            onRemoveTab(tabId);

            // If the active tab is being removed, select another tab
            if (activeTab === tabId) {
                const remainingTabs = tabs.filter(tab => tab.id !== tabId);

                if (remainingTabs.length > 0) {
                    handleTabClick(remainingTabs[0].id);
                } else {
                    setActiveTab(null);
                    if (typeof window !== 'undefined' && storageKey) {
                        sessionStorage.removeItem(storageKey);
                    }
                }
            }
        }
    };

    // Update activeTab if tabs change and current active tab no longer exists
    useEffect(() => {
        const activeTabExists = tabs.some(tab => tab.id === activeTab);

        if (!activeTabExists && tabs.length > 0) {
            handleTabClick(tabs[0].id);
        } else if (!activeTabExists) {
            setActiveTab(null);
            if (typeof window !== 'undefined' && storageKey) {
                sessionStorage.removeItem(storageKey);
            }
        }
    }, [tabs]);

    return (
        <div className={`tab-component ${className}`}>
            <div className="tab">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`tablinks ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => handleTabClick(tab.id)}
                    >
                        {externalLinks && tab.isExternal ? (
                            <a href={tab.link} target="_blank" rel="noopener noreferrer">
                                {tab.label} {tab.icon && <i className={tab.icon}></i>}
                            </a>
                        ) : (
                            <>
                                {tab.label}
                                {allowRemoval && (
                                    <span
                                        className="tab-close"
                                        onClick={(e) => handleRemoveTab(e, tab.id)}
                                    >
                                        &times;
                                    </span>
                                )}
                            </>
                        )}
                    </button>
                ))}
            </div>

            {tabs.map(tab => (
                <div
                    key={tab.id}
                    id={tab.id}
                    className={`tabcontent ${activeTab === tab.id ? 'active' : ''}`}
                >
                    {tab.content}
                </div>
            ))}
        </div>
    );
};

TabHooks.propTypes = Tab.propTypes;
