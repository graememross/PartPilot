"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Table } from '@mantine/core';

type Project = {
    id: string;
    name: string;
    description?: string;
};

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        fetch('/api/projects')
        .then((r) => r.json())
        .then((data) => setProjects(data.projects || []));
    }, []);

    const rows = projects.map((element) => (
        <Table.Tr key={element.name}>
            <Table.Td>{element.name}</Table.Td>
            <Table.Td>{element.description}</Table.Td>
            <Table.Td>
                <Link href={`/project/${element.id}`}>Edit</Link>
            </Table.Td>
        </Table.Tr>
    ));
    return (
        <div style={{ padding: 24 }}>
            <h1>Projects</h1>
            <Link href="/project/create">Create new project</Link>

            <Table>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Description</Table.Th>
                    <Table.Th>Actions</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </div>
    );
}
