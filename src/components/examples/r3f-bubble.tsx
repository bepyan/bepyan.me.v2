// @see https://codesandbox.io/p/sandbox/bestservedbold-christmas-baubles-forked-klhzlz

import { Canvas, useFrame, type Vector3 } from '@react-three/fiber';
import { EffectComposer, N8AO } from '@react-three/postprocessing';
import {
  BallCollider,
  Physics,
  type RapierRigidBody,
  RigidBody,
} from '@react-three/rapier';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const baubleScales = [0.6, 0.7, 0.75, 0.8, 0.85];
const baubleColors = ['#fdfdfd', '#d5d5d5', '#b1b1b1', '#909090'];
const baubles = [...Array(50)].map(() => ({
  scale: baubleScales[Math.floor(Math.random() * baubleScales.length)],
  color: baubleColors[Math.floor(Math.random() * baubleColors.length)],
}));

export const R3FBubbleApp = () => {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      gl={{ antialias: false }}
      camera={{ position: [0, 0, 15], fov: 17.5, near: 1, far: 20 }}
      onCreated={(state) => (state.gl.toneMappingExposure = 1.5)}
    >
      <ambientLight intensity={1} />
      <spotLight
        position={[10, 10, 10]}
        penumbra={1}
        angle={0.15}
        intensity={1}
        castShadow
      />
      <Physics gravity={[0, 0, 0]}>
        <Pointer />
        {baubles.map((props, i) => (
          <Bauble key={i} {...props} />
        ))}
      </Physics>
      <EffectComposer multisampling={0}>
        <N8AO aoRadius={2} intensity={1} />
      </EffectComposer>
    </Canvas>
  );
};

function Pointer({ vec = new THREE.Vector3() }) {
  const ref = useRef<RapierRigidBody>(null);

  useFrame(({ mouse, viewport }) => {
    ref.current?.setNextKinematicTranslation(
      vec.set(
        (mouse.x * viewport.width) / 2,
        (mouse.y * viewport.height) / 2,
        0,
      ),
    );
  });

  return (
    <RigidBody
      position={[0, 0, 0]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[1]} />
    </RigidBody>
  );
}

function Bauble({
  vec = new THREE.Vector3(),
  scale = 1,
  color = '#fff',
  r = THREE.MathUtils.randFloatSpread,
}) {
  const api = useRef<RapierRigidBody>(null);
  const pos = useMemo<Vector3>(() => [r(10), r(10), r(10)], []);
  const sphereGeometry = useMemo(() => new THREE.SphereGeometry(1, 28, 28), []);
  const baubleMaterial = useMemo(
    () => new THREE.MeshLambertMaterial({ color }),
    [color],
  );

  useFrame((_, delta) => {
    delta = Math.min(0.1, delta);
    api.current!.applyImpulse(
      vec
        .copy(api.current!.translation() as THREE.Vector3)
        .normalize()
        .multiply({
          x: -50 * delta * scale,
          y: -150 * delta * scale,
          z: -50 * delta * scale,
        } as THREE.Vector3),
      false,
    );
  });

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.1}
      position={pos}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
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
