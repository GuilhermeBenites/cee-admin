import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, useFieldArray, useForm, type Resolver, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { ClientCombobox } from './client-combobox';

type Category = {
    id: number;
    name: string;
    type: 'income' | 'expense';
};

export const transactionItemSchema = z.object({
    category_id: z.coerce.number().int().positive('Categoria é obrigatória'),
    item_amount: z.coerce.number().positive('Valor deve ser maior que 0'),
    item_description: z.string().optional().nullable(),
    member_id: z.coerce.number().int().positive().optional().nullable(),
    reference_months: z.string().optional().nullable(),
});

export const transactionSchema = z.object({
    transaction_date: z.string().min(1, 'Data é obrigatória'),
    payment_method: z.string().min(1, 'Forma de pagamento é obrigatória'),
    description: z.string().optional().nullable(),
    client_id: z.coerce.number().int().positive('Cliente é obrigatório'),
    items: z.array(transactionItemSchema).min(1, 'Adicione pelo menos 1 item'),
});

export type TransactionSchema = z.infer<typeof transactionSchema>;

type MemberLite = { id: number; name: string };

interface TransactionFormProps {
    id: string;
    onSubmit: SubmitHandler<TransactionSchema>;
    defaultValues?: Partial<TransactionSchema>;
    categories: Category[];
    members: MemberLite[];
    onTotalChange: (total: number) => void;
}

