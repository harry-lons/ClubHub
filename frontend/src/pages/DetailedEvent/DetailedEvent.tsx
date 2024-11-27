import React, { useContext, useState,useEffect } from "react"
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { useParams, useNavigate } from "react-router-dom";
import { Event, Club, RSVP, User, RSVPInt} from "../../types/types";
import { emptyEvent, exampleUsers, emptyClub } from "../../constants/constants";
import { TextField, Button, MenuItem } from '@mui/material';
import "./DetailedEvent.css"
import {AuthContext} from "../../context/AuthContext"
import { fetchEventById } from "../../utils/event-utils";
import { fetchClubById } from "../../utils/club-utils";
import { fetchRSVP, createRSVP, deleteRSVP, fetchCurrentAttendees } from "../../utils/RSVP-utils";
import exampleFlyer from "../../constants/flyer.jpg";
import {Alert, Box,ListItem,ListItemButton,ListItemText,AccordionDetails,Accordion,AccordionSummary} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


interface DetailedEventProps {
    which: string; 
}

const DetailedEvent: React.FC<DetailedEventProps> = ({ which }) => {
    const { id } = useParams<{ id: string }>();
    console.log("Web Page Event ID",id);
    const navigate = useNavigate();
    const context = useContext(AuthContext);
    useEffect(() => {
        console.log(context.token, context.accountType, context.id);
    }, []);
    const club_id = context.id;
    const token = context.token;
    const userId = context.id;
    const [event, setEvent] = useState<Event> (emptyEvent);
    const [club, setClub] = useState<Club> (emptyClub);
    const [rsvp, setRsvp] = useState(false);
    const [attendees, setAttendees] = useState<User[]>(exampleUsers);


    useEffect(() => {
        if (!id) return;
        const loadData = async () => {
            try {
                const event_clubId_ = await loadEvent();
                if (event_clubId_) {
                    await loadClub(event_clubId_);
                }
                if (which === "USER") {
                    loadRSVP();
                }
                if (which === "CLUB") {
                    loadAttendees();
                }
            } catch (err) {
                console.error("Error loading data:", err);
            }
        };
        loadData();
    }, [id]);

    const loadEvent = async () => {
        try {
            if (id) {
                const event_ = await fetchEventById(Number(id)); // `id` is already a string, so no conversion is needed
                console.log("Fetched event:", event_);
                setEvent(event_);
                return event_.club_id;
            } else {
                console.error("ID is undefined. Cannot fetch event.");
            }
        } catch (err: any) {
            console.error("Error loading event:", err.message);
        }
    };

    const loadClub = async (clubId: string) => {
        try {
            const club_ = await fetchClubById(clubId); 
            setClub(club_);
        } catch (err: any) {
            console.error("Error loading club:", err.message);
        }
    };
    //load all the RSVP of the user 
    const loadRSVP = async () => {
        try {
            // ! bug RSVPList is undefined
            // ! bug RSVPList is undefined
            const RSVPList = await fetchRSVP(token); // Convert id to a number
            console.log("Detail Page RSVP list",RSVPList);
            RSVPList.forEach((rl)=> {if(rl.event_id === id){setRsvp(true);}});
        } catch (err: any) {
            console.error("Error loading RSVP:", err.message);
        }
    };
    //load all the RSVP for the event
    const loadAttendees = async ()=>{
        try{
            const AttendeeList = await fetchCurrentAttendees(Number(event.id));
            setAttendees(AttendeeList);
        }catch(err:any){
            console.error("Error loading Attendee List:", err.message);
        }
    }

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
    const handleRecur = (event: Event)=>{
        if(event.recurrence){
            return(<p>Yes. Recur {recurrenceDescription(event.recurrence_type as number)}. End Date {event.stop_date?.getFullYear()}-{event.stop_date?.getMonth()}-{event.stop_date?.getDate()}</p >);
        }else{
            return (<p>Not a recurring event.</p >);
        }
    }
    function renderRow(props: ListChildComponentProps) {
        const { index, style } = props;
      
        // Ensure we don't go out of bounds
        const user = attendees[index] || { first_name: 'Unknown', last_name: 'User' };
      
        return (
          <ListItem style={style} key={index} component="div" disablePadding>
            <ListItemButton>
              <ListItemText primary={`${user.first_name} ${user.last_name}`} />
            </ListItemButton>
          </ListItem>
        );
      }
      
      const VirtualizedAccordion=()=> {
        return (
          <Accordion sx={{width: 600,marginTop:3}}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <ListItemText primary="Attendee List" />
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ width: 600, height: 400, maxWidth: 360, bgcolor: 'background.paper' }}>
                <FixedSizeList
                  height={400}
                  width={570}
                  itemSize={46}
                  itemCount={attendees.length}
                  overscanCount={5}
                >
                  {renderRow}
                </FixedSizeList>
              </Box>
            </AccordionDetails>
          </Accordion>
        );
      }



    const BackButton: React.FC = () => {
        const handleBack = () => {
            navigate(-1); // Navigates to the previous page
        };

        return (
        <button onClick={handleBack} className="back-button">
            &lt;
        </button>
        );
    };

    const RSVPButton: React.FC = () => {
        const [alert, setAlert] = useState<{ message: string; severity: 'success' | 'error' | null }>({
            message: '',
            severity: null,
        });
    
        const [isRSVPing, setIsRSVPing] = useState(false); // Prevent race conditions
        console.info("RSVP status:", rsvp);
    
        const toggleRSVP = async () => {
            if (isRSVPing) return; // Prevent multiple toggles at once
            setIsRSVPing(true);
    
            if (!rsvp) {
                const newRSVP: RSVPInt = {
                    user_id: userId,
                    event_id: Number(event.id),
                };
    
                const successful = await createRSVP(token, newRSVP);
    
                if (successful) {
                    setRsvp(true); // Update RSVP state
                    setAlert({
                        message: "You have successfully RSVPed to this event! Looking forward to seeing you there!",
                        severity: 'success',
                    });
                } else {
                    setAlert({
                        message: "RSVP unsuccessful. Please contact the webpage administrator.",
                        severity: 'error',
                    });
                }
            } else {
                const successful = await deleteRSVP(token, event.id);
    
                if (successful) {
                    setRsvp(false); // Update RSVP state
                    setAlert({
                        message: "You have successfully canceled your RSVP to this event!",
                        severity: 'success',
                    });
                } else {
                    setAlert({
                        message: "Cancel RSVP unsuccessful. Please contact the webpage administrator.",
                        severity: 'error',
                    });
                }
            }
    
            setIsRSVPing(false); // Allow toggling again
    
            // Automatically hide the alert after 3 seconds
            setTimeout(() => {
                setAlert({ message: '', severity: null });
            }, 3000);
        };
    
        return (
            <>
                {alert.severity && (
                    <Alert
                        icon={<CheckIcon fontSize="inherit" />}
                        severity={alert.severity}
                        onClose={() => setAlert({ message: '', severity: null })} // Allow manual dismissal
                        style={{ marginBottom: '16px' }}
                    >
                        {alert.message}
                    </Alert>
                )}
    
                <Button className="rsvp-button" variant="contained" onClick={toggleRSVP}>
                    {rsvp ? 'Cancel RSVP' : 'RSVP'}
                </Button>
            </>
        );
    };
    

    const EditButton : React.FC = () => {
        const handleEdit = () => {
            navigate(`/club/editEvent/${id}`);
        }

        return (
            <Button className="edit-button" variant="contained" onClick={handleEdit}>
                Edit
            </Button>
        );
    }

    const eventTypes = [
        { value: 'social', label: 'Social Event' },
        { value: 'workshop', label: 'Workshop' },
        { value: 'networking', label: 'Networking Event' },
        { value: 'fundraiser', label: 'Fundraiser' },
        { value: 'competition', label: 'Competition' },
        { value: 'seminar', label: 'Educational Seminar' },
        { value: 'communityService', label: 'Community Service' },
        { value: 'cultural', label: 'Cultural Event' },
        { value: 'recreational', label: 'Recreational Outing' },
        { value: 'generalMeeting', label: 'General Meeting' },
        { value: 'academic', label: 'Academic' },
        { value: 'orientation', label: 'Orientation/Welcome Event' },
        { value: 'careerDevelopment', label: 'Career Development' },
        { value: 'volunteering', label: 'Volunteering' },
        { value: 'panel', label: 'Panel Discussion' },
        { value: 'celebration', label: 'Celebration/Festival' },
        { value: 'sports', label: 'Sports Event' },
        { value: 'arts', label: 'Arts & Performance' },
        { value: 'training', label: 'Training Session' },
        { value: 'research', label: 'Research Presentation' }
    ];
    
    return (
        <div id="event-detail-container">
            <div className="event-detail-header">
                <BackButton />
            </div>
            <div className="event-identity-container">
                <div className="event-title-container">
                        <div className="event-detail-title">
                            <h2>{event.title}</h2>
                        </div>
                        {
                            which == "CLUB" ?
                            <EditButton /> :
                            which == "USER" ?
                            <RSVPButton /> :
                            null
                        }
                </div>
                <div className="event-detail-club" style={{ display: 'flex', alignItems: 'center' }}>
                    <p style={{ display: 'inline-block',marginRight: '5px' }}>From  </p>
                    <p className="event-detail-club-name-text" onClick = {()=>navigate(`/clubDetail/${club.id}`)}>{club.name}</p>
                </div>
                
            </div>
            <div className="event-info-container">
                <div className="event-description">
                    <h3>Description</h3>
                    <p>{event.summary}</p >
                </div>
                <div className="event-detail-type">
                    <h3>Type</h3>
                    <p>{event.type
                        .map(typeValue => {
                            const matchingType = eventTypes.find(type => type.value === typeValue);
                            return matchingType?.label;
                        })
                        .filter(Boolean)
                        .join(', ')}</p >
                </div>
                <div className="event-detail-location">
                    <h3>Location</h3>
                    <p>{event.location}</p >
                </div>
                <div className="event-detail-time">
                    <h3>Date & Time</h3>
                    {handleTime(event.begin_time, event.end_time)}
                </div>
                
                <div className="event-detail-capacity">
                    <h3>Capacity</h3>
                    <p>{event.capacity ? event.capacity.toString() : "No Capacity"}</p >
                </div>
                <div className="event-recurring">
                    <h3>Recurring</h3>
                    {handleRecur(event)}
                </div>
                {(which === "CLUB") && 
                <div className = "event-num-attendees">
                    <h3>Attendees</h3>
                    <p>Number of Current Attendees: {attendees.length}</p>
                    <VirtualizedAccordion />
                </div>}
                <div className="event-detail-pictures">
                    <h3>Pictures</h3>
                    <img src={exampleFlyer} className="event-picture"/>
                </div>
                <div className = "event-detail-contact">
                    <h3>Contact Information</h3>
                    {Array.isArray(club.contact_email) ? (
                        club.contact_email.map((email, index) => (
                        <p key={index}>{email}</p>
                        ))
                    ) : (
                    <p>{club.contact_email}</p>
                    )}
                </div>
                <div className="event-detail-attendees"></div>
                
                <div></div>
            </div>
        </div>
    );
    };


export default DetailedEvent;