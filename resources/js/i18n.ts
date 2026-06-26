import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      'common.search': 'Search',
      'common.apply': 'Apply',
      'common.clear_all': 'Clear All',
      'auth.login': 'Log In',
      'auth.register': 'Register',
      'auth.logout': 'Log Out',
      'public.challenges': 'Challenges',
      'public.candidates': 'Candidates',
      'public.companies': 'Companies',
      'public.all_rights_reserved': 'All rights reserved',
      'public.challenges_title': 'Explore Challenges',
      'public.challenges_subtitle': 'Test your skills with real-world problems from top companies.',
      'public.search_challenges': 'Search challenges...',
      'public.filters': 'Filters',
      'public.difficulty': 'Difficulty',
      'public.skills': 'Skills',
      'public.sort_latest': 'Latest',
      'public.sort_popular': 'Popular',
      'public.sort_deadline': 'Deadline',
      'public.view_details': 'View Details',
      'public.no_challenges': 'No challenges found.',
      'public.clear_filters': 'Clear Filters',
      'public.level_beginner': 'Beginner',
      'public.level_intermediate': 'Intermediate',
      'public.level_advanced': 'Advanced',
      'public.level_expert': 'Expert',
      'public.candidates_title': 'Talented Candidates',
      'public.candidates_subtitle': 'Discover top talent from around the world.',
      'public.search_candidates': 'Search candidates...',
      'public.experience_level': 'Experience Level',
      'public.available_only': 'Available Only',
      'public.sort_reputation': 'Reputation',
      'public.sort_newest': 'Newest',
      'public.sort_name': 'Name',
      'public.active_filters': 'Active Filters',
      'public.available': 'Available',
      'public.joined': 'Joined',
      'public.no_headline': 'No headline',
      'public.no_candidates': 'No candidates found.',
      'public.level_entry': 'Entry',
      'public.level_junior': 'Junior',
      'public.level_mid': 'Mid',
      'public.level_senior': 'Senior',
      'public.level_lead': 'Lead',
      'candidate.dashboard': 'Dashboard',
      'candidate.challenges': 'My Challenges',
      'candidate.submissions': 'Submissions',
      'candidate.profile': 'Profile',
      'candidate.settings': 'Settings',
      'candidate.reputation': 'Reputation',
      'candidate.area': 'Candidate Area',
      'company.dashboard': 'Dashboard',
      'company.challenges': 'Challenges',
      'company.submissions': 'Submissions',
      'company.settings': 'Settings',
      'company.profile': 'Profile',
      'company.area': 'Company Area',
      'admin.dashboard': 'Dashboard',
      'admin.welcome': 'Welcome to Admin Panel',
      'admin.panel': 'Admin Panel',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
