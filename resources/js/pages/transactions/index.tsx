import AppLayout from '@/layouts/app-layout';
import { PaginatedResponse, type BreadcrumbItem, type Transaction } from '@/types';
import { Head } from '@inertiajs/react';
import { DataTable } from './components/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transações',
        href: '/transactions',
    },
];

export default function Index({ transactions }: { transactions: PaginatedResponse<Transaction> }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transações" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <DataTable data={transactions.data} />
            </div>
        </AppLayout>
    );
}
