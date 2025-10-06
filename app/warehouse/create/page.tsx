"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { showNotification } from '@mantine/notifications';
import { TextInput, Textarea, Button, Stack, Box } from '@mantine/core';

export default function CreateWarehouse() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            const resp = await fetch('/api/warehouses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description }),
            });
            if (resp.status === 401) {
                showNotification({ title: 'Unauthorized', message: 'You must be signed in to create a Warehouse', color: 'red' });
                return;
            }
            if (resp.ok) {
                showNotification({ title: 'Created', message: 'Warehouse created', color: 'green' });
                router.push('/Warehouse');
            } else {
                showNotification({ title: 'Error', message: 'Error creating Warehouse', color: 'red' });
            }
        } catch (err) {
            showNotification({ title: 'Error', message: 'Network error creating Warehouse', color: 'red' });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box p="md">
            <h1>Create Warehouse</h1>
            <form onSubmit={submit}>
            <Stack>
                    <TextInput
                        label="Name"
                        placeholder="Warehouse name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={loading}
                    />
                    <Textarea
                        label="Description"
                        placeholder="Short description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={loading}
                    />
                    <Button type="submit" loading={loading} disabled={loading}>
                        Create
                    </Button>
                </Stack>
            </form>
        </Box>
    );
}
