import React from 'react'
import './loader.css'

function Loader({ message }) {
  return (
    <div className='loader-container'>
      <div className="loader"></div>
      <h2 style={{marginTop: 0, fontSize: '100%'}}>{message}</h2>
    </div>
  )
}

export default Loader