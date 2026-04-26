// components/HeroCanvas.js — subtle 3D spheres that drift & react to mouse
"use client";
import { useEffect, useRef } from "react";

export default function HeroCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 768) return undefined;

    let disposed = false;
    let raf = 0;
    let cleanup = () => {};

    const init = async () => {
      const THREE = await import("three");
      if (disposed) return;

      const canvas = canvasRef.current;
      if (!canvas || !canvas.parentElement) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
      camera.position.z = 5;

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const resize = () => {
        if (!canvas.parentElement) return;
        const w = canvas.parentElement.offsetWidth;
        const h = canvas.parentElement.offsetHeight;
        if (!w || !h) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      };
      resize();
      window.addEventListener("resize", resize);

      const sphereGeometry = new THREE.IcosahedronGeometry(0.8, 12);
      const sphereMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff6b1a,
        metalness: 0.3,
        roughness: 0.15,
        transmission: 0.4,
        thickness: 1.5,
        emissive: 0xffc72c,
        emissiveIntensity: 0.15,
      });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.set(2.2, 0.8, 0);
      scene.add(sphere);

      const smallGeometry = new THREE.IcosahedronGeometry(0.3, 6);
      const smallMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xe63946,
        metalness: 0.5,
        roughness: 0.1,
        emissive: 0xe63946,
        emissiveIntensity: 0.2,
      });
      const small = new THREE.Mesh(smallGeometry, smallMaterial);
      small.position.set(-2.5, -0.5, 0.5);
      scene.add(small);

      scene.add(new THREE.AmbientLight(0xffffff, 0.4));
      const key = new THREE.PointLight(0xffc72c, 3, 10);
      key.position.set(3, 3, 3);
      scene.add(key);
      const rim = new THREE.PointLight(0xe63946, 2, 10);
      rim.position.set(-3, -2, 2);
      scene.add(rim);

      let mx = 0;
      const onMove = (event) => {
        mx = (event.clientX / window.innerWidth - 0.5) * 2;
      };
      window.addEventListener("mousemove", onMove);

      let t = 0;
      const loop = () => {
        t += 0.005;
        sphere.rotation.x = t;
        sphere.rotation.y = t * 0.7;
        sphere.position.y = 0.8 + Math.sin(t * 1.5) * 0.15;
        sphere.position.x += (2.2 + mx * 0.3 - sphere.position.x) * 0.05;

        small.rotation.x = -t * 1.3;
        small.rotation.y = t * 0.5;
        small.position.y = -0.5 + Math.cos(t * 1.2) * 0.2;
        small.position.x += (-2.5 + mx * -0.2 - small.position.x) * 0.05;

        renderer.render(scene, camera);
        raf = requestAnimationFrame(loop);
      };
      loop();

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", resize);
        window.removeEventListener("mousemove", onMove);
        sphereGeometry.dispose();
        sphereMaterial.dispose();
        smallGeometry.dispose();
        smallMaterial.dispose();
        renderer.dispose();
      };
    };

    init().catch(() => {});

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[1] pointer-events-none"
    />
  );
}
