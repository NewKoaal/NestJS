import { Course } from '../courses/courses.entity';
import { User } from '../users/users.entity';
export declare enum RequestStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    EXPIRED = "EXPIRED"
}
export declare class EnrollmentRequest {
    id: string;
    userId: string;
    user?: User;
    courseId: string;
    course?: Course;
    status: string;
    requestMessage: string;
    responseMessage: string;
    requestedAt: Date;
    processedAt: Date;
    processedBy: string;
}
