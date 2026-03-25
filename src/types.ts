export type PostureType = 'standing' | 'sitting';

export interface Exercise {
  id: string;
  name: string;
  sanskritName: string;
  description: string;
  benefits: string[];
  posture: PostureType;
  duration: number; // in seconds
  imageUrl: string;
  youtubeId: string;
}

export const EXERCISES: Exercise[] = [
  {
    id: 'surya-namaskar',
    name: 'Sun Salutation',
    sanskritName: 'Surya Namaskar',
    description: 'A complete body workout that improves metabolism and burns fat across all muscle groups.',
    benefits: ['Full body toning', 'Metabolism boost', 'Flexibility'],
    posture: 'standing',
    duration: 60,
    imageUrl: 'https://picsum.photos/seed/surya/800/1000',
    youtubeId: '1xRX1MuoImw' // Short Surya Namaskar tutorial
  },
  {
    id: 'trikonasana',
    name: 'Triangle Pose',
    sanskritName: 'Trikonasana',
    description: 'Stretches the waist and burns fat on the sides of the body.',
    benefits: ['Waist reduction', 'Digestion', 'Spine health'],
    posture: 'standing',
    duration: 45,
    imageUrl: 'https://picsum.photos/seed/trikona/800/1000',
    youtubeId: 'S6gB0QHbWFE' // Short Triangle Pose tutorial
  },
  {
    id: 'virabhadrasana',
    name: 'Warrior Pose',
    sanskritName: 'Virabhadrasana',
    description: 'Strengthens legs and core while burning significant calories.',
    benefits: ['Leg strength', 'Core stability', 'Focus'],
    posture: 'standing',
    duration: 60,
    imageUrl: 'https://picsum.photos/seed/warrior/800/1000',
    youtubeId: '56hnUF1scTE' // Short Warrior Pose tutorial
  },
  {
    id: 'paschimottanasana',
    name: 'Seated Forward Bend',
    sanskritName: 'Paschimottanasana',
    description: 'Targets abdominal fat and improves digestion.',
    benefits: ['Belly fat reduction', 'Stress relief', 'Hamstring stretch'],
    posture: 'sitting',
    duration: 90,
    imageUrl: 'https://picsum.photos/seed/paschim/800/1000',
    youtubeId: '1E-84p0itDs' // Short Seated Forward Bend tutorial
  },
  {
    id: 'dhanurasana',
    name: 'Bow Pose',
    sanskritName: 'Dhanurasana',
    description: 'Massages abdominal organs and burns belly fat effectively.',
    benefits: ['Abdominal toning', 'Back strength', 'Respiratory health'],
    posture: 'sitting',
    duration: 45,
    imageUrl: 'https://picsum.photos/seed/bow/800/1000',
    youtubeId: '4P2mYcOGxbU' // Short Bow Pose tutorial
  },
  {
    id: 'ardha-matsyendrasana',
    name: 'Half Spinal Twist',
    sanskritName: 'Ardha Matsyendrasana',
    description: 'Twists the torso to burn side fat and detoxify organs.',
    benefits: ['Side fat reduction', 'Detox', 'Spinal mobility'],
    posture: 'sitting',
    duration: 60,
    imageUrl: 'https://picsum.photos/seed/twist/800/1000',
    youtubeId: 'wJpyMgbxytU' // Short Half Spinal Twist tutorial
  }
];
