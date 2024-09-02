import React, {useEffect} from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../utils/auth';

export default function Logout() {
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    navigate('/login');
  };

  useEffect(() => {
    if (location.pathname === "/logout") {
      logout(); 
    }
  }, [location.pathname]);

  return (
    <div style={{ overflow: 'hidden', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Card style={{ maxWidth: 400 }}>
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CheckCircleIcon style={{ fontSize: 80, color: 'green' }} />
            <h2>Successfully Logged Out</h2>
            <p>Login again to access the page</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
            <Button variant="contained" color="primary" onClick={handleGoToLogin}>
              Go to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
