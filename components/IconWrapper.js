
import React from 'react';
import SafeIcon from './SafeIcon';

// Safe import wrapper for vector icons
let MaterialIcons = null;
let FontAwesome5 = null;

try {
  MaterialIcons = require('react-native-vector-icons/MaterialIcons').default;
} catch (error) {
  console.warn('MaterialIcons not available:', error.message);
}

try {
  FontAwesome5 = require('react-native-vector-icons/FontAwesome5').default;
} catch (error) {
  console.warn('FontAwesome5 not available:', error.message);
}

// Export safe icon components
export const Icon = ({ name, size, color, style, ...props }) => (
  <SafeIcon
    name={name}
    size={size}
    color={color}
    style={style}
    IconComponent={MaterialIcons}
    {...props}
  />
);

export const FontAwesome = ({ name, size, color, style, solid, ...props }) => (
  <SafeIcon
    name={name}
    size={size}
    color={color}
    style={style}
    IconComponent={FontAwesome5}
    {...props}
  />
);

// Default export for backward compatibility
export default Icon;