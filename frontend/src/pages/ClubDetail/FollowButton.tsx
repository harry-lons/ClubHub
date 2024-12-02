import React, { useContext, useState, useEffect } from "react"
import { Follow } from "../../types/types";
import { createFollow, deleteFollow, fetchFollowers, fetchFollowStatus } from "../../utils/follow-utils";
import { AuthContext } from "../../context/AuthContext"
import CheckIcon from '@mui/icons-material/Check';
import { Alert, Button } from '@mui/material';

interface FollowButtonProps {
    follow: boolean;
    setFollow: (value: boolean) => void;
    club_id: string;
    showMessages: boolean;
}
const FollowButton: React.FC<FollowButtonProps> = ({ follow, setFollow, club_id, showMessages }) => {
    const context = useContext(AuthContext);
    const token = context.token || "";
    const [alert, setAlert] = useState<{ message: string; severity: 'success' | 'error' | null }>({
        message: '',
        severity: null,
    });
    const toggleFollow = async () => {
        setFollow(!follow);
        if (!follow) {
            const newFollow: Follow = {
                user_id: context.id,
                club_id: club_id as string,
            };

            const successful = await createFollow(token, newFollow);
            console.log("followed: ", successful)
            if (successful) {
                setAlert({
                    message: "You have successfully followed this club! We're very happy to have you here!",
                    severity: 'success',
                });
            } else {
                setAlert({
                    message: 'Follow action unsuccessful. Please contact the webpage administrator.',
                    severity: 'error',
                });
            }
        } else {
            const successful = await deleteFollow(token, club_id as string);
            console.log("unfollowed: ", successful)
            if (successful) {
                setAlert({
                    message: 'You have successfully unfollowed this club!',
                    severity: 'success',
                });
            } else {
                setAlert({
                    message: 'Unfollow action unsuccessful. Please contact the webpage administrator.',
                    severity: 'error',
                });
            }
        }
        console.log(alert.message)
        // Automatically hide the alert after 3 seconds
        setTimeout(() => {
            setAlert({ message: '', severity: null });
        }, 3000); // 3000ms = 3 seconds
    }

    return (
        <>
            {alert.severity && showMessages && (
                <Alert
                    icon={<CheckIcon fontSize="inherit" />}
                    severity={alert.severity}
                    onClose={() => setAlert({ message: '', severity: null })} // Allow closing the alert
                >
                    {alert.message}
                </Alert>
            )}
            <Button className="follow-button" variant="contained" onClick={toggleFollow}>
                {follow ? 'unFOLLOW' : 'FOLLOW'}
            </Button>
        </>
    );
};

export default FollowButton;