import { colord, extend } from "colord";
import mixPlugin from "colord/plugins/mix";

extend([mixPlugin]);

export enum Colors {
    Pink = "#ff2d55",
    Purple = "#5856d6",
    Orange = "#ff9500",
    Yellow = "#ffcc00",
    Red = "#ff3b30",
    TealBlue = "#5ac8fa",
    Blue = "#007aff",
    Green = "#4cd964",
}

/**
 * Get a Color-tint based on the percentage
 * @param   {Colors}    color       A color from the ColorsEnum
 * @param   {number}    percentage  Percentage should be between 1 and 100!
 */
export const getTint = (color: Colors, percentage: number): string => {
    const p = percentage < 1 ? percentage * 100 : percentage;
    const colorInst = colord(color);
    const redTints = colorInst.tints(100).map((c) => c.toHex());
    return redTints.reverse()[p - 1];
};
