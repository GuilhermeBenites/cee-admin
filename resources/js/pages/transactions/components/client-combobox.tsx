import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ArrowUpDown, Check, PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import axios from '@/lib/axios';
import { cn } from '@/lib/utils';
import { CommandLoading } from 'cmdk';

type Client = {
    id: number;
    name: string;
};

export function ClientCombobox({ value, onChange, className }: { value?: number; onChange: (value: number) => void; className?: string }) {
    const [open, setOpen] = useState(false);
    const [clients, setClients] = useState<Client[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios
            .get('/api/clients', { params: { q: search } })
            .then((response) => {
                setClients(response.data);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [search]);

    const handleCreateClient = () => {
        setLoading(true);
        axios
            .post('/api/clients', { name: search })
            .then((response) => {
                const newClient = response.data as Client;
                setClients((currentClients) => [...currentClients, newClient]);
                onChange(newClient.id);
                setOpen(false);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const selectedClient = clients.find((c) => c.id === value);

    const exactMatch = clients.some((client) => client.name.trim().toLowerCase() === search.trim().toLowerCase());

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className={cn('w-full justify-between', className)}>
                    {selectedClient?.name ?? 'Selecione um cliente...'}
                    <ArrowUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="z-[60] p-0" align="start" usePortal={false}>
                <Command shouldFilter={false}>
                    <CommandInput placeholder="Pesquisar cliente..." className="h-9" onValueChange={setSearch} value={search} />
                    <CommandList>
                        {loading && <CommandLoading>Carregando...</CommandLoading>}
                        <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
                        <CommandGroup>
                            {clients.map((client) => (
                                <CommandItem
                                    key={client.id}
                                    onSelect={() => {
                                        onChange(client.id);
                                        setOpen(false);
                                    }}
                                    value={client.name}
                                >
                                    {client.name}
                                    <Check className={cn('ml-auto h-4 w-4', value === client.id ? 'opacity-100' : 'opacity-0')} />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                        {!loading && search.length > 0 && !exactMatch && (
                            <CommandGroup>
                                <CommandItem onSelect={handleCreateClient} className="cursor-pointer text-sm">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Criar cliente "{search}"
                                </CommandItem>
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
