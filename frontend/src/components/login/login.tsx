import React, { Component } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import './login.css';
import { Button, Snackbar, SnackbarCloseReason, SnackbarContent, TextField } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import bcrypt from "bcryptjs-react";

interface MyLoginProps {
  navigate: NavigateFunction;
}

interface MyLoginState {
  username: string;
  password: string;
  snackbarOpen: boolean;
  snackbarMessage: string;
  snackbarVariant: 'success' | 'error';
}

// Pre-hash the "admin" password
// Has to modified to use the actual password hash from the database
const adminHashedPassword = bcrypt.hashSync('admin', 10);

class MyLogin extends Component<MyLoginProps, MyLoginState> {
  constructor(props: MyLoginProps) {
    super(props);
    this.state = {
      username: '',
      password: '',
      snackbarOpen: false,
      snackbarMessage: '',
      snackbarVariant: 'success',
    };
  }

  handleLogin = async () => {
    const { username, password } = this.state;
    
    if (username === 'admin' && bcrypt.compareSync(password, adminHashedPassword)) {
      this.setState({
        snackbarOpen: true,
        snackbarMessage: 'Successfully logged in',
        snackbarVariant: 'success',
      });
      this.props.navigate('/customers');
    } else {
      this.setState({
        snackbarOpen: true,
        snackbarMessage: 'Invalid login or password',
        snackbarVariant: 'error',
      });
    }
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ [event.target.name]: event.target.value } as unknown as Pick<MyLoginState, keyof MyLoginState>);
  };

  handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      this.handleLogin();
    }
  };

  handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ snackbarOpen: false });
  };

  render() {
    const {  snackbarMessage, snackbarVariant } = this.state;

    return (
      <div className='container login'>
        <div className="header">
          <div className="title">
            <h1>Little Boutik</h1>
          </div>
        </div>
        <div className="inputs">
          <TextField id="outlined-basic" label="Login" variant="outlined" type='text' name='username'
            value={this.state.username} 
            onChange={this.handleChange} 
          />
          <TextField id="outlined-basic" label="Password" variant="outlined" type="password" name='password'
            value={this.state.password} 
            onChange={this.handleChange}
            onKeyDown={this.handleKeyPress} 
          />
          <Button variant="contained" onClick={this.handleLogin} startIcon={<LoginIcon />}>
            Enter
            </Button>
        </div>
        <Snackbar
        open={this.state.snackbarOpen}
        autoHideDuration={3000}
        onClose={this.handleSnackbarClose}
        message={this.state.snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <SnackbarContent
            message={snackbarMessage}
            style={{
              backgroundColor: snackbarVariant === 'success' ? 'green' : 'red',
            }}
          />
      </Snackbar>
      
      </div>
    );
  }
}

const MyLoginWithNavigate = () => {
  const navigate = useNavigate();
  return <MyLogin navigate={navigate} />;
};

export default MyLoginWithNavigate;