import { motion } from 'framer-motion';
import { ArchitectureProps } from './types';

export function SpaceArchitecture({ data, onWaterClick, onCaloriesClick }: ArchitectureProps) {
  const stars = Array.from({ length: 30 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 2,
  }));

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-[hsl(240_30%_8%)] via-[hsl(260_30%_12%)] to-[hsl(280_30%_15%)]">
      {/* Stars */}
      {stars.map((star, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: star.delay,
          }}
        />
      ))}

      {/* Water Planet */}
      <motion.div 
        className="absolute left-8 top-1/4 cursor-pointer"
        onClick={onWaterClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="relative"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          {/* Planet */}
          <motion.div
            className="w-24 h-24 rounded-full relative overflow-hidden"
            style={{
              background: 'radial-gradient(circle at 30% 30%, hsl(var(--water-light)), hsl(var(--water)), hsl(var(--water-dark)))',
              boxShadow: '0 0 40px hsl(var(--water) / 0.5), inset -10px -10px 30px hsl(var(--water-dark) / 0.5)',
            }}
            animate={{
              boxShadow: [
                '0 0 40px hsl(var(--water) / 0.5), inset -10px -10px 30px hsl(var(--water-dark) / 0.5)',
                '0 0 60px hsl(var(--water) / 0.7), inset -10px -10px 30px hsl(var(--water-dark) / 0.5)',
                '0 0 40px hsl(var(--water) / 0.5), inset -10px -10px 30px hsl(var(--water-dark) / 0.5)',
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {/* Water waves on planet surface */}
            <motion.div
              className="absolute inset-0 opacity-30"
              style={{
                background: 'repeating-linear-gradient(0deg, transparent, transparent 8px, hsl(var(--water-light)) 8px, hsl(var(--water-light)) 10px)',
              }}
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.div>
          
          {/* Orbiting ring showing progress */}
          <svg className="absolute -inset-4 w-32 h-32" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="hsl(var(--water) / 0.2)"
              strokeWidth="2"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="hsl(var(--water))"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${data.water.progress * 2.83} 283`}
              transform="rotate(-90 50 50)"
              initial={{ strokeDasharray: '0 283' }}
              animate={{ strokeDasharray: `${data.water.progress * 2.83} 283` }}
              transition={{ duration: 1 }}
            />
          </svg>
          
          {/* Label */}
          <div className="text-center mt-6">
            <span className="text-xl font-bold text-water">{Math.round(data.water.progress)}%</span>
            <p className="text-[10px] text-water/70 uppercase tracking-wider">hydration</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Energy Planet */}
      <motion.div 
        className="absolute right-8 top-1/4 cursor-pointer"
        onClick={onCaloriesClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="relative"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          {/* Planet */}
          <motion.div
            className="w-24 h-24 rounded-full relative overflow-hidden"
            style={{
              background: 'radial-gradient(circle at 30% 30%, hsl(var(--nutrition-light)), hsl(var(--nutrition)), hsl(var(--nutrition-dark)))',
              boxShadow: '0 0 40px hsl(var(--nutrition) / 0.5), inset -10px -10px 30px hsl(var(--nutrition-dark) / 0.5)',
            }}
            animate={{
              boxShadow: [
                '0 0 40px hsl(var(--nutrition) / 0.5), inset -10px -10px 30px hsl(var(--nutrition-dark) / 0.5)',
                '0 0 60px hsl(var(--nutrition) / 0.7), inset -10px -10px 30px hsl(var(--nutrition-dark) / 0.5)',
                '0 0 40px hsl(var(--nutrition) / 0.5), inset -10px -10px 30px hsl(var(--nutrition-dark) / 0.5)',
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          >
            {/* Energy pulses */}
            <motion.div
              className="absolute inset-4 rounded-full border-2 border-white/20"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
          
          {/* Orbiting ring */}
          <svg className="absolute -inset-4 w-32 h-32" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="hsl(var(--nutrition) / 0.2)"
              strokeWidth="2"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="hsl(var(--nutrition))"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${data.calories.progress * 2.83} 283`}
              transform="rotate(-90 50 50)"
              initial={{ strokeDasharray: '0 283' }}
              animate={{ strokeDasharray: `${data.calories.progress * 2.83} 283` }}
              transition={{ duration: 1 }}
            />
          </svg>
          
          {/* Label */}
          <div className="text-center mt-6">
            <span className="text-xl font-bold text-nutrition">{Math.round(data.calories.progress)}%</span>
            <p className="text-[10px] text-nutrition/70 uppercase tracking-wider">energy</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Constellation path - 7 day history */}
      <div className="absolute bottom-16 left-8 right-8">
        <svg className="w-full h-20" viewBox="0 0 300 60">
          {/* Connection lines */}
          {data.water.history.slice(-7).map((_, i) => {
            if (i === 0) return null;
            const x1 = (i - 1) * 50;
            const x2 = i * 50;
            const y1 = 30 - ((data.water.history[i - 1]?.value || 0) / data.water.goal) * 20;
            const y2 = 30 - ((data.water.history[i]?.value || 0) / data.water.goal) * 20;
            
            return (
              <motion.line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="hsl(var(--water) / 0.3)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              />
            );
          })}
          
          {/* Star points */}
          {data.water.history.slice(-7).map((day, i) => {
            const progress = day.value / data.water.goal;
            const isToday = i === 6;
            
            return (
              <motion.g key={i}>
                <motion.circle
                  cx={i * 50}
                  cy={30 - progress * 20}
                  r={isToday ? 6 : 4}
                  fill={isToday ? 'hsl(var(--water))' : 'hsl(var(--water) / 0.5)'}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                />
                {isToday && (
                  <motion.circle
                    cx={i * 50}
                    cy={30 - progress * 20}
                    r={10}
                    fill="none"
                    stroke="hsl(var(--water) / 0.3)"
                    animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
                <text
                  x={i * 50}
                  y={55}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[10px]"
                >
                  {new Date(day.date).toLocaleDateString('en', { weekday: 'short' }).charAt(0)}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
