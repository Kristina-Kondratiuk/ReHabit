import {
  BookOpen,
  CigaretteOff,
  Droplet,
  Dumbbell,
  GraduationCap,
  SportShoe,
  Utensils,
  WineOff,
  type LucideIcon,
} from 'lucide-react-native';

export type HabitIconName =
  | 'droplet'
  | 'dumbbell'
  | 'book-open'
  | 'wine-off'
  | 'cigarette-off'
  | 'graduation-cap'
  | 'utensils'
  | 'sport-shoe';

export type PresetHabit = {
  id: string;
  title: string;
  description: string;
  icon: HabitIconName;
};

export const habitIconMap: Record<HabitIconName, LucideIcon> = {
  droplet: Droplet,
  dumbbell: Dumbbell,
  'book-open': BookOpen,
  'wine-off': WineOff,
  'cigarette-off': CigaretteOff,
  'graduation-cap': GraduationCap,
  utensils: Utensils,
  'sport-shoe': SportShoe,
};

export const habitIconLabelMap: Record<HabitIconName, string> = {
  droplet: 'Pić wodę',
  dumbbell: 'Ćwiczyć',
  'book-open': 'Czytać książki',
  'wine-off': 'Pić mniej alkoholu',
  'cigarette-off': 'Rzucić palenie',
  'graduation-cap': 'Nauka',
  utensils: 'Śniadanie',
  'sport-shoe': 'Bieganie',
};

export const presetHabits: PresetHabit[] = [
  {
    id: 'water',
    title: 'Pić wodę',
    description: 'Chcę pamiętać o regularnym nawodnieniu każdego dnia.',
    icon: 'droplet',
  },
  {
    id: 'exercise',
    title: 'Ćwiczyć',
    description: 'Chcę codziennie zadbać o aktywność fizyczną.',
    icon: 'dumbbell',
  },
  {
    id: 'reading',
    title: 'Czytać książki',
    description: 'Chcę codziennie poświęcać czas na czytanie.',
    icon: 'book-open',
  },
  {
    id: 'alcohol-free',
    title: 'Pić mniej alkoholu',
    description: 'Chcę utrzymać dzień bez alkoholu.',
    icon: 'wine-off',
  },
  {
    id: 'smoking',
    title: 'Rzucić palenie',
    description: 'Chcę ograniczać i całkowicie odstawić papierosy.',
    icon: 'cigarette-off',
  },
  {
    id: 'study',
    title: 'Nauka',
    description: 'Chcę codziennie zrobić choć jedną sesję nauki.',
    icon: 'graduation-cap',
  },
  {
    id: 'breakfast',
    title: 'Jeść śniadanie',
    description: 'Chcę regularnie jeść śniadanie, aby mieć więcej energii rano.',
    icon: 'utensils',
  },
  {
    id: 'running',
    title: 'Bieganie',
    description: 'Chcę regularnie biegać i budować kondycję.',
    icon: 'sport-shoe',
  },
];
