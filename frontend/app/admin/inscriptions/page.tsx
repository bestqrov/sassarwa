'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const InscriptionForm = dynamic(() => import('@/components/forms/InscriptionForm'), {
    loading: () => <LoadingSpinner />,
});

export default function RegisterStudentPage() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <InscriptionForm onSuccessRedirect="/admin/students" />
        </Suspense>
    );
}
