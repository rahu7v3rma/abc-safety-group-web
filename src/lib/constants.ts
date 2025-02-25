import type { Panel } from './types';

export const USStates = [
   'Alabama',
   'Alaska',
   'Arizona',
   'Arkansas',
   'California',
   'Colorado',
   'Connecticut',
   'Delaware',
   'Florida',
   'Georgia',
   'Hawaii',
   'Idaho',
   'Illinois',
   'Indiana',
   'Iowa',
   'Kansas',
   'Kentucky',
   'Louisiana',
   'Maine',
   'Maryland',
   'Massachusetts',
   'Michigan',
   'Minnesota',
   'Mississippi',
   'Missouri',
   'Montana',
   'Nebraska',
   'Nevada',
   'New Hampshire',
   'New Jersey',
   'New Mexico',
   'New York',
   'North Carolina',
   'North Dakota',
   'Ohio',
   'Oklahoma',
   'Oregon',
   'Pennsylvania',
   'Rhode Island',
   'South Carolina',
   'South Dakota',
   'Tennessee',
   'Texas',
   'Utah',
   'Vermont',
   'Virginia',
   'Washington',
   'West Virginia',
   'Wisconsin',
   'Wyoming',
];

export const eyeColors = [
   'Brown',
   'Blue',
   'Green',
   'Hazel',
   'Gray',
   'Amber',
   'Red',
   'Violet',
   'Black',
   'Mixed',
   'Heterochromia',
];

export const roleWeightage: Record<string, number> = {
   superuser: 4,
   admin: 3,
   instructor: 2,
   student: 1,
};

export const AvailablePanels: Panel[] = ['admin'];

export const roleToPanel: Record<string, string> = {
   superuser: 'admin',
   admin: 'admin',
};

export const gradingColors: Record<number, string> = {
   49: 'text-red-500',
   59: 'text-orange-500',
   89: 'text-blue-500',
   100: 'text-green-500',
};
