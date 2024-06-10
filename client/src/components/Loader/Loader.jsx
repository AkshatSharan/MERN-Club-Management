import React from 'react'
import './loader.css'

function Loader() {
    return (
        <div style={{position:'absolute', top: '50%', left: '50%', translate: '-50%'}}>
            <span className="loader"></span>
        </div>
    )
}

export default Loader