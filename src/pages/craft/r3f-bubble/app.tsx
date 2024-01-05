// @see https://codesandbox.io/p/sandbox/bestservedbold-christmas-baubles-forked-klhzlz

import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, N8AO, SSAO } from '@react-three/postprocessing';
import {
  BallCollider,
  CylinderCollider,
  Physics,
  type RapierRigidBody,
  RigidBody,
} from '@react-three/rapier';
import { useRef } from 'react';
import * as THREE from 'three';

const baubleMaterial = new THREE.MeshLambertMaterial({
  color: '#ececec',
  emissive: 'gray',
});
const sphereGeometry = new THREE.SphereGeometry(1, 28, 28);

const baubleScales = [0.5, 0.6, 0.75, 1, 1];
const baubles = [...Array(50)].map(() => ({
  scale: baubleScales[Math.floor(Math.random() * baubleScales.length)],
}));

function Bauble({
  vec = new THREE.Vector3(),
  scale = 1,
  r = THREE.MathUtils.randFloatSpread,
}) {
  const api = useRef<RapierRigidBody>(null);

  useFrame((state, delta) => {
    delta = Math.min(0.1, delta);
    api.current!.applyImpulse(
      vec
        .copy(api.current!.translation() as THREE.Vector3)
        .normalize()
        .multiply({
          x: -50 * delta * scale,
          y: -150 * delta * scale,
          z: -50 * delta * scale,
        } as any),
      false,
    );
  });

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      position={[r(20), r(20) - 25, r(20) - 10]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <mesh
        castShadow
        receiveShadow
        scale={scale}
        geometry={sphereGeometry}
        material={baubleMaterial}
      />
    </RigidBody>
  );
}

function Pointer({ vec = new THREE.Vector3() }) {
  const ref = useRef<RapierRigidBody>(null);

  useFrame(({ mouse, viewport }) => {
    vec.lerp(
      {
        x: (mouse.x * viewport.width) / 2,
        y: (mouse.y * viewport.height) / 2,
        z: 0,
      } as THREE.Vector3,
      0.2,
    );
    ref.current?.setNextKinematicTranslation(vec);
  });

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

export const App = () => (
  <Canvas
    shadows
    gl={{ alpha: true, stencil: false, depth: false }}
    camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
    onCreated={(state) => (state.gl.toneMappingExposure = 1.5)}
  >
    <ambientLight intensity={1} />
    <spotLight
      position={[20, 20, 25]}
      penumbra={1}
      angle={0.2}
      color="white"
      castShadow
      shadow-mapSize={[512, 512]}
    />
    <directionalLight position={[0, 5, -4]} intensity={4} />
    <directionalLight position={[0, -15, -0]} intensity={4} color="gray" />
    <Physics gravity={[0, 0, 0]}>
      <Pointer />
      {baubles.map((props, i) => (
        <Bauble key={i} {...props} />
      ))}
    </Physics>
    <EffectComposer disableNormalPass multisampling={0}>
      <N8AO color="gray" aoRadius={2} intensity={1} />
      <SSAO
        worldDistanceThreshold={0}
        worldDistanceFalloff={0}
        worldProximityThreshold={0}
        worldProximityFalloff={0}
      />
    </EffectComposer>
  </Canvas>
);
