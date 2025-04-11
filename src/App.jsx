import React, { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { PointerLockControls, Html } from '@react-three/drei';
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
import uranus from "./assets/uranus.jpg";
import neptune from "./assets/neptune.jpg";




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
  size: 5000 , // taille / 500 earth: 
  distance: 1_200_000 // distance / 1 000 000 = 1/1 000 000
};


const planets = [
  { name: "Sun", size: 200_000 / SCALE.size, distance: 0, texture: `${suns}`, rotation_speed: 0,  },
  { name: "Mercury", size: 4_879 / SCALE.size, color: "gray", distance: 57_900_000 / SCALE.distance, texture: `${mercury}`, rotation_speed: (2 * Math.PI) / (288 * 60), rotation_orbitale: (2 * Math.PI) / (88 * 60) },
  { name: "Venus", size: 12_104 / SCALE.size, color: "orange", distance: 108_200_000 / SCALE.distance, texture: `${venus}`, rotation_speed: (2 * Math.PI) / (1200 * 60), rotation_orbitale: (2 * Math.PI) / (225 * 60)},
  { name: "Earth", size: 12_742 / SCALE.size, distance: 149_600_000 / SCALE.distance, texture: `${earth}`, rotation_speed: (2 * Math.PI) / (120 * 60), rotation_orbitale: (2 * Math.PI) / (365 * 60)},
  { name: "Mars", size: 6_779 / SCALE.size, distance: 227_900_000 / SCALE.distance, texture: `${mars}`, rotation_speed: (2 * Math.PI) / (123 * 60), rotation_orbitale: (2 * Math.PI) / (687 * 60)  },
  { name: "Jupiter", size: 130_820 / SCALE.size, color: "orange", distance: (778_500_000 / SCALE.distance) / 2 , texture: `${jupyter}`, rotation_speed: (2 * Math.PI) / (50 * 60), rotation_orbitale: (2 * Math.PI) / (4333 * 30) *2 }, 
  { name: "Saturn", size: 110_460 / SCALE.size, color: "goldenrod", distance: (1433_500_000/ SCALE.distance) / 2, texture: `${saturn}`, rings: `${saturnRings}`, rotation_speed: (2 * Math.PI) / (54 * 60), rotation_orbitale: (2 * Math.PI) / (10759 * 30) * 5},
  { name: "Uranus", size: 50_724 / SCALE.size, color: "lightblue", distance: (2_872_500_000 / SCALE.distance) / 2, texture: `${uranus}`, rotation_speed: (2 * Math.PI) / (86 * 60), rotation_orbitale: (2 * Math.PI) / (20000 * 30) * 5 },
  { name: "Neptune", size: 49_244 / SCALE.size, color: "cyan", distance: (4_495_100_000 / SCALE.distance) / 2, texture: `${neptune}`, rotation_speed: (2 * Math.PI) / (80 * 60), rotation_orbitale: (2 * Math.PI) / (30000 * 30) * 10 },
];


function Ring({ size, rings }) {
  const ringTexture = useLoader(TextureLoader, rings);

  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[size * 1.2, size * 2, 64]} />
      <meshStandardMaterial
        map={ringTexture}
        side={2}
        transparent
        opacity={1}
      />
    </mesh>
  );
}

function Planet({ name, size, distance, texture, rings, rotation_speed, rotation_orbitale  }) {
  const textureMap = useLoader(TextureLoader, texture);
  const planetRef = useRef();
  const groupRef = useRef();


  useFrame(() => {
    if (planetRef.current) {
      // Rotation sur soi-même
      planetRef.current.rotation.y += rotation_speed;
    }
    if (groupRef.current && name !== "Sun") {
      // Révolution autour du Soleil
      groupRef.current.rotation.y += rotation_orbitale ;
    }
  });
  return (
    <>
    <group ref={groupRef}>
    <mesh ref={planetRef} position={[distance, 0, 0]}>
      <sphereGeometry args={[size, 64, 64]} />
      <meshStandardMaterial map={textureMap} emissiveMap={textureMap} emissive={name === 'Sun' ? 'yellow' : 'black'} emissiveIntensity={name === 'Sun' ? 3 : 0} /> 
      {rings && <Ring size={size} rings={rings} />} 
        </mesh>
        <Html
        position={[distance, size + 2, 0]} // Ajuste un peu plus haut
        style={{
          color: 'white',
          fontSize: '14px',
          fontWeight: 'bold',
          textAlign: 'center',
          pointerEvents: 'none',
          textShadow: '0 0 5px black',
        }}
        center
        distanceFactor={250} // ajuste la taille du texte selon la distance
      >
        {name}
      </Html>
      </group>
      
     </>
  );

}




function App() {


  return (
<div style={{width: '100vw', height: '100vh', margin: 0, padding: 0  }}>
<Canvas  camera={{ position: [50,0,100], fov: 75}}style={{ background: 'black' }}>
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
          rotation_speed={planet.rotation_speed}
          rotation_orbitale={planet.rotation_orbitale}

        />
      ))}
</Canvas>

</div>
  );
}

export default App;
