export const DEPARTMENTS = [
  'Computer Science and Engineering',
  'Information Technology',
  'Electronics and Communication Engineering',
  'Electrical and Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Biotechnology',
  'Biomedical Engineering',
  'Aerospace Engineering',
  'Automobile Engineering',
  'Industrial Engineering',
  'Production Engineering',
  'Electronics and Instrumentation Engineering',
  'Food Technology',
  'Textile Engineering',
  'Environmental Engineering',
  'Marine Engineering',
  'Agricultural Engineering',
  'Mining Engineering',
  'Petroleum Engineering',
  'Metallurgical Engineering',
  'Ceramic Engineering',
  'Plastic Engineering',
  'Other'
];

export const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'];

export const MAX_TEAM_MEMBERS = 4;

/** Max teams that may select the same problem statement */
export const MAX_TEAMS_PER_PROBLEM = 15;

/** When false, new team leader registrations are blocked (member joining stays open) */
export const REGISTRATION_OPEN = false;

/** When false, teams cannot newly select a problem statement (existing selections stay) */
export const PS_SELECTION_OPEN = false;

export const emptyMember = () => ({
  name: '',
  email: '',
  department: '',
  year: ''
});

export const isValidEmail = (email: string): boolean => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
};