import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { MagnifyingGlass, X } from './Icons';
import { colors, fonts } from '../theme';
export function SearchField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <View style={styles.search}>
      <MagnifyingGlass size={20} weight="bold" color={colors.muted} />
      <TextInput
        accessibilityLabel={placeholder}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        style={styles.input}
        autoCorrect={false}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Xóa từ khóa"
          onPress={() => onChange('')}
          style={styles.clear}
        >
          <X size={16} weight="bold" color={colors.ink} />
        </Pressable>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  search: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
    gap: 10,
  },
  input: {
    flex: 1,
    minWidth: 0,
    minHeight: 50,
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.ink,
    paddingVertical: 12,
  },
  clear: {
    width: 44,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
