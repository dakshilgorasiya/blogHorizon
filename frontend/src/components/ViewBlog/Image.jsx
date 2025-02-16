import React from 'react'

function Image({imageLink}) {
  return (
    <>
      <div>
        <img src={imageLink} alt="image" className="w-full max-h-96 rounded-lg" />
      </div>
    </>
  )
}

export default Image