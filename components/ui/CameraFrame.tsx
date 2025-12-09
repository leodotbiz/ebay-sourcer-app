import React from 'react'

type CameraFrameProps = {
  imageUrl?: string
}

export default function CameraFrame({ imageUrl }: CameraFrameProps) {
  return (
    <div className="relative w-full max-w-sm mx-auto aspect-[3/4] border-2 border-white rounded-lg overflow-hidden">
      {/* Image preview or placeholder */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Selected preview"
          className="w-full h-full object-cover rounded-lg"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-400 text-sm">Camera Preview</p>
        </div>
      )}
      
      {/* Corner brackets - always visible as overlay */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white rounded-br-lg" />
    </div>
  )
}

