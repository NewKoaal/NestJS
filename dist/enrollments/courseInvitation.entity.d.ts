import { Course } from '../courses/courses.entity';
import { User } from '../users/users.entity';
export declare enum InvitationStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    EXPIRED = "EXPIRED"
}
export declare class CourseInvitation {
    id: string;
    courseId: string;
    course?: Course;
    invitedBy: string;
    user?: User;
    inviteeEmail: string;
    status: string;
    expiresAt: Date;
    createdAt: Date;
}
