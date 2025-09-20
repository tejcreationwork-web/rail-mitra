import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  AccessibilityInfo,
  Dimensions,
} from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';

interface DropdownOption {
  id: string;
  label: string;
  value: any;
}

interface AccessibleDropdownProps {
  options: DropdownOption[];
  selectedValue: any;
  onSelect: (option: DropdownOption) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  style?: any;
}

export default function AccessibleDropdown({
  options,
  selectedValue,
  onSelect,
  placeholder = 'Select an option',
  label,
  disabled = false,
  style,
}: AccessibleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<TouchableOpacity>(null);

  const selectedOption = options.find(option => option.value === selectedValue);

  const handleOpen = () => {
    if (disabled) return;
    setIsOpen(true);
    AccessibilityInfo.announceForAccessibility(`${label || 'Dropdown'} opened. ${options.length} options available.`);
  };

  const handleClose = () => {
    setIsOpen(false);
    // Return focus to the trigger button
    if (buttonRef.current) {
      buttonRef.current.focus();
    }
  };

  const handleSelect = (option: DropdownOption) => {
    onSelect(option);
    setIsOpen(false);
    AccessibilityInfo.announceForAccessibility(`${option.label} selected`);
    
    // Return focus to the trigger button
    setTimeout(() => {
      if (buttonRef.current) {
        buttonRef.current.focus();
      }
    }, 100);
  };

  const renderOption = ({ item, index }: { item: DropdownOption; index: number }) => {
    const isSelected = item.value === selectedValue;
    
    return (
      <TouchableOpacity
        style={[styles.option, isSelected && styles.selectedOption]}
        onPress={() => handleSelect(item)}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`${item.label}${isSelected ? ', selected' : ''}`}
        accessibilityHint={`Select ${item.label}`}
        accessibilityState={{ selected: isSelected }}
      >
        <Text style={[styles.optionText, isSelected && styles.selectedOptionText]}>
          {item.label}
        </Text>
        {isSelected && (
          <Check 
            size={20} 
            color="#2563EB" 
            accessibilityLabel="Selected"
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text 
          style={styles.label}
          accessible={true}
          accessibilityRole="text"
        >
          {label}
        </Text>
      )}
      
      <TouchableOpacity
        ref={buttonRef}
        style={[
          styles.trigger,
          disabled && styles.disabledTrigger,
          isOpen && styles.openTrigger
        ]}
        onPress={handleOpen}
        disabled={disabled}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`${label || 'Dropdown'}: ${selectedOption?.label || placeholder}`}
        accessibilityHint="Double tap to open dropdown menu"
        accessibilityState={{ 
          expanded: isOpen,
          disabled: disabled 
        }}
      >
        <Text style={[
          styles.triggerText,
          disabled && styles.disabledText,
          !selectedOption && styles.placeholderText
        ]}>
          {selectedOption?.label || placeholder}
        </Text>
        <ChevronDown 
          size={20} 
          color={disabled ? "#94A3B8" : "#64748B"}
          style={[styles.chevron, isOpen && styles.chevronOpen]}
        />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={handleClose}
        accessible={true}
        accessibilityViewIsModal={true}
      >
        <TouchableOpacity 
          style={styles.overlay}
          onPress={handleClose}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Close dropdown"
        >
          <View style={styles.dropdown}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>
                {label || 'Select Option'}
              </Text>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Close dropdown"
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={options}
              renderItem={renderOption}
              keyExtractor={(item) => item.id}
              style={styles.optionsList}
              accessible={true}
              accessibilityRole="list"
              accessibilityLabel={`${options.length} options available`}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
    fontFamily: 'Inter-SemiBold',
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    minHeight: 56, // Minimum touch target size
  },
  openTrigger: {
    borderColor: '#2563EB',
  },
  disabledTrigger: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  triggerText: {
    fontSize: 16,
    color: '#1E293B',
    fontFamily: 'Inter-Regular',
    flex: 1,
  },
  placeholderText: {
    color: '#94A3B8',
  },
  disabledText: {
    color: '#94A3B8',
  },
  chevron: {
    marginLeft: 8,
  },
  chevronOpen: {
    transform: [{ rotate: '180deg' }],
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    maxHeight: Dimensions.get('window').height * 0.6,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    fontFamily: 'Poppins-Bold',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '600',
  },
  optionsList: {
    maxHeight: 300,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
    minHeight: 56, // Minimum touch target size
  },
  selectedOption: {
    backgroundColor: '#EBF4FF',
  },
  optionText: {
    fontSize: 16,
    color: '#1E293B',
    fontFamily: 'Inter-Regular',
    flex: 1,
  },
  selectedOptionText: {
    color: '#2563EB',
    fontWeight: '600',
  },
});