
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const TIMING_OPTIONS = [
  { value: '起床', label: '起床' },
  { value: '朝', label: '朝' },
  { value: '昼', label: '昼' },
  { value: '夕', label: '夕' },
  { value: '眠前', label: '眠前' },
];

interface TimingSelectorProps {
  selectedTimings: string[];
  onTimingsChange: (timings: string[]) => void;
  multiple?: boolean;
  className?: string;
}

export const TimingSelector = ({
  selectedTimings,
  onTimingsChange,
  multiple = true,
  className = ""
}: TimingSelectorProps) => {
  const handleValueChange = (values: string[]) => {
    onTimingsChange(values);
  };

  const handleSingleValueChange = (value: string) => {
    onTimingsChange(value ? [value] : []);
  };

  if (multiple) {
    return (
      <ToggleGroup
        type="multiple"
        value={selectedTimings}
        onValueChange={handleValueChange}
        className={`flex flex-wrap gap-2 ${className}`}
      >
        {TIMING_OPTIONS.map((timing) => (
          <ToggleGroupItem
            key={timing.value}
            value={timing.value}
            className="px-3 py-2 text-xs sm:text-sm border border-blue-200 data-[state=on]:bg-blue-500 data-[state=on]:text-white hover:bg-blue-50"
          >
            {timing.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    );
  }

  return (
    <ToggleGroup
      type="single"
      value={selectedTimings[0] || ''}
      onValueChange={handleSingleValueChange}
      className={`flex flex-wrap gap-2 ${className}`}
    >
      {TIMING_OPTIONS.map((timing) => (
        <ToggleGroupItem
          key={timing.value}
          value={timing.value}
          className="px-3 py-2 text-xs sm:text-sm border border-blue-200 data-[state=on]:bg-blue-500 data-[state=on]:text-white hover:bg-blue-50"
        >
          {timing.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};
