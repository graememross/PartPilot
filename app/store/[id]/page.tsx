"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { showNotification } from '@mantine/notifications';
import { TextInput, Textarea, Button, Stack, Box } from '@mantine/core';

export default function StoreEditPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;
    const [Store, setStore] = useState<any>(null);
        const [name, setName] = useState('');
        const [description, setDescription] = useState('');
        const [loading, setLoading] = useState(false);
        const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetch('/api/stores')
        .then((r) => r.json())
        .then((data) => {
            const p = data.Stores?.find((x: any) => x.id === id);
            setStore(p);
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
                const resp = await fetch(`/api/stores/${id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, description }),
                });
                if (resp.status === 401) return showNotification({ title: 'Unauthorized', message: 'You must sign in to edit this Store', color: 'red' });
                if (resp.status === 403) return showNotification({ title: 'Forbidden', message: 'You are not allowed to edit this Store', color: 'red' });
                if (resp.ok) {
                    showNotification({ title: 'Saved', message: 'Store saved', color: 'green' });
                    router.push('/store');
                } else showNotification({ title: 'Error', message: 'Error saving Store', color: 'red' });
            } catch (err) {
                showNotification({ title: 'Error', message: 'Network error saving Store', color: 'red' });
            } finally {
                setLoading(false);
            }
        }

    async function del() {
        if (!confirm('Delete Store?')) return;
        setDeleting(true);
        try {
            const resp = await fetch(`/api/stores/${id}`, { method: 'DELETE' });
            if (resp.status === 401) return showNotification({ title: 'Unauthorized', message: 'You must sign in to delete this Store', color: 'red' });
            if (resp.status === 403) return showNotification({ title: 'Forbidden', message: 'You are not allowed to delete this Store', color: 'red' });
            if (resp.ok) {
                showNotification({ title: 'Deleted', message: 'Store deleted', color: 'green' });
                router.push('/store');
            } else showNotification({ title: 'Error', message: 'Error deleting Store', color: 'red' });
        } catch (err) {
            showNotification({ title: 'Error', message: 'Network error deleting Store', color: 'red' });
        } finally {
            setDeleting(false);
        }
    }

    if (!Store) return <div style={{ padding: 24 }}>Loading...</div>;

        return (
            <Box p="md">
                <h1>Edit Store</h1>
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
