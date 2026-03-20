'use client'

import { useRef, useEffect } from 'react'
import { initScene } from './scene'

export default function HoloBackground() {
   const canvasRef = useRef<HTMLCanvasElement>(null)

   useEffect(() => {
    if (!canvasRef.current) return
    const cleanup = initScene(canvasRef.current)
    return cleanup
   }, [])
   return (<canvas
    ref={canvasRef}
    style={{
        position : 'fixed',
        inset : 0, 
        width: '100vw', 
        height :'100vw',
        zIndex: -1,
        pointerEvents : 'none',
    }}
    />
   )
}

