import type { AddressSchemaType } from "./schemas";

/**
 * Formats an address object into a single, uppercased string.
 *
 * The output string uses the following pattern:
 * "<street>, <city>, <postalCode>, <country>"
 *
 * @example
 * const formatted = addressFormatter({
 *   street: '123 Main St',
 *   city: 'Springfield',
 *   postalCode: '12345',
 *   country: 'USA'
 * });
 * // OUTPUT : 123 MAIN ST, SPRINGFIELD, 12345, USA
 */
export function addressFormatter(address: AddressSchemaType): string {
    return `${address.street}, ${address.city}, ${address.postalCode}, ${address.country}`.toUpperCase();
}

/**
 * Pads a number with leading zeros to achieve a specified length.
 * @param value Value
 * @param length Desired length of the resulting string
 * @returns The value as a string, padded with leading zeros to the specified length
 */
export function padNumber(value: number, length: number): string {
  return value.toString().padStart(length, '0');
}