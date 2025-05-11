import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useTranslation } from '@/translations/useTranslation';
import { tabStyles } from '@/assets/styles/tabStyles';

interface FilterOption {
  id: string;
  label: string;
}

export type FilterParams = {
  vehicleType: string | null;
  productType: string | null;
  origin: string | null;
  destination: string | null;
  priceRange: string | null;
};

interface OrderFiltersProps {
  vehicleTypeFilter: string | null;
  productTypeFilter: string | null;
  originFilter: string | null;
  destinationFilter: string | null;
  priceRangeFilter: string | null;
  onFilterChange: (type: keyof FilterParams, value: string | null) => void;
  vehicleTypes: FilterOption[];
  productTypes: FilterOption[];
  origins: FilterOption[];
  destinations: FilterOption[];
  priceRanges: FilterOption[];
}

export const OrderFilters: React.FC<OrderFiltersProps> = ({
  vehicleTypeFilter,
  productTypeFilter,
  originFilter,
  destinationFilter,
  priceRangeFilter,
  onFilterChange,
  vehicleTypes,
  productTypes,
  origins,
  destinations,
  priceRanges,
}) => {
  const { t } = useTranslation();

  const renderFilterSection = (
    title: string,
    options: FilterOption[],
    activeFilter: string | null,
    filterType: keyof FilterParams
  ) => {
    return (
      <View style={styles.filterSection}>
        <ThemedText style={styles.filterTitle}>{title}</ThemedText>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterOptionsContainer}
        >
          <TouchableOpacity
            style={[
              styles.filterOption,
              activeFilter === null && styles.activeFilterOption,
            ]}
            onPress={() => onFilterChange(filterType, null)}
          >
            <ThemedText
              style={[
                styles.filterText,
                activeFilter === null && styles.activeFilterText,
              ]}
            >
              {t('all')}
            </ThemedText>
          </TouchableOpacity>
          
          {options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.filterOption,
                activeFilter === option.id && styles.activeFilterOption,
              ]}
              onPress={() => onFilterChange(filterType, option.id)}
            >
              <ThemedText
                style={[
                  styles.filterText,
                  activeFilter === option.id && styles.activeFilterText,
                ]}
              >
                {option.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderFilterSection(t('vehicleType'), vehicleTypes, vehicleTypeFilter, 'vehicleType')}
      {renderFilterSection(t('productType'), productTypes, productTypeFilter, 'productType')}
      {renderFilterSection(t('origin'), origins, originFilter, 'origin')}
      {renderFilterSection(t('destination'), destinations, destinationFilter, 'destination')}
      {renderFilterSection(t('priceRange'), priceRanges, priceRangeFilter, 'priceRange')}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  filterSection: {
    marginBottom: 10,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#282828',
    paddingHorizontal: 20,
    fontFamily: 'Comfortaa',
  },
  filterOptionsContainer: {
    paddingHorizontal: 20,
    paddingRight: 40,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F5F7FA',
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activeFilterOption: {
    backgroundColor: tabStyles.actionButton.backgroundColor,
    borderColor: tabStyles.actionButton.backgroundColor,
  },
  filterText: {
    fontSize: 13,
    color: '#777777',
  },
  activeFilterText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
