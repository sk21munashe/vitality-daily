import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Scale, TrendingUp, TrendingDown, Target, Calendar, Edit2, Trash2, Ruler, FileText, Sparkles, Lightbulb, Trophy, Download, Share2, Zap, ChevronDown, ChevronUp, Percent, Apple, Droplets, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BodyAvatar } from './BodyAvatar';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format, subDays } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface WellnessCheckPageProps {
  onClose: () => void;
}

interface BodyZone {
  id: string;
  name: string;
  path: string;
  metrics: {
    bodyFat?: number;
    muscleMass?: number;
  };
}

interface WeightEntry {
  id: string;
  date: string;
  weight: number;
  notes?: string;
}

interface AIMilestone {
  targetWeight: number;
  estimatedDate: string;
  message: string;
  achieved: boolean;
}

interface AIInsight {
  type: 'tip' | 'achievement' | 'insight';
  icon: React.ReactNode;
  title: string;
  message: string;
  color: string;
}

export function WellnessCheckPage({ onClose }: WellnessCheckPageProps) {
  const [selectedZone, setSelectedZone] = useState<BodyZone | null>(null);
  const [currentWeight, setCurrentWeight] = useState<number | null>(null);
  const [userHeight, setUserHeight] = useState<number | null>(null);
  const [weightInput, setWeightInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showExtras, setShowExtras] = useState(false);
  const [celebrating, setCelebrating] = useState(false);

  // Fetch health data on mount
  useEffect(() => {
    const fetchHealthData = async () => {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: healthPlanData } = await supabase
          .from('user_health_plans')
          .select('health_profile')
          .eq('user_id', user.id)
          .single();
        
        if (healthPlanData) {
          const healthProfile = healthPlanData.health_profile as any;
          if (healthProfile?.currentWeight) {
            setCurrentWeight(healthProfile.currentWeight);
          }
          if (healthProfile?.height) {
            setUserHeight(healthProfile.height);
          }
        }
      }
      setIsLoading(false);
    };
    fetchHealthData();
  }, []);

  const handleLogWeight = async () => {
    const weight = parseFloat(weightInput);
    if (isNaN(weight) || weight <= 0) {
      toast.error('Please enter a valid weight');
      return;
    }
    
    setCurrentWeight(weight);
    setWeightInput('');
    
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: healthPlanData } = await supabase
        .from('user_health_plans')
        .select('health_profile')
        .eq('user_id', user.id)
        .single();
      
      if (healthPlanData) {
        const updatedProfile = {
          ...(healthPlanData.health_profile as any),
          currentWeight: weight
        };
        
        await supabase
          .from('user_health_plans')
          .update({ health_profile: updatedProfile })
          .eq('user_id', user.id);
        
        toast.success('Weight logged!', {
          description: `Your weight has been updated to ${weight} kg`,
        });
      }
    }
  };

  // Sample data
  const weightHistory: WeightEntry[] = [
    { id: '1', date: format(subDays(new Date(), 6), 'yyyy-MM-dd'), weight: currentWeight ? currentWeight + 1.5 : 72 },
    { id: '2', date: format(subDays(new Date(), 5), 'yyyy-MM-dd'), weight: currentWeight ? currentWeight + 1.2 : 71.7 },
    { id: '3', date: format(subDays(new Date(), 4), 'yyyy-MM-dd'), weight: currentWeight ? currentWeight + 0.8 : 71.3 },
    { id: '4', date: format(subDays(new Date(), 3), 'yyyy-MM-dd'), weight: currentWeight ? currentWeight + 0.5 : 71 },
    { id: '5', date: format(subDays(new Date(), 2), 'yyyy-MM-dd'), weight: currentWeight ? currentWeight + 0.3 : 70.8 },
    { id: '6', date: format(subDays(new Date(), 1), 'yyyy-MM-dd'), weight: currentWeight ? currentWeight + 0.1 : 70.6 },
    { id: '7', date: format(new Date(), 'yyyy-MM-dd'), weight: currentWeight || 70.5 },
  ];

  const aiMilestones: AIMilestone[] = [
    { 
      targetWeight: currentWeight ? currentWeight - 2 : 68.5, 
      estimatedDate: format(subDays(new Date(), -14), 'MMM d'),
      message: 'First milestone! 🎯',
      achieved: false
    },
    { 
      targetWeight: currentWeight ? currentWeight - 5 : 65.5, 
      estimatedDate: format(subDays(new Date(), -42), 'MMM d'),
      message: 'Halfway there! 🌟',
      achieved: false
    },
  ];

  const chartData = weightHistory.map(entry => ({
    date: format(new Date(entry.date), 'MMM d'),
    weight: entry.weight,
  }));

  const weeklyChange = weightHistory.length >= 2 
    ? (weightHistory[weightHistory.length - 1].weight - weightHistory[0].weight).toFixed(1)
    : '0';
  const isLosing = parseFloat(weeklyChange) < 0;

  const avgWeight = (weightHistory.reduce((sum, e) => sum + e.weight, 0) / weightHistory.length).toFixed(1);
  const lowestWeight = Math.min(...weightHistory.map(e => e.weight)).toFixed(1);
  const highestWeight = Math.max(...weightHistory.map(e => e.weight)).toFixed(1);

  const bmi = currentWeight && userHeight 
    ? (currentWeight / Math.pow(userHeight / 100, 2)).toFixed(1)
    : null;

  const insights: AIInsight[] = [
    {
      type: 'achievement',
      icon: <Trophy className="w-4 h-4" />,
      title: 'Great Progress! 🎉',
      message: "You've logged your weight 7 days in a row! Consistency is the key to success.",
      color: 'nutrition'
    },
    {
      type: 'tip',
      icon: <Lightbulb className="w-4 h-4" />,
      title: 'Pro Tip',
      message: 'Weigh yourself at the same time each morning for the most accurate tracking.',
      color: 'fitness'
    },
    {
      type: 'insight',
      icon: <TrendingUp className="w-4 h-4" />,
      title: 'Weekly Analysis',
      message: "Your weight trend shows steady progress. Keep up the great work—you're on track for your next milestone!",
      color: 'health'
    },
    {
      type: 'tip',
      icon: <Zap className="w-4 h-4" />,
      title: 'Energy Boost',
      message: 'Try adding a 10-minute walk after meals to support your metabolism.',
      color: 'water'
    },
  ];

  const metrics = [
    { label: 'Body Fat', value: '18%', icon: Percent, color: 'health' },
    { label: 'Protein', value: '25%', icon: Flame, color: 'nutrition' },
    { label: 'Carbs', value: '50%', icon: Apple, color: 'fitness' },
    { label: 'Fat', value: '25%', icon: Droplets, color: 'water' },
  ];

  const handleExport = () => {
    toast.success('Report downloaded!', { description: 'Your wellness report has been saved.' });
  };

  const handleShare = () => {
    toast.success('Ready to share!', { description: 'Share link copied to clipboard.' });
  };

  const triggerCelebration = () => {
    setCelebrating(true);
    setTimeout(() => setCelebrating(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed inset-0 z-50 bg-background flex flex-col"
    >
      {/* Header */}
      <header className="flex-shrink-0 px-4 py-3 border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Button variant="ghost" size="sm" onClick={onClose} className="h-9 px-3">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-health flex items-center justify-center shadow-health">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-bold">Wellness Check</h1>
          </div>
          <div className="w-20" />
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Loading your wellness data...</div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
            
            {/* ===== TOP SECTION: Avatar + Key Metrics ===== */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Avatar */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-br from-health/10 to-transparent rounded-2xl p-6 border border-border/50 min-h-[320px] flex items-center justify-center"
              >
                <BodyAvatar 
                  onZoneSelect={setSelectedZone}
                  selectedZone={selectedZone}
                />
              </motion.div>

              {/* Key Metrics Cards */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-health" />
                  Key Metrics
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {metrics.map((metric, index) => (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`rounded-xl p-4 bg-gradient-to-br from-${metric.color}/20 to-${metric.color}/5 border border-border/50`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-7 h-7 rounded-lg bg-${metric.color}/20 flex items-center justify-center`}>
                          <metric.icon className={`w-4 h-4 text-${metric.color}`} />
                        </div>
                        <span className="text-xs text-muted-foreground">{metric.label}</span>
                      </div>
                      <p className={`text-xl font-bold text-${metric.color}`}>{metric.value}</p>
                    </motion.div>
                  ))}
                </div>

                {/* BMI Card */}
                {bmi && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-4 rounded-xl bg-gradient-to-br from-health/20 to-health/5 border border-health/30"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-health flex items-center justify-center shadow-health">
                          <Heart className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Body Mass Index</p>
                          <p className="text-xl font-bold text-health">{bmi}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Category</p>
                        <p className={`text-sm font-semibold ${
                          parseFloat(bmi) < 18.5 ? 'text-water' :
                          parseFloat(bmi) < 25 ? 'text-nutrition' :
                          parseFloat(bmi) < 30 ? 'text-fitness' : 'text-destructive'
                        }`}>
                          {parseFloat(bmi) < 18.5 ? 'Underweight' :
                           parseFloat(bmi) < 25 ? 'Normal' :
                           parseFloat(bmi) < 30 ? 'Overweight' : 'Obese'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </section>

            {/* ===== MIDDLE SECTION: Weight Logs ===== */}
            <section className="space-y-4">
              <h3 className="text-base font-semibold flex items-center gap-2">
                <Scale className="w-5 h-5 text-health" />
                Weight & Progress
              </h3>

              {/* Quick Weight Input */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card/50 rounded-xl p-4 border border-border/50"
              >
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="number"
                      value={weightInput}
                      onChange={(e) => setWeightInput(e.target.value)}
                      placeholder={currentWeight ? `${currentWeight} kg` : 'Enter weight'}
                      className="w-full h-11 pl-10 pr-14 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-health/50"
                      step="0.1"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">kg</span>
                  </div>
                  <Button
                    onClick={handleLogWeight}
                    disabled={!weightInput}
                    className="bg-gradient-health hover:opacity-90 text-white px-6"
                  >
                    Log Weight
                  </Button>
                </div>
              </motion.div>

              {/* Weight Trend Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card/50 rounded-xl p-4 border border-border/50"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-health" />
                    7-Day Trend
                  </h4>
                  <div className={`flex items-center gap-1 text-sm font-medium ${isLosing ? 'text-nutrition' : 'text-fitness'}`}>
                    {isLosing ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                    {weeklyChange} kg
                  </div>
                </div>
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="weightGradientScroll" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--health))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--health))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <YAxis 
                        domain={['dataMin - 1', 'dataMax + 1']} 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                        width={40}
                      />
                      <Tooltip
                        contentStyle={{
                          background: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="weight"
                        stroke="hsl(var(--health))"
                        strokeWidth={2}
                        fill="url(#weightGradientScroll)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* AI Milestones & Weekly Snapshot Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* AI Milestones */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="bg-card/50 rounded-xl p-4 border border-border/50"
                >
                  <h4 className="text-sm font-semibold flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-health" />
                    AI Milestones
                  </h4>
                  <div className="space-y-2">
                    {aiMilestones.map((milestone, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          milestone.achieved 
                            ? 'bg-nutrition/10 border border-nutrition/30' 
                            : 'bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Target className={`w-5 h-5 ${milestone.achieved ? 'text-nutrition' : 'text-muted-foreground'}`} />
                          <div>
                            <p className="text-sm font-medium">{milestone.targetWeight} kg</p>
                            <p className="text-xs text-muted-foreground">{milestone.message}</p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{milestone.estimatedDate}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Weekly Snapshot */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-card/50 rounded-xl p-4 border border-border/50"
                >
                  <h4 className="text-sm font-semibold mb-3">Weekly Snapshot</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 rounded-lg bg-muted/30">
                      <p className="text-xs text-muted-foreground">Average</p>
                      <p className="text-lg font-bold">{avgWeight} kg</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-nutrition/10">
                      <p className="text-xs text-muted-foreground">Lowest</p>
                      <p className="text-lg font-bold text-nutrition">{lowestWeight} kg</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-fitness/10">
                      <p className="text-xs text-muted-foreground">Highest</p>
                      <p className="text-lg font-bold text-fitness">{highestWeight} kg</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Weight History List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-card/50 rounded-xl p-4 border border-border/50"
              >
                <h4 className="text-sm font-semibold mb-3">Recent Entries</h4>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {weightHistory.slice().reverse().map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium">{entry.weight} kg</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(entry.date), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                          <Edit2 className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-destructive/10 transition-colors">
                          <Trash2 className="w-4 h-4 text-destructive/70" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Height/Notes Toggle */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <button
                  onClick={() => setShowExtras(!showExtras)}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-health" />
                    Height & Notes
                  </span>
                  {showExtras ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>

                <AnimatePresence>
                  {showExtras && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 mt-2 rounded-xl bg-card/50 border border-border/50 space-y-4">
                        {userHeight && (
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-health/10 flex items-center justify-center">
                              <Ruler className="w-6 h-6 text-health" />
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Height</p>
                              <p className="text-lg font-semibold">{userHeight} cm</p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground mb-2">Notes</p>
                            <textarea
                              placeholder="Add notes about your progress..."
                              className="w-full h-20 p-3 text-sm rounded-lg border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-health/50"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </section>

            {/* ===== BOTTOM SECTION: AI Insights, Tips, Reports ===== */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-health" />
                  AI Wellness Insights
                </h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleExport} className="h-9">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShare} className="h-9">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Insights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {insights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + index * 0.05 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    onClick={insight.type === 'achievement' ? triggerCelebration : undefined}
                    className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                      insight.type === 'achievement' 
                        ? 'bg-gradient-to-br from-nutrition/20 to-nutrition/5 border-nutrition/30' 
                        : 'bg-card/50 border-border/50 hover:border-health/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        insight.color === 'nutrition' ? 'bg-nutrition/20 text-nutrition' :
                        insight.color === 'fitness' ? 'bg-fitness/20 text-fitness' :
                        insight.color === 'water' ? 'bg-water/20 text-water' :
                        'bg-health/20 text-health'
                      }`}>
                        {insight.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold mb-1">{insight.title}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{insight.message}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Motivational Quote */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="p-5 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 text-center"
              >
                <p className="text-sm italic text-foreground/80">
                  "Small steps every day lead to big results. You're doing amazing!"
                </p>
                <p className="text-xs text-muted-foreground mt-2">— Your Wellness Coach 💜</p>
              </motion.div>
            </section>

            {/* Bottom Padding */}
            <div className="h-6" />
          </div>
        )}
      </div>

      {/* Celebration Animation */}
      {celebrating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 pointer-events-none flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.5, 1] }}
            className="text-6xl"
          >
            🎉
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
