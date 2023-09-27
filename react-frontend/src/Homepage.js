import React, { useState, useEffect } from 'react';
import FileList from './fileList';
import Footerlayout from './Footer_layout';
import Headerlogo from './headerlogo';
import './Homepage.css'
import { Layout, } from 'antd'; // Import Table, Button, and Popconfirm from antd
import Logo from './Logo';
import imgsrc from './logout.png';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import {useNavigate, useLocation } from 'react-router-dom';

const { Header, Content, Sider } = Layout;


const siderStyle = {
  background: '#2e266d',
  color: '#fff',
  flex: 'none',
  width: '250px',
};

const headerStyle = {
  background: '#f5f5f5',
  color: '#fff',
  height: '80px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 20px',
};

const userImageStyle = {
  width: '40px',
  height: '40px',
  objectFit: 'cover',
  borderRadius: '50%',
};

const logoutImageStyle = {
  cursor: 'pointer',
  width: '25px',
  height: '25px',
  marginTop: '37px',
};

const usernameStyle = {
  display: 'inline',
  marginRight: '8px',
  fontSize: '20px',
  fontStyle: 'normal',
  marginTop: '15px',
};


function Homepage() {
  // Access userData from location.state
  const [userImage, setUserImage] = useState('');
   // To track uploaded files
  const navigate = useNavigate();
  const { userData } = useLocation().state;
  const {selectedFilelist} = useLocation().state;
  const [userfiles, setUserFiles] = useState([]); 
  const username = userData.name
  console.log(userData)

  useEffect(() => {
    const storedUserImage = localStorage.getItem('userImage');
    if (storedUserImage) {
      setUserImage(storedUserImage);
    }
  }, []);

  


  const handleLogout = () => {
    confirmAlert({
      title: 'Confirm Logout',
      message: 'Do you want to logout?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            localStorage.removeItem('username');
            localStorage.removeItem('userImage');
            navigate('/'); // Redirect to the login page
          },
        },
        {
          label: 'No',
          onClick: () => {
            // User canceled logout, do nothing
          },
        },
      ],
    });
  };
  const handleDataFromChild = (data) => {
    console.log(data)
    setUserFiles(data)
  };


  return (
    <Layout style={{ minHeight: '100vh' }}>
      
      <Sider style={siderStyle}>  
        <Logo />
        <FileList userData={userData} filelistselected ={handleDataFromChild}/>
      </Sider>
      <Layout>
        <Header style={headerStyle}>
          <Headerlogo />
          <div
            style={{
              display: 'flex',
              color: '#04507f',
              fontSize: '20px',
              marginRight: '10px',
            }}
          >
            {userImage && <img src={userImage} alt="User" style={userImageStyle} />}
            {username && <p style={usernameStyle}>{username}</p>}
            <img
              src={imgsrc}
              alt="Logout"
              style={logoutImageStyle}
              onClick={handleLogout}
            />
          </div>
        </Header>
        <Layout>
          <Content className="site-layout" style={{ padding: '0 20px', marginTop: '20px' }}>
            
          </Content>
          <Footerlayout  userData={userData} Files={userfiles}/>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default Homepage;