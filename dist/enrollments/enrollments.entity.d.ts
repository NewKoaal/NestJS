import { Course } from '../courses/courses.entity';
import { User } from '../users/users.entity';
export declare enum EnrollmentStatus {
    PENDING_APPROVAL = "PENDING APPROVAL",
    ACTIVE = "ACTIVE",
    COMPLETED = "COMPLETED",
    DROPPED = "DROPPED",
    SUSPENDED = "SUSPENDED"
}
export declare class Enrollment {
    id: string;
    studentId: string;
    student?: User;
    courseId: string;
    course?: Course;
    teamId: string;
    status: string;
    startedAt: Date;
    completedAt: Date;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
