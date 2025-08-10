import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputMask } from '@react-input/mask';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const memberSchema = z.object({
    name: z.string().min(1, 'O nome é obrigatório'),
    email: z.string().email('Endereço de e-mail inválido'),
    phone: z.string().min(1, 'O telefone é obrigatório'),
    join_date: z.string().min(1, 'A data de adesão é obrigatória'),
});

export type MemberSchema = z.infer<typeof memberSchema>;

interface MemberFormProps {
    id: string;
    onSubmit: (values: MemberSchema) => void;
    defaultValues?: MemberSchema;
}

export function MemberForm({ id, onSubmit, defaultValues }: MemberFormProps) {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<MemberSchema>({
        resolver: zodResolver(memberSchema),
        defaultValues: defaultValues || {
            name: '',
            email: '',
            phone: '',
            join_date: '',
        },
    });

    return (
        <form id={id} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <Label htmlFor="name">Nome</Label>
                <Input id="name" {...register('name')} />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>
            <div>
                <Label htmlFor="phone">Telefone</Label>
                <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                        <InputMask
                            {...field}
                            component={Input}
                            mask="(__) _____-____"
                            replacement={{ _: /\d/ }}
                            id="phone"
                            placeholder="(00) 00000-0000"
                        />
                    )}
                />
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
            </div>
            <div>
                <Label htmlFor="join_date">Data de adesão</Label>
                <Input id="join_date" type="date" {...register('join_date')} />
                {errors.join_date && <p className="mt-1 text-xs text-red-500">{errors.join_date.message}</p>}
            </div>
        </form>
    );
}
