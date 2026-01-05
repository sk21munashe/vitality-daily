import { motion } from 'framer-motion';
import { ArchitectureProps } from './types';

export function ScientificArchitecture({ data, onWaterClick, onCaloriesClick }: ArchitectureProps) {
  const waterMolecules = Array.from({ length: Math.floor(data.water.progress / 10) }, (_, i) => i);
  const energyParticles = Array.from({ length: Math.floor(data.calories.progress / 10) }, (_, i) => i);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Water molecules section */}
      <motion.div 
        className="absolute left-4 top-1/4 cursor-pointer"
        onClick={onWaterClick}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative w-40 h-40">
          {/* H2O Label */}
          <motion.div
            className="absolute -top-8 left-0 text-water font-mono text-sm font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            H₂O • {Math.round(data.water.current)}ml
          </motion.div>
          
          {/* Central molecule */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-water/30 border-2 border-water flex items-center justify-center"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-water font-bold text-lg">{Math.round(data.water.progress)}%</span>
          </motion.div>

          {/* Orbiting molecules */}
          {waterMolecules.slice(0, 8).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full bg-water shadow-water"
              style={{
                left: '50%',
                top: '50%',
              }}
              animate={{
                x: [0, Math.cos((i * 45 * Math.PI) / 180) * 50],
                y: [0, Math.sin((i * 45 * Math.PI) / 180) * 50],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Calories energy section */}
      <motion.div 
        className="absolute right-4 top-1/4 cursor-pointer"
        onClick={onCaloriesClick}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative w-40 h-40">
          {/* kcal Label */}
          <motion.div
            className="absolute -top-8 right-0 text-nutrition font-mono text-sm font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {data.calories.current} kcal
          </motion.div>

          {/* Energy core */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-nutrition/30 border-2 border-nutrition flex items-center justify-center"
            animate={{ 
              boxShadow: [
                '0 0 20px hsl(var(--nutrition) / 0.3)',
                '0 0 40px hsl(var(--nutrition) / 0.5)',
                '0 0 20px hsl(var(--nutrition) / 0.3)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-nutrition font-bold text-lg">{Math.round(data.calories.progress)}%</span>
          </motion.div>

          {/* Energy particles */}
          {energyParticles.slice(0, 8).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-nutrition"
              style={{
                left: '50%',
                top: '50%',
              }}
              animate={{
                x: [0, Math.cos((i * 45 * Math.PI) / 180 + Date.now() / 1000) * 60],
                y: [0, Math.sin((i * 45 * Math.PI) / 180 + Date.now() / 1000) * 60],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* 7-day trend chart */}
      <div className="absolute bottom-8 left-4 right-4">
        <div className="flex items-end justify-between h-24 gap-1">
          {data.water.history.slice(-7).map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="flex gap-0.5 h-16 items-end">
                <motion.div
                  className="w-2 bg-water/60 rounded-t"
                  initial={{ height: 0 }}
                  animate={{ height: `${(day.value / data.water.goal) * 100}%` }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                />
                <motion.div
                  className="w-2 bg-nutrition/60 rounded-t"
                  initial={{ height: 0 }}
                  animate={{ height: `${((data.calories.history[i]?.value || 0) / data.calories.goal) * 100}%` }}
                  transition={{ delay: i * 0.1 + 0.05, duration: 0.5 }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground font-mono">
                {new Date(day.date).toLocaleDateString('en', { weekday: 'short' }).charAt(0)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
