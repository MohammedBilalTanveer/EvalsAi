/* File: src/components/FloatingElements.jsx */
import React, { useEffect, useState, useMemo } from "react";
import { motion } from "motion/react";
import { Cpu, Brain, Zap, Settings, Code, Bot } from "lucide-react";

/**
 * Stable client-only randomized floating icons.
 * Generates positions/sizes/durations on mount so they don't re-randomize on re-renders.
 */
export function FloatingElements() {
  const [mounted, setMounted] = useState(false);
  const [width, setWidth] = useState(1200);
  const [configs, setConfigs] = useState([]);
  const [particles, setParticles] = useState([]);

  // base element defs (safe for SSR)
  const baseElements = useMemo(() => [
    { Icon: Cpu, delay: 0 },
    { Icon: Brain, delay: 1.5 },
    { Icon: Zap, delay: 3 },
    { Icon: Settings, delay: 0.8 },
    { Icon: Code, delay: 2.2 },
    { Icon: Bot, delay: 4 },
  ], []);

  useEffect(() => {
    // run only on client
    setMounted(true);
    const updateWidth = () => setWidth(window.innerWidth || 1200);
    updateWidth();
    window.addEventListener("resize", updateWidth);

    // generate stable configs & particles once per session (client-only)
    const newConfigs = baseElements.map((item, idx) => ({
      ...item,
      top: 0.06 + Math.random() * 0.82,
      size: Math.round(18 + Math.random() * 28),
      duration: 18 + Math.random() * 12,
      extraDelay: Math.random() * 0.8,
      drift: (idx % 3) * 2,
    }));
    setConfigs(newConfigs);

    const p = Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      x: Math.random(),
      y: Math.random(),
      size: Math.round(6 + Math.random() * 18),
      delay: Math.random() * 6,
      duration: 10 + Math.random() * 8,
    }));
    setParticles(p);

    return () => window.removeEventListener("resize", updateWidth);
  }, [baseElements]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {configs.map((item, idx) => {
        const Icon = item.Icon;
        const topPercent = item.top * 100;
        return (
          <motion.div
            key={`float-${idx}`}
            style={{
              position: "absolute",
              left: -120,
              top: `${topPercent}%`,
              willChange: "transform, opacity",
            }}
            animate={{
              x: [-120, width + 120],
              rotate: [0, 360],
              y: [`${topPercent}%`, `${topPercent + item.drift}%`, `${topPercent}%`],
            }}
            transition={{
              duration: item.duration,
              repeat: Infinity,
              delay: item.delay + item.extraDelay,
              ease: "linear",
            }}
            className="text-purple-500/20"
          >
            <Icon size={item.size} />
          </motion.div>
        );
      })}

      {particles.map((p) => (
        <motion.div
          key={`particle-${p.id}`}
          style={{
            position: "absolute",
            left: `${p.x * 100}%`,
            top: `${p.y * 100}%`,
            width: p.size,
            height: p.size,
            borderRadius: 9999,
            background: "rgba(123,47,247,0.12)",
            boxShadow: `0 0 ${p.size}px rgba(123,47,247,0.12)`,
            willChange: "transform, opacity",
          }}
          animate={{
            y: [`${p.y * 100}%`, `${(p.y * 100) - 8}%`, `${p.y * 100}%`],
            x: [`${p.x * 100}%`, `${(p.x * 100) + 6}%`, `${p.x * 100}%`],
            opacity: [0.25, 0.9, 0.25],
            scale: [0.9, 1.2, 0.9],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
