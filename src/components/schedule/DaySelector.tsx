import React from 'react';
import FilterChips from '../common/FilterChips';
import { todayDay } from '../../utils/date';
/** @param onSelectDay - Callback chọn ngày, bắt buộc. */
export default function DaySelector({
  selectedDay = todayDay(),
  onSelectDay,
}: {
  selectedDay?: number;
  onSelectDay: (value: number) => void;
}) {
  return (
    <FilterChips
      options={Array.from({ length: 7 }, (_, i) => ({
        value: String(i + 2),
        label: i === 6 ? 'Chủ nhật' : `Thứ ${i + 2}`,
      }))}
      selected={String(selectedDay)}
      onSelect={value => onSelectDay(Number(value))}
    />
  );
}
