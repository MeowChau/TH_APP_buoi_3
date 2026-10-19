import React, { useEffect, useRef } from 'react';
import {
  AccessibilityInfo,
  ActivityIndicator,
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CaretRight,
  MagnifyingGlass,
  WarningCircle,
} from './Icons';
import { colors, fonts, ui } from '../theme';

export function Fade({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    let active = true;
    let animation: Animated.CompositeAnimation | undefined;
    AccessibilityInfo.isReduceMotionEnabled()
      .then(reduced => {
        if (!active || reduced) {
          return;
        }
        opacity.setValue(0);
        animation = Animated.timing(opacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        });
        animation.start();
      })
      .catch(() => {});
    const listener = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      reduced => {
        if (reduced) {
          animation?.stop();
          opacity.setValue(1);
        }
      },
    );
    return () => {
      active = false;
      animation?.stop();
      listener.remove();
    };
  }, [opacity]);
  return <Animated.View style={[style, { opacity }]}>{children}</Animated.View>;
}
export function Screen({
  children,
  scroll = true,
  detail = false,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  detail?: boolean;
}) {
  return (
    <SafeAreaView
      style={ui.page}
      edges={detail ? ['bottom', 'left', 'right'] : ['top', 'left', 'right']}
    >
      {scroll ? (
        <ScrollView
          contentContainerStyle={ui.content}
          keyboardShouldPersistTaps="handled"
        >
          <Fade style={{ gap: 22 }}>{children}</Fade>
        </ScrollView>
      ) : (
        children
      )}
    </SafeAreaView>
  );
}
export function Brand({ right }: { right?: React.ReactNode }) {
  return (
    <View style={ui.between}>
      <View style={ui.row}>
        <View style={styles.brandIcon}>
          <BookOpen size={20} weight="bold" color={colors.ink} />
        </View>
        <Text style={styles.brand}>
          study<Text style={styles.brandLight}> / space</Text>
        </Text>
      </View>
      {right}
    </View>
  );
}
export function PageTitle({
  index,
  title,
  subtitle,
}: {
  index: string;
  title: string;
  subtitle: string;
}) {
  return (
    <View style={{ gap: 7 }}>
      <Text style={ui.eyebrow}>SỔ TAY SINH VIÊN / {index}</Text>
      <Text accessibilityRole="header" style={ui.title}>
        {title}
      </Text>
      <Text style={ui.muted}>{subtitle}</Text>
    </View>
  );
}
export function Section({
  title,
  action,
  onPress,
}: {
  title: string;
  action?: string;
  onPress?: () => void;
}) {
  return (
    <View style={ui.between}>
      <Text accessibilityRole="header" style={[ui.heading, { flex: 1 }]}>
        {title}
      </Text>
      {action && (
        <Pressable
          accessibilityRole="button"
          onPress={onPress}
          style={styles.sectionAction}
        >
          <Text style={styles.actionText}>{action}</Text>
          <ArrowRight size={14} color={colors.ink} weight="bold" />
        </Pressable>
      )}
    </View>
  );
}
export function Badge({
  label,
  tone = 'green',
}: {
  label: string;
  tone?: 'green' | 'blue' | 'yellow' | 'red';
}) {
  return (
    <View style={[styles.badge, { backgroundColor: colors[`${tone}Bg`] }]}>
      <Text style={[styles.badgeText, { color: colors[tone] }]}>{label}</Text>
    </View>
  );
}
export function Button({
  label,
  onPress,
  secondary = false,
  loading = false,
}: {
  label: string;
  onPress: () => void;
  secondary?: boolean;
  loading?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: loading, busy: loading }}
      disabled={loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        secondary && styles.secondary,
        { opacity: pressed || loading ? 0.65 : 1 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={secondary ? colors.ink : colors.surface} />
      ) : (
        <>
          <Text style={[styles.buttonText, secondary && { color: colors.ink }]}>
            {label}
          </Text>
          <ArrowRight
            size={17}
            color={secondary ? colors.ink : colors.surface}
            weight="bold"
          />
        </>
      )}
    </Pressable>
  );
}
export function IconButton({
  label,
  onPress,
  direction = 'right',
}: {
  label: string;
  onPress: () => void;
  direction?: 'left' | 'right';
}) {
  const Icon = direction === 'left' ? ArrowLeft : ArrowRight;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconButton,
        { opacity: pressed ? 0.5 : 1 },
      ]}
    >
      <Icon size={20} weight="bold" color={colors.ink} />
    </Pressable>
  );
}
export function Empty({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <View style={styles.empty}>
      <MagnifyingGlass size={30} color={colors.muted} weight="bold" />
      <Text style={ui.heading}>{title}</Text>
      <Text style={[ui.muted, { textAlign: 'center' }]}>{description}</Text>
    </View>
  );
}
export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={[ui.muted, { flex: 1 }]}>{label}</Text>
      <Text selectable style={[ui.body, { flex: 1.6, textAlign: 'right' }]}>
        {value}
      </Text>
    </View>
  );
}
export function Chevron() {
  return <CaretRight size={17} color={colors.muted} weight="bold" />;
}
export function Notice({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <View accessibilityRole="alert" style={styles.notice}>
      <WarningCircle size={20} color={colors.red} />
      <Text style={[ui.muted, { flex: 1, color: colors.red }]}>{message}</Text>
      <Pressable
        onPress={onRetry}
        accessibilityRole="button"
        style={{ paddingVertical: 12 }}
      >
        <Text style={[ui.body, { color: colors.red }]}>Thử lại</Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  brandIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brand: {
    fontFamily: fonts.bold,
    fontSize: 17,
    color: colors.ink,
    letterSpacing: -0.6,
  },
  brandLight: { fontFamily: fonts.regular, color: colors.muted },
  sectionAction: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  actionText: { fontFamily: fonts.medium, fontSize: 11, color: colors.ink },
  badge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  badgeText: { fontFamily: fonts.medium, fontSize: 10, lineHeight: 16 },
  button: {
    minHeight: 51,
    paddingVertical: 14,
    paddingHorizontal: 17,
    borderRadius: 6,
    backgroundColor: '#111111',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  buttonText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    lineHeight: 22,
    color: colors.surface,
    flexShrink: 1,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
  },
  empty: {
    padding: 30,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 14,
    paddingVertical: 11,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
  },
  notice: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: colors.redBg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
});
