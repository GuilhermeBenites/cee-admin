import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Transaction, type TransactionItem } from '@/types';
import { router } from '@inertiajs/react';
import { useEffect, useId, useMemo, useState } from 'react';
import { TransactionForm, type TransactionSchema } from './transaction-form';

type Category = {
    id: number;
    name: string;
    type: 'income' | 'expense';
};

type MemberLite = { id: number; name: string };

interface UpsertTransactionModalProps {
    transaction?: Transaction & { items?: TransactionItem[] };
    open: boolean;
    setOpen: (open: boolean) => void;
    categories: Category[];
    members: MemberLite[];
}

export function UpsertTransactionModal({ transaction, open, setOpen, categories, members }: UpsertTransactionModalProps) {
    const formId = useId();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [total, setTotal] = useState(0);

    const onSubmit = (values: TransactionSchema) => {
        const url = transaction ? route('transactions.update', transaction.id) : route('transactions.store');
        const method = transaction ? 'put' : 'post';

        router[method](url, values, {
            onStart: () => setIsSubmitting(true),
            onFinish: () => setIsSubmitting(false),
            onSuccess: () => setOpen(false),
        });
    };

    function handleOpenChange(isOpen: boolean) {
        setOpen(isOpen);
    }

    const memoDefaults = useMemo<Partial<TransactionSchema> | undefined>(() => {
        if (!transaction) return undefined;
        return {
            transaction_date: transaction.transaction_date,
            payment_method: transaction.payment_method,
            description: transaction.description || '',
            items: transaction.items?.map((i) => ({
                category_id: i.category_id,
                item_amount: i.item_amount,
                item_description: i.item_description || '',
                member_id: i.member_id,
                reference_months: i.reference_months || '',
            })),
        };
    }, [transaction]);

    const [defaultValues, setDefaultValues] = useState<Partial<TransactionSchema> | undefined>(memoDefaults);

    useEffect(() => {
        setDefaultValues(memoDefaults);
    }, [memoDefaults]);

    useEffect(() => {
        async function loadItems() {
            if (!transaction || transaction.items || !open) return;
            try {
                const response = await fetch(route('transactions.show', transaction.id), { headers: { Accept: 'application/json' } });
                if (!response.ok) return;
                const data = (await response.json()) as Transaction & { items?: TransactionItem[] };
                setDefaultValues({
                    transaction_date: data.transaction_date,
                    payment_method: data.payment_method,
                    description: data.description || '',
                    items: (data.items || []).map((i) => ({
                        category_id: i.category_id,
                        item_amount: i.item_amount,
                        item_description: i.item_description || '',
                        member_id: i.member_id,
                        reference_months: i.reference_months || '',
                    })),
                });
            } catch {
                // ignore
            }
        }
        loadItems();
    }, [open, transaction]);

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="!max-w-5xl !p-0">
                <DialogHeader className="px-8 pt-6">
                    <DialogTitle>{transaction ? 'Editar' : 'Nova'} transação</DialogTitle>
                    <DialogDescription>Preencha os campos obrigatórios e adicione itens facilmente.</DialogDescription>
                </DialogHeader>

                <TransactionForm
                    id={formId}
                    onSubmit={onSubmit}
                    defaultValues={defaultValues}
                    categories={categories}
                    members={members}
                    onTotalChange={setTotal}
                />

                <DialogFooter className="flex items-center justify-between rounded-b-2xl border-t border-gray-200 bg-gray-50 px-8 py-6 sm:items-center sm:justify-between">
                    <div className="flex flex-col">
                        <span className="text-sm text-gray-600">Total</span>
                        <span className="text-2xl font-bold text-gray-900">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
                        </span>
                    </div>
                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-2">
                        <Button variant="outline" onClick={() => handleOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" form={formId} disabled={isSubmitting}>
                            {isSubmitting ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
