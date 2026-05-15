// Social links shown in the pinned header (and the rising-from-spiral preview).
// Update the URLs here, not in the components.

import {
  IconGithub,
  IconLinkedin,
  // IconX,       // bring back when there's something worth linking to
  // IconResume,
  IconEmail,
} from '../components/pixel/social-icons.jsx';

export const SOCIALS = [
  { id: 'github',   label: 'GitHub',   url: 'https://github.com/parsa-j42',          icon: IconGithub },
  { id: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/parsa-j42', icon: IconLinkedin },
  // { id: 'x',      label: 'X',      url: '#', icon: IconX },
  // { id: 'resume', label: 'Resume', url: '#', icon: IconResume },
  { id: 'email',    label: 'Email',    url: 'mailto:hi@parsaj.dev',                  icon: IconEmail },
];
