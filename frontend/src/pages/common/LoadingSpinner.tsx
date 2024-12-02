import React from 'react';
import { ClipLoader } from 'react-spinners';

const LoadingSpinner = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
        }}>
            <ClipLoader size={50} color="#36d7b7" />
            <p style={{
                marginTop: '20px',
                fontSize: '18px',
                color: '#eee',
            }}>Loading...</p>
        </div>
    );
};

export default LoadingSpinner;
