import { Category } from '../types/expense';
import { ThemeColors } from './Colors';

export const CATEGORIES: Category[] = [
  'Food & Dining', 'Transport', 'Shopping', 'Entertainment',
  'Health', 'Education', 'Utilities', 'Rent', 'Groceries', 'Other',
];

export const CATEGORY_ICONS: Record<Category, string> = {
  'Food & Dining':  '🍔',
  'Transport':      '🚖',
  'Shopping':       '🛍️',
  'Entertainment':  '🎬',
  'Health':         '💊',
  'Education':      '📚',
  'Utilities':      '⚡',
  'Rent':           '🏠',
  'Groceries':      '🛒',
  'Other':          '📦',
};

export const CATEGORY_GRADIENTS: Record<Category, [string, string]> = {
  'Food & Dining':  ['#FF6B6B', '#FF8E53'],
  'Transport':      ['#4FACFE', '#00F2FE'],
  'Shopping':       ['#FF6B9D', '#C44DFF'],
  'Entertainment':  ['#C44DFF', '#7C6EF6'],
  'Health':         ['#00E5C0', '#00B4D8'],
  'Education':      ['#F7971E', '#FFD200'],
  'Utilities':      ['#00B4D8', '#4FACFE'],
  'Rent':           ['#7C6EF6', '#B06EF6'],
  'Groceries':      ['#6BCB77', '#00E5C0'],
  'Other':          ['#9B9BC2', '#64748B'],
};

// Returns the right category color for the current theme
export const CATEGORY_COLORS = (c: ThemeColors): Record<Category, string> => ({
  'Food & Dining':  c.catFood,
  'Transport':      c.catTransport,
  'Shopping':       c.catShopping,
  'Entertainment':  c.catEntertainment,
  'Health':         c.catHealth,
  'Education':      c.catEducation,
  'Utilities':      c.catUtilities,
  'Rent':           c.catRent,
  'Groceries':      c.catGroceries,
  'Other':          c.catOther,
});
