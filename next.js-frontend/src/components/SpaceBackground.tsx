'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function StarField() {
  const starsRef = useRef<THREE.Points>(null)
  
  useFrame((state, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.x += delta * 0.05
      starsRef.current.rotation.y += delta * 0.075
    }
  })

  return <Stars ref={starsRef} radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
}

// function Planet({ position, color, size }: { position: [number, number, number], color: string, size: number }) {
//   const meshRef = useRef<THREE.Mesh>(null)
  
//   useFrame((state) => {
//     if (meshRef.current) {
//       meshRef.current.rotation.y += 0.01
//     }
//   })

//   return (
//     <mesh ref={meshRef} position={position}>
//       <sphereGeometry args={[size, 32, 32]} />
//       <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
//     </mesh>
//   )
// }

export default function SpaceBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <StarField />
        {/* <Planet position={[-3, 2, -5]} color="#4F46E5" size={0.5} />
        <Planet position={[4, -1, -8]} color="#EC4899" size={0.3} />
        <Planet position={[-2, -3, -6]} color="#10B981" size={0.4} /> */}
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  )
}