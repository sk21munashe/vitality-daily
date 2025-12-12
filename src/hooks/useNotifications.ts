import { useEffect, useCallback } from "react";

interface NotificationConfig {
  streakDays: number;
  waterProgress: number;
  calorieProgress: number;
  fitnessProgress: number;
  waterGoal: number;
  calorieGoal: number;
  fitnessGoal: number;
}

export const useNotifications = () => {
  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications");
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }

    return false;
  }, []);

  const sendNotification = useCallback((title: string, body: string, icon?: string) => {
    if (Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: icon || "/favicon.ico",
        badge: "/favicon.ico",
        tag: "vitaltrack-notification",
      });
    }
  }, []);

  const checkAndSendReminders = useCallback((config: NotificationConfig) => {
    const now = new Date();
    const hour = now.getHours();
    const lastReminderKey = "vitaltrack_last_reminder";
    const lastReminder = localStorage.getItem(lastReminderKey);
    const today = now.toDateString();

    if (lastReminder === today) return;

    // Morning motivation (8-9 AM)
    if (hour >= 8 && hour < 9) {
      sendNotification(
        "Good Morning! 🌅",
        "Ready to crush your wellness goals today? Start by drinking some water!",
      );
      localStorage.setItem(lastReminderKey, today);
    }

    // Midday check-in (12-13 PM)
    if (hour >= 12 && hour < 13) {
      const waterPercent = Math.round((config.waterProgress / config.waterGoal) * 100);
      if (waterPercent < 50) {
        sendNotification(
          "Hydration Check! 💧",
          `You're at ${waterPercent}% of your water goal. Keep sipping!`,
        );
        localStorage.setItem(lastReminderKey, today);
      }
    }

    // Evening reminder (18-19 PM)
    if (hour >= 18 && hour < 19) {
      const fitnessPercent = Math.round((config.fitnessProgress / config.fitnessGoal) * 100);
      if (fitnessPercent < 100) {
        sendNotification(
          "Evening Activity Reminder! 🏃",
          `You've completed ${fitnessPercent}% of your fitness goal. There's still time!`,
        );
        localStorage.setItem(lastReminderKey, today);
      }
    }
  }, [sendNotification]);

  const sendStreakWarning = useCallback((streakDays: number, allGoalsComplete: boolean) => {
    if (streakDays > 0 && !allGoalsComplete) {
      const now = new Date();
      const hour = now.getHours();
      
      // Late evening streak warning (20-21 PM)
      if (hour >= 20 && hour < 21) {
        const lastStreakWarning = localStorage.getItem("vitaltrack_streak_warning");
        const today = now.toDateString();
        
        if (lastStreakWarning !== today) {
          sendNotification(
            `Don't Break Your ${streakDays}-Day Streak! 🔥`,
            "Complete your remaining goals before midnight to keep your streak alive!",
          );
          localStorage.setItem("vitaltrack_streak_warning", today);
        }
      }
    }
  }, [sendNotification]);

  const sendGoalCompleteNotification = useCallback((goalType: "water" | "calories" | "fitness") => {
    const messages = {
      water: { title: "Hydration Goal Complete! 💧", body: "Amazing! You've hit your water intake goal for today!" },
      calories: { title: "Nutrition Goal Achieved! 🥗", body: "Great job tracking your meals today!" },
      fitness: { title: "Fitness Goal Crushed! 💪", body: "You've completed your daily fitness goal!" },
    };
    
    const { title, body } = messages[goalType];
    sendNotification(title, body);
  }, [sendNotification]);

  const sendAllGoalsComplete = useCallback((streakDays: number) => {
    sendNotification(
      "All Goals Complete! 🎉",
      `Incredible! You've achieved all your wellness goals. ${streakDays + 1}-day streak!`,
    );
  }, [sendNotification]);

  // Request permission on mount
  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  // Set up periodic checks
  useEffect(() => {
    const checkInterval = setInterval(() => {
      const stored = localStorage.getItem("vitaltrack_notification_config");
      if (stored) {
        try {
          const config = JSON.parse(stored) as NotificationConfig;
          checkAndSendReminders(config);
          
          const allComplete = 
            config.waterProgress >= config.waterGoal &&
            config.calorieProgress >= config.calorieGoal &&
            config.fitnessProgress >= config.fitnessGoal;
          
          sendStreakWarning(config.streakDays, allComplete);
        } catch (e) {
          console.error("Error parsing notification config:", e);
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkInterval);
  }, [checkAndSendReminders, sendStreakWarning]);

  const updateNotificationConfig = useCallback((config: NotificationConfig) => {
    localStorage.setItem("vitaltrack_notification_config", JSON.stringify(config));
  }, []);

  return {
    requestPermission,
    sendNotification,
    sendGoalCompleteNotification,
    sendAllGoalsComplete,
    updateNotificationConfig,
    checkAndSendReminders,
  };
};