export function TransactionForm({ id, onSubmit, defaultValues, categories, members, onTotalChange }: TransactionFormProps) {
    function formatLocalDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm<TransactionSchema>({
        resolver: zodResolver(transactionSchema) as Resolver<TransactionSchema>,
        defaultValues: {
            transaction_date: formatLocalDate(new Date()),
            payment_method: '',
            description: '',
            items: [
                {
                    category_id: categories?.[0]?.id ?? 0,
                    item_amount: 0,
                    item_description: '',
                    member_id: undefined,
                    reference_months: '',
                },
            ],
            ...defaultValues,
        },
    });

    const { fields, append, remove } = useFieldArray({ control, name: 'items' });

    const items = watch('items');

    useEffect(() => {
        const subscription = watch((value) => {
            const total = value.items?.reduce((sum, item) => sum + (Number(item?.item_amount) || 0), 0) || 0;
            onTotalChange(total);
        });
        return () => subscription.unsubscribe();
    }, [watch, onTotalChange]);

    return (
        <form id={id} onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-8 py-6">
            <div className="flex flex-col gap-4 md:flex-row">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="transaction_date">Data</Label>
                    <Input id="transaction_date" type="date" {...register('transaction_date')} className="w-fit" />
                    {errors.transaction_date && <p className="text-xs text-red-500">{errors.transaction_date.message}</p>}
                </div>
                <div className="flex min-w-52 flex-col gap-2">
                    <Label htmlFor="client_id">Cliente</Label>
                    <Controller
                        control={control}
                        name="client_id"
                        render={({ field }) => <ClientCombobox value={field.value} onChange={field.onChange} />}
                    />
                    {errors.client_id && <p className="text-xs text-red-500">{errors.client_id.message}</p>}
                </div>
                <div className="flex min-w-52 flex-col gap-2">
                    <Label htmlFor="payment_method">Forma de pagamento</Label>
                    <Controller
                        control={control}
                        name={'payment_method'}
                        render={({ field }) => (
                            <Select value={field.value || undefined} onValueChange={(v) => field.onChange(v)}>
                                <SelectTrigger id="payment_method">
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PIX">PIX</SelectItem>
                                    <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                                    <SelectItem value="Cartão de débito">Cartão de débito</SelectItem>
                                    <SelectItem value="Cartão de crédito">Cartão de crédito</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.payment_method && <p className="text-xs text-red-500">{errors.payment_method.message}</p>}
                </div>
                <div className="flex min-w-80 flex-col gap-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Input id="description" placeholder="Opcional" {...register('description')} className="w-full" />
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Itens da transação</h4>
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                            append({
                                category_id: categories?.[0]?.id ?? 0,
                                item_amount: 0,
                                item_description: '',
                                member_id: undefined,
                                reference_months: '',
                            })
                        }
                    >
                        <Plus className="mr-2 h-4 w-4" /> Adicionar item
                    </Button>
                </div>

                <div className="space-y-4">
                    {fields.map((field, index) => {
                        const selectedCategory = categories.find((c) => c.id === Number(items?.[index]?.category_id));
                        const selectedName = selectedCategory?.name ?? '';
                        const showDescription = selectedName === 'Outros';
                        const showMemberAndRef = selectedName === 'Mensalidade';

                        return (
                            <div key={field.id} className="flex items-start gap-3 rounded-md border p-3">
                                <div className="grid flex-1 grid-cols-1 gap-3 md:grid-cols-4">
                                    <div className="flex flex-col gap-2">
                                        <Label>Categoria</Label>
                                        <Controller
                                            control={control}
                                            name={`items.${index}.category_id`}
                                            render={({ field }) => (
                                                <Select
                                                    value={field.value != null ? String(field.value) : undefined}
                                                    onValueChange={(v) => {
                                                        const numeric = Number(v);
                                                        field.onChange(numeric);
                                                        const selected = categories.find((c) => c.id === numeric);
                                                        const name = selected?.name ?? '';
                                                        if (name !== 'Outros') {
                                                            setValue(`items.${index}.item_description`, '');
                                                        }
                                                        if (name !== 'Mensalidade') {
                                                            setValue(`items.${index}.member_id`, null);
                                                            setValue(`items.${index}.reference_months`, '');
                                                        }
                                                    }}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {categories.map((c) => (
                                                            <SelectItem key={c.id} value={String(c.id)}>
                                                                {c.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.items?.[index]?.category_id && (
                                            <p className="text-xs text-red-500">{errors.items[index]?.category_id?.message as string}</p>
                                        )}
                                    </div>

                                    {showDescription && (
                                        <div className="flex flex-col gap-2">
                                            <Label>Descrição do item</Label>
                                            <Input {...register(`items.${index}.item_description` as const)} placeholder="Opcional" />
                                        </div>
                                    )}

                                    {showMemberAndRef && (
                                        <div className="flex min-w-52 flex-col gap-2">
                                            <Label>Membro</Label>
                                            <Controller
                                                control={control}
                                                name={`items.${index}.member_id`}
                                                render={({ field }) => (
                                                    <Select
                                                        value={field.value != null ? String(field.value) : undefined}
                                                        onValueChange={(v) => field.onChange(v === 'none' ? null : Number(v))}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Opcional" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="none">Nenhum</SelectItem>
                                                            {members.map((m) => (
                                                                <SelectItem key={m.id} value={String(m.id)}>
                                                                    {m.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                        </div>
                                    )}

                                    {showMemberAndRef && (
                                        <div className="flex min-w-52 flex-col gap-2">
                                            <Label>Ref. meses</Label>
                                            <Input {...register(`items.${index}.reference_months` as const)} placeholder="Opcional" />
                                        </div>
                                    )}

                                    <div className="flex min-w-52 flex-col gap-2">
                                        <Label>Valor</Label>
                                        <Input type="number" step="0.01" {...register(`items.${index}.item_amount` as const)} />
                                        {errors.items?.[index]?.item_amount && (
                                            <p className="text-xs text-red-500">{errors.items[index]?.item_amount?.message as string}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <Label className="invisible">Remover</Label>
                                    <Button type="button" variant="outline" size="icon" onClick={() => remove(index)} aria-label="Remover item">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                    {typeof errors.items?.message === 'string' && <p className="text-xs text-red-500">{errors.items?.message}</p>}
                </div>
            </div>
        </form>
    );
}
