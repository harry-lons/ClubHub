import React, { useContext, useState,useEffect } from "react"
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { useParams, useNavigate } from "react-router-dom";
import { Event, Club, RSVP, User, RSVPInt} from "../../types/types";
import { exampleEvent, exampleUsers, emptyClub } from "../../constants/constants";
import { TextField, Button, MenuItem } from '@mui/material';
import "./DetailedEvent2.css"
import {AuthContext} from "../../context/AuthContext"
import { fetchEventById } from "../../utils/event-utils";
import { fetchClubById } from "../../utils/club-utils";
import { fetchRSVP, createRSVP, deleteRSVP, fetchCurrentAttendees } from "../../utils/RSVP-utils";
import exampleFlyer from "../../constants/flyer.jpg";
import {Alert, Box,ListItem,ListItemButton,ListItemText,AccordionDetails,Accordion,AccordionSummary} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { NavBar } from "../NavBar/NavBar";


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
    const [event, setEvent] = useState<Event> (exampleEvent);
    const [club, setClub] = useState<Club> (emptyClub);
    const [rsvp, setRsvp] = useState(false);
    const [attendees, setAttendees] = useState<User[]>(exampleUsers);


    useEffect(() => {
        if (!id) return;
        loadEvent();
        loadClub();
        if(which === "USER") loadRSVP();
        if(which==="CLUB") loadAttendees();
    }, [id]);
    

    const loadEvent = async () => {
        try {
            if (id) {
                const event_ = await fetchEventById(Number(id)); // `id` is already a string, so no conversion is needed
                console.log("Fetched event:", event_);
                setEvent(event_);
            } else {
                console.error("ID is undefined. Cannot fetch event.");
            }
        } catch (err: any) {
            console.error("Error loading event:", err.message);
        }
    };

    const loadClub = async () => {
        try {
            const club_ = await fetchClubById(event.club_id); 
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

    return(
        //  <div className="eventDetail-container">
        //      <div className="background"> </div>
           
        // </div>
            
        
    );
    
};


export default DetailedEvent;