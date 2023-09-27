import React, { useState } from 'react';
import './style.css'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import imgsrc from './AQE.png'

function Login() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    // const [userData, setUserData] = useState(null);

    const navigate = useNavigate();

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    function callApi(username, password) {
        axios.post(`http://localhost:8000/login/`, formData)
            .then((response) => {
                console.log('Response:', response.data);

                // setUserData(response.data);

                navigate('/homepage', { state: { userData: response.data } });
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
    return (
        <div className='login template d-flex flex-column align-items-center vh-100' style={{ backgroundColor: '#2e266d' }}>
            <div className='image-container mt-3'>
                <img src={imgsrc} alt="Description of the image" style={{ width: '500px', height: '300px' }} />
            </div>
            <div className='form_container p-5 rounded bg-white mt-4'>
                <form>
                    <h3 className='text-center'>Sign In</h3>
                    <div className='mb-2'>
                        <label htmlFor='username'>UserName</label>
                        <input type='text' name='username' placeholder='Enter Username' className='form-control' onChange={handleInputChange} />
                    </div>
                    <div className='mb-2'>
                        <label htmlFor='password'>Password</label>
                        <input type='password' name='password' placeholder='Enter Password' className='form-control' onChange={handleInputChange} />
                    </div>
                    <div className='mb-2'>
                        <input type='checkbox' className='custom-control custom-checkbox' id='check' />
                        <label htmlFor='check' className='custom-input-label ms-2'>Remember me</label>
                    </div>
                    <div className='d-grid'>
                        <button type='button' className='btn btn-primary' onClick={() => callApi(formData.username, formData.password)}>Sign In</button>
                    </div>
                    <p className='text-end mt-2'>
                        <Link to="/signup" className='ms-2'>Sign Up</Link>
                    </p>
                </form>
            </div>
        </div>

    )
}

export default Login