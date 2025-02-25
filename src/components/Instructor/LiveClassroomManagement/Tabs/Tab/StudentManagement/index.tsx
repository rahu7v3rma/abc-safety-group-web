'use client';

import { TInstructorStudentsData, TWithPagination } from '@/lib/types';
import { FC } from 'react';

interface StudentManagementProps {
   students?: TWithPagination<{ students: TInstructorStudentsData[] }>;
}

const StudentManagement: FC<StudentManagementProps> = () => {
   return <span>Under development</span>;
};

export default StudentManagement;
