'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  createWaterSpiritUndineModel,
  createWaterSpiritUndineEnvironment,
  frameWaterSpiritUndineCamera,
  configureWaterSpiritUndineRenderer,
  createWaterSpiritUndineInspectControls,
} from '@/lib/three/createWaterSpiritModel';

export type StageProps = {
  azimuthDeg: number;
  elevationDeg: number;
  /** 'reference' matches the spec's lightingFromPhoto rig; 'neutral' is the evaluation rig. */
  mode: 'reference' | 'neutral' | 'grazing';
  /** Disables OrbitControls and auto-rotation so a screenshot is deterministic. */
  still: boolean;
  /**
   * Replaces every material with one flat opaque grey. The blockout and structural passes are
   * judged on proportion, pose and hierarchy, and the spec's transmissive materials render
   * near-invisible against a light background - which reads as missing geometry, not as glass.
   */
  flat: boolean;
  width: number;
  height: number;
};

/**
 * Lights authored from the spec's `lightingFromPhoto` block. The generated factory ships a
 * generic warm look-dev rig, which would push the render outside the 205-220deg hue band the
 * palette review target enforces.
 */
function createLights(mode: StageProps['mode']): THREE.Group {
  const lights = new THREE.Group();
  lights.name = 'water-spirit-lights';

  if (mode === 'neutral') {
    lights.add(new THREE.HemisphereLight(0xffffff, 0x808080, 1.1));
    const flat = new THREE.DirectionalLight(0xffffff, 1.4);
    flat.position.set(0, 1, 3);
    lights.add(flat);
    return lights;
  }

  const grazing = mode === 'grazing';

  const fill = new THREE.HemisphereLight(0x9fcbf2, 0x1e63c8, grazing ? 0.2 : 0.65);
  lights.add(fill);

  const key = new THREE.DirectionalLight(0xe8f3fc, grazing ? 3.4 : 1.5);
  key.position.set(-0.35, 0.72, 0.6).normalize().multiplyScalar(8);
  lights.add(key);

  const rim = new THREE.DirectionalLight(0x4a93e8, grazing ? 0.3 : 1.1);
  rim.position.set(0.55, 0.3, -0.85).normalize().multiplyScalar(8);
  lights.add(rim);

  return lights;
}

export default function WaterSpiritStage({
  azimuthDeg,
  elevationDeg,
  mode,
  still,
  flat,
  width,
  height,
}: StageProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    configureWaterSpiritUndineRenderer(renderer);
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.environment = createWaterSpiritUndineEnvironment(renderer);

    const model = createWaterSpiritUndineModel();
    if (flat) {
      const clay = new THREE.MeshStandardMaterial({
        color: 0xb9c6d4,
        roughness: 0.75,
        metalness: 0.0,
        side: THREE.DoubleSide,
      });
      model.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (!mesh.isMesh) return;
        const source = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
        // the invisible pivot and collider proxies must stay invisible
        if (source && 'opacity' in source && (source as THREE.Material).opacity === 0) {
          mesh.visible = false;
          return;
        }
        mesh.material = clay;
      });
    }
    scene.add(model);
    scene.add(createLights(mode));

    const camera = new THREE.PerspectiveCamera(22, width / height, 0.1, 100);
    frameWaterSpiritUndineCamera(camera, model, { azimuthDeg, elevationDeg, margin: 1.1 });

    const controls = still ? null : createWaterSpiritUndineInspectControls(camera, renderer.domElement);

    let frame = 0;
    const tick = () => {
      controls?.update();
      renderer.render(scene, camera);
      frame = requestAnimationFrame(tick);
    };
    tick();

    // Capture handshake: the screenshot tool waits for this flag before shooting.
    const win = window as unknown as Record<string, unknown>;
    win.__sculptRuntime = model.userData.sculptRuntime ?? null;
    win.__sculptModel = model;
    win.__sculptScene = scene;
    win.__sculptCamera = camera;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        win.__sculptReady = true;
        document.documentElement.setAttribute('data-sculpt-ready', 'true');
      });
    });

    return () => {
      cancelAnimationFrame(frame);
      controls?.dispose();
      renderer.dispose();
      host.removeChild(renderer.domElement);
      delete win.__sculptReady;
      document.documentElement.removeAttribute('data-sculpt-ready');
    };
  }, [azimuthDeg, elevationDeg, mode, still, flat, width, height]);

  return <div ref={hostRef} style={{ width, height }} />;
}
