"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { showNotification } from '@mantine/notifications';
import { TextInput, Textarea, Button, Stack, Box } from '@mantine/core';

export default function CreateStore() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            const resp = await fetch('/api/stores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description }),
            });
            if (resp.status === 401) {
                showNotification({ title: 'Unauthorized', message: 'You must be signed in to create a Store', color: 'red' });
                return;
            }
            if (resp.ok) {
                showNotification({ title: 'Created', message: 'Store created', color: 'green' });
                router.push('/store');
            } else {
                showNotification({ title: 'Error', message: 'Error creating Store', color: 'red' });
            }
        } catch (err) {
            showNotification({ title: 'Error', message: 'Network error creating Store', color: 'red' });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box p="md">
            <h1>Create Store</h1>
            <form onSubmit={submit}>
            <Stack>
                    <TextInput
                        label="Name"
                        placeholder="Store name"
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
