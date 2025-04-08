import "./style/darkmode.css"
import "./style/tab.css"
import "./style/pricing.css"
import { TabHooks } from './Tab';
import ThemeToggle from "./Toggle/useTheme"
import {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


import {faInfinity} from "@awesome.me/kit-2333bf7b7a/icons/duotone/solid";

function Pricing () {

    // Add a new state to track when to show infinity
    const [showInfinity, setShowInfinity] = useState(false);
    const [val, setValue] = useState(1000);

    function updateIn(event) {
        // Parse the value as a number
        const value = parseInt(event.target.value, 10);

        setValue(value); // Update the slider value

        // Set flag for showing infinity icon
        if (value === 10000) {
            setShowInfinity(true);
        } else {
            setShowInfinity(false);
        }
    }
    const tabs = [
        {
            id: "free",
            label: "Free",
            content: (
                <>
                    <div className="plan-card">
                        <h3>Free Plan</h3>
                        <p className="plan-description">Start your journey with our essential features</p>

                        <div className="price-tag">
                            <span className="price">$0</span>
                            <span className="period">/month</span>
                        </div>

                        <ul className="feature-list">
                            <li>
                                <i className="fas fa-check"></i>
                                <span>Access to all fonts and colors</span>
                            </li>
                            <li>
                                <i className="fas fa-check"></i>
                                <span>Basic translation model</span>
                            </li>
                            <li>
                                <i className="fas fa-check"></i>
                                <span>Basic text-to-speech model</span>
                            </li>
                            <li>
                                <i className="fas fa-check"></i>
                                <span>10 images per month</span>
                            </li>
                        </ul>

                        <button className="cta-button">Get Started Free</button>
                    </div>
                </>
            )
        },
        {
            id: "pro",
            label: "pro",
            content: (
                <>
                    <div className="plan-card featured">
                        <div className="featured-badge">Most Popular</div>
                        <h3>Pro Plan</h3>
                        <p className="plan-description">Advanced features for professional users</p>

                        <div className="price-tag">
                            <span className="price">$5</span>
                            <span className="period">/month</span>
                        </div>

                        <ul className="feature-list">
                            <li>
                                <i className="fas fa-check"></i>
                                <span>All Free plan features</span>
                            </li>
                            <li>
                                <i className="fas fa-check"></i>
                                <span>Advanced text-to-speech models</span>
                            </li>
                            <li>
                                <i className="fas fa-check"></i>
                                <span>Advanced translation models</span>
                            </li>
                            <li>
                                <i className="fas fa-check"></i>
                                <span>Text improvement models</span>
                            </li>
                            <li>
                                <i className="fas fa-check"></i>
                                <span>Text summarization models</span>
                            </li>
                            <li>
                                <i className="fas fa-check"></i>
                                <span>Text generation models</span>
                            </li>
                            <li>
                                <i className="fas fa-check"></i>
                                <span>Text analysis models</span>
                            </li>
                            <li>
                                <i className="fas fa-check"></i>
                                <span>Text extraction models</span>
                            </li>
                            <li>
                                <i className="fas fa-infinity"></i>
                                <span>Unlimited images</span>
                            </li>
                        </ul>

                        <button className="cta-button">Upgrade to Pro</button>
                    </div>
                </>
            )
        },
        {
            id: "school",
            label: "School",
            content: (
                <>
                    <div className="plan-card">
                        <h3>School Plan</h3>
                        <p className="plan-description">Customizable solutions for educational institutions</p>

                        <div className="custom-pricing">
                            <i className="fas fa-school"></i>
                            <span>Custom pricing based on your needs</span>
                        </div>

                        <div className="feature-configurator">
                            <h4>Select Your Features</h4>

                            <div className="feature-group">
                                <div className="feature-item">
                                    <input type="checkbox" id="fonts"/>
                                    <label htmlFor="fonts">
                                        <span className="feature-name">Fonts and Colors</span>
                                        <span className="feature-desc">Access to all styling options</span>
                                    </label>
                                </div>

                                <div className="feature-item">
                                    <input type="checkbox" id="translation"/>
                                    <label htmlFor="translation">
                                        <span className="feature-name">Translation Model</span>
                                        <span className="feature-desc">Support for multiple languages</span>
                                    </label>
                                </div>

                                <div className="feature-item">
                                    <input type="checkbox" id="tts"/>
                                    <label htmlFor="tts">
                                        <span className="feature-name">Text-to-Speech</span>
                                        <span className="feature-desc">Convert text to natural speech</span>
                                    </label>
                                </div>

                                <div className="feature-item">
                                    <input type="checkbox" id="improvement"/>
                                    <label htmlFor="improvement">
                                        <span className="feature-name">Text Improvement</span>
                                        <span className="feature-desc">Grammar and style enhancement</span>
                                    </label>
                                </div>

                                <div className="feature-item">
                                    <input type="checkbox" id="summarization"/>
                                    <label htmlFor="summarization">
                                        <span className="feature-name">Text Summarization</span>
                                        <span className="feature-desc">Create concise summaries</span>
                                    </label>
                                </div>

                                <div className="feature-item">
                                    <input type="checkbox" id="generation"/>
                                    <label htmlFor="generation">
                                        <span className="feature-name">Text Generation</span>
                                        <span className="feature-desc">AI-powered content creation</span>
                                    </label>
                                </div>

                                <div className="feature-item">
                                    <input type="checkbox" id="analysis"/>
                                    <label htmlFor="analysis">
                                        <span className="feature-name">Text Analysis</span>
                                        <span className="feature-desc">Advanced text analytics</span>
                                    </label>
                                </div>

                                <div className="feature-item slider-container">
                                    <label htmlFor="imageRange">
                                        <span className="feature-name">Monthly Image Limit</span>
                                        <span className="feature-desc">Images per month</span>
                                    </label>
                                    <div className="slider-control">
                                        <input
                                            type="range"
                                            id="imageRange"
                                            min="100"
                                            max="10000"
                                            value={val} // Use the state value here instead of "1000"
                                            step="100"
                                            onChange={updateIn}
                                        />
                                        <span className="range-value" id="imageValue">
    {showInfinity ?
        <FontAwesomeIcon icon={faInfinity}/> :
        val.toLocaleString()
    }
</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="contact-section">
                            <p>Get in touch with our education team for a custom quote based on your selected features
                                and number of students.</p>
                            <button className="cta-button">Request Quote</button>
                        </div>
                    </div>
                </>
            )
        }
    ]

    // Handle tab change event
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
                storageKey="handwrite-pricing-tabs"
                externalLinks={true}
                onTabChange={handleTabChange}
                className="pricing-tabs"
            />
        </div>
    );
}

export default Pricing;
