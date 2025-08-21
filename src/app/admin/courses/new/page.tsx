import { PageHeader } from '@/components/PageHeader';
import { CourseForm } from '@/features/courses/components/CourseForm';

export default function NewCoursesPage() {
    return (
        <div className="container my-8 px-12">
            <PageHeader
                title="Create Your New Courses"
                description="Manage and organize all your courses efficiently."
            ></PageHeader>
            <CourseForm></CourseForm>
        </div>
    );
}
