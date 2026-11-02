import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import colors from '../theme/colors';
import typography from '../theme/typography';
export const stackOptions: NativeStackNavigationOptions = {
  headerStyle: { backgroundColor: colors.background },
  headerTintColor: colors.text,
  headerTitleStyle: {
    fontFamily: typography.body.fontFamily,
    fontSize: typography.body.fontSize,
  },
  headerShadowVisible: false,
  headerBackButtonDisplayMode: 'minimal',
  contentStyle: { backgroundColor: colors.background },
};
