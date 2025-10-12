import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Container, Title } from '@mantine/core'; 

// 🛑 CRITICAL: Dynamically import the client component and DISABLE SSR
const CsvDropZone = dynamic(
    () => import('@/components/DropZone/CsvDropZone'),
    {
        // This prevents the "default.then" error by forcing client-side rendering
        ssr: false, 
        loading: () => <p>Loading file upload interface...</p>
    }
);

export default function CsvUploadPage() {
    return (
        <Container size="md" pt="xl">
        <Title order={2} ta="center" mb="lg">Mantine CSV Parser</Title>

        <Suspense fallback={<div>Loading...</div>}>
            <CsvDropZone />
        </Suspense>
        </Container>
    );
}