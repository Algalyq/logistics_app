import { StyleSheet } from 'react-native';

// Colors
export const COLORS = {
  PRIMARY: '#35B468',
  BACKGROUND: '#FBFBFB',
  TEXT_DARK: '#282828',
  TEXT_LIGHT: '#777777',
  INPUT_BG: '#F1F1F1',
  PLACEHOLDER: '#AAAAAA',
};

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
