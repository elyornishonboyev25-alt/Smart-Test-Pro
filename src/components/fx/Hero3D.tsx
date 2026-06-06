import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Icosahedron, MeshDistortMaterial } from '@react-three/drei'
import type { Mesh } from 'three'

function Crystal() {
  const ref = useRef<Mesh>(null)

  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.28
    ref.current.rotation.x += delta * 0.08
  })

  return (
    <Float speed={1.5} rotationIntensity={0.6} floatIntensity={1.15}>
      <Icosahedron ref={ref} args={[1.3, 1]}>
        <MeshDistortMaterial
          color="#EF4444"
          emissive="#7F1D1D"
          emissiveIntensity={0.35}
          roughness={0.22}
          metalness={0.12}
          distort={0.34}
          speed={1.8}
        />
      </Icosahedron>
    </Float>
  )
}

/**
 * Central 3D centerpiece (lazy-loaded via Hero3DStage). A glossy, slowly
 * morphing red crystal lit in the brand palette. Self-contained — no external
 * HDR/network assets — so it renders reliably offline.
 */
export default function Hero3D() {
  return (
    <Canvas
      dpr={[1, 1.7]}
      camera={{ position: [0, 0, 4.3], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.75} />
      <directionalLight position={[3, 4, 5]} intensity={1.7} color="#FFE4E6" />
      <directionalLight position={[-4, -2, -3]} intensity={0.7} color="#FCA5A5" />
      <pointLight position={[0, 0, 3]} intensity={0.6} color="#FB7185" />
      <Crystal />
    </Canvas>
  )
}
