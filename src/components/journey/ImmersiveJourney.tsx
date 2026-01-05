import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArchitectureStyle, JourneyData } from './types';
import { ScientificArchitecture } from './ScientificArchitecture';
import { FunArchitecture } from './FunArchitecture';
import { NatureArchitecture } from './NatureArchitecture';
import { MinimalistArchitecture } from './MinimalistArchitecture';
import { SpaceArchitecture } from './SpaceArchitecture';
import { ArchitectureSelector } from './ArchitectureSelector';

interface ImmersiveJourneyProps {
  data: JourneyData;
  onWaterClick: () => void;
  onCaloriesClick: () => void;
}

const STORAGE_KEY = 'journey-architecture';

export function ImmersiveJourney({ data, onWaterClick, onCaloriesClick }: ImmersiveJourneyProps) {
  const [architecture, setArchitecture] = useState<ArchitectureStyle>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return (saved as ArchitectureStyle) || 'minimalist';
  });
  const [selectorOpen, setSelectorOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, architecture);
  }, [architecture]);

  const renderArchitecture = () => {
    const props = { data, onWaterClick, onCaloriesClick };
    
    switch (architecture) {
      case 'scientific':
        return <ScientificArchitecture {...props} />;
      case 'fun':
        return <FunArchitecture {...props} />;
      case 'nature':
        return <NatureArchitecture {...props} />;
      case 'minimalist':
        return <MinimalistArchitecture {...props} />;
      case 'space':
        return <SpaceArchitecture {...props} />;
      default:
        return <MinimalistArchitecture {...props} />;
    }
  };

  return (
    <div className="relative w-full h-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={architecture}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.4 }}
        >
          {renderArchitecture()}
        </motion.div>
      </AnimatePresence>

      <ArchitectureSelector
        current={architecture}
        onChange={setArchitecture}
        isOpen={selectorOpen}
        onToggle={() => setSelectorOpen(!selectorOpen)}
      />
    </div>
  );
}
