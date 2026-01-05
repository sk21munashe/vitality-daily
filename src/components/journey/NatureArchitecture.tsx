import { motion } from 'framer-motion';
import { ArchitectureProps } from './types';

export function NatureArchitecture({ data, onWaterClick, onCaloriesClick }: ArchitectureProps) {
  const leaves = Array.from({ length: Math.floor(data.calories.progress / 15) + 1 }, (_, i) => i);
  const ripples = [0, 1, 2];

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-background via-nutrition/5 to-water/10">
      {/* Sun/Moon based on progress */}
      <motion.div
        className="absolute right-8 top-8"
        animate={{ 
          y: [0, -5, 0],
          rotate: [0, 5, 0],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <div 
          className="w-16 h-16 rounded-full"
          style={{
            background: `radial-gradient(circle, ${
              (data.water.progress + data.calories.progress) / 2 > 50 
                ? 'hsl(45 100% 60%), hsl(35 100% 50%)' 
                : 'hsl(220 30% 70%), hsl(220 30% 50%)'
            })`,
            boxShadow: '0 0 40px hsl(45 100% 60% / 0.4)',
          }}
        />
      </motion.div>

      {/* Ground/Soil */}
      <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-[hsl(25_40%_25%)] to-transparent" />

      {/* Growing tree for calories */}
      <motion.div 
        className="absolute left-1/2 -translate-x-1/2 bottom-20 cursor-pointer"
        onClick={onCaloriesClick}
        whileTap={{ scale: 0.98 }}
      >
        {/* Tree trunk */}
        <motion.div
          className="w-8 mx-auto rounded-t-lg bg-gradient-to-t from-[hsl(25_50%_30%)] to-[hsl(25_40%_40%)]"
          initial={{ height: 20 }}
          animate={{ height: 40 + data.calories.progress * 0.8 }}
          transition={{ duration: 1 }}
        />
        
        {/* Tree canopy */}
        <motion.div
          className="relative -mt-8"
          initial={{ scale: 0 }}
          animate={{ scale: 0.5 + (data.calories.progress / 200) }}
          transition={{ duration: 1 }}
        >
          <div className="w-32 h-32 rounded-full bg-gradient-to-b from-nutrition to-nutrition-dark mx-auto opacity-90" />
          <div className="absolute top-4 left-4 w-24 h-24 rounded-full bg-gradient-to-br from-nutrition/80 to-nutrition-dark/80" />
          
          {/* Leaves floating off */}
          {leaves.slice(0, 6).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-lg"
              style={{ left: `${20 + (i % 3) * 25}%`, top: `${20 + Math.floor(i / 3) * 30}%` }}
              animate={{
                y: [0, -20, 0],
                x: [0, i % 2 === 0 ? 10 : -10, 0],
                rotate: [0, i % 2 === 0 ? 20 : -20, 0],
              }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
            >
              🍃
            </motion.div>
          ))}
        </motion.div>

        {/* Progress label */}
        <motion.div 
          className="text-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="text-xl font-bold text-nutrition">{Math.round(data.calories.progress)}%</span>
          <p className="text-xs text-muted-foreground">{data.calories.current} kcal</p>
        </motion.div>
      </motion.div>

      {/* River/Water stream */}
      <motion.div 
        className="absolute left-4 bottom-8 right-4 cursor-pointer"
        onClick={onWaterClick}
        whileTap={{ scale: 0.98 }}
      >
        {/* River bed */}
        <div className="relative h-16 rounded-full overflow-hidden bg-water-dark/30">
          {/* Flowing water */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-water via-water-light to-water"
            style={{ width: `${data.water.progress}%` }}
            animate={{
              backgroundPosition: ['0% 0%', '100% 0%'],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
          
          {/* Ripples */}
          {ripples.map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-white/30"
              style={{ left: `${20 + i * 25}%` }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}
          
          {/* Fish emoji */}
          {data.water.progress > 30 && (
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 text-xl"
              animate={{ 
                x: [0, 100, 0],
                scaleX: [1, 1, -1, -1, 1],
              }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              🐟
            </motion.div>
          )}
        </div>
        
        {/* Water label */}
        <div className="flex justify-between mt-2">
          <span className="text-sm font-bold text-water">{Math.round(data.water.progress)}%</span>
          <span className="text-xs text-muted-foreground">{Math.round(data.water.current / 1000 * 10) / 10}L</span>
        </div>
      </motion.div>

      {/* 7-day garden */}
      <div className="absolute top-1/4 left-4 right-4 flex justify-between">
        {data.water.history.slice(-7).map((day, i) => {
          const combinedProgress = ((day.value / data.water.goal) + ((data.calories.history[i]?.value || 0) / data.calories.goal)) / 2;
          return (
            <motion.div
              key={i}
              className="flex flex-col items-center"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <motion.div
                className="text-2xl"
                animate={{ rotate: combinedProgress >= 0.8 ? [0, 5, -5, 0] : 0 }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {combinedProgress >= 0.8 ? '🌳' : combinedProgress >= 0.5 ? '🌿' : combinedProgress >= 0.2 ? '🌱' : '·'}
              </motion.div>
              <span className="text-[10px] text-muted-foreground mt-1">
                {new Date(day.date).toLocaleDateString('en', { weekday: 'short' }).charAt(0)}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
