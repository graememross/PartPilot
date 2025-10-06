"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { showNotification } from '@mantine/notifications';
import { TextInput, Textarea, Button, Stack, Box } from '@mantine/core';

export default function ProjectEditPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;
    const [project, setProject] = useState<any>(null);
        const [name, setName] = useState('');
        const [description, setDescription] = useState('');
        const [loading, setLoading] = useState(false);
        const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetch('/api/projects')
        .then((r) => r.json())
        .then((data) => {
            const p = data.projects?.find((x: any) => x.id === id);
            setProject(p);
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
                const resp = await fetch(`/api/projects/${id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, description }),
                });
                if (resp.status === 401) return showNotification({ title: 'Unauthorized', message: 'You must sign in to edit this project', color: 'red' });
                if (resp.status === 403) return showNotification({ title: 'Forbidden', message: 'You are not allowed to edit this project', color: 'red' });
                if (resp.ok) {
                    showNotification({ title: 'Saved', message: 'Project saved', color: 'green' });
                    router.push('/project');
                } else showNotification({ title: 'Error', message: 'Error saving project', color: 'red' });
            } catch (err) {
                showNotification({ title: 'Error', message: 'Network error saving project', color: 'red' });
            } finally {
                setLoading(false);
            }
        }

    async function del() {
        if (!confirm('Delete project?')) return;
        setDeleting(true);
        try {
            const resp = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
            if (resp.status === 401) return showNotification({ title: 'Unauthorized', message: 'You must sign in to delete this project', color: 'red' });
            if (resp.status === 403) return showNotification({ title: 'Forbidden', message: 'You are not allowed to delete this project', color: 'red' });
            if (resp.ok) {
                showNotification({ title: 'Deleted', message: 'Project deleted', color: 'green' });
                router.push('/project');
            } else showNotification({ title: 'Error', message: 'Error deleting project', color: 'red' });
        } catch (err) {
            showNotification({ title: 'Error', message: 'Network error deleting project', color: 'red' });
        } finally {
            setDeleting(false);
        }
    }

    if (!project) return <div style={{ padding: 24 }}>Loading...</div>;

        return (
            <Box p="md">
                <h1>Edit Project</h1>
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
