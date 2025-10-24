import { Repository } from 'typeorm';
import { Enrollment, EnrollmentStatus } from './enrollments.entity';
import { EnrollmentRequest } from './enrollmentRequest.entity';
import { CourseInvitation } from './courseInvitation.entity';
import { Course } from '../courses/courses.entity';
import { User } from '../users/users.entity';
import { RequestEnrollmentDto } from './dto/enrollment-request.dto';
import { InviteToCourseDto } from './dto/enrollment-invitation.dto';
import { MailService } from '../mail/mail.service';
export declare class EnrollmentsService {
    private readonly enrollmentRepo;
    private readonly requestRepo;
    private readonly inviteRepo;
    private readonly courseRepo;
    private readonly userRepo;
    private readonly mailService;
    private static readonly MAX_ACTIVE;
    private static readonly APPROVAL_TTL_HOURS;
    constructor(enrollmentRepo: Repository<Enrollment>, requestRepo: Repository<EnrollmentRequest>, inviteRepo: Repository<CourseInvitation>, courseRepo: Repository<Course>, userRepo: Repository<User>, mailService: MailService);
    private expireIfNeeded;
    private countActiveEnrollments;
    private ensureActiveLimit;
    enrollDirect(studentId: string, courseId: string): Promise<Enrollment>;
    requestEnrollment(studentId: string, courseId: string, dto: RequestEnrollmentDto): Promise<EnrollmentRequest>;
    listRequestsForInstructor(instructorId: string): Promise<EnrollmentRequest[]>;
    decideRequest(instructorId: string, requestId: string, decision: 'approve' | 'reject', responseMessage?: string): Promise<{
        request: EnrollmentRequest;
        enrollment?: undefined;
    } | {
        request: EnrollmentRequest;
        enrollment: Enrollment;
    }>;
    invite(instructorId: string, dto: InviteToCourseDto): Promise<CourseInvitation>;
    acceptInvitation(userId: string, userEmail: string, id: string): Promise<Enrollment>;
    myCourses(studentId: string, status?: EnrollmentStatus): Promise<Enrollment[]>;
    updateStatus(studentId: string, courseId: string, status: EnrollmentStatus): Promise<Enrollment>;
    drop(studentId: string, courseId: string): Promise<Enrollment>;
    listStudentsForCourse(instructorId: string, courseId: string): Promise<Enrollment[]>;
}
