'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { IconCalendar, IconX } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import type { DateRange } from 'react-day-picker';

interface DateRangeFilterProps {
  onDateRangeChange: (startDate: Date | null, endDate: Date | null) => void;
}

export function DateRangeFilter({ onDateRangeChange }: DateRangeFilterProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);

  const handlePreset = (days: number) => {
    const end = endOfDay(new Date());
    const start = startOfDay(subDays(end, days));
    setDateRange({ from: start, to: end });
    onDateRangeChange(start, end);
    setIsOpen(false);
  };

  const handleClear = () => {
    setDateRange(undefined);
    onDateRangeChange(null, null);
  };

  const handleRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from && range?.to) {
      onDateRangeChange(range.from, range.to);
      setIsOpen(false);
    }
  };

  const isActive = dateRange?.from && dateRange?.to;

  return (
    <div className='flex items-center gap-2'>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={isActive ? 'default' : 'outline'}
            className={cn('w-full sm:w-auto', isActive && 'bg-primary')}
          >
            <IconCalendar className='mr-2 h-4 w-4' />
            {isActive
              ? `${format(dateRange.from!, 'MMM dd')} - ${format(dateRange.to!, 'MMM dd')}`
              : 'Select Date Range'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <div className='p-4'>
            <div className='mb-4 grid grid-cols-2 gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handlePreset(7)}
              >
                Last 7 days
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handlePreset(30)}
              >
                Last 30 days
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handlePreset(90)}
              >
                Last 90 days
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handlePreset(365)}
              >
                Last year
              </Button>
            </div>

            <div className='border-t pt-4'>
              <Calendar
                initialFocus
                mode='range'
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={handleRangeSelect}
                numberOfMonths={1}
              />
            </div>

            <div className='mt-4 flex gap-2 border-t pt-4'>
              <Button
                variant='outline'
                size='sm'
                onClick={handleClear}
                className='flex-1'
              >
                Clear
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {isActive && (
        <Button
          variant='ghost'
          size='sm'
          onClick={handleClear}
          className='h-10 w-10 p-0'
        >
          <IconX className='h-4 w-4' />
        </Button>
      )}
    </div>
  );
}
