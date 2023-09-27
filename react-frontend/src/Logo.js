import React from 'react'
import imageSrc from './logo.png';

function logo() {
  return (
    <div>
     <img src={imageSrc} alt="Description of the image" style={{width: '75px',marginLeft: '60px',marginTop:'20px'}}/>
    </div>
  )
}

export default logo