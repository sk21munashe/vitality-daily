export type ArchitectureStyle = 'scientific' | 'fun' | 'nature' | 'minimalist' | 'space';

export interface JourneyData {
  water: {
    current: number;
    goal: number;
    progress: number;
    history: { date: string; value: number }[];
  };
  calories: {
    current: number;
    goal: number;
    progress: number;
    history: { date: string; value: number }[];
  };
}

export interface ArchitectureProps {
  data: JourneyData;
  onWaterClick: () => void;
  onCaloriesClick: () => void;
}
