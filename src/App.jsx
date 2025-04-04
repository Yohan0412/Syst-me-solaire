import React from "react";
import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'

function PlayerControls() {
  const { camera } = useThree()
  const velocity = useRef([0, 0, 0])

  useEffect(() => {
    const handleKeyDown = (e) => {
      const v = [...velocity.current]
      if (e.key === 'z' || e.key === 'z') v[2] = -0.2
      if (e.key === 's') v[2] = 0.2
      if (e.key === 'q') v[0] = -0.2
      if (e.key === 'd') v[0] = 0.2
      velocity.current = v
    }

    const handleKeyUp = (e) => {
      const v = [...velocity.current]
      if (['z', 'w', 's'].includes(e.key)) v[2] = 0
      if (['q', 'd'].includes(e.key)) v[0] = 0
      velocity.current = v
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useFrame(() => {
    const [vx, , vz] = velocity.current
    camera.translateX(vx)
    camera.translateZ(vz)
  })

  return null
}

function Planete({ position, color, size }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

function App() {
  return (
<div style={{width: '100wh', height: '100vh', margin: 0, padding: 0  }}>
<Canvas  camera={{ position: [0, 0, 30], fov: 60, near: 0.1, far: 1000 }} style={{ background: 'black' }}>
<ambientLight intensity={0.5} />
<pointLight position={[20, 20, 20]} />
<PointerLockControls />
<PlayerControls/>



{/* Soleil */}
<Planete position={[0, 0, 0]} color="yellow" size={4} />

{/* Planètes */}
<Planete position={[10, 0, 0]} color="blue" size={2} />
<Planete position={[20, 0, 0]} color="red" size={1.5} />
<Planete position={[30, 0, 0]} color="green" size={1.2} />
<Planete position={[40, 0, 0]} color="purple" size={1} />
</Canvas>
</div>
  );
}

export default App;
