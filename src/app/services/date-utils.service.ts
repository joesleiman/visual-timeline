import { Injectable } from '@angular/core';

export type ZoomLevel = 'day' | 'week' | 'month';

export interface DateRange {
    start: Date;
    end: Date;
}

export interface TimelineColumn {
    date: Date;
    label: string;
    subLabel: string;
}

@Injectable({
    providedIn: 'root'
})
export class DateUtilsService {

    parseDate(dateStr: string): Date {
        return new Date(dateStr + 'T00:00:00');
    }

    formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    addDays(date: Date, days: number): Date {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    getDateRange(zoomLevel: ZoomLevel): DateRange {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        switch (zoomLevel) {
            case 'day':
                return {
                    start: this.addDays(today, -14),
                    end: this.addDays(today, 28)
                };
            case 'week':
                return {
                    start: this.addDays(today, -56),
                    end: this.addDays(today, 56)
                };
            case 'month':
                const monthStart = this.addDays(today, -180);
                const monthEnd = this.addDays(today, 180);
                // new Date(2025, 1, 0)  // Feb day 0 → Jan 31, 2025 (Jan has 31 days)
                // new Date(2025, 3, 0)  // Apr day 0 → Mar 31, 2025 (Mar has 31 days)
                // new Date(2025, 2, 0)  // Mar day 0 → Feb 28, 2025 (Feb has 28 days in 2025)
                return {
                    // This ensures the timeline starts at the beginning of the month, 
                    // not for example July 3
                    start: new Date(monthStart.getFullYear(), monthStart.getMonth(), 1),
                    // Normalize End to Last Day of Month
                    end: new Date(monthEnd.getFullYear(), monthEnd.getMonth() + 1, 0)
                };
        }
    }

    generateColumns(zoomLevel: ZoomLevel, range: DateRange): TimelineColumn[] {
        const columns: TimelineColumn[] = [];

        if (zoomLevel === 'day') { // (-14days, +28days)
            let current = new Date(range.start);
            while (current <= range.end) {
                columns.push({
                    date: new Date(current),
                    label: `${current.getDate()}`, //(1-31)
                    subLabel: current.toLocaleDateString('en-US', { month: 'short' }) //Jan, Feb, Mar
                });
                current = this.addDays(current, 1);
            }
        } else if (zoomLevel === 'week') { //(-56days, +56days) = (-8weeks, +8weeks)
            let current = new Date(range.start);
            let weekNum = 1;
            while (current <= range.end) {
                columns.push({
                    date: new Date(current),
                    label: `Week ${weekNum}`,
                    subLabel: current.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) //Dec 2025
                });
                current = this.addDays(current, 7);
                weekNum++;
            }
        } else { // month (-180days, + 180days) = (-6months, +6months)
            let current = new Date(range.start);
            while (current <= range.end) {
                columns.push({
                    date: new Date(current),
                    label: current.toLocaleDateString('en-US', { month: 'short' }), //Dec
                    subLabel: current.getFullYear().toString() // 2025
                });
                current.setMonth(current.getMonth() + 1);
            }
        }

        return columns;
    }

    daysBetween(date1: Date, date2: Date): number {
        const oneDay = 24 * 60 * 60 * 1000;
        return Math.round((date2.getTime() - date1.getTime()) / oneDay);
    }

    private weeksBetweenFractional(start: Date, end: Date): number {
        const msPerDay = 24 * 60 * 60 * 1000;
        const diff = end.getTime() - start.getTime();
        const days = diff / msPerDay;
        return days / 7; // Returns fractional weeks
    }

    private monthsBetweenFractional(start: Date, end: Date): number {
        const startYear = start.getFullYear(); // e.g., 2025
        const startMonth = start.getMonth(); // e.g., 8 (September, 0-indexed)
        const startDay = start.getDate(); // e.g., 15

        const endYear = end.getFullYear(); // e.g., 2025
        const endMonth = end.getMonth();  // e.g., 11 (December)
        const endDay = end.getDate(); // e.g., 10

        // Calculate total months between the two dates
        // September 15 to December 10 = (2025 - 2025) * 12 + (11 - 8) = 3 months
        const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth);

        // Calculate the fractional part based on days within months
        // We need to determine what fraction of the start month we're using
        // and what fraction of the end month we're using

        // Gets how many days are in the start month (September has 30 days)
        // Calculates what fraction of September we're skipping (not using)
        // startDayFraction = (15 - 1) / 30 = 14/30 = 0.467
        // This means we're skipping 46.7% of September (days 1-14), and only using 53.3% of it (days 15-30).

        //When you use day = 0, JavaScript goes backwards to the last day of the previous month
        // October (month 9) day 0
        // = Last day of September
        // = September 30, 2025

        // Why (day - 1)?

        // Day 1 means we use the whole month → fraction skipped = 0%
        // Day 15 means we skip days 1-14 → fraction skipped = 46.7%
        // Day 30 means we skip days 1-29 → fraction skipped = 96.7%
        const daysInStartMonth = new Date(startYear, startMonth + 1, 0).getDate();
        const startDayFraction = (startDay - 1) / daysInStartMonth; // Day 1 = 0%, Day 15 = ~50%

        const daysInEndMonth = new Date(endYear, endMonth + 1, 0).getDate();
        const endDayFraction = endDay / daysInEndMonth; // Day 1 = ~3%, Day 31 = 100%

        // Total = whole months + end fraction - start fraction
        // Result = (Whole months) - (Part of start month we skip) + (Part of end month we use)
        return totalMonths - startDayFraction + endDayFraction;
    }

    calculateBarPosition(
        orderStartDate: string,
        orderEndDate: string,
        rangeStart: Date,
        rangeEnd: Date,
        cellWidth: number = 100,
        zoomLevel: 'day' | 'week' | 'month' = 'day'
    ): { left: number; width: number; visible: boolean } {
        // Parse the dates
        // Converts the order's start and end date strings into Date objects
        const start = this.parseDate(orderStartDate);
        const end = this.parseDate(orderEndDate);

        // Check if order is completely outside the visible range
        if (end < rangeStart || start > rangeEnd) {
            return { left: 0, width: 0, visible: false };
        }

        // Clamp the start and end dates to the visible range
        const clampedStart = start < rangeStart ? rangeStart : start;
        const clampedEnd = end > rangeEnd ? rangeEnd : end;

        let offsetUnits: number;
        let durationUnits: number;
        if (zoomLevel === 'day') {
            // Calculate offset from start
            // Calculates how many days/weeks/months from the timeline's start until the order begins
            // This determines the bar's left position
            offsetUnits = this.daysBetween(rangeStart, clampedStart);

            // Calculate order duration
            // Calculates how many days/weeks/months the order lasts
            // This determines the bar's width
            durationUnits = this.daysBetween(clampedStart, clampedEnd) + 1;
        } else if (zoomLevel === 'week') {
            offsetUnits = this.weeksBetweenFractional(rangeStart, clampedStart);
            durationUnits = this.weeksBetweenFractional(clampedStart, clampedEnd);
            durationUnits += 1 / 7; // Add one day worth for end date inclusion
        } else { //month
            offsetUnits = this.monthsBetweenFractional(rangeStart, clampedStart);
            durationUnits = this.monthsBetweenFractional(clampedStart, clampedEnd);
            durationUnits += 1 / 30; // Add one day worth for end date inclusion
        }

        const left = offsetUnits * cellWidth;
        const width = durationUnits * cellWidth;

        // Math.max(0, result) - Ensures result isn't below 0
        return {
            left: Math.max(0, left),
            width: Math.max(0, width),
            visible: true
        };
    }
}