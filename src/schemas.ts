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
 * const parsedData = scheduleTimeSchema.parse(validData);
 * console.log(parsedData.time); // Outputs a Date object with today's date at 14:30
 * console.log(parsedData.label); // Outputs "Afternoon Meeting"
 * ```
 */
const scheduleTimeSchema = zod.object({
    time: zod.string().transform(str => {
        const [hours, minutes] = str.split(':').map(Number); // Parses "HH:MM" format
        const now = new Date();
        now.setHours(hours, minutes, 0, 0); // Defines local time
        return now;
    }),
    label: zod.string()
});

/**
 * A Zod schema for validating and transforming string inputs into Date objects.
 * 
 * @example
 * const validDate = dateSchema.parse("2023-01-01"); // Returns a valid Date object.
 * const invalidDate = dateSchema.parse("invalid-date"); // Throws a validation error.
 * 
 * @throws {ZodError} If the input string cannot be transformed into a valid `Date` object.
 */
const dateSchema = zod.string()
    .transform(str => new Date(str))
    .refine(date => !isNaN(date.getTime()), { error: "Invalid date format" });


/**
 * Schema definition for a raw schedule object.
 * 
 * This schema validates the structure and types of the raw schedule data.
 */
export const rawScheduleSchema = zod.object({
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
    createdAt: dateSchema.optional(),
    updatedAt: dateSchema,
    website: zod.string().url().optional(),

    scheduleStart:scheduleTimeSchema,
    schedule: zod.array(
        scheduleTimeSchema
    )
});