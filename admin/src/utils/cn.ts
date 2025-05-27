import { twMerge, ClassNameValue } from "tailwind-merge";

/**
 * It takes an array of class names, and returns a single class name
 * @param {ClassNameValue[]} classLists - ClassNameValue[]
 */
export const cn = (...classLists: ClassNameValue[]) => twMerge(classLists);
