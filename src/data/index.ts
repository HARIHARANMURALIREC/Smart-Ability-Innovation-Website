import type { ActivityItem, AppNotification } from '@/types';

// Static content for the landing page ----------------------------------

export const TIMELINE = [
  {
    step: '01',
    title: 'Registration Opens',
    description: 'Official launch of SmartAbility Innovation Challenge on 25 July 2026. Teams can access the registration portal, view all 11 problem statements, competition guidelines, evaluation criteria, and timelines.',
    icon: 'ClipboardList',
  },
  {
    step: '02',
    title: 'Problem Selection & Team Registration',
    description: 'Teams (4 members including team leader) register by selecting one problem statement from either the Software Track (9 Problem Statements) or Hardware Track (2 Problem Statements). Registration is on a first-come, first-served basis based on problem availability.',
    icon: 'Target',
  },
  {
    step: '03',
    title: 'Solution Development Begins',
    description: 'Immediately after successful registration, teams may begin ideation, research, design, and prototype development for their chosen problem statement.',
    icon: 'Cpu',
  },
  {
    step: '04',
    title: 'Registration Closes',
    description: 'Registration portal closes on 29 July 2026. Teams must finalize their problem selection and registration before this deadline.',
    icon: 'Calendar',
  },
  {
    step: '05',
    title: 'Innovation Challenge & Evaluation',
    description: 'On 01 August 2026, teams present their solutions before a panel of Special Educators, domain experts, and technical jury members. Based on evaluation and expert feedback, teams refine and enhance their solutions before the final review.',
    icon: 'Trophy',
  },
] as const;

export const FAQS = [
  {
    q: 'What are the project tracks in SmartAbility?',
    a: 'SmartAbility has two tracks: (1) AI Software — build AI-powered applications such as speech recognition tools, NLP systems, AAC apps, or intelligent assistive software; (2) Hardware — design smart assistive devices such as IoT communication aids, sensor-based systems, or embedded hardware prototypes.',
  },
  {
    q: 'Who can participate in SmartAbility?',
    a: 'Any college student, innovator, researcher, or multidisciplinary team can participate. You will register as a team leader, add up to 3 additional members (4 total including leader), and provide your college and department details.',
  },
  {
    q: 'What is the theme of SmartAbility?',
    a: 'SmartAbility is an Innovation Challenge on Assistive Technology focused on building AI software applications and hardware devices to support Speech, Hearing and Communication for persons with disabilities.',
  },
  {
    q: 'How many problem statements are there?',
    a: 'There are 11 real-world problem statements identified from the assistive technology domain. The Software Track has 9 problem statements, and the Hardware Track has 2 problem statements. Participants choose one and build either an AI software or hardware solution around it.',
  },
  {
    q: 'What is the total prize value?',
    a: 'The total prize value is ₹1,00,000 distributed across winning teams in both AI software and hardware tracks.',
  },
  {
    q: 'When and where is the Innovation Challenge?',
    a: 'SmartAbility Innovation Challenge runs from 25-29 July 2026 for registration, with the main challenge event on 01 August 2026, organised by the Centre of Excellence in Assistive Technology, Rajalakshmi Engineering College, in association with NIEPMD.',
  },
  {
    q: 'Who are the coordinators?',
    a: 'Convenor: Dr. S. Poonkuzhali. Coordinators: Dr. Priya Vijay and Mrs. D. Sorna Shanthi.',
  },
  {
    q: 'Who is allowed to upload the final project PDF?',
    a: 'Only the registered Team Leader is authorized to upload the final project PDF. Team members can view submission status but cannot upload files themselves.',
  },
] as const;

export const STATS = [
  { label: 'Problem Statements', value: 11, icon: 'ClipboardList' },
  { label: 'Prize Pool (₹)', value: 100000, icon: 'Trophy' },
  { label: 'Registration: 25-29 July', value: 1, icon: 'Calendar' },
  { label: 'Challenge: 01 August 2026', value: 1, icon: 'Zap' },
] as const;

// Admin dummy data ------------------------------------------------------

export const REGISTRATION_CHART = [
  { label: 'Mon', value: 12 },
  { label: 'Tue', value: 28 },
  { label: 'Wed', value: 45 },
  { label: 'Thu', value: 38 },
  { label: 'Fri', value: 62 },
  { label: 'Sat', value: 84 },
  { label: 'Sun', value: 50 },
];

export const SUBMISSION_CHART = [
  { label: 'Wk 1', value: 8 },
  { label: 'Wk 2', value: 22 },
  { label: 'Wk 3', value: 41 },
  { label: 'Wk 4', value: 67 },
];

export const DEPARTMENT_DISTRIBUTION = [
  { label: 'CSE', value: 42, color: '#4f46e5' },
  { label: 'IT', value: 28, color: '#7c3aed' },
  { label: 'ECE', value: 18, color: '#0ea5e9' },
  { label: 'AI/DS', value: 22, color: '#8b5cf6' },
  { label: 'Other', value: 18, color: '#38bdf8' },
];

export const SAMPLE_ACTIVITIES: ActivityItem[] = [
  { id: 'a1', icon: 'UserPlus', title: 'New team "Code Cavaliers" registered', time: '2 min ago', tone: 'brand' },
  { id: 'a2', icon: 'FileUp', title: 'Team "Pixel Pioneers" submitted their project', time: '18 min ago', tone: 'emerald' },
  { id: 'a3', icon: 'BellRing', title: 'Deadline reminder sent to 12 teams', time: '1 hr ago', tone: 'amber' },
  { id: 'a4', icon: 'Users', title: 'Team "Quantum Coders" added a new member', time: '3 hr ago', tone: 'sky' },
  { id: 'a5', icon: 'Trophy', title: 'Evaluation panel opened for Round 2', time: '5 hr ago', tone: 'accent' },
];

export const SAMPLE_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    title: 'Registration Opens: 25 July 2026',
    body: 'SmartAbility Innovation Challenge registration is now open. Teams can select from 11 problem statements and register by 29 July 2026.',
    time: '12 min ago',
    read: false,
    tone: 'warning',
  },
  {
    id: 'n2',
    title: 'Welcome to SmartAbility 2026!',
    body: 'Your team has been successfully registered. Explore 11 problem statements (9 Software, 2 Hardware) and start building!',
    time: '1 day ago',
    read: false,
    tone: 'success',
  },
  {
    id: 'n3',
    title: 'Organised by CEAT, Rajalakshmi Engineering College',
    body: 'SmartAbility is conducted in association with Dept. of Speech, Hearing & Communication, NIEPMD. Challenge event: 01 August 2026.',
    time: '2 days ago',
    read: true,
    tone: 'info',
  },
];

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Member Registration', to: '/member-register' },
  { label: 'Student Login', to: '/student-login' },
];
