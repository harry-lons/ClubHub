import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '../NavBar/NavBar';
import './HomePage.css';

export const HomePage = () => {
    const navigate = useNavigate();

    // State for tracking the current step in the tour
    const [currentStep, setCurrentStep] = useState<number>(-1); // Initialize to -1 (tour inactive)

    // Tour steps definition
    const tourSteps = [
        { id: "tour-step-navbar", text: "This is the navigation bar where you can navigate the app." },
        { id: "tour-step-identity", text: "Welcome to SoCalSocial! Here's what we aim to do." },
        { id: "tour-step-tips", text: "These are tips for getting started with the platform!" },
        { id: "tour-step-clubs", text: "Find clubs that match your interests here." },
        { id: "tour-step-events", text: "RSVP to events from your favorite clubs in this section." },
        { id: "tour-step-profile", text: "Update your profile to stay connected with friends." },
    ];

    // Function to handle moving to the next step
    const nextStep = () => {
        if (currentStep < tourSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            // End the tour
            setCurrentStep(-1);
        }
    };

    // Function to start the tour
    const startTour = () => {
        setCurrentStep(0); // Start the tour from the first step
    };

    // Get the current step element and calculate tooltip position
    const getTooltipPosition = (id: string) => {
        const element = document.getElementById(id);
        if (!element) return { top: 0, left: 0 }; // Fallback if element is not found

        const rect = element.getBoundingClientRect();
        return {
            top: rect.top + window.scrollY + rect.height + 10, // Position below the element
            left: rect.left + window.scrollX + rect.width / 2, // Center horizontally
        };
    };

    useEffect(() => {
        if (currentStep >= 0) {
            const stepElement = document.getElementById(tourSteps[currentStep]?.id);
            if (stepElement) {
                stepElement.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    }, [currentStep]);

    const currentTooltipPosition =
        currentStep >= 0 ? getTooltipPosition(tourSteps[currentStep]?.id) : null;

    return (
        <div className="HomePageContainer">
            {/* Overlay for guided tour */}
            {currentStep >= 0 && (
                <div className="tour-overlay">
                    <div
                        className="tour-tooltip"
                        style={{
                            top: currentTooltipPosition?.top,
                            left: currentTooltipPosition?.left,
                            position: 'absolute',
                        }}
                    >
                        <p>{tourSteps[currentStep]?.text}</p>
                        <button onClick={nextStep}>
                            {currentStep < tourSteps.length - 1 ? "Next" : "Finish"}
                        </button>
                    </div>
                </div>
            )}

            <div className="navbarContainer" id="tour-step-navbar">
                <NavBar />
            </div>
            <div className="web-identity-container" id="tour-step-identity">
                <h1>SoCalSocial: Your Personalized Hub for UCSD Events</h1>
                <p>
                    SoCalSocial is designed to simplify and personalize event discovery for UCSD
                    students by centralizing event information in one platform.
                </p>
            </div>
            <h2 id="tour-step-tips">Tips for Getting Started 🤩</h2>
            <div className="web-instruction-container">
                <div className="web-clubs-container" id="tour-step-clubs">
                    <h3>Let's Start by Exploring Clubs That Match Your Interests 😻</h3>
                    <p>Tutorials waiting to be written at the end of Sprint 5</p>
                </div>
                <div className="web-events-container" id="tour-step-events">
                    <h3>Next Step: RSVP to Events from Your Favorite Clubs 🫶🏻</h3>
                    <p>Tutorials waiting to be written at the end of Sprint 5</p>
                </div>
                <div className="web-profile-container" id="tour-step-profile">
                    <h3>Update Your Profile to Stay Connected with Friends 💃🏻</h3>
                    <p>Tutorials waiting to be written at the end of Sprint 5</p>
                </div>
            </div>

            {/* Demo Button */}
            <div className="demo-button-container">
                <button className="demo-button" onClick={startTour}>
                    Start Demo
                </button>
            </div>

            <h2>Latest Updates on Our Progress ⌨️</h2>
            <div className="web-updates-container">
                <div className="web-update-4">
                    <h3>Sprint 4</h3>
                    <p>Things waiting to be filled</p>
                </div>
            </div>
        </div>
    );
};
