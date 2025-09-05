// Utility composable for formatting numbers, durations, and random integers
import { FormatNumberOptions, Duration } from '../../types/types';

export const useFormat = () => {
  const formatNumber = (value: number = 0, options?: FormatNumberOptions): string => {
    options = Object.assign({
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      notation: 'standard',
      style: 'decimal'
    }, options);
    const formatter = new Intl.NumberFormat('en-US', options);
    return formatter.format(value);
  };

  const getRandomInt = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  return {
    formatNumber,
    getRandomInt
  };
};