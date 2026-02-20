import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}


/**
 * Autorise uniquement:
 * - URLs relatives (/billing)
 * - URLs absolues SAME-ORIGIN
 */

export function sanitizeReturnUrl(input: unknown, appOrigin: string): URL {
    const fallback = new URL("/billing", appOrigin);

    if (typeof input !== "string" || input.length === 0 || input.length > 2048) return fallback;

    try {
        const u = new URL(input, appOrigin);
        if (u.origin !== appOrigin) return fallback;
        return u;
    } catch {
        return fallback;
    }
}