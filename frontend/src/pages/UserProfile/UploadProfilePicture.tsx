import React, { useState, useContext } from 'react';
import { Button, Input, CircularProgress, Snackbar } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';


const UploadProfilePicture: React.FC = () => {
  const { token } = useContext(AuthContext);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);  
  const [success, setSuccess] = useState<boolean>(false); 

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    if (!token) {
      setError('Authorization token is missing');
      return;
    }

    setUploading(true);
    setError(null); 

    const formData = new FormData();
    formData.append('profile_picture', selectedFile);

    try {
        const response = await fetch('/myself/upload_profile_picture', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            body: formData,
          });

      if (response.status === 200) {
        setSuccess(true); 
      } else {
        setError('Failed to upload profile picture');
      }
    } catch (error) {
      setError('An error occurred while uploading the file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Input
        type="file"
        inputProps={{ accept: 'image/*' }} 
        onChange={handleFileChange}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={uploading || !selectedFile} 
      >
        {uploading ? <CircularProgress size={24} /> : 'Upload Profile Picture'}
      </Button>

      {error && (
        <Snackbar
          open={true}
          autoHideDuration={6000}
          message={error}
          onClose={() => setError(null)}
        />
      )}

      {success && (
        <Snackbar
          open={true}
          autoHideDuration={6000}
          message="Profile picture uploaded successfully!"
          onClose={() => setSuccess(false)}
        />
      )}
    </div>
  );
};

export default UploadProfilePicture;
