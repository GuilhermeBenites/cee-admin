import { ConfirmActionModal } from '@/components/confirm-action-modal';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useConfirmAction } from '@/hooks/use-confirm-action';
import AppLayout from '@/layouts/app-layout';
import { formatDate, formatPhone } from '@/lib/utils';
import { Member, PaginatedResponse, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { UpsertMemberModal } from './components/upsert-member-modal';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Membros',
        href: '/members',
    },
];

export default function Index({ members }: { members: PaginatedResponse<Member> }) {
    const [open, setOpen] = useState(false);
    const [activeMember, setActiveMember] = useState<Member>();
    const { processing, delete: destroy } = useForm();
    const { isModalOpen, openModal, closeModal, confirm } = useConfirmAction();

    function handleEdit(member: Member) {
        setActiveMember(member);
        setOpen(true);
    }

    function handleCreate() {
        setActiveMember(undefined);
        setOpen(true);
    }

    const columns: ColumnDef<Member>[] = [
        {
            accessorKey: 'name',
            header: 'Nome',
        },
        {
            accessorKey: 'email',
            header: 'Email',
        },
        {
            accessorKey: 'phone',
            header: 'Telefone',
            cell: ({ row }) => {
                const member = row.original;
                return <span>{formatPhone(member.phone)}</span>;
            },
        },
        {
            accessorKey: 'join_date',
            header: 'Data de adesão',
            cell: ({ row }) => {
                const member = row.original;
                return <span>{formatDate(member.join_date)}</span>;
            },
        },
        {
            id: 'actions',
            enableHiding: false,
            cell: ({ row }) => {
                const member = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(member)}>Editar</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() =>
                                    openModal(() => {
                                        destroy(route('members.destroy', member.id), {
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
            <UpsertMemberModal open={open} setOpen={setOpen} member={activeMember} />
            <ConfirmActionModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={confirm}
                title="Você tem certeza?"
                description="Essa ação não pode ser desfeita. Isso excluirá permanentemente o membro."
                isPending={processing}
            />
            <Head title="Membros" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <DataTable
                    data={members.data}
                    columns={columns}
                    createText="Novo membro"
                    createAction={() => handleCreate()}
                    filterColumnId="name"
                    filterPlaceholder="Filtrar por nome..."
                />
            </div>
        </AppLayout>
    );
}
