import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { useAchievements } from '@/hooks/useAchievements';
import { AchievementBadge } from '@/components/AchievementBadge';
import { DashboardCard } from '@/components/DashboardCard';

export function AchievementsSection() {
  const { 
    achievements, 
    isUnlocked, 
    getUnlockDate, 
    getAchievementProgress,
    newlyUnlocked,
    unlockedAchievements,
  } = useAchievements();

  const unlockedCount = unlockedAchievements.length;
  const totalCount = achievements.length;

  // Sort: unlocked first, then by tier (gold > silver > bronze)
  const tierOrder = { gold: 0, silver: 1, bronze: 2 };
  const sortedAchievements = [...achievements].sort((a, b) => {
    const aUnlocked = isUnlocked(a.id);
    const bUnlocked = isUnlocked(b.id);
    if (aUnlocked !== bUnlocked) return aUnlocked ? -1 : 1;
    return tierOrder[a.tier] - tierOrder[b.tier];
  });

  return (
    <DashboardCard className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <h2 className="font-semibold">Achievements</h2>
        </div>
        <span className="text-sm text-muted-foreground">
          {unlockedCount}/{totalCount}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-muted rounded-full mb-5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full"
        />
      </div>

      {/* Badge grid */}
      <div className="grid grid-cols-4 gap-1">
        {sortedAchievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.03 }}
          >
            <AchievementBadge
              achievement={achievement}
              isUnlocked={isUnlocked(achievement.id)}
              unlockedAt={getUnlockDate(achievement.id)}
              progress={getAchievementProgress(achievement)}
              isNewlyUnlocked={newlyUnlocked === achievement.id}
            />
          </motion.div>
        ))}
      </div>
    </DashboardCard>
  );
}
