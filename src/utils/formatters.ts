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