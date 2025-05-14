/* eslint-disable react/no-unknown-property */
import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Html, OrbitControls, Stars } from '@react-three/drei';
import {
  useDrag,
  useDrop,
  DragSourceMonitor,
  DropTargetMonitor,
} from 'react-dnd';
import { useSpring, animated } from '@react-spring/three';
import type { Mesh } from 'three';
import { TextureLoader } from 'three';
import mercury from 'Assets/Images/mercury.jpg';
import venus from 'Assets/Images/venus.jpg';
import earth from 'Assets/Images/earth.jpg';
import mars from 'Assets/Images/mars.jpg';
import jupiter from 'Assets/Images/jupiter.jpg';
import saturn from 'Assets/Images/saturn.jpg';
import uranus from 'Assets/Images/uranus.jpg';
import neptune from 'Assets/Images/neptune.jpg';
import { Environment } from '@react-three/drei';

// Planet Data
interface Planet {
  name: string;
  orbitRadius: number;
  radius: number;
  texture: string;
  angle: number;
}
const planets: Planet[] = [
  { name: 'Mercury', orbitRadius: 20, radius: 2, texture: mercury, angle: 0 },
  {
    name: 'Venus',
    orbitRadius: 35,
    radius: 4.5,
    texture: venus,
    angle: Math.PI * 0.2,
  },
  {
    name: 'Earth',
    orbitRadius: 35,
    radius: 5,
    texture: earth,
    angle: Math.PI * 0.6,
  },
  {
    name: 'Mars',
    orbitRadius: 45,
    radius: 3.5,
    texture: mars,
    angle: Math.PI * 1.1,
  },
  {
    name: 'Jupiter',
    orbitRadius: 60,
    radius: 11,
    texture: jupiter,
    angle: Math.PI * 1.7,
  },
  {
    name: 'Saturn',
    orbitRadius: 80,
    radius: 9,
    texture: saturn,
    angle: Math.PI * 2.3,
  },
  {
    name: 'Uranus',
    orbitRadius: 100,
    radius: 4,
    texture: uranus,
    angle: Math.PI * 2.8,
  },
  {
    name: 'Neptune',
    orbitRadius: 120,
    radius: 4,
    texture: neptune,
    angle: Math.PI * 3.5,
  },
];

type DragItem = { name: string };

