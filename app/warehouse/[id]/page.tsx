"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { showNotification } from '@mantine/notifications';
import { TextInput, Textarea, Button, Stack, Box } from '@mantine/core';

export default function WarehouseEditPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;
    const [Warehouse, setWarehouse] = useState<any>(null);
        const [name, setName] = useState('');
        const [description, setDescription] = useState('');
        const [loading, setLoading] = useState(false);
        const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetch('/api/warehouses')
        .then((r) => r.json())
        .then((data) => {
            const p = data.Warehouses?.find((x: any) => x.id === id);
            setWarehouse(p);
            if (p) {
            setName(p.name);
            setDescription(p.description || '');
            }
        });
    }, [id]);

        async function save(e: React.FormEvent) {
            e.preventDefault();
            setLoading(true);
            try {
                const resp = await fetch(`/api/warehouses/${id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, description }),
                });
                if (resp.status === 401) return showNotification({ title: 'Unauthorized', message: 'You must sign in to edit this Warehouse', color: 'red' });
                if (resp.status === 403) return showNotification({ title: 'Forbidden', message: 'You are not allowed to edit this Warehouse', color: 'red' });
                if (resp.ok) {
                    showNotification({ title: 'Saved', message: 'Warehouse saved', color: 'green' });
                    router.push('/warehouse');
                } else showNotification({ title: 'Error', message: 'Error saving Warehouse', color: 'red' });
            } catch (err) {
                showNotification({ title: 'Error', message: 'Network error saving Warehouse', color: 'red' });
            } finally {
                setLoading(false);
            }
        }

    async function del() {
        if (!confirm('Delete Warehouse?')) return;
        setDeleting(true);
        try {
            const resp = await fetch(`/api/warehouses/${id}`, { method: 'DELETE' });
            if (resp.status === 401) return showNotification({ title: 'Unauthorized', message: 'You must sign in to delete this Warehouse', color: 'red' });
            if (resp.status === 403) return showNotification({ title: 'Forbidden', message: 'You are not allowed to delete this Warehouse', color: 'red' });
            if (resp.ok) {
                showNotification({ title: 'Deleted', message: 'Warehouse deleted', color: 'green' });
                router.push('/warehouse');
            } else showNotification({ title: 'Error', message: 'Error deleting Warehouse', color: 'red' });
        } catch (err) {
            showNotification({ title: 'Error', message: 'Network error deleting Warehouse', color: 'red' });
        } finally {
            setDeleting(false);
        }
    }

    if (!Warehouse) return <div style={{ padding: 24 }}>Loading...</div>;

        return (
            <Box p="md">
                <h1>Edit Warehouse</h1>
                <form onSubmit={save}>
                    <Stack>
                        <TextInput label="Name" value={name} onChange={(e) => setName(e.target.value)} required disabled={loading} />
                        <Textarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} disabled={loading} />
                        <Button type="submit" loading={loading} disabled={loading}>Save</Button>
                    </Stack>
                </form>
                <Button color="red" mt="sm" onClick={del} loading={deleting} disabled={deleting}>Delete</Button>
            </Box>
        );
}
