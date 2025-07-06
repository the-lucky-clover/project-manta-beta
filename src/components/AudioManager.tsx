import React, { useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { GameState } from '../types/GameState';

interface AudioManagerProps {
  gameState: GameState;
}

export const AudioManager: React.FC<AudioManagerProps> = ({ gameState }) => {
  const audioRefs = useRef<{ [key: string]: Howl }>({});
  const lastCloakingState = useRef(false);
  const lastPlasmaState = useRef(false);

  useEffect(() => {
    // Initialize audio files
    audioRefs.current = {
      ambient: new Howl({
        src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJeVkVaL'], // Placeholder
        loop: true,
        volume: 0.3
      }),
      plasmaHum: new Howl({
        src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJeVkVaL'], // Placeholder
        loop: true,
        volume: 0.5
      }),
      cloakActivate: new Howl({
        src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJeVkVaL'], // Placeholder
        volume: 0.7
      }),
      thrusterBoost: new Howl({
        src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJeVkVaL'], // Placeholder
        volume: 0.6
      })
    };

    // Start ambient audio
    audioRefs.current.ambient.play();

    return () => {
      // Cleanup
      Object.values(audioRefs.current).forEach(sound => {
        sound.stop();
        sound.unload();
      });
    };
  }, []);

  // Handle cloaking audio
  useEffect(() => {
    if (gameState.cloakingActive !== lastCloakingState.current) {
      if (gameState.cloakingActive) {
        audioRefs.current.cloakActivate?.play();
      }
      lastCloakingState.current = gameState.cloakingActive;
    }
  }, [gameState.cloakingActive]);

  // Handle plasma audio
  useEffect(() => {
    if (gameState.plasmaActive !== lastPlasmaState.current) {
      if (gameState.plasmaActive) {
        audioRefs.current.plasmaHum?.play();
      } else {
        audioRefs.current.plasmaHum?.stop();
      }
      lastPlasmaState.current = gameState.plasmaActive;
    }
  }, [gameState.plasmaActive]);

  // ORACLE AI voice notifications
  useEffect(() => {
    if (gameState.missionActive) {
      // Simulate ORACLE AI speech with visual feedback
      const oracleMessages = [
        "Anti-gravity systems online. Prepare for quantum translation.",
        "Cloaking field stable. We are invisible to conventional sensors.",
        "Mercury plasma rings at optimal resonance frequency.",
        "Mission parameters updated. Proceed with reconnaissance protocol."
      ];
      
      // In a real implementation, this would use Web Speech API or a TTS service
      console.log("ORACLE AI:", oracleMessages[Math.floor(Math.random() * oracleMessages.length)]);
    }
  }, [gameState.missionActive, gameState.cloakingActive, gameState.plasmaActive]);

  // Spatial audio positioning (for future WebXR implementation)
  useEffect(() => {
    if (gameState.spacecraft && audioRefs.current.plasmaHum) {
      // Position audio based on spacecraft location
      // This would be enhanced for 3D spatial audio in WebXR
      const distance = gameState.spacecraft.position.length();
      const volume = Math.max(0.1, 1 - distance * 0.01);
      
      audioRefs.current.plasmaHum.volume(volume);
    }
  }, [gameState.spacecraft?.position]);

  return null; // This component doesn't render anything visible
};