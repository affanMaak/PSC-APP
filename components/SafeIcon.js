
import React from 'react';
import { Text, View } from 'react-native';

// Safe icon wrapper that provides fallback when vector icons fail
const SafeIcon = ({ name, size = 24, color = '#000', IconComponent, fallbackText, style, ...props }) => {
  const [hasError, setHasError] = React.useState(false);

  // Fallback icon mappings
  const fallbackIcons = {
    'delete': '🗑️',
    'add': '',
    'close': '×',
    'search': '🔍',
    'event': '📅',
    'camera-alt': '📷',
    'save': '💾',
    'receipt': '🧾',
    'store': '🏪',
    'logout': '⬅️',
    'trending-up': '📈',
    'trending-down': '📉',
    'check-circle': '✅',
    'error': '❌',
    'person': '👤',
    'people': '👥',
    'group': '👥',
    'user-friends': '👫',
    'users': '👥',
    'plus-circle': '➕',
    'history': '📋',
    'user-circle': '👤',
    'settings': '⚙️',
    'pie-chart': '📊',
    'call-split': '↗️',
    'compare-arrows': '↔️',
    'swap-horiz': '↔️',
    'payments': '💳',
    'account-balance-wallet': '💰',
    'arrow-upward': '⬆️',
    'arrow-downward': '⬇️',
    'arrow-drop-down': '⬇️',
    'arrow-drop-up': '⬆️',
    'person-add': '👤',
    'person-remove': '👤-',
    'description': '📄'
  };

  if (hasError || !IconComponent) {
    const fallback = fallbackText || fallbackIcons[name] || '?';
    return (
      <View style={[{ 
        width: size, 
        height: size, 
        justifyContent: 'center', 
        alignItems: 'center' 
      }, style]}>
        <Text style={{ 
          fontSize: size * 0.8, 
          color: color,
          textAlign: 'center'
        }}>
          {fallback}
        </Text>
      </View>
    );
  }

  try {
    return (
      <IconComponent
        name={name}
        size={size}
        color={color}
        style={style}
        onError={() => setHasError(true)}
        {...props}
      />
    );
  } catch (error) {
    const fallback = fallbackText || fallbackIcons[name] || '?';
    return (
      <View style={[{ 
        width: size, 
        height: size, 
        justifyContent: 'center', 
        alignItems: 'center' 
      }, style]}>
        <Text style={{ 
          fontSize: size * 0.8, 
          color: color,
          textAlign: 'center'
        }}>
          {fallback}
        </Text>
      </View>
    );
  }
};

export default SafeIcon;
