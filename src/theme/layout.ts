import { StyleSheet } from 'react-native';
import colors from './colors';
import spacing from './spacing';
import typography from './typography';
export default StyleSheet.create({
  page: { flex: spacing.grow, backgroundColor: colors.background },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
    flexGrow: spacing.grow,
  },
  stack: { gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  grow: { flex: spacing.grow },
  card: {
    backgroundColor: colors.surface,
    borderWidth: spacing.hairline,
    borderColor: colors.border,
    borderRadius: spacing.radius,
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: { ...typography.title, color: colors.text },
  heading: { ...typography.h3, color: colors.text },
  body: { ...typography.body, color: colors.text },
  muted: { ...typography.small, color: colors.textMuted },
  eyebrow: { ...typography.label, color: colors.textMuted },
  mono: { ...typography.mono, color: colors.textMuted },
  danger: { ...typography.small, color: colors.danger },
});
