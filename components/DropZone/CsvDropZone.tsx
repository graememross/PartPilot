"use client";

import React, { useCallback, useState } from 'react';
import Papa from 'papaparse';
import { Dropzone, FileWithPath, MIME_TYPES } from '@mantine/dropzone';
import { Group, Text, rem, Alert, Table, Button } from '@mantine/core';
import { IconUpload, IconFileText, IconX, IconAlertCircle } from '@tabler/icons-react';
import { showNotification } from '@mantine/notifications';
import { extractPartInfoFromLCSCResponse } from "@/lib/helper/lcsc_api";

// --- 1. Parsing Logic (Reusable Function) ---
const parseCsvFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.errors.length) {
                reject(results.errors);
                } else {
                resolve(results.data);
                }
            },
            error: (error: Error) => {
                reject(error);
            },
            });
        });
};

// --- 2. Mantine Dropzone Component ---
export default function CsvMantineDropzone() {
    const [parsedData, setParsedData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [orderNum, setOrderNum] = useState<string | null>(null);
    const [vendor, setVendor] = useState<string | null>(null);

    const handleDrop = useCallback(async (files: FileWithPath[]) => {
        const file = files[0];

        if (file) {
            setLoading(true);
            setError(null);
            setParsedData([]); // Clear previous data
            const nameArray = file.name.split('_')
            setOrderNum(nameArray[2])
            setVendor(nameArray[0])
            try {
                const data = await parseCsvFile(file);
                setParsedData(data);
            } catch (e) {
                setError('Failed to parse CSV file. Please ensure it is a valid CSV format.');
            } finally {
                setLoading(false);
            }
        }
    }, []);

    const clearData = () => {
        setParsedData([]);
        setError(null);
        setVendor(null);
        setOrderNum(null);
    }

    const acceptOrder = async () => {
        setLoading(true);
        try {
            const resp = await fetch('/api/warehouses/0/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    'warehouse': 0,
                    'orderNum': orderNum,
                    'vendor': vendor,
                    'lines': parsedData
                }),
            });
            if (resp.status === 401) {
                showNotification({ title: 'Unauthorized', message: 'You must be signed in to create a Warehouse', color: 'red' });
                return;
            }
            if (resp.ok) {
                showNotification({ title: 'Created', message: 'Warehouse created', color: 'green' });
            } else {
                showNotification({ title: 'Error', message: 'Error creating Warehouse', color: 'red' });
            }
        } catch (err) {
            showNotification({ title: 'Error', message: 'Network error creating Warehouse', color: 'red' });
        } finally {
            setLoading(false);
        }
    }
  // Determine column headers for the table preview
    const columns = parsedData.length > 0 ? Object.keys(parsedData[0]) : [];

    return (
    <>
        <Dropzone
            onDrop={handleDrop}
            onReject={(files) => setError(`File rejected: ${files[0]?.file.name || 'Unknown file'}`)}
            maxFiles={1}
            accept={[MIME_TYPES.csv]} // Accept only CSV
            loading={loading}
            h={rem(180)}
        >
        <Group justify="center" gap="xl" style={{ minHeight: rem(150), pointerEvents: 'none' }}>
            <Dropzone.Accept>
                <IconUpload size="3.2rem" stroke={1.5} color="var(--mantine-color-blue-6)" />
            </Dropzone.Accept>
            <Dropzone.Reject>
                <IconX size="3.2rem" stroke={1.5} color="var(--mantine-color-red-6)" />
            </Dropzone.Reject>
            <Dropzone.Idle>
                <IconFileText size="3.2rem" stroke={1.5} color="var(--mantine-color-dimmed)" />
            </Dropzone.Idle>

            <div>
                <Text size="xl" inline>
                Drag a CSV order file here or click to select
                </Text>
                <Text size="sm" color="dimmed" inline mt={7}>
                Only a single .csv file is accepted
                </Text>
            </div>
        </Group>
        </Dropzone>

        {/* Status and Error Display */}
        {error && (
            <Alert icon={<IconAlertCircle size="1rem" />} title="Error" color="red" mt="md">
            {error}
            </Alert>
        )}

        {/* Data Preview */}
        {parsedData.length > 0 && (
            <div style={{ marginTop: '20px' }}>
            <Group justify="space-between" mb="xs">
                <Text fw={700}>Parsed {parsedData.length} rows</Text>
                <Text>Vendor: {vendor}</Text>
                <Text>Order #: {orderNum}</Text>
                <Button size="xs" variant="light" color="green" onClick={acceptOrder}>Accept Order</Button>
                <Button size="xs" variant="light" color="red" onClick={clearData}>Clear Data</Button>
            </Group>
            <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid var(--mantine-color-gray-3)' }}>
                <Table stickyHeader striped>
                <Table.Thead>
                    <Table.Tr>
                    {columns.map((col) => (
                        <Table.Th key={col}>{col}</Table.Th>
                    ))}
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {/* Show a preview of the first 5 rows */}
                    {parsedData.slice(0, 5).map((row, index) => (
                    <Table.Tr key={index}>
                        {columns.map((col) => (
                        <Table.Td key={col}>{String(row[col] || '')}</Table.Td>
                        ))}
                    </Table.Tr>
                    ))}
                </Table.Tbody>
                </Table>
            </div>
            </div>
        )}
    </>
    );
}
