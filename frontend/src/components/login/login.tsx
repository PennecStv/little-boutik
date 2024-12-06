import React, { Component } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import './login.css';

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
          <div className="text">
            <h1>Little Boutik</h1>
          </div>
        </div>
        <div className="inputs">
          <input 
            type="text" 
            placeholder="Username" 
            value={this.state.username} 
            onChange={this.handleChange} 
          />
          <button onClick={this.handleLogin}>Enter</button>
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