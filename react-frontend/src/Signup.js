
import React, { useState } from 'react';
import './style.css'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import imgsrc from './AQE.png'

function Signup() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    function callApi(formData) {
        console.log(formData)
        axios.post(`http://localhost:8000/register/`, formData)
            .then((response) => {
                console.log('Response:', response.data);
                navigate("/")
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
    return (
      <div className='signup template d-flex flex-column align-items-center vh-100' style={{ backgroundColor: '#2e266d' }}>
      <div className='image-container mt-5'>
        <img src={imgsrc} alt="Description of the image" style={{ width: '500px', height: '300px' ,marginTop : '-50px' }} />
      </div>
    
      <div className='form_container p-5 rounded bg-white'>
        <form>
          <h3 className='text-center'>Sign Up</h3>
          <div className='mb-2'>
            <label htmlFor='username'>UserName</label>
            <input type='text' name='username' placeholder='Enter Username' className='form-control' onChange={handleInputChange} />
          </div>
          <div className='mb-2'>
            <label htmlFor='email'>Email</label>
            <input type='email' name='email' placeholder='Enter Email' className='form-control' onChange={handleInputChange} />
          </div>
          <div className='mb-2'>
            <label htmlFor='password'>Password</label>
            <input type='password' name='password' placeholder='Enter Password' className='form-control' onChange={handleInputChange} />
          </div>
          <div className='d-grid mt-2'>
            <button type='button' className='btn btn-primary' onClick={() => callApi(formData)}>Sign Up</button>
          </div>
          <p className='text-end mt-2'>
            Already Registered <Link to="/" className='ms-2'>Sign In</Link>
          </p>
        </form>
      </div>
    </div>
    
    
    )
}

export default Signup