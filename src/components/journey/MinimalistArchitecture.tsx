import { motion } from 'framer-motion';
import { ArchitectureProps } from './types';

export function MinimalistArchitecture({ data, onWaterClick, onCaloriesClick }: ArchitectureProps) {
  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col justify-center px-8">
      {/* Main metrics */}
      <div className="space-y-12">
        {/* Water */}
        <motion.div 
          className="cursor-pointer group"
          onClick={onWaterClick}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-baseline gap-4">
            <motion.span 
              className="text-6xl font-extralight tracking-tight text-water"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              key={data.water.current}
            >
              {Math.round(data.water.progress)}
            </motion.span>
            <span className="text-2xl font-light text-water/60">%</span>
          </div>
          
          {/* Progress line */}
          <div className="mt-4 h-px bg-border relative overflow-hidden">
            <motion.div
              className="absolute left-0 top-0 h-full bg-water"
              initial={{ width: 0 }}
              animate={{ width: `${data.water.progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-water"
              animate={{ left: `${Math.min(data.water.progress, 98)}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          
          <div className="mt-2 flex justify-between items-center">
            <span className="text-xs tracking-widest uppercase text-muted-foreground">water</span>
            <span className="text-xs text-muted-foreground font-light">
              {Math.round(data.water.current / 1000 * 10) / 10}L / {data.water.goal / 1000}L
            </span>
          </div>
        </motion.div>

        {/* Calories */}
        <motion.div 
          className="cursor-pointer group"
          onClick={onCaloriesClick}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-baseline gap-4">
            <motion.span 
              className="text-6xl font-extralight tracking-tight text-nutrition"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              key={data.calories.current}
            >
              {Math.round(data.calories.progress)}
            </motion.span>
            <span className="text-2xl font-light text-nutrition/60">%</span>
          </div>
          
          {/* Progress line */}
          <div className="mt-4 h-px bg-border relative overflow-hidden">
            <motion.div
              className="absolute left-0 top-0 h-full bg-nutrition"
              initial={{ width: 0 }}
              animate={{ width: `${data.calories.progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-nutrition"
              animate={{ left: `${Math.min(data.calories.progress, 98)}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          
          <div className="mt-2 flex justify-between items-center">
            <span className="text-xs tracking-widest uppercase text-muted-foreground">energy</span>
            <span className="text-xs text-muted-foreground font-light">
              {data.calories.current} / {data.calories.goal} kcal
            </span>
          </div>
        </motion.div>
      </div>

      {/* 7-day trend - minimal dots */}
      <div className="absolute bottom-8 left-8 right-8">
        <div className="flex justify-between items-end h-16">
          {data.water.history.slice(-7).map((day, i) => {
            const waterPct = (day.value / data.water.goal) * 100;
            const calPct = ((data.calories.history[i]?.value || 0) / data.calories.goal) * 100;
            const isToday = i === 6;
            
            return (
              <motion.div
                key={i}
                className="flex flex-col items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                {/* Stacked dots */}
                <div className="relative h-10 flex flex-col justify-end gap-1">
                  <motion.div
                    className={`w-1.5 rounded-full bg-water ${isToday ? 'opacity-100' : 'opacity-40'}`}
                    initial={{ height: 0 }}
                    animate={{ height: Math.max(2, waterPct * 0.3) }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  />
                  <motion.div
                    className={`w-1.5 rounded-full bg-nutrition ${isToday ? 'opacity-100' : 'opacity-40'}`}
                    initial={{ height: 0 }}
                    animate={{ height: Math.max(2, calPct * 0.3) }}
                    transition={{ delay: i * 0.1 + 0.05, duration: 0.5 }}
                  />
                </div>
                
                <span className={`text-[10px] ${isToday ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  {new Date(day.date).toLocaleDateString('en', { weekday: 'short' }).charAt(0)}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
