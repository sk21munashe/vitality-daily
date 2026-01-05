import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Droplets, 
  Utensils, 
  Target, 
  Sparkles, 
  Trophy, 
  ChevronRight, 
  X,
  Flame
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const TOUR_STORAGE_KEY = 'wellness_tour_completed';

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  emoji: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Your Wellness Journey! 🎉',
    description: 'We\'re excited to have you here! Let us show you around the app so you can start tracking your health goals.',
    icon: Sparkles,
    color: 'from-primary to-accent',
    emoji: '👋',
  },
  {
    id: 'water',
    title: 'Track Your Hydration',
    description: 'Log your water intake easily with quick add buttons. Stay hydrated and watch your progress fill up throughout the day!',
    icon: Droplets,
    color: 'from-blue-500 to-cyan-500',
    emoji: '💧',
  },
  {
    id: 'meals',
    title: 'Log Your Meals',
    description: 'Track calories and nutrition by logging your meals. Use our AI-powered food scanner for quick entries!',
    icon: Utensils,
    color: 'from-orange-500 to-amber-500',
    emoji: '🥗',
  },
  {
    id: 'goals',
    title: 'Set Your Goals',
    description: 'Customize your daily water and calorie goals in your profile. Get AI-suggested targets based on your needs!',
    icon: Target,
    color: 'from-green-500 to-emerald-500',
    emoji: '🎯',
  },
  {
    id: 'streaks',
    title: 'Build Your Streak',
    description: 'Use the app daily to build your streak! The longer your streak, the more achievements you\'ll unlock.',
    icon: Flame,
    color: 'from-orange-500 to-red-500',
    emoji: '🔥',
  },
  {
    id: 'achievements',
    title: 'Earn Achievements',
    description: 'Complete challenges and hit milestones to earn badges. Check your profile to see all your achievements!',
    icon: Trophy,
    color: 'from-yellow-500 to-amber-500',
    emoji: '🏆',
  },
];

interface WelcomeTourProps {
  onComplete: () => void;
}

export function WelcomeTour({ onComplete }: WelcomeTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    setIsVisible(false);
    setTimeout(onComplete, 300);
  };

  const step = TOUR_STEPS[currentStep];
  const Icon = step.icon;
  const isLastStep = currentStep === TOUR_STEPS.length - 1;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-sm bg-card rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Progress dots */}
            <div className="flex justify-center gap-1.5 pt-4 pb-2">
              {TOUR_STEPS.map((_, index) => (
                <motion.div
                  key={index}
                  initial={false}
                  animate={{
                    width: index === currentStep ? 24 : 8,
                    backgroundColor: index <= currentStep ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
                  }}
                  className="h-2 rounded-full"
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>

            {/* Close button */}
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted/50 transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Content */}
            <div className="px-6 py-4 text-center">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
                className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}
              >
                <Icon className="w-10 h-10 text-white" />
              </motion.div>

              {/* Emoji */}
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl block mb-2"
              >
                {step.emoji}
              </motion.span>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-xl font-bold mb-2"
              >
                {step.title}
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-muted-foreground text-sm leading-relaxed"
              >
                {step.description}
              </motion.p>
            </div>

            {/* Actions */}
            <div className="px-6 pb-6 pt-2 flex gap-3">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="flex-1"
                >
                  Back
                </Button>
              )}
              <Button
                onClick={handleNext}
                className={`flex-1 ${currentStep === 0 ? 'w-full' : ''}`}
              >
                {isLastStep ? (
                  "Let's Go!"
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            </div>

            {/* Skip link */}
            {!isLastStep && (
              <div className="pb-4 text-center">
                <button
                  onClick={handleSkip}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Skip tour
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function useTourStatus() {
  const [showTour, setShowTour] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    const tourCompleted = localStorage.getItem(TOUR_STORAGE_KEY);
    const justCompletedOnboarding = sessionStorage.getItem('just_completed_onboarding');
    
    if (!tourCompleted && justCompletedOnboarding === 'true') {
      setShowTour(true);
      setIsNewUser(true);
      sessionStorage.removeItem('just_completed_onboarding');
    }
  }, []);

  const completeTour = () => {
    setShowTour(false);
    setIsNewUser(false);
  };

  return { showTour, isNewUser, completeTour };
}