"use client";

import React, { useEffect, useRef, useState } from "react";
import { renderToString } from "react-dom/server";

interface Icon {
  x: number;
  y: number;
  z: number;
  scale: number;
  opacity: number;
  id: number;
}

export interface IconCloudProps {
  icons?: React.ReactNode[];
  images?: string[];
  size?: number; // canvas size (square)
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function IconCloud({ icons, images, size = 400 }: IconCloudProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [iconPositions, setIconPositions] = useState<Icon[]>([]);
  const [rotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [targetRotation, setTargetRotation] = useState<{
    x: number;
    y: number;
    startX: number;
    startY: number;
    distance: number;
    startTime: number;
    duration: number;
  } | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const rotationRef = useRef(rotation);
  const iconCanvasesRef = useRef<HTMLCanvasElement[]>([]);
  const imagesLoadedRef = useRef<boolean[]>([]);

  // Create icon canvases once when icons/images change
  useEffect(() => {
    if (!icons && !images) return;

    const items = icons || images || [];
    imagesLoadedRef.current = new Array(items.length).fill(false);

    const newIconCanvases = items.map((item, index) => {
      const offscreen = document.createElement("canvas");
      offscreen.width = 40;
      offscreen.height = 40;
      const offCtx = offscreen.getContext("2d");

      if (offCtx) {
        if (images) {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = items[index] as string;
          img.onload = () => {
            offCtx.clearRect(0, 0, offscreen.width, offscreen.height);
            offCtx.beginPath();
            offCtx.arc(20, 20, 20, 0, Math.PI * 2);
            offCtx.closePath();
            offCtx.clip();
            offCtx.drawImage(img, 0, 0, 40, 40);
            imagesLoadedRef.current[index] = true;
          };
          img.onerror = () => {
            offCtx.fillStyle = '#666';
            offCtx.font = '10px sans-serif';
            offCtx.textAlign = 'center';
            offCtx.textBaseline = 'middle';
            offCtx.fillText('ERR', 20, 22);
            imagesLoadedRef.current[index] = true;
          }
        } else if (icons) {
          offCtx.scale(0.4, 0.4);
          const svgString = renderToString(item as React.ReactElement);
            const img = new Image();
            img.src = "data:image/svg+xml;base64," + btoa(svgString);
            img.onload = () => {
              offCtx.clearRect(0, 0, offscreen.width, offscreen.height);
              offCtx.drawImage(img, 0, 0);
              imagesLoadedRef.current[index] = true;
            };
        }
      }
      return offscreen;
    });

    iconCanvasesRef.current = newIconCanvases;
  }, [icons, images]);

  // Generate initial icon positions on a sphere (Fibonacci)
  useEffect(() => {
    const items = icons || images || [];
    const newIcons: Icon[] = [];
    const numIcons = items.length || 20;
    const offset = 2 / numIcons;
    const increment = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < numIcons; i++) {
      const y = i * offset - 1 + offset / 2;
      const r = Math.sqrt(1 - y * y);
      const phi = i * increment;
      const x = Math.cos(phi) * r;
      const z = Math.sin(phi) * r;
      newIcons.push({ x: x * 100, y: y * 100, z: z * 100, scale: 1, opacity: 1, id: i });
    }
    setIconPositions(newIcons);
  }, [icons, images]);

  // Mouse events
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect || !canvasRef.current) return;
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePos({ x, y });
    }
    if (isDragging) {
      const deltaX = e.clientX - lastMousePos.x;
      const deltaY = e.clientY - lastMousePos.y;
      rotationRef.current = {
        x: rotationRef.current.x + deltaY * 0.002,
        y: rotationRef.current.y + deltaX * 0.002,
      };
      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handlePointerUp = () => setIsDragging(false);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
      const dx = mousePos.x - centerX;
      const dy = mousePos.y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const speed = 0.003 + (distance / maxDistance) * 0.01;

      if (targetRotation) {
        const elapsed = performance.now() - targetRotation.startTime;
        const progress = Math.min(1, elapsed / targetRotation.duration);
        const eased = easeOutCubic(progress);
        rotationRef.current = {
          x: targetRotation.startX + (targetRotation.x - targetRotation.startX) * eased,
          y: targetRotation.startY + (targetRotation.y - targetRotation.startY) * eased,
        };
        if (progress >= 1) setTargetRotation(null);
      } else if (!isDragging) {
        rotationRef.current = {
          x: rotationRef.current.x + (dy / canvas.height) * speed,
          y: rotationRef.current.y + (dx / canvas.width) * speed,
        };
      }

      iconPositions.forEach((icon, index) => {
        const cosX = Math.cos(rotationRef.current.x);
        const sinX = Math.sin(rotationRef.current.x);
        const cosY = Math.cos(rotationRef.current.y);
        const sinY = Math.sin(rotationRef.current.y);
        const rotatedX = icon.x * cosY - icon.z * sinY;
        const rotatedZ = icon.x * sinY + icon.z * cosY;
        const rotatedY = icon.y * cosX + rotatedZ * sinX;
        const scale = (rotatedZ + 200) / 300;
        const opacity = Math.max(0.18, Math.min(1, (rotatedZ + 150) / 200));
        ctx.save();
        ctx.translate(canvas.width / 2 + rotatedX, canvas.height / 2 + rotatedY);
        ctx.scale(scale, scale);
        ctx.globalAlpha = opacity;
        if ((icons || images) && iconCanvasesRef.current[index] && imagesLoadedRef.current[index]) {
          ctx.drawImage(iconCanvasesRef.current[index], -20, -20, 40, 40);
        }
        ctx.restore();
      });
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => { if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); };
  }, [icons, images, iconPositions, isDragging, mousePos, targetRotation]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className="rounded-lg cursor-grab active:cursor-grabbing bg-transparent"
      aria-label="Interactive 3D Icon Cloud"
      role="img"
    />
  );
}

export default IconCloud;
