import { useRef } from 'react';
import { useParticleCanvas } from '../hooks/useParticleCanvas';
import { useTheme } from '../hooks/useTheme';

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  useParticleCanvas(canvasRef, theme.particleHueMin, theme.particleHueMax);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
