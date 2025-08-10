import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';
import { type User } from './user';

export { User };

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export type Transaction = {
    id: number;
    type: 'income' | 'expense';
    source_destination: string;
    description: string;
    amount: number;
    transaction_date: string;
    payment_method: string;
    user_id: number;
    member_id: number | null;
    reference_months: string | null;
    vehicle_type: string | null;
    created_at: string;
    updated_at: string;
    user: User;
};

export type PaginatedResponse<T> = {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
};

export type Member = {
    id: number;
    name: string;
    email: string;
    phone: string;
    birth_date: string;
    join_date: string;
};