// Draggable Planet Labels
interface DraggableLabelProps {
  name: string;
}
function DraggableLabel({ name }: DraggableLabelProps) {
  const [{ isDragging }, dragRef] = useDrag<
    DragItem,
    void,
    { isDragging: boolean }
  >({
    type: 'PLANET',
    item: { name },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={dragRef}
      role="button"
      tabIndex={0}
      aria-label={`Drag ${name}`}
      style={{
        opacity: isDragging ? 0.5 : 1,
        padding: '8px',
        margin: '4px 0',
        background: 'rgba(225, 128, 0, 0.7)',
        cursor: 'grab',
        borderRadius: '4px',
      }}
    >
      {name}
    </div>
  );
}

//Orbit Rings
interface OrbitRingProps {
  radius: number;
  highlight: boolean;
}
function OrbitRing({ radius, highlight }: OrbitRingProps) {
  const ref = useRef<Mesh>(null!);
  useFrame(() => {
    ref.current.rotation.z += 0.0005;
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.1, 16, 100]} />
      <meshBasicMaterial
        color={highlight ? '#ff0' : '#444'}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
}

//  Planet With Drop Zone
interface PlanetWithDropZoneProps {
  data: Planet;
  onHover: (name: string | null) => void;
  onDropped: (label: string, planet: string) => void;
  isMatched: boolean;
}
function PlanetWithDropZone({
  data,
  onHover,
  onDropped,
  isMatched,
}: PlanetWithDropZoneProps) {
  // Load planet texture
  const texture = useLoader(TextureLoader, data.texture);
  const x = data.orbitRadius * Math.cos(data.angle);
  const z = data.orbitRadius * Math.sin(data.angle);

  // Configure drop target
  const [{ isOver, canDrop }, drop] = useDrop<
    DragItem,
    void,
    { isOver: boolean; canDrop: boolean }
  >({
    accept: 'PLANET',
    canDrop: () => !isMatched,
    drop: (item) => onDropped(item.name, data.name),
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  // Bubble up hover state
  useEffect(() => {
    onHover(isOver && canDrop ? data.name : null);
  }, [isOver, canDrop, data.name, onHover]);

  // Animate scale on hover
  const { scale } = useSpring({ scale: isOver && canDrop ? 1.4 : 1 });

  return (
    <animated.mesh position={[x, 0, z]} scale={scale as any}>
      <sphereGeometry args={[data.radius, 32, 32]} />
      <meshStandardMaterial
        map={texture}
        emissive={isOver && canDrop ? 'yellow' : 'black'}
        roughness={0.7}
      />

      {/* Screen-space HTML overlay for drop events */}
      <Html center>
        <div
          ref={(el) => {
            if (!isMatched && el) drop(el);
          }}
          style={{
            width: data.radius * 30,
            height: data.radius * 30,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            pointerEvents: 'auto',
            backgroundColor:
              isOver && canDrop ? 'rgba(255,255,0,0.2)' : 'transparent',
            borderRadius: '50%',
            zIndex: 10,
          }}
        >
          {(isMatched || (isOver && canDrop)) && (
            <div style={{ pointerEvents: 'none', color: '#fff', fontSize: 12 }}>
              {data.name}
            </div>
          )}
        </div>
      </Html>
    </animated.mesh>
  );
}

// Sun is currently a sphere with emissive material but can be replaced with an image
function Sun() {
  return (
    <mesh>
      <sphereGeometry args={[8, 32, 32]} />
      <meshStandardMaterial
        color="#ff8000"
        emissive={'#ff1b1a'}
        toneMapped={false}
      />
      <pointLight color="#ffcc33" intensity={0.1} distance={200} decay={2} />
    </mesh>
  );
}
//  Orbiting Planets
function OrbitingPlanet({ data }: { data: Planet }) {
  const ref = useRef<Mesh>(null!);
  const texture = useLoader(TextureLoader, data.texture);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.2 + data.angle;
    ref.current.position.set(
      data.orbitRadius * Math.cos(t),
      0,
      data.orbitRadius * Math.sin(t),
    );
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[data.radius, 32, 32]} />
      <meshStandardMaterial map={texture} roughness={0.7} />
    </mesh>
  );
}

export default function PlanetMatchGame() {
  const [placed, setPlaced] = useState<Record<string, boolean>>({});
  const [hovered, setHovered] = useState<string | null>(null);

  const [showOverlay, setShowOverlay] = useState(false);

  // Handle drop logic
  const handleDrop = (label: string, planet: string): void => {
    if (label === planet) {
      setPlaced((p) => {
        const next = { ...p, [planet]: true };
        return next;
      });
    } else {
      alert(` ${label} does not belong to ${planet}`);
    }
  };

  const allMatched = Object.keys(placed).length === planets.length;

  useEffect(() => {
    if (allMatched) setShowOverlay(true);
  }, [allMatched]);

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        position: 'relative',
        background: '#000',
      }}
    >
      {allMatched && showOverlay && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#fff',
            fontSize: 48,
            zIndex: 10,
          }}
        >
          <div>All planets matched! 🎉</div>
          {/* Close button */}
          <button
            onClick={() => setShowOverlay(false)}
            style={{
              marginTop: '20px',
              padding: '8px 16px',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      )}

      {/* Sidebar UI */}
      <div
        style={{
          width: '100%',
          padding: '10px',
          color: '#fff',
          background: 'transparent',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          position: 'absolute',
          top: 10,
          zIndex: 9,
        }}
      >
        <button
          className="btn mt-2"
          onClick={() => {
            setPlaced({});
            setShowOverlay(false);
          }}
          style={{
            marginBottom: '10px',
            padding: '8px',
            background: 'rgba(225, 128, 0)',
            color: '#fff',
          }}
        >
          Reset Game
        </button>
        <div>{planets.filter((p) => !placed[p.name]).length} left</div>
        {planets.map((p) =>
          !placed[p.name] ? (
            <DraggableLabel key={p.name} name={p.name} />
          ) : null,
        )}
      </div>
      {/* 3D Canvas */}
      <Canvas
        style={{ flex: 1 }}
        camera={{ position: [0, 150, 300], fov: 30 }}
        dpr={Math.min(window.devicePixelRatio, 1.5)}
        gl={{ toneMappingExposure: 1.5 }}
      >
        <color attach="background" args={['#000']} />
        <Stars
          radius={300}
          depth={60}
          count={3000}
          factor={15}
          saturation={0.2}
          fade={false}
        />

        <ambientLight intensity={0.5} />
        <hemisphereLight args={[0xffffff, 0x080820, 0.6]} />

        {/* Key (sunlight) */}
        <directionalLight position={[0, 50, 100]} intensity={0.2} castShadow />
        <directionalLight position={[0, 50, -100]} intensity={0.2} />
        <directionalLight position={[0, -50, 100]} intensity={0.2} />
        <directionalLight position={[0, -50, -100]} intensity={0.2} />

        {/* Fill (soft shadow lift) */}
        <directionalLight position={[0, 20, 200]} intensity={0.2} />
        <directionalLight position={[0, -20, 200]} intensity={0.2} />
        <directionalLight position={[0, 20, -200]} intensity={0.2} />
        <directionalLight position={[0, -20, -200]} intensity={0.2} />

        {/* Rim (backlight) */}
        <directionalLight position={[0, 100, -200]} intensity={0.2} />
        <directionalLight position={[0, -100, 200]} intensity={0.2} />
        <directionalLight position={[0, -100, -200]} intensity={0.2} />
        <directionalLight position={[0, 100, 200]} intensity={0.2} />
        <Environment preset="sunset" background={false} />

        <Sun />
        <OrbitControls maxDistance={300} minDistance={50} />
        {/* Orbits */}
        {planets.map((p) => (
          <OrbitRing
            key={p.name}
            radius={p.orbitRadius}
            highlight={hovered === p.name}
          />
        ))}
        {/* Planets */}
        {planets.map((p) =>
          allMatched ? (
            <OrbitingPlanet key={p.name} data={p} />
          ) : (
            <PlanetWithDropZone
              key={p.name}
              data={p}
              onHover={setHovered}
              onDropped={handleDrop}
              isMatched={!!placed[p.name]}
            />
          ),
        )}
      </Canvas>
    </div>
  );
}
