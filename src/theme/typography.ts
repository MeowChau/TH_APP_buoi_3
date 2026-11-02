import { Platform, TextStyle } from 'react-native';
export const fonts = {
  regular: 'BeVietnamPro-Regular',
  medium: 'BeVietnamPro-Medium',
  bold: 'BeVietnamPro-SemiBold',
  serif: Platform.select({ ios: 'Georgia', default: 'serif' }),
  mono: Platform.select({ ios: 'Menlo', default: 'monospace' }),
};
const typography = {
  title: {
    fontFamily: fonts.serif,
    fontSize: 34,
    lineHeight: 42,
    letterSpacing: -1,
  },
  h2: { fontFamily: fonts.serif, fontSize: 26, lineHeight: 34 },
  h3: { fontFamily: fonts.bold, fontSize: 17, lineHeight: 26 },
  body: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 23 },
  strong: { fontFamily: fonts.bold, fontSize: 15, lineHeight: 25 },
  small: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 20 },
  label: {
    fontFamily: fonts.medium,
    fontSize: 11,
    lineHeight: 18,
    letterSpacing: 1,
  },
  mono: { fontFamily: fonts.mono, fontSize: 12, lineHeight: 20 },
  number: { fontFamily: fonts.serif, fontSize: 36, lineHeight: 44 },
  tab: { fontFamily: fonts.medium, fontSize: 9, lineHeight: 16 },
} satisfies Record<string, TextStyle>;
export default typography;
