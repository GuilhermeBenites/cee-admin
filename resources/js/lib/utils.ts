import { type ClassValue, clsx } from 'clsx';
import { format } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatPhone(phone: string | null): string {
    if (!phone) {
        return '';
    }

    const cleaned = phone.replace(/\D/g, '');

    if (cleaned.length === 12) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 8)}-${cleaned.slice(8, 12)}`;
    }

    if (cleaned.length === 11) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
    }

    if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6, 10)}`;
    }

    return phone;
}

export function formatDate(date: string | null): string {
    if (!date) {
        return '';
    }

    const dateObj = new Date(date);
    const offset = dateObj.getTimezoneOffset();
    dateObj.setMinutes(dateObj.getMinutes() + offset);

    return format(dateObj, 'dd/MM/yyyy');
}
