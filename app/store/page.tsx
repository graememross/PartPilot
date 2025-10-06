"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Table } from '@mantine/core';

type Store = {
    id: string;
    name: string;
    description?: string;
};

export default function StoresPage() {
    const [Stores, setStores] = useState<Store[]>([]);

    useEffect(() => {
        fetch('/api/stores')
        .then((r) => r.json())
        .then((data) => 
            setStores(data.stores || []));
    }, []);

    const rows = Stores.map((element) => (
        <Table.Tr key={element.name}>
            <Table.Td>{element.name}</Table.Td>
            <Table.Td>{element.description}</Table.Td>
            <Table.Td>
                <Link href={`/store/${element.id}`}>Edit</Link>
            </Table.Td>
        </Table.Tr>
    ));
    return (
        <div style={{ padding: 24 }}>
            <h1>Stores</h1>
            <Link href="/store/create">Create new Store</Link>

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
