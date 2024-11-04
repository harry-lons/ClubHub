import React, { useContext, useState } from "react"
import { useParams } from "react-router-dom";
import { Event } from "../types/types";
import { Club } from "../types/types";
import { exampleEvent, exampleClub } from "../constants/constants";


const DetailedEvent: React.FC = () => {
    // const {id} = useParams();
    // const event = Event[].find((event)=>event.id === id); //After database implemented
    // if(!event){
    //     return <p>Event Not Found</p >
    // }

    const event = exampleEvent;
    const club = exampleClub;

    const handleTime = (begin_time: Date, end_time: Date) => {

        const byear = begin_time.getFullYear();
        const bmonth = begin_time.getMonth() + 1;
        const bday = begin_time.getDate();
        const bhours = begin_time.getHours().toString().padStart(2, '0');
        const bminutes = begin_time.getMinutes().toString().padStart(2, '0');

        const eyear = end_time.getFullYear();
        const emonth = end_time.getMonth() + 1;
        const eday = end_time.getDate();
        const ehours = end_time.getHours().toString().padStart(2, '0');
        const eminutes = end_time.getMinutes().toString().padStart(2, '0');

        if (byear == eyear && bmonth == emonth && bday == eday) {
            return (<p>{byear}-{bmonth}-{bday} {bhours}:{bminutes} to {ehours}:{eminutes}</p>);
        } else {
            return (<p>{byear}-{bmonth}-{bday} {bhours}:{bminutes} to {eyear}-{emonth}-{eday} {ehours}:{eminutes}</p>)
        }
    }
    const recurrenceDescription = (interval: number) =>{
        switch (interval){
            case 0:
                return "weekly";
            case 1:
                return "every other week";
            case 2:
                return "monthly";
            default:
                return "custom interval";
        }
    }
    const handleRecur = (recurrence: [ boolean, number, Date|null])=>{
        if(!recurrence[0]){
            return (<p>Not a recurring event.</p >);
        }else{
            return(<p>Yes. Recur {recurrenceDescription(recurrence[1])}. End Date {recurrence[2]?.getFullYear()}-{recurrence[2]?.getMonth()}-{recurrence[2]?.getDate()}</p >);
        }
    }
    const handleClubInfo = (club_id: string) =>{

    }
    const handleFollowClick = (event_id: string)=>{

    }
    // const handleAttendees = (event_id: string) =>{
    // implement after database is set
    // //search through the same event_id
    // //try to represent the list in a nice way
    // }
    
    return (
        <div>
            <div className="BackButton"></div>
            <div className="Event_Identity">
                <div className="Event_Title">
                    <h2>{event.title}</h2>
                </div>
                <div className="Event_Button">
                    {}
                </div> 
                <div className="Event_Club"></div>
                
            </div>
        <div className="Event_Info">
            <div className="Event_Description">
                <h3>Description</h3>
                <p>{event.summary}</p >
            </div>
            <div className="Event_Type">
                <h3>Type</h3>
                <p>{event.type}</p >
            </div>
            <div className="Event_Location">
                <h3>Location</h3>
                <p>{event.location}</p >
            </div>
            <div className="Event_Time">
                <h3>Date & Time</h3>
                {handleTime(event.begin_time, event.end_time)}
            </div>
            <div className="Event_Recurring">
                <h3>Recurring</h3>
                {handleRecur(event.recurrence)}
            </div>
            <div className="Event_Details">
                <h3>Details</h3>
                <p>{JSON.stringify(event.details)}</p >
            </div>
            <div className = "Event_Contact">
                <h3>Contact Information</h3>
                <p></p >
            </div>
            <div className="Event_Attendees"></div>
            
            <div></div>
        </div>
        </div>
    );
};

export default DetailedEvent;