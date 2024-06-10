import React from 'react'
import './loader.css'

function Loader() {
  return (
    <div style={{ position: 'absolute', top: '50%', left: '50%', translate: '-50%' }}>
      <div class="loader"></div>
    </div>
  )
}

export default Loader