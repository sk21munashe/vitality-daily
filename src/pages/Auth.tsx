import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Heart, Droplets, Flame, Dumbbell } from "lucide-react";

interface AuthProps {
  onSignIn: (name: string) => void;
}

const Auth = ({ onSignIn }: AuthProps) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      setError("Please enter a name with at least 2 characters");
      return;
    }
    if (trimmedName.length > 50) {
      setError("Name must be less than 50 characters");
      return;
    }
    onSignIn(trimmedName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-4 w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg"
            >
              <Heart className="w-10 h-10 text-primary-foreground" />
            </motion.div>
            <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              VitalTrack
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Your Daily Wellness Companion
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex justify-center gap-4">
              {[
                { icon: Droplets, color: "text-blue-500", delay: 0.3 },
                { icon: Flame, color: "text-green-500", delay: 0.4 },
                { icon: Dumbbell, color: "text-orange-500", delay: 0.5 },
              ].map(({ icon: Icon, color, delay }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay }}
                >
                  <Icon className={`w-6 h-6 ${color}`} />
                </motion.div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Enter your name to get started"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError("");
                  }}
                  className="text-center text-lg h-12"
                  maxLength={50}
                />
                {error && (
                  <p className="text-destructive text-sm mt-2 text-center">{error}</p>
                )}
              </div>
              
              <Button
                type="submit"
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
              >
                Start Your Journey
              </Button>
            </form>

            <p className="text-xs text-muted-foreground text-center">
              Track water, calories, and fitness to achieve your wellness goals
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;
