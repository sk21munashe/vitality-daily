import { motion } from 'framer-motion';
import { ArchitectureProps } from './types';

export function FunArchitecture({ data, onWaterClick, onCaloriesClick }: ArchitectureProps) {
  const waterDrops = Array.from({ length: 5 }, (_, i) => i);
  const stars = Array.from({ length: Math.floor(data.calories.progress / 20) + 1 }, (_, i) => i);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Rainbow gradient background */}
      <motion.div 
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            'linear-gradient(45deg, hsl(var(--water) / 0.3), hsl(var(--nutrition) / 0.3))',
            'linear-gradient(90deg, hsl(var(--nutrition) / 0.3), hsl(var(--water) / 0.3))',
            'linear-gradient(135deg, hsl(var(--water) / 0.3), hsl(var(--nutrition) / 0.3))',
          ]
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Water character */}
      <motion.div 
        className="absolute left-8 top-1/3 cursor-pointer"
        onClick={onWaterClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.div
          className="relative"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {/* Water drop body */}
          <div className="w-20 h-24 relative">
            <svg viewBox="0 0 40 48" className="w-full h-full">
              <motion.path
                d="M20 4 C8 20 4 28 4 36 C4 44 11 48 20 48 C29 48 36 44 36 36 C36 28 32 20 20 4Z"
                fill="hsl(var(--water))"
                animate={{ 
                  d: [
                    "M20 4 C8 20 4 28 4 36 C4 44 11 48 20 48 C29 48 36 44 36 36 C36 28 32 20 20 4Z",
                    "M20 6 C10 20 6 28 6 36 C6 42 12 46 20 46 C28 46 34 42 34 36 C34 28 30 20 20 6Z",
                    "M20 4 C8 20 4 28 4 36 C4 44 11 48 20 48 C29 48 36 44 36 36 C36 28 32 20 20 4Z",
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              {/* Eyes */}
              <circle cx="14" cy="30" r="2" fill="white" />
              <circle cx="26" cy="30" r="2" fill="white" />
              <circle cx="14" cy="31" r="1" fill="#333" />
              <circle cx="26" cy="31" r="1" fill="#333" />
              {/* Smile */}
              <motion.path
                d="M14 36 Q20 40 26 36"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                animate={{ d: data.water.progress > 50 ? "M14 36 Q20 42 26 36" : "M14 38 Q20 38 26 38" }}
              />
            </svg>
          </div>
          
          {/* Progress text */}
          <div className="text-center mt-2">
            <motion.span 
              className="text-2xl font-bold text-water"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5 }}
              key={data.water.current}
            >
              {Math.round(data.water.progress)}%
            </motion.span>
            <p className="text-xs text-muted-foreground">
              {Math.round(data.water.current / 1000 * 10) / 10}L
            </p>
          </div>
        </motion.div>

        {/* Celebration drops */}
        {data.water.progress >= 100 && waterDrops.map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl"
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: -50, opacity: 0, x: (i - 2) * 20 }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          >
            💧
          </motion.div>
        ))}
      </motion.div>

      {/* Calories character */}
      <motion.div 
        className="absolute right-8 top-1/3 cursor-pointer"
        onClick={onCaloriesClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.div
          className="relative"
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {/* Fire/Energy body */}
          <div className="w-20 h-24 relative flex items-center justify-center">
            <motion.div
              className="text-6xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              🔥
            </motion.div>
          </div>
          
          {/* Progress text */}
          <div className="text-center mt-2">
            <motion.span 
              className="text-2xl font-bold text-nutrition"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5 }}
              key={data.calories.current}
            >
              {Math.round(data.calories.progress)}%
            </motion.span>
            <p className="text-xs text-muted-foreground">
              {data.calories.current} kcal
            </p>
          </div>
        </motion.div>

        {/* Celebration stars */}
        {stars.map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-xl"
            style={{ left: `${(i % 3) * 30}%`, top: `${Math.floor(i / 3) * 30}%` }}
            animate={{ 
              scale: [0, 1, 0],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          >
            ⭐
          </motion.div>
        ))}
      </motion.div>

      {/* Progress path */}
      <div className="absolute bottom-16 left-8 right-8">
        <div className="relative h-4 bg-muted/50 rounded-full overflow-hidden">
          <motion.div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-water to-nutrition rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(data.water.progress + data.calories.progress) / 2}%` }}
            transition={{ duration: 1 }}
          />
          
          {/* Runner emoji */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 text-lg"
            animate={{ left: `${Math.min((data.water.progress + data.calories.progress) / 2, 95)}%` }}
            transition={{ duration: 1 }}
          >
            🏃
          </motion.div>
        </div>
        
        {/* Day labels */}
        <div className="flex justify-between mt-4">
          {data.water.history.slice(-7).map((day, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <motion.div
                className="text-lg"
                animate={{ scale: i === 6 ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.5, repeat: i === 6 ? Infinity : 0 }}
              >
                {(day.value / data.water.goal) >= 1 ? '🏆' : (day.value / data.water.goal) >= 0.5 ? '⭐' : '○'}
              </motion.div>
              <span className="text-[10px] text-muted-foreground">
                {new Date(day.date).toLocaleDateString('en', { weekday: 'short' }).charAt(0)}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
