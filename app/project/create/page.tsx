"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { showNotification } from '@mantine/notifications';
import { TextInput, Textarea, Button, Stack, Box } from '@mantine/core';

export default function CreateProject() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            const resp = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description }),
            });
            if (resp.status === 401) {
                showNotification({ title: 'Unauthorized', message: 'You must be signed in to create a project', color: 'red' });
                return;
            }
            if (resp.ok) {
                showNotification({ title: 'Created', message: 'Project created', color: 'green' });
                router.push('/project');
            } else {
                showNotification({ title: 'Error', message: 'Error creating project', color: 'red' });
            }
        } catch (err) {
            showNotification({ title: 'Error', message: 'Network error creating project', color: 'red' });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box p="md">
            <h1>Create Project</h1>
            <form onSubmit={submit}>
            <Stack>
                    <TextInput
                        label="Name"
                        placeholder="Project name"
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
