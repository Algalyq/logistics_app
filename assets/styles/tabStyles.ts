import { StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { COLORS } from './authStyles';
import { Colors } from '@/constants/Colors';

const windowWidth = Dimensions.get('window').width;

export const tabStyles = StyleSheet.create({
  // Common container styles
  container: {
    flex: 1,
    // Will be overridden by ThemedView
  },
  
  // Common header styles
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: COLORS.PRIMARY, // Will be set to the theme primary color
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FBFBFB', // Light text on dark background header
    fontFamily: 'Comfortaa',
  },
  welcome: {
    fontSize: 16,
    color: '#FBFBFB',
    fontWeight: '400',
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FBFBFB',
    fontFamily: 'Comfortaa',
  },
  
  // Common profile image styles
  profileImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FBFBFB',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  
  // Scroll view styles
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  
  // Section styles
  section: {
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#282828',
    fontFamily: 'Comfortaa',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  viewAllText: {
    fontSize: 14,
    color: COLORS.PRIMARY, // Will use the theme primary color
    fontWeight: '600',
  },
  
  // Card styles
  card: {
    backgroundColor: '#FFFFFF', // Will be overridden by ThemedView for dark mode
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#282828', // Will be overridden by ThemedText for dark mode
  },
  
  // Tabs navigation styles
  tabContainer: {
    flexDirection: 'row',
    marginVertical: 16,
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.PRIMARY, // Will use the theme primary color
  },
  tabText: {
    fontSize: 16,
    color: '#777777', // Will be overridden by ThemedText for dark mode
  },
  activeTabText: {
    color: COLORS.PRIMARY, // Will use the theme primary color
    fontWeight: '600',
  },
  
  // Status badge styles
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  newBadge: {
    backgroundColor: '#E0F7FA',
  },
  'in-progressBadge': {
    backgroundColor: '#FFF9C4',
  },
  completedBadge: {
    backgroundColor: '#E8F5E9',
  },
  cancelledBadge: {
    backgroundColor: '#FFEBEE',
  },
  
  // Button styles
  actionButton: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY, // Will use the theme primary color
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  
  // Empty state
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#777777',
    fontSize: 16,
  },
});
