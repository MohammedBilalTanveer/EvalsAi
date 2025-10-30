/* File: src/components/StarfieldBackground.jsx */
import { useEffect, useState, useMemo } from "react";
import { motion } from "motion/react";

/**
 * Client-only starfield. Positions/density computed on client to avoid SSR/hydration mismatch.
 */
export function StarfieldBackground() {
  const [mounted, setMounted] = useState(false);
  const [dims, setDims] = useState({ w: 1200, h: 900 });
  const [stars, setStars] = useState([]);

  useEffect(() => {
    setMounted(true);
    const update = () => {
      const w = window.innerWidth || 1200;
      const h = Math.max(window.innerHeight || 800, document.documentElement.scrollHeight || 800);
      setDims({ w, h });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update);
    return () => { window.removeEventListener("resize", update); window.removeEventListener("scroll", update); };
  }, []);

  // generate stars whenever dims change (client-only)
  useEffect(() => {
    if (!mounted) return;
    const area = (dims.w * dims.h) / 3000;
    const count = Math.min(140, Math.max(40, Math.floor(area)));
    const palette = ['#8b5cf6','#a855f7','#c084fc','#6366f1','#06b6d4'];
    const arr = Array.from({ length: count }).map((_, i) => {
      const size = Math.random() < 0.12 ? 2 + Math.random() * 4 : 1 + Math.random() * 1.4;
      return {
        id: i,
        left: Math.random() * dims.w,
        top: Math.random() * dims.h,
        size,
        color: palette[Math.floor(Math.random() * palette.length)],
        twinkle: Math.random() * 4,
        duration: 4 + Math.random() * 6,
        driftX: (Math.random() - 0.5) * 20,
        driftY: (Math.random() - 0.5) * 20,
      };
    });
    setStars(arr);
  }, [dims.w, dims.h, mounted]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none -z-10">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(13,17,23,1), rgba(13,11,23,0.7))" }} />
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            background: s.color,
            boxShadow: `0 0 ${(s.size) * 3}px ${s.color}60`,
            willChange: "transform, opacity",
          }}
          animate={{
            x: [0, s.driftX, 0],
            y: [0, s.driftY, 0],
            opacity: [0.2, 0.95, 0.2],
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            delay: s.twinkle,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* two soft orbs for depth */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 360,
          height: 360,
          left: dims.w * 0.06,
          top: dims.h * 0.08,
          background: "radial-gradient(circle, rgba(123,47,247,0.14), transparent 60%)",
          willChange: "transform, opacity",
        }}
        animate={{ scale: [1, 1.35, 1], opacity: [0.25, 0.6, 0.25] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute rounded-full"
        style={{
          width: 260,
          height: 260,
          right: dims.w * 0.06,
          top: dims.h * 0.55,
          background: "radial-gradient(circle, rgba(35,168,242,0.12), transparent 60%)",
        }}
        animate={{ scale: [1, 1.4, 1], opacity: [0.15, 0.5, 0.15] }}
        transition={{ duration: 9, repeat: Infinity, delay: 2, ease: "easeInOut" }}
      />
    </div>
  );
}
