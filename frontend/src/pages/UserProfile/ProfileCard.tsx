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
import { AuthContext } from '../../context/AuthContext';
import { API_BASE_URL } from '../../constants/constants';
import { CardMedia } from '@mui/material';
import UploadProfilePicture from './UploadProfilePicture';

interface ProfileCardProps {
  user: User;
}


export const ProfileCard: React.FC<ProfileCardProps> = ({ user }) =>{ 
    const {token} = React.useContext(AuthContext);

    React.useEffect(() => {
        loadPic();
    }, []);

    const loadPic = async () => {
        try{
        const picture = await fetch (`${API_BASE_URL}/myself/profile_pictire`,{
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`, 
              'Content-Type': 'image/png', 
            },
          })
        }catch(err: any){

        }
    };

    return (
        <Card sx={{  width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {/* <CardMedia
                sx={{ height: 140 }}
                image={picture}
                title="green iguana"
            /> */}

            <UploadProfilePicture />

            <CardContent>
                <Typography gutterBottom variant="h5" component="div" textAlign="center">
                    {user.first_name} {user.last_name}
                </Typography>
                <Card 
                    sx={{ 
                        width: '100%', 
                        height: '100%', 
                        backgroundColor:'rgba(218, 198, 238, 0.6)', 
                        margin: '0 auto', 
                        display: 'flex', 
                        marginTop: 2 
                    }}
                >
                    <Typography 
                        variant="body2" 
                        sx={{ color: 'text.primary', textAlign: 'center', height: '80%', maxHeight: 600, overflowY: 'auto', padding: 1 }}
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
