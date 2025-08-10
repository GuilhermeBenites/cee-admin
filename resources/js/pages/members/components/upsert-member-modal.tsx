import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Member } from '@/types';
import { router } from '@inertiajs/react';
import { useId, useMemo, useState } from 'react';
import { MemberForm, MemberSchema } from './member-form';

interface UpsertMemberModalProps {
    member?: Member;
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function UpsertMemberModal({ member, open, setOpen }: UpsertMemberModalProps) {
    const formId = useId();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = (values: MemberSchema) => {
        console.log(values);
        const url = member ? route('members.update', member.id) : route('members.store');
        const method = member ? 'put' : 'post';

        router[method](url, values, {
            onStart: () => setIsSubmitting(true),
            onFinish: () => setIsSubmitting(false),
            onSuccess: () => setOpen(false),
        });
    };

    function handleOpenChange(isOpen: boolean) {
        setOpen(isOpen);
    }

    const defaultValues = useMemo(() => {
        if (!member) return undefined;

        return {
            name: member.name,
            email: member.email,
            phone: member.phone,
            join_date: member.join_date,
        };
    }, [member]);

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{member ? 'Editar' : 'Novo'} membro</DialogTitle>
                    <DialogDescription>Preencha os campos abaixo para {member ? 'editar o' : 'adicionar um novo'} membro.</DialogDescription>
                </DialogHeader>

                <MemberForm id={formId} onSubmit={onSubmit} defaultValues={defaultValues} />

                <DialogFooter>
                    <Button variant="outline" onClick={() => handleOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button type="submit" form={formId} disabled={isSubmitting}>
                        {isSubmitting ? 'Salvando...' : 'Salvar'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
