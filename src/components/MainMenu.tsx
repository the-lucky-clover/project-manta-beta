import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Settings, Info, Users, BookOpen } from 'lucide-react';

interface MainMenuProps {
  onStartGame: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onStartGame }) => {
  const [selectedMode, setSelectedMode] = useState<string>('reconnaissance');

  const missionModes = [
    {
      id: 'reconnaissance',
      title: 'Urban Reconnaissance',
      description: 'Covert surveillance of metropolitan areas using advanced cloaking',
      difficulty: 'Moderate',
      duration: '15-25 min'
    },
    {
      id: 'deepspace',
      title: 'Deep Space Mission',
      description: 'Investigate anomalies in the asteroid belt and Jovian system',
      difficulty: 'Advanced',
      duration: '30-45 min'
    },
    {
      id: 'combat',
      title: 'Electronic Warfare',
      description: 'Tactical operations with advanced countermeasures',
      difficulty: 'Expert',
      duration: '20-35 min'
    }
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black via-slate-900 to-blue-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent animate-pulse" />
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px h-px bg-cyan-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 2, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center pt-8 pb-4"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-cyan-400 mb-2 tracking-wider">
            PROJECT MANTA
          </h1>
          <div className="text-cyan-300 text-sm md:text-base tracking-widest">
            ADVANCED ANTI-GRAVITY FLIGHT SIMULATOR
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full px-4 gap-8">
          {/* Mission Selection */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="flex-1"
          >
            <h2 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center gap-2">
              <Play className="w-6 h-6" />
              SELECT MISSION
            </h2>
            
            <div className="space-y-4">
              {missionModes.map((mode) => (
                <motion.div
                  key={mode.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                    selectedMode === mode.id
                      ? 'border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/20'
                      : 'border-slate-600 bg-slate-800/50 hover:border-cyan-400/50'
                  }`}
                  onClick={() => setSelectedMode(mode.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-cyan-300">
                      {mode.title}
                    </h3>
                    <div className="text-right text-xs text-slate-400">
                      <div>{mode.difficulty}</div>
                      <div>{mode.duration}</div>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm">{mode.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Start Button */}
            <motion.button
              className="w-full mt-8 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300"
              onClick={onStartGame}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              INITIATE MISSION
            </motion.button>
          </motion.div>

          {/* TR-3B Info Panel */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex-1 lg:max-w-md"
          >
            <h2 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center gap-2">
              <Info className="w-6 h-6" />
              TR-3B SPECIFICATIONS
            </h2>
            
            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600">
              <div className="space-y-4 text-sm">
                <div>
                  <div className="text-cyan-400 font-semibold">Dimensions</div>
                  <div className="text-slate-300">183m wingspan × 61m length × 15m height</div>
                </div>
                
                <div>
                  <div className="text-cyan-400 font-semibold">Propulsion</div>
                  <div className="text-slate-300">Mercury plasma ring array</div>
                  <div className="text-slate-300">89.2% mass reduction capability</div>
                </div>
                
                <div>
                  <div className="text-cyan-400 font-semibold">Cloaking System</div>
                  <div className="text-slate-300">Metamaterial adaptive camouflage</div>
                  <div className="text-slate-300">Visual, thermal & radar stealth</div>
                </div>
                
                <div>
                  <div className="text-cyan-400 font-semibold">Sensor Suite</div>
                  <div className="text-slate-300">Synthetic Aperture Radar</div>
                  <div className="text-slate-300">Multi-spectral imaging</div>
                  <div className="text-slate-300">Quantum communication array</div>
                </div>
              </div>
            </div>

            {/* Secondary Options */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <button className="flex items-center justify-center gap-2 p-3 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-300 hover:border-cyan-400/50 transition-colors">
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <button className="flex items-center justify-center gap-2 p-3 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-300 hover:border-cyan-400/50 transition-colors">
                <BookOpen className="w-4 h-4" />
                Tutorial
              </button>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="text-center pb-4 text-xs text-slate-500"
        >
          <div className="mb-2">
            CLASSIFICATION: UNCLASSIFIED TECHNICAL SPECIFICATION
          </div>
          <div>
            Use WASD/Arrow keys for desktop control • Touch gestures for mobile control
          </div>
        </motion.footer>
      </div>
    </div>
  );
};