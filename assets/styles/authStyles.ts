import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

// Colors for components that don't directly use the theme system
export const COLORS = {
  PRIMARY: '#2E7D32',              // Green primary color
  BACKGROUND: '#FBFBFB',           // Light mode background
  TEXT_DARK: '#282828',            // Dark text for light mode
  TEXT_LIGHT: '#777777',           // Light text for both modes
  INPUT_BG: '#F1F1F1',             // Input background for light mode
  PLACEHOLDER: '#AAAAAA',          // Placeholder text
};

// Helper to get theme-aware colors based on system theme
export const getAuthColors = (isDark = false) => ({
  PRIMARY: Colors[isDark ? 'dark' : 'light'].primary,
  BACKGROUND: isDark ? '#151718' : '#FBFBFB',
  TEXT_DARK: isDark ? '#ECEDEE' : '#282828',
  TEXT_LIGHT: isDark ? '#9BA1A6' : '#777777',
  INPUT_BG: isDark ? '#2C2F31' : '#F1F1F1',
  PLACEHOLDER: isDark ? '#687076' : '#AAAAAA',
});

// Font families
export const FONTS = {
  PRIMARY: 'Comfortaa',
  SECONDARY: 'SpaceMono',
};

// Common auth styles used across login and registration screens
export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  appName: {
    fontFamily: FONTS.PRIMARY,
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
  },
  formContainer: {
    width: '100%',
  },
  title: {
    fontFamily: FONTS.PRIMARY,
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.TEXT_LIGHT,
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: FONTS.PRIMARY,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.INPUT_BG,
    borderRadius: 12,
    height: 56,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.TEXT_DARK,
  },
  passwordContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.INPUT_BG,
    borderRadius: 12,
    height: 56,
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    height: 56,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.TEXT_DARK,
  },
  eyeIcon: {
    paddingHorizontal: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 32,
  },
  actionButton: {
    // We use COLORS.PRIMARY here, but ThemedView components will override this
    // with the current theme color from the context
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  actionButtonText: {
    fontFamily: FONTS.PRIMARY,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.BACKGROUND,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  linkText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.TEXT_LIGHT,
  },
  highlightedLinkText: {
    fontFamily: FONTS.PRIMARY,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.PRIMARY,
  },
});
