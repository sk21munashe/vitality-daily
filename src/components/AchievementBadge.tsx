import { motion } from 'framer-motion';
import { Droplets, Utensils, Scale, Flame, Lock } from 'lucide-react';
import { AchievementDefinition, AchievementTier } from '@/types/achievements';
import { format, parseISO } from 'date-fns';
import { Progress } from '@/components/ui/progress';

interface AchievementBadgeProps {
  achievement: AchievementDefinition;
  isUnlocked: boolean;
  unlockedAt?: string;
  progress: number;
  isNewlyUnlocked?: boolean;
}

const tierColors: Record<AchievementTier, { bg: string; border: string; glow: string; text: string }> = {
  bronze: {
    bg: 'from-amber-700/30 to-amber-900/30',
    border: 'border-amber-600/50',
    glow: 'shadow-amber-500/30',
    text: 'text-amber-500',
  },
  silver: {
    bg: 'from-slate-300/30 to-slate-500/30',
    border: 'border-slate-400/50',
    glow: 'shadow-slate-400/30',
    text: 'text-slate-300',
  },
  gold: {
    bg: 'from-yellow-400/30 to-yellow-600/30',
    border: 'border-yellow-500/50',
    glow: 'shadow-yellow-500/40',
    text: 'text-yellow-400',
  },
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Droplets,
  Utensils,
  Scale,
  Flame,
};

export function AchievementBadge({
  achievement,
  isUnlocked,
  unlockedAt,
  progress,
  isNewlyUnlocked,
}: AchievementBadgeProps) {
  const tierStyle = tierColors[achievement.tier];
  const IconComponent = iconMap[achievement.icon] || Flame;

  return (
    <motion.div
      initial={isNewlyUnlocked ? { scale: 0, rotate: -180 } : { opacity: 0, y: 20 }}
      animate={isNewlyUnlocked 
        ? { scale: 1, rotate: 0 } 
        : { opacity: 1, y: 0 }
      }
      transition={isNewlyUnlocked 
        ? { type: 'spring', stiffness: 200, damping: 15 }
        : { duration: 0.3 }
      }
      className={`relative p-4 rounded-2xl border-2 transition-all duration-300 ${
        isUnlocked 
          ? `bg-gradient-to-br ${tierStyle.bg} ${tierStyle.border} shadow-lg ${tierStyle.glow}` 
          : 'bg-muted/30 border-muted-foreground/20 opacity-60'
      }`}
    >
      {/* Unlock animation glow effect */}
      {isNewlyUnlocked && (
        <motion.div
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 2 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${tierStyle.bg} blur-xl`}
        />
      )}

      <div className="relative z-10 flex flex-col items-center text-center gap-2">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          isUnlocked 
            ? `bg-gradient-to-br ${tierStyle.bg}` 
            : 'bg-muted/50'
        }`}>
          {isUnlocked ? (
            <IconComponent className={`w-6 h-6 ${tierStyle.text}`} />
          ) : (
            <Lock className="w-5 h-5 text-muted-foreground" />
          )}
        </div>

        {/* Title */}
        <h3 className={`font-semibold text-sm ${
          isUnlocked ? tierStyle.text : 'text-muted-foreground'
        }`}>
          {achievement.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2">
          {achievement.description}
        </p>

        {/* Tier badge */}
        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
          isUnlocked 
            ? `${tierStyle.bg} ${tierStyle.text}` 
            : 'bg-muted text-muted-foreground'
        }`}>
          {achievement.tier}
        </span>

        {/* Progress or unlock date */}
        {isUnlocked && unlockedAt ? (
          <p className="text-[10px] text-muted-foreground mt-1">
            Earned {format(parseISO(unlockedAt), 'MMM d, yyyy')}
          </p>
        ) : (
          <div className="w-full mt-2">
            <Progress value={progress} className="h-1.5" />
            <p className="text-[10px] text-muted-foreground mt-1">
              {Math.round(progress)}% complete
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
