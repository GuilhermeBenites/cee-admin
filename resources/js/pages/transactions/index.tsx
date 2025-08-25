import { ConfirmActionModal } from '@/components/confirm-action-modal';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useConfirmAction } from '@/hooks/use-confirm-action';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/utils';
import { PaginatedResponse, type BreadcrumbItem, type Transaction } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { UpsertTransactionModal } from './components/upsert-transaction-modal';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transações',
        href: '/transactions',
    },
];

type Category = { id: number; name: string; type: 'income' | 'expense' };
type MemberLite = { id: number; name: string };

export default function Index({
    transactions,
    categories = [],
    members = [],
    filters,
}: {
    transactions: PaginatedResponse<Transaction>;
    categories?: Category[];
    members?: MemberLite[];
    filters: { date?: string };
}) {
    const { processing, delete: destroy } = useForm();
    const { isModalOpen, openModal, closeModal, confirm } = useConfirmAction();
    const [isUpsertOpen, setIsUpsertOpen] = useState(false);
    const [editing, setEditing] = useState<Transaction | undefined>(undefined);

    function handleCreate() {
        setEditing(undefined);
        setIsUpsertOpen(true);
    }

    function handleEdit(transaction: Transaction) {
        setEditing(transaction);
        setIsUpsertOpen(true);
    }

    function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
        const newDate = e.target.value;
        router.get(
            route('transactions.index'),
            { date: newDate || undefined }, // Send undefined to clear filter
            {
                preserveState: true,
                replace: true,
            },
        );
    }

    const columns: ColumnDef<Transaction>[] = [
        {
            accessorKey: 'transaction_date',
            header: 'Data',
            cell: ({ row }) => {
                const t = row.original;
                return <span>{formatDate(t.transaction_date)}</span>;
            },
        },
        {
            accessorKey: 'total_amount',
            header: 'Valor total',
            cell: ({ row }) => {
                const t = row.original;
                return <span>R$ {Number(t.total_amount).toFixed(2)}</span>;
            },
        },
        {
            accessorKey: 'payment_method',
            header: 'Pagamento',
        },
        {
            accessorKey: 'description',
            header: 'Descrição',
        },
        {
            id: 'userName',
            accessorFn: (row) => row.user?.name ?? '',
            header: 'Usuário',
            filterFn: 'includesString',
            cell: ({ getValue }) => <span>{getValue<string>()}</span>,
        },
        {
            id: 'actions',
            enableHiding: false,
            cell: ({ row }) => {
                const t = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(t)}>Editar</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() =>
                                    openModal(() => {
                                        destroy(route('transactions.destroy', t.id), {
                                            preserveScroll: true,
                                        });
                                    })
                                }
                            >
                                Remover
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <ConfirmActionModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={confirm}
                title="Você tem certeza?"
                description="Essa ação não pode ser desfeita. Isso excluirá permanentemente a transação."
                isPending={processing}
            />
            <UpsertTransactionModal open={isUpsertOpen} setOpen={setIsUpsertOpen} transaction={editing} categories={categories} members={members} />
            <Head title="Transações" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <DataTable
                    data={transactions.data}
                    columns={columns}
                    createText="Nova transação"
                    createAction={() => handleCreate()}
                    filterColumnId="userName"
                    filterPlaceholder="Filtrar por cliente..."
                    dateFilterValue={filters.date}
                    onDateFilterChange={handleDateChange}
                />
            </div>
        </AppLayout>
    );
}
