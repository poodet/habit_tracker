import { isoToLocalDateAndTime, buildLocalDate } from '../datetime';

describe('Datetime utilities', () => {
  describe('isoToLocalDateAndTime', () => {
    it('should parse ISO string to local date and time', () => {
      const result = isoToLocalDateAndTime('2024-03-15T10:30:00Z');
      expect(result.date).toBeDefined();
      expect(result.time).toBeDefined();
    });

    it('should handle undefined input', () => {
      const result = isoToLocalDateAndTime(undefined);
      expect(result.date).toBeUndefined();
      expect(result.time).toBeUndefined();
    });

    it('should handle invalid date string', () => {
      const result = isoToLocalDateAndTime('invalid-date');
      expect(result.date).toBeUndefined();
      expect(result.time).toBeUndefined();
    });
  });

  describe('buildLocalDate', () => {
    it('should build date from date string for all-day events', () => {
      const result = buildLocalDate('2024-03-15', undefined, true);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(2); // 0-indexed (March = 2)
      expect(result.getDate()).toBe(15);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
    });

    it('should build date from date and time strings', () => {
      const result = buildLocalDate('2024-03-15', '14:30', false);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(2);
      expect(result.getDate()).toBe(15);
      expect(result.getHours()).toBe(14);
      expect(result.getMinutes()).toBe(30);
    });

    it('should default to midnight when time is not provided for non-all-day events', () => {
      const result = buildLocalDate('2024-01-01', undefined, false);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
    });
  });
});
