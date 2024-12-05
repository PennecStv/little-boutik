import React from 'react'
import './login.css'

export const MyLogin = () => {
  return (
    <div className='container login'>
        <div className="header">
            <div className="text">
                <h1>Little Boutik</h1>
            </div>
        </div>
        <div className="inputs">
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="Password" />
            <button>Login</button>
        </div>
    </div>
  )
}

export default MyLogin