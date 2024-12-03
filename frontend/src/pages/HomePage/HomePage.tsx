import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '../common/NavBar';
import './HomePage.css';
import { AuthContext } from '../../context/AuthContext';

export const HomePage = () => {
    const navigate = useNavigate();
    const context = useContext(AuthContext);
    useEffect(() => {
        console.log(context.token, context.accountType, context.id);
    }, []);
    const [currentStep, setCurrentStep] = useState<number>(-1);

    // const tourSteps = [
    //     { id: "tour-step-navbar", text: "This is the navigation bar where you can navigate the app. You can check out your events, discover clubs, and your profile here." },
    //     { id: "tour-step-header", text:  <>
    //         Here is SoCalSocial's vision!
    //         <br />
    //         *TLDR: SoCalSocial is designed to simplify and personalize event discovery for UCSD students by centralizing event information in one platform.
    //     </> },
    //     { id: "tour-step-tips-header", text: "These are the tips for getting started with the platform." },
    //     { id: "tour-step-create", text: <>At this page, you can add to your profile, <br/>
    //                                       set privacy preference, and view your past event history. </> },
    //     { id: "tour-step-explore", text: <>Navigate to the Clubs Page to find and <br/>
    //                                        explore clubs. Follow clubs that match your interests." </> },
    //     { id: "tour-step-rsvp", text: <>Discover exciting events and RSVP directly from  <br/>
    //                                     the Events Page to stay connected and engaged. </> },
    // ];

    const tourSteps = context.accountType === "user"
    ? [
        { id: "tour-step-navbar", text: "This is the navigation bar where you can navigate the app. You can check out your events, discover clubs, and your profile here." },
        { id: "tour-step-header", text: <>
            Here is SoCalSocial's vision!
            <br />
            *TLDR: SoCalSocial is designed to simplify and personalize event discovery for UCSD students by centralizing event information in one platform.
        </> },
        { id: "tour-step-tips-header", text: "These are the tips for getting started with the platform." },
        { id: "tour-step-create", text: <>At this page, you can add to your profile, <br/>
                                          set privacy preferences, and view your past event history. </> },
        { id: "tour-step-explore", text: <>Navigate to the Clubs Page to find and <br/>
                                           explore clubs. Follow clubs that match your interests. </> },
        { id: "tour-step-rsvp", text: <>Discover exciting events and RSVP directly from <br/>
                                        the Events Page to stay connected and engaged. </> },
    ]
    : [
        { id: "tour-step-navbar", text: "This is the navigation bar where you can navigate the app. You can manage your club, add events, and check RSVPs here." },
        { id: "tour-step-header", text: <>
            Here is SoCalSocial's vision for clubs!
            <br />
            *TLDR: SoCalSocial helps clubs manage events and connect with students in a streamlined platform.
        </> },
        { id: "tour-step-tips-header", text: "These are the tips for getting started with managing your club." },
        { id: "tour-step-create", text: <>Build your club’s profile, <br/>
                                          showcase the club's vision, and keep followers updated. </> },
        { id: "tour-step-explore", text: <>Navigate to the Events Page to add <br/>
                                           and manage events for your club. </> },
        { id: "tour-step-rsvp", text: <>Manage RSVPs and track engagement <br/>
                                        directly from the Events Page. </> },
    ];



    const nextStep = () => {
        if (currentStep < tourSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setCurrentStep(-1);
        }
    };

    const startTour = () => {
        setCurrentStep(0);
    };

    const isActiveStep = (id: string) => currentStep >= 0 && tourSteps[currentStep]?.id === id;

    const getTooltipStyle = () => {
        const stepId = tourSteps[currentStep]?.id;
        const element = document.getElementById(stepId);
        if (!element) return { top: '0px', left: '0px', display: 'none' };

        const rect = element.getBoundingClientRect();
        return {
            top: `${rect.top + window.scrollY + rect.height + 10}px`,
            left: `${rect.left + window.scrollX + rect.width / 2}px`,
            transform: 'translateX(-50%)',
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

    return (
        <div className="HomePageContainer">
            {currentStep >= 0 && (
                <div className="tour-overlay">
                    <div className="tour-tooltip" style={getTooltipStyle()}>
                        <p>{tourSteps[currentStep]?.text}</p>
                        <button onClick={nextStep}>
                            {currentStep < tourSteps.length - 1 ? "Next" : "Finish"}
                        </button>
                    </div>
                </div>
            )}

            <div
                className={`navbarContainer ${isActiveStep("tour-step-navbar") ? "active-step" : ""}`}
                id="tour-step-navbar"
            >
                <NavBar />
            </div>
            <div
                className={`web-identity-container ${isActiveStep("tour-step-header") ? "active-step" : ""}`}
                id="tour-step-header"
            >
                <h1>SoCalSocial: Your Personalized Hub for UCSD Events</h1>
                <p>
                    With countless flyers, social media posts, and invitations flooding your day, 
                    it’s easy to feel lost in the noise. SoCalSocial tackles this challenge by 
                    centralizing event information and personalizing it just for you, showcasing events 
                    that truly matter based on your interests. By cutting through the clutter, SoCalSocial 
                    helps reduce the stress of information overload, so you can focus on the experiences 
                    that are most important to you: discovering new clubs and joining fun events!

                </p>
            </div>

            <div className="header-and-button-container">
                <h2
                    className={`${isActiveStep("tour-step-tips-header") ? "active-step" : ""}`}
                    id="tour-step-tips-header"
                >
                    ✏️ Tips to Get Started 
                </h2>
                <button className="demo-button" onClick={startTour}>
                    Start Demo
                </button>
            </div>

            {context.accountType === "user"&& // if you dont have time remove this line
            <div className="tips-container">
                <div
                    className={`tip ${isActiveStep("tour-step-create") ? "active-step" : ""}`}
                    id="tour-step-create"
                >
                    <img src="/profile.png" alt="Profile" />
                    <h3>Create & Personalize</h3>
                    <p>Check out your profile and personalize it to your liking!</p>
                </div>
                <div
                    className={`tip ${isActiveStep("tour-step-explore") ? "active-step" : ""}`}
                    id="tour-step-explore"
                >
                    <img src="/clubSearch.png" alt="Clubs" />
                    <h3>Explore. Match. Follow.</h3>
                    <p>Find clubs that match your interests and connect with peers.</p>
                </div>
                <div
                    className={`tip ${isActiveStep("tour-step-rsvp") ? "active-step" : ""}`}
                    id="tour-step-rsvp"
                >
                    <img src="/eventsList.png" alt="Events" />
                    <h3>RSVP Now and Join the Fun</h3>
                    <p>Discover events and RSVP to stay in the loop with your favorite clubs.</p>
                </div>
            </div>
            }

            {context.accountType === "club"&& // if you dont have time remove this line
            <div className="tips-container">
                <div
                    className={`tip ${isActiveStep("tour-step-create") ? "active-step" : ""}`}
                    id="tour-step-create"
                >
                    <img src="/clubProfile.png" alt="Profile" />
                    <h3>Show Off Your Club's Personality</h3>
                    <p>Build a profile that stands out—share your mission, add board members, and let your followers stay updated.</p>
                </div>
                <div
                    className={`tip ${isActiveStep("tour-step-explore") ? "active-step" : ""}`}
                    id="tour-step-explore"
                >
                    <img src="/addEvent.png" alt="Clubs" />
                    <h3>Add Events!</h3>
                    <p>Add events that bring your club’s vision to life and engage your community.</p>
                </div>
                <div
                    className={`tip ${isActiveStep("tour-step-rsvp") ? "active-step" : ""}`}
                    id="tour-step-rsvp"
                >
                    <img src="/clubEvents.png" alt="Events" />
                    <h3>Plan and Promote Like a Pro</h3>
                    <p>Easily create and manage events to connect with peers and grow your community.</p>
                </div>
            </div>
            }



        </div>
    );
};

