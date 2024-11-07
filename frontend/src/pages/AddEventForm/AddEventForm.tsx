import React, { useContext, useState } from "react"
import { useParams, useNavigate } from "react-router-dom";
import { Event } from "../../types/types";
import { Club } from "../../types/types";
import DatePicker from "react-datepicker";
import { DateField, DateTimePicker} from "@mui/x-date-pickers";
import { TextField, Button, MenuItem } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from "dayjs";
import { FormControl,Switch,FormGroup,FormControlLabel,InputLabel,Select } from '@mui/material';
import "react-datepicker/dist/react-datepicker.css";


export const AddEventForm= ()=>{
    const [title,setTitle] = useState("");
    const [location,setLocation] = useState("");
    const [end_time,setEnd_time] = useState<Date>(new Date());
    const [begin_time,setBegin_time] = useState<Date>(new Date());
    const [summary,setSummary] = useState("");
    const [type,setType] = useState("");
    const [recur,setRecur] = useState(false);
    const [frequency,setFrequency] = useState(-1);
    const [stop_date, setStop_date] = useState<Date>(new Date());
    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        //pass params back to the backed API
        //Alert 1. Title & Location & Time cannot be empty
        //Alert if is recurrence, Stop time > endtime  
        //navigate to club-side edit event page
        //club id should be a context
	//recurrence: [ boolean, number, Date|null ];
	//pictures: { [key: string]: string };
	//type: string;
        setTitle("");
        //do something with the club id
        //check if the stop time is valid (after the end time and begin time)
        setSummary("");
        
        
      };
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
        { value: 'academic', label: 'Academic' }
    ];
    const handleChange = (value: string) => {
        setType(value);
      };
    const navigate = useNavigate();
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
        const handleBeginTimeChange = (date: Dayjs) => {
            
                setBegin_time(date.toDate());
                if (date.isAfter(end_time)) {
                    setEnd_time(date.add(1,'hour').toDate()); // Reset end time if it’s before the new begin time
                }

        };
      
        const handleEndTimeChange = (date: Dayjs) => {
         
                setEnd_time(date.toDate());
        
        };
    
    
    return(
        
        <div id="event-detail-container">
        <div className="event-detail-header">
            <BackButton />
        </div>
        <div className="event-info-container">
            <div className = "event-title">
                <h3>Title</h3>
                    <TextField
                    required type="text"
                    className="form-control"
                    id="title"
                    value={title}
                    onChange={(e)=>(setTitle(e.target.value))}
                    ></TextField>
            </div>
            <div className="event-description">
                <h3>Description</h3>
                {/* Make the Description Container Bigger! */}
                <TextField required type="text"
                className="form-control"
                id="description"
                value={summary}
                onChange={(e)=>(setSummary(e.target.value))}
                ></TextField>
            </div>
            <div className="event-type">
                <h3>Event Type</h3>
                <h5>Please select the one that most fits this event</h5>
                {eventTypes.map((eventType) => (
                    <button
                        key={eventType.value}
                        onClick={() => handleChange(eventType.value)}
                        style={{
                        padding: '8px 16px',
                        margin: '4px',
                        borderRadius: '5px',
                        border: type === eventType.value ? '2px solid #007BFF' : '2px solid #ccc',
                        backgroundColor: type === eventType.value ? '#007BFF' : '#f0f0f0',
                        color: type === eventType.value ? '#fff' : '#333',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s, border-color 0.3s',
                        }}
                    >
                    {eventType.label}
                    </button>
                ))}
            </div>
            <div className="event-location">
                <h3>Location</h3>
                <TextField
                    required type="text"
                    className="form-control"
                    id="location"
                    value={location}
                    onChange={(e)=>(setLocation(e.target.value))}
                ></TextField>
            </div>
            <div className="event-time">
                    <h3>Date & Time</h3>
                    <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                    <DateTimePicker label="Begin Time" value={dayjs(begin_time)}
                        onChange={(newValue) => newValue&&handleBeginTimeChange(newValue)} />
 
                    {/* <h5>Please choose End Time of the event</h5> */}
                    
                    <DateTimePicker label="End Time" value={dayjs(end_time)}
                        onChange={(newValue) => newValue&&handleEndTimeChange(newValue)} />
                        {/* Need to enable set the minTime and minDate of the End_time */}
                    </div>
            </div>
            <div className="event-recurring">
                <h3>Recurring</h3>
                <FormGroup>
                    <FormControlLabel control={<Switch color="secondary" onChange={()=>(setRecur(!recur))}/>} label="Event Recurring" />
                </FormGroup>
                {recur && 
                <div style={{ display: "flex", gap: "16px", alignItems: "center", marginTop: "16px" }}>
                    <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="demo-simple-select-filled-label">Frequency</InputLabel>
                        <Select
                            value={frequency}
                            onChange={(e) => setFrequency(Number(e.target.value))}
                            displayEmpty
                            variant="outlined"
                            style={{ width: '200px' }}
                        >
                            <MenuItem value="" disabled>Select Frequency</MenuItem>
                            <MenuItem value="0">Weekly</MenuItem>
                            <MenuItem value="1">Every Other Week</MenuItem>
                            <MenuItem value="2">Monthly</MenuItem>
                        </Select>
                    </FormControl>
                    <DateField 
                        label="Stop Date" 
                        value={dayjs(stop_date)}
                        onChange={(newValue) => {if (newValue) setStop_date(newValue.toDate());}}/>
            </div>}
            </div>
            {/* Pictures */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", marginTop: "24px" }}>
                <Button variant="contained" style={{ backgroundColor: '#43BD28', color: '#FFFFFF' }} onClick={()=>onSubmit}>Submit Event</Button>
            </div>
            
            <div></div>
        </div>
        
    </div>
    
    );
}