import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing Anti-Gravity Systems...');

  const loadingSteps = [
    'Initializing Anti-Gravity Systems...',
    'Calibrating Mercury Plasma Rings...',
    'Activating Metamaterial Cloaking...',
    'Synchronizing Quantum Communications...',
    'Loading Mission Parameters...',
    'Systems Ready - Standby for Launch'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + Math.random() * 15, 100);
        
        const stepIndex = Math.floor((newProgress / 100) * loadingSteps.length);
        if (stepIndex < loadingSteps.length) {
          setLoadingText(loadingSteps[stepIndex]);
        }
        
        return newProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black via-slate-900 to-blue-900 flex flex-col items-center justify-center z-50">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent animate-pulse" />
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* PROJECT MANTA Logo */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center mb-8"
      >
        <h1 className="text-6xl md:text-8xl font-bold text-cyan-400 mb-2 tracking-wider">
          PROJECT
        </h1>
        <h1 className="text-6xl md:text-8xl font-bold text-cyan-400 mb-4 tracking-wider">
          MANTA
        </h1>
        <div className="text-cyan-300 text-lg md:text-xl tracking-widest">
          ANTI-GRAVITY FLIGHT SIMULATOR
        </div>
      </motion.div>

      {/* Loading Bar */}
      <div className="w-80 md:w-96 bg-slate-800 rounded-full h-2 mb-4 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full shadow-lg shadow-cyan-500/50"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Loading Text */}
      <motion.div
        key={loadingText}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="text-cyan-300 text-sm md:text-base text-center px-4"
      >
        {loadingText}
      </motion.div>

      {/* Progress Percentage */}
      <div className="text-cyan-400 text-lg font-mono mt-2">
        {Math.round(progress)}%
      </div>

      {/* Classification */}
      <div className="absolute bottom-4 text-xs text-slate-500 text-center px-4">
        CLASSIFICATION: UNCLASSIFIED TECHNICAL SPECIFICATION
        <br />
        VERSION 1.0 - TARGET RELEASE: Q2 2025
      </div>
    </div>
  );
};