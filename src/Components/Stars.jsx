import React from "react";

function Stars() {

    const stars = [...Array(1000)].map(()=> 

    ({ position: [
        (Math.random() - 0.5 ) * 2000,
        (Math.random() - 0.5 ) * 2000,
        (Math.random() - 0.5 ) * 2000,
    ],

}));


    return (
      <>
      {stars.map((stars, index) => (
       <mesh key={index}
       position={stars.position}>
<sphereGeometry args={[0.5, 8, 8]} />
<meshBasicMaterial color="white" />
</mesh>
))}

</>
    );
  }

  export default Stars;
  
