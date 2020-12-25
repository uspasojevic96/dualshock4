/**
 * Options used to define how {@link DualShock} is behaving
 *
 * @author Uros Spasojevic
 */
export interface DualShockOptions {
    /**
     * Hexadecimal representation of product ID
     *
     * @defaultValue `0x09cc`
     */
    productID?: number;

    /**
     * Logger tag
     *
     * @defaultValue `DualShock`
     */
    tag?: string;

    /**
     * Hexadecimal representation of vendor ID
     *
     * @defaultValue `0x054c`
     */
    vendorID?: number;
}