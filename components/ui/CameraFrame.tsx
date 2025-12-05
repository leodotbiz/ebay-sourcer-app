import React from 'react'

export default function CameraFrame() {
  return (
    <div className="relative w-full max-w-sm mx-auto aspect-[3/4] border-2 border-white rounded-lg">
      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white rounded-br-lg" />
      
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Camera Preview</p>
      </div>
    </div>
  )
}

