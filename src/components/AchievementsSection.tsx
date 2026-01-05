import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Droplets, Utensils, Scale, Flame } from 'lucide-react';
import { useAchievements } from '@/hooks/useAchievements';
import { AchievementBadge } from '@/components/AchievementBadge';
import { AchievementCategory } from '@/types/achievements';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const categoryIcons: Record<AchievementCategory | 'all', React.ReactNode> = {
  all: <Trophy className="w-4 h-4" />,
  hydration: <Droplets className="w-4 h-4" />,
  nutrition: <Utensils className="w-4 h-4" />,
  weight: <Scale className="w-4 h-4" />,
  streak: <Flame className="w-4 h-4" />,
};

const categoryLabels: Record<AchievementCategory | 'all', string> = {
  all: 'All',
  hydration: 'Hydration',
  nutrition: 'Nutrition',
  weight: 'Weight',
  streak: 'Streaks',
};

export function AchievementsSection() {
  const [activeCategory, setActiveCategory] = useState<AchievementCategory | 'all'>('all');
  const { 
    achievements, 
    isUnlocked, 
    getUnlockDate, 
    getAchievementProgress,
    newlyUnlocked,
    unlockedAchievements,
  } = useAchievements();

  const filteredAchievements = activeCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === activeCategory);

  const unlockedCount = unlockedAchievements.length;
  const totalCount = achievements.length;

  return (
    <div className="space-y-4">
      {/* Header with count */}
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
          Achievements
        </h2>
        <span className="text-sm text-muted-foreground">
          {unlockedCount}/{totalCount} unlocked
        </span>
      </div>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as AchievementCategory | 'all')}>
        <TabsList className="w-full justify-start overflow-x-auto h-auto p-1 gap-1">
          {(Object.keys(categoryLabels) as (AchievementCategory | 'all')[]).map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {categoryIcons[category]}
              <span className="hidden sm:inline">{categoryLabels[category]}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory} className="mt-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4"
          >
            {filteredAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
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
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
