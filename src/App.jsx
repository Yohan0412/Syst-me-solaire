import React, { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'
import Stars from "./Components/Stars";
import { TextureLoader } from 'three';
import suns from "./assets/sun.jpg";
import earth from "./assets/earth.jpg";
import mercury from "./assets/mercury.jpg";
import venus from "./assets/venus.jpg";
import mars from "./assets/mars.jpg";
import jupyter from "./assets/jupyter.jpg";
import saturn from "./assets/saturn.jpg";
import saturnRings from "./assets/saturnRings.png";

function PlayerControls() {
  const { camera } = useThree()
  const velocity = useRef([0, 0, 0])

  useEffect(() => {
    const handleKeyDown = (e) => {
      const v = [...velocity.current]
      if (e.key === 'z' || e.key === 'w') v[2] = -0.2
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


const SCALE = {
  size: 2500, // taille / 500 earth: 
  distance: 800_000 // distance / 1 000 000 = 1/1 000 000
};


const planets = [
  { name: "Sun", size: 100_000 / SCALE.size, distance: 0, texture: `${suns}`  },
  { name: "Mercury", size: 4_879 / SCALE.size, color: "gray", distance: 57_900_000 / SCALE.distance, texture: `${mercury}` },
  { name: "Venus", size: 12_104 / SCALE.size, color: "orange", distance: 108_200_000 / SCALE.distance, texture: `${venus}` },
  { name: "Earth", size: 12_742 / SCALE.size, distance: 149_600_000 / SCALE.distance, texture: `${earth}` },
  { name: "Mars", size: 6_779 / SCALE.size, distance: 227_900_000 / SCALE.distance, texture: `${mars}`  },
  { name: "Jupiter", size: 139_820 / SCALE.size, color: "orange", distance: 778_500_000 / SCALE.distance, texture: `${jupyter}` },
  { name: "Saturn", size: 116_460 / SCALE.size, color: "goldenrod", distance: 1433_500_000/ SCALE.distance, texture: `${saturn}`, rings: `${saturnRings}` },
  // { name: "Uranus", size: 50_724 / SCALE.size, color: "lightblue", distance: 2872_500_000 / SCALE.distance, texture: `${jupyter}` },
  // { name: "Neptune", size: 49_244 / SCALE.size, color: "cyan", distance: 4495_100_000 / SCALE.distance, texture: `${jupyter}` },
];

function Planet({ name, size, distance, texture, rings }) {
  const textureMap = useLoader(TextureLoader, texture);
  const ringTexture = useLoader(TextureLoader, rings || texture);
  const hasRings = !!rings;

  return (
    <mesh position={[distance, 0, 0]}>
      <sphereGeometry args={[size, 64, 64]} />
      <meshStandardMaterial map={textureMap}  />
      {hasRings && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size * 1.2, size * 2, 64]} />
          <meshStandardMaterial map={ringTexture} side={2} transparent opacity={0.8} />
        </mesh>
      )}
    </mesh>

  );

}

function App() {
  return (
<div style={{width: '100vw', height: '100vh', margin: 0, padding: 0  }}>
<Canvas  camera={{ position: [0,10,200], fov: 75}}style={{ background: 'black' }}>
<ambientLight intensity={0.5} />
<pointLight position={[0, 0, 0]} intensity={50} color="yellow" decay={0.5} />
<PointerLockControls />
<PlayerControls/>
<Stars />
{planets.map((planet) => (
        <Planet
          key={planet.name}
          name={planet.name}
          size={planet.size}
          distance={planet.distance}
          texture={planet.texture}
          rings={planet.rings}
        />
      ))}
</Canvas>
</div>
  );
}

export default App;
