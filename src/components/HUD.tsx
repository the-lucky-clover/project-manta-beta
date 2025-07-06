import React from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Zap, Navigation, Radar, Thermometer } from 'lucide-react';
import { GameState } from '../types/GameState';

interface HUDProps {
  gameState: GameState;
  onStateUpdate: (updates: Partial<GameState>) => void;
}

export const HUD: React.FC<HUDProps> = ({ gameState, onStateUpdate }) => {
  const formatNumber = (num: number, decimals: number = 1) => {
    return num.toFixed(decimals);
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Holographic scan lines */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent animate-pulse" />
      
      {/* Top HUD Bar */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-4 left-4 right-4 flex justify-between items-start"
      >
        {/* Left Status Panel */}
        <div className="bg-black/70 border border-cyan-400/50 rounded-lg p-4 backdrop-blur-sm">
          <div className="text-cyan-400 text-xs font-mono mb-2">TR-3B STATUS</div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between gap-4">
              <span className="text-slate-300">ALT:</span>
              <span className="text-cyan-300 font-mono">
                {formatNumber((gameState.spacecraft?.position.y || 0) * 10)}m
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-300">SPD:</span>
              <span className="text-cyan-300 font-mono">
                {formatNumber(gameState.velocity || 0)} m/s
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-300">HDG:</span>
              <span className="text-cyan-300 font-mono">
                {formatNumber(((gameState.spacecraft?.rotation.y || 0) * 180 / Math.PI) % 360)}°
              </span>
            </div>
          </div>
        </div>

        {/* Mission Status */}
        <div className="bg-black/70 border border-cyan-400/50 rounded-lg p-4 backdrop-blur-sm">
          <div className="text-cyan-400 text-xs font-mono mb-2">MISSION</div>
          <div className="text-slate-300 text-xs">
            {gameState.missionType?.toUpperCase() || 'RECONNAISSANCE'}
          </div>
          <div className="text-green-400 text-xs mt-1">
            {gameState.missionActive ? 'ACTIVE' : 'STANDBY'}
          </div>
        </div>

        {/* Right System Panel */}
        <div className="bg-black/70 border border-cyan-400/50 rounded-lg p-4 backdrop-blur-sm">
          <div className="text-cyan-400 text-xs font-mono mb-2">SYSTEMS</div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3" />
              <span className="text-slate-300">PWR:</span>
              <span className="text-green-400">{formatNumber(gameState.powerLevel || 100)}%</span>
            </div>
            <div className="flex items-center gap-2">
              {gameState.cloakingActive ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              <span className="text-slate-300">CLOAK:</span>
              <span className={gameState.cloakingActive ? "text-green-400" : "text-slate-400"}>
                {gameState.cloakingActive ? 'ACTIVE' : 'OFFLINE'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Navigation className="w-3 h-3" />
              <span className="text-slate-300">NAV:</span>
              <span className="text-green-400">ONLINE</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Center Crosshair */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-8 h-8 border-2 border-cyan-400 rounded-full opacity-60">
          <div className="w-2 h-2 bg-cyan-400 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-cyan-400 font-mono">
          TARGET
        </div>
      </div>

      {/* Bottom Left - Sensor Data */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="absolute bottom-4 left-4"
      >
        <div className="bg-black/70 border border-cyan-400/50 rounded-lg p-4 backdrop-blur-sm">
          <div className="text-cyan-400 text-xs font-mono mb-2 flex items-center gap-2">
            <Radar className="w-3 h-3" />
            SENSOR SUITE
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-slate-300">SAR:</span>
              <span className="text-green-400">SCANNING</span>
            </div>
            <div className="flex items-center gap-2">
              <Thermometer className="w-3 h-3" />
              <span className="text-slate-300">THERMAL:</span>
              <span className="text-green-400">ACTIVE</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span className="text-slate-300">QUANTUM:</span>
              <span className="text-cyan-400">LINKED</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom Right - Plasma Status */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="absolute bottom-4 right-4"
      >
        <div className="bg-black/70 border border-cyan-400/50 rounded-lg p-4 backdrop-blur-sm">
          <div className="text-cyan-400 text-xs font-mono mb-2">PLASMA ARRAY</div>
          <div className="space-y-2">
            {['TOP', 'PORT', 'STBD'].map((ring, index) => (
              <div key={ring} className="flex items-center gap-2">
                <div className="text-slate-300 text-xs w-8">{ring}:</div>
                <div className="flex-1 bg-slate-700 h-2 rounded overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-400"
                    initial={{ width: '0%' }}
                    animate={{ 
                      width: gameState.plasmaActive ? 
                        `${85 + Math.sin(Date.now() * 0.01 + index) * 10}%` : '0%' 
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="text-xs text-cyan-300 w-8">
                  {gameState.plasmaActive ? Math.round(85 + Math.sin(Date.now() * 0.01 + index) * 10) : 0}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Radar Display */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="absolute top-1/2 right-4 transform -translate-y-1/2"
      >
        <div className="bg-black/70 border border-cyan-400/50 rounded-full p-4 backdrop-blur-sm w-32 h-32">
          <div className="relative w-full h-full">
            <div className="absolute inset-0 border-2 border-cyan-400/30 rounded-full" />
            <div className="absolute inset-2 border border-cyan-400/20 rounded-full" />
            <div className="absolute inset-4 border border-cyan-400/10 rounded-full" />
            
            {/* Radar sweep */}
            <motion.div
              className="absolute top-1/2 left-1/2 w-0.5 h-12 bg-gradient-to-t from-cyan-400 to-transparent origin-bottom"
              style={{ marginTop: '-48px', marginLeft: '-1px' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Contact blips */}
            <div className="absolute top-2 right-4 w-1 h-1 bg-red-400 rounded-full animate-pulse" />
            <div className="absolute bottom-6 left-3 w-1 h-1 bg-yellow-400 rounded-full animate-pulse" />
          </div>
        </div>
      </motion.div>

      {/* ORACLE AI Status */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
      >
        <div className="bg-black/70 border border-cyan-400/50 rounded-lg px-6 py-2 backdrop-blur-sm">
          <div className="text-cyan-400 text-xs font-mono flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            ORACLE AI: All systems nominal - Standing by for orders
          </div>
        </div>
      </motion.div>
    </div>
  );
};