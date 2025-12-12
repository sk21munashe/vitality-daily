import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, User, Smile, Heart, Star, Zap, Flame, Dumbbell, Apple, Droplets, Target, Trophy, Crown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const presetIcons = [
  { id: 'user', icon: User, color: 'from-blue-500 to-cyan-500' },
  { id: 'smile', icon: Smile, color: 'from-yellow-500 to-orange-500' },
  { id: 'heart', icon: Heart, color: 'from-pink-500 to-rose-500' },
  { id: 'star', icon: Star, color: 'from-amber-500 to-yellow-500' },
  { id: 'zap', icon: Zap, color: 'from-purple-500 to-indigo-500' },
  { id: 'flame', icon: Flame, color: 'from-orange-500 to-red-500' },
  { id: 'dumbbell', icon: Dumbbell, color: 'from-emerald-500 to-teal-500' },
  { id: 'apple', icon: Apple, color: 'from-green-500 to-lime-500' },
  { id: 'droplets', icon: Droplets, color: 'from-sky-500 to-blue-500' },
  { id: 'target', icon: Target, color: 'from-red-500 to-pink-500' },
  { id: 'trophy', icon: Trophy, color: 'from-amber-600 to-yellow-500' },
  { id: 'crown', icon: Crown, color: 'from-violet-500 to-purple-500' },
  { id: 'sparkles', icon: Sparkles, color: 'from-fuchsia-500 to-pink-500' },
];

interface AvatarSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAvatar?: { type: 'icon' | 'image'; value: string };
  onAvatarChange: (avatar: { type: 'icon' | 'image'; value: string }) => void;
}

export function AvatarSelector({ open, onOpenChange, currentAvatar, onAvatarChange }: AvatarSelectorProps) {
  const [selectedIcon, setSelectedIcon] = useState(currentAvatar?.type === 'icon' ? currentAvatar.value : 'user');
  const [previewImage, setPreviewImage] = useState<string | null>(
    currentAvatar?.type === 'image' ? currentAvatar.value : null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image too large', { description: 'Please select an image under 2MB' });
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file type', { description: 'Please select an image file' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setPreviewImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveIcon = () => {
    onAvatarChange({ type: 'icon', value: selectedIcon });
    onOpenChange(false);
    toast.success('Avatar updated!');
  };

  const handleSaveImage = () => {
    if (previewImage) {
      onAvatarChange({ type: 'image', value: previewImage });
      onOpenChange(false);
      toast.success('Profile picture updated!');
    }
  };

  const getIconComponent = (iconId: string) => {
    return presetIcons.find(i => i.id === iconId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            Change Profile Picture
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="icons" className="mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="icons">
              <Smile className="w-4 h-4 mr-2" />
              Choose Icon
            </TabsTrigger>
            <TabsTrigger value="upload">
              <Upload className="w-4 h-4 mr-2" />
              Upload Photo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="icons" className="space-y-4">
            {/* Preview */}
            <div className="flex justify-center py-4">
              <motion.div
                key={selectedIcon}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className={cn(
                  'w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br',
                  getIconComponent(selectedIcon)?.color || 'from-primary to-primary/60'
                )}
              >
                {(() => {
                  const iconData = getIconComponent(selectedIcon);
                  if (iconData) {
                    const IconComponent = iconData.icon;
                    return <IconComponent className="w-10 h-10 text-white" />;
                  }
                  return <User className="w-10 h-10 text-white" />;
                })()}
              </motion.div>
            </div>

            {/* Icon Grid */}
            <div className="grid grid-cols-5 gap-2">
              {presetIcons.map(({ id, icon: Icon, color }) => (
                <motion.button
                  key={id}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedIcon(id)}
                  className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center transition-all',
                    selectedIcon === id
                      ? `bg-gradient-to-br ${color} ring-2 ring-primary ring-offset-2`
                      : 'bg-muted hover:bg-muted/80'
                  )}
                >
                  <Icon className={cn(
                    'w-5 h-5',
                    selectedIcon === id ? 'text-white' : 'text-foreground'
                  )} />
                </motion.button>
              ))}
            </div>

            <Button onClick={handleSaveIcon} className="w-full">
              Save Icon
            </Button>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            {/* Preview */}
            <div className="flex justify-center py-4">
              <div className="relative">
                <div className={cn(
                  'w-24 h-24 rounded-full flex items-center justify-center overflow-hidden',
                  previewImage ? '' : 'bg-muted border-2 border-dashed border-border'
                )}>
                  {previewImage ? (
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>

            {/* Upload Button */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              {previewImage ? 'Choose Different Photo' : 'Select from Gallery'}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Supported formats: JPG, PNG, WEBP. Max size: 2MB
            </p>

            <Button 
              onClick={handleSaveImage} 
              className="w-full"
              disabled={!previewImage}
            >
              Save Photo
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

interface AvatarDisplayProps {
  avatar?: { type: 'icon' | 'image'; value: string };
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export function AvatarDisplay({ avatar, size = 'md', className, onClick }: AvatarDisplayProps) {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14 sm:w-20 sm:h-20',
    lg: 'w-24 h-24',
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7 sm:w-10 sm:h-10',
    lg: 'w-12 h-12',
  };

  const getIconData = (iconId: string) => {
    return presetIcons.find(i => i.id === iconId);
  };

  if (avatar?.type === 'image') {
    return (
      <div 
        className={cn(
          'rounded-full overflow-hidden flex-shrink-0 cursor-pointer relative group',
          sizeClasses[size],
          className
        )}
        onClick={onClick}
      >
        <img 
          src={avatar.value} 
          alt="Profile" 
          className="w-full h-full object-cover"
        />
        {onClick && (
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera className="w-5 h-5 text-white" />
          </div>
        )}
      </div>
    );
  }

  const iconData = avatar?.type === 'icon' ? getIconData(avatar.value) : null;
  const IconComponent = iconData?.icon || User;
  const gradientColor = iconData?.color || 'from-primary to-primary/60';

  return (
    <div 
      className={cn(
        'rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer relative group bg-gradient-to-br',
        gradientColor,
        sizeClasses[size],
        className
      )}
      onClick={onClick}
    >
      <IconComponent className={cn('text-white', iconSizes[size])} />
      {onClick && (
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
          <Camera className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
}
