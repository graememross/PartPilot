"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Table } from '@mantine/core';

type Warehouse = {
    id: string;
    name: string;
    description?: string;
};

export default function WarehousePage() {
    const [Warehouse, setWarehouse] = useState<Warehouse[]>([]);

    useEffect(() => {
        fetch('/api/warehouses')
        .then((r) => r.json())
        .then((data) => 
            setWarehouse(data.warehouses || []));
    }, []);

    const rows = Warehouse.map((element) => (
        <Table.Tr key={element.name}>
            <Table.Td>{element.name}</Table.Td>
            <Table.Td>{element.description}</Table.Td>
            <Table.Td>
                <Link href={`/warehouse/${element.id}`}>Edit</Link>
            </Table.Td>
        </Table.Tr>
    ));
    return (
        <div style={{ padding: 24 }}>
            <h1>Warehouse</h1>
            <Link href="/warehouses/create">Create new warehouse</Link>

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
