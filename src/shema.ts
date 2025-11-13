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
})

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
})

// {
//     "comment": "School data for testing purposes",

//     "name": {
//         "original": "Lycée Thomas Edison de Lorgues",
//         "en": "Thomas Edison High School of Lorgues"
//     },
//     "address": {
//         "street": "1 Rue Emile Héraud",
//         "city": "Lorgues",
//         "postalCode": "83510",
//         "country": "France"
//     },
//     "createdAt": "2023-01-01T00:00:00Z",
//     "updatedAt": "2024-06-15T12:00:00Z",
//     "website": "https://www.lycee-lorgues.fr/",

//     "scheduleStart": {"time": "08:00", "label": "8h"},
//     "schedule": [
//         {"time": "09:00", "label": "9h"},
//         {"time": "10:00", "label": "10h"},
//         {"time": "11:00", "label": "11h"},
//         {"time": "12:00", "label": "12h"},
//         {"time": "13:00", "label": "13h"},
//         {"time": "14:00", "label": "14h"},
//         {"time": "15:00", "label": "15h"},
//         {"time": "16:00", "label": "16h"},
//         {"time": "17:00", "label": "17h"}
//     ]
// }