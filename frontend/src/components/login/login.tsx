import React, { Component } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import './login.css';
import { Button, TextField } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';

interface MyLoginProps {
  navigate: NavigateFunction;
}

interface MyLoginState {
  username: string;
}

class MyLogin extends Component<MyLoginProps, MyLoginState> {
  constructor(props: MyLoginProps) {
    super(props);
    this.state = {
      username: '',
    };
  }

  handleLogin = () => {
    this.props.navigate('/customers');
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ username: event.target.value });
  };

  render() {
    return (
      <div className='container login'>
        <div className="header">
          <div className="title">
            <h1>Little Boutik</h1>
          </div>
        </div>
        <div className="inputs">
          <TextField id="outlined-basic" label="Login" variant="outlined" 
            value={this.state.username} 
            onChange={this.handleChange} 
          />
          <Button variant="contained" onClick={this.handleLogin} startIcon={<LoginIcon />}>
            Enter
            </Button>
        </div>
      </div>
    );
  }
}

const MyLoginWithNavigate = () => {
  const navigate = useNavigate();
  return <MyLogin navigate={navigate} />;
};

export default MyLoginWithNavigate;