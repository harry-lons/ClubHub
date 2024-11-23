import React, { useContext, useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom";
import { Event, EventType } from "../../types/types";
import { Club } from "../../types/types";
import DatePicker from "react-datepicker";
import { DateField, DateTimePicker} from "@mui/x-date-pickers";
import { TextField, Button, MenuItem, Box, Chip } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from "dayjs";
import { FormControl,Switch,FormGroup,FormControlLabel,InputLabel,OutlinedInput,ListItemText,Checkbox } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import "react-datepicker/dist/react-datepicker.css";
import { createEvent } from "../../utils/event-utils";
import {AuthContext} from "../../context/AuthContext"


export const AddEventForm= ()=>{

    const context = useContext(AuthContext);
    useEffect(() => {
        console.log(context.token, context.accountType, context.id);
    }, []);
    const club_id = context.id;
    const token = context.token;
    const navigate = useNavigate();
    const BackButton: React.FC = () => {
        const handleBack = () => { navigate(-1); };
        // Navigates to the previous page
        return (<button onClick={handleBack} className="back-button">&lt;</button>);
    };

    const [formData, setFormData] = useState({
        title: "",
        location: "",
        begin_time: new Date(),
        end_time: new Date(),
        summary: "",
        type: [] as EventType[],
        recur: false,
        frequency: -1,
        stop_date: new Date(),
        capacity:null
	    // pictures: { [key: string]: string };
    });

    const [errors, setErrors] = useState({
        title: false,
        location: false,
        begin_time: false,
        end_time: false,
        stop_date: false,
    });

    const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        const newErrors = {
            title: formData.title.trim() === '',
            location: formData.location.trim() === '',
            begin_time: false,
            end_time: formData.begin_time > formData.end_time,
            stop_date: false,
        };
        setErrors(newErrors);

        if (!Object.values(newErrors).includes(true)) {
            // TODO:
            // navigate to club-side edit event page
            // club id should be a context
            const newEvent: Event =
            {
                id: `${formData.title}-${Date.now()}`,
                title: formData.title,
                club_id : "CLUB ID PLACE HOLDER",
                location: formData.location,
                begin_time: formData.begin_time,
                end_time: formData.end_time,
                recurrence: formData.recur,
                recurrence_type: formData.frequency,
                stop_date: formData.stop_date,
                summary: formData.summary,
                pictures: { },
                type: formData.type,
                capacity:formData.capacity||null
            };
            const eventID = createEvent(token, newEvent);
            navigate(`/club/events/${eventID}`);
        }
    
        const newFormData = {
            title: "",
            location: "",
            begin_time: new Date(),
            end_time: new Date(),
            summary: "",
            type: [] as EventType[],
            recur: false,
            frequency: -1,
            stop_date: new Date(),
            capacity: null
        };
        setFormData(newFormData);
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

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleTypeChange = (event: SelectChangeEvent<string[]>) => {
        const {
            target: { value },
        } = event;
        const valuesArray = typeof value === 'string' ? value.split(',') : value;
        setFormData({
            ...formData,
            type: valuesArray.map(item => item.trim() as EventType)
        });
    };
    const handleBeginTimeChange = (date: Dayjs) => {
        setFormData({...formData, begin_time: date.toDate(),});
        if (date.isAfter(formData.end_time)) {
            setFormData({...formData, end_time: date.add(1,'hour').toDate(),});
            // Reset end time if it’s before the new begin time
        }
    };
    
    const handleEndTimeChange = (date: Dayjs) => {  
        setFormData({...formData, end_time: date.toDate(),});
    };

    const handleStopDateChange = (date: Dayjs) => {  
        setFormData({...formData, stop_date: date.toDate(),});
    };
    
    // for type multiselect
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
    PaperProps: {
        style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
        },
    },
    };
    
    return(
        <div id="event-detail-container">
            <div className="event-detail-header">
                <BackButton />
            </div>
            <div className="event-info-container">
                <div className = "add-event-title">
                    <h3>Event Title</h3>
                    <TextField
                        type="text"
                        className="form-control"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        error={errors.title}
                        helperText={errors.title ? 'Event title is required' : ''}
                        sx={{ width: '24ch' }}
                    ></TextField>
                </div>
                <div className="add-event-description">
                    <h3>Event Summary</h3>
                        <TextField
                        multiline
                        rows={4}
                        type="text"
                        className="form-control"
                        name="summary"
                        value={formData.summary}
                        onChange={handleChange}
                        sx={{ width: '36ch' }}
                    ></TextField>
                </div>
                <div className="add-event-type">
                    <h3>Event Type</h3>
                    <FormControl sx={{ width: '36ch' }}>
                        <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        value={formData.type}
                        onChange={handleTypeChange}
                        input={<OutlinedInput/>}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} />
                                ))}
                            </Box>
                        )}
                        MenuProps={MenuProps}
                        >
                        {eventTypes.map((t) => (
                            <MenuItem key={t.label} value={t.label}>
                            <Checkbox checked={formData.type.includes(t.label as EventType)} />
                            <ListItemText primary={t.label} />
                            </MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                </div>
                <div className="add-event-location">
                    <h3>Location</h3>
                    <TextField
                        type="text"
                        className="form-control"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        error={errors.location}
                        helperText={errors.location ? 'Event location is required' : ''}
                        sx={{ width: '24ch' }}
                    ></TextField>
                </div>
                <div className="add-event-time">
                        <h3>Date & Time</h3>
                        <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                        <DateTimePicker label="Begin Time" value={dayjs(formData.begin_time)}
                            onChange={(newValue) => newValue&&handleBeginTimeChange(newValue)} 
                            sx={{ width: '24ch' }}/>
                        
                        <DateTimePicker label="End Time" value={dayjs(formData.end_time)}
                            onChange={(newValue) => newValue&&handleEndTimeChange(newValue)}
                            sx={{ width: '24ch' }}
                            minDateTime={dayjs(formData.begin_time)}/>
                        </div>
                </div>
                <div className="add-event-recurring">
                    <h3>Recurring</h3>
                    <FormGroup>
                        <FormControlLabel control={<Switch color="secondary" onChange={()=>(setFormData({...formData, recur: !formData.recur}))}/>} label="Event Recurring" />
                    </FormGroup>
                    {formData.recur && 
                    <div style={{ display: "flex", gap: "16px", alignItems: "center", marginTop: "16px" }}>
                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel id="demo-simple-select-label">Frequency</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                label="Frequency"
                                value={formData.frequency}
                                onChange={(e) => setFormData({ ...formData, frequency: Number(e.target.value) })}
                                variant="outlined"
                                style={{ width: '200px' }}
                            >
                                <MenuItem value="" disabled>Select Frequency</MenuItem>
                                <MenuItem value="0">Weekly</MenuItem>
                                <MenuItem value="1">Biweek</MenuItem>
                                <MenuItem value="2">Monthly</MenuItem>
                            </Select>
                        </FormControl>
                        <DateTimePicker views={['year', 'month', 'day']}
                            label="Stop Date" value={dayjs(formData.stop_date)}
                            onChange={(newValue) => newValue&&handleStopDateChange(newValue)}
                            sx={{ width: '24ch' }}
                            minDateTime={dayjs(formData.begin_time)}/>
                    </div>}
                </div>
                <div className="add-event-capacity">
                    <h3>Capacity</h3>
                    <TextField
                        type="text"
                        className="form-control"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                        sx={{ width: '24ch' }}
                    ></TextField>
                </div>
                {/* Pictures */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", marginTop: "24px" }}>
                    <Button variant="contained" style={{ backgroundColor: '#43BD28', color: '#FFFFFF' }} onClick={handleSubmit}>Submit Event</Button>
                </div>
                
                <div></div>
            </div>
        </div>
    );
}