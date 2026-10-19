import 'react-native-svg';

// Phosphor 3 forwards an optional className for web interoperability.
// Native SVG ignores it; declare it here for Phosphor's source entry points.
declare module 'react-native-svg' {
  interface SvgProps {
    className?: string;
  }
}
