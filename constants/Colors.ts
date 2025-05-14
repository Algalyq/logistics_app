/**
 * App colors using light theme only with green primary and white secondary
 * regardless of system theme settings
 */

const primaryColor = '#2E7D32'; // Green primary color
const secondaryColor = '#FFFFFF'; // White secondary color

// Single theme object for the entire app
export const Colors = {
  // Light theme only
  light: {
    text: '#11181C', // Black text
    background: secondaryColor, // White background
    tint: primaryColor,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: primaryColor,
    primary: primaryColor,
  },
  // Using same light theme values even for dark mode
  dark: {
    text: '#11181C', // Same black text
    background: secondaryColor, // Same white background
    tint: primaryColor,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: primaryColor,
    primary: primaryColor,
  },
};
