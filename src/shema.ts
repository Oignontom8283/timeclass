import zod from 'zod';

/**
 * A Zod schema for validating and transforming a schedule time object.
 * 
 * This schema expects an object with the following properties:
 * - `time`: A string representing time in the "HH:MM" format. It is transformed into a `Date` object
 *   with the current date and the specified hours and minutes.
 * - `label`: A string representing a label or description for the schedule time.
 * 
 * Example:
 * ```typescript
 * const validData = {
 *   time: "14:30",
 *   label: "Afternoon Meeting"
 * };
 * 
 * const parsedData = scheduleTimeShema.parse(validData);
 * console.log(parsedData.time); // Outputs a Date object with today's date at 14:30
 * console.log(parsedData.label); // Outputs "Afternoon Meeting"
 * ```
 */
const scheduleTimeShema = zod.object({
    time: zod.string().transform(str => {
        const [hours, minutes] = str.split(':').map(Number); // Parses "HH:MM" format
        const now = new Date();
        now.setHours(hours, minutes, 0, 0); // Defines local time
        return now;
    }),
    label: zod.string()
});

export const rawSheduleShema = zod.object({
    comment: zod.string().optional(),

    name: zod.object({
        original: zod.string(),
        en: zod.string().optional()
    }),
    address: zod.object({
        street: zod.string(),
        city: zod.string(),
        postalCode: zod.string(),
        country: zod.string()
    }),
    createdAt: zod.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format"
    }),
    updatedAt: zod.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format"
    }),
    website: zod.string().url().optional(),

    scheduleStart:scheduleTimeShema,
    schedule: zod.array(
        scheduleTimeShema
    )
});