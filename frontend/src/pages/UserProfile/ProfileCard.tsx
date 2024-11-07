import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { User } from '../../types/types';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
interface ProfileCardProps {
  user: User;
}
export const ProfileCard: React.FC<ProfileCardProps> = ({ user }) =>{  
    return (
        <Card sx={{ width: 350, height: 700, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <AccountCircleIcon 
                sx={{ 
                    fontSize: 260, 
                    color:  'gray',
                    margin : '8px auto', 
                    marginTop: '8px auto',
                    marginBottom: '-16px'
                }} 
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div" textAlign="center">
                    {user.first_name} {user.last_name}
                </Typography>
                <Card 
                    sx={{ 
                        width: 300, 
                        height: 200, 
                        backgroundColor:'rgba(218, 198, 238, 0.6)', 
                        margin: '0 auto', 
                        display: 'flex', 
                        marginTop: 2 
                    }}
                >
                    <Typography 
                        variant="body2" 
                        sx={{ color: 'text.primary', textAlign: 'center', maxHeight: 180, overflowY: 'auto', padding: 1 }}
                    >
                        {/* Add description here */}
                        User Description
                    </Typography>
                </Card>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', paddingBottom: 3 }}>
                <FormGroup>
                    <FormControlLabel control={<Switch color="secondary" />} label="Make My Account Private" />
                    <FormControlLabel control={<Switch defaultChecked color="secondary" />} label="Show My Events To Others" />
                </FormGroup>
            </CardActions>
        </Card>
    );
};
