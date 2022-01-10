import { colord, extend } from "colord";
import mixPlugin from "colord/plugins/mix";

extend([mixPlugin]);

/**
 * Get a Color-tint based on the percentage
 * @param   {string}    color       A color as string
 * @param   {number}    percentage  Percentage should be between 1 and 100!
 */
export const getTint = (color: string, percentage: number): string => {
    const p = percentage < 1 ? percentage * 100 : percentage;
    const colorInst = colord(color);
    const redTints = colorInst.tints(100).map((c) => c.toHex());
    return redTints.reverse()[Math.round(p - 1)];
};
