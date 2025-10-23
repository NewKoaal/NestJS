import { EnrollmentsService } from './enrollments.service';
import { MyCoursesQueryDto, UpdateProgressDto } from './dto/enrollment.dto';
import { EnrollDirectDto, RequestEnrollmentDto } from './dto/enrollment-request.dto';
import { InviteToCourseDto, AcceptInvitationDto } from './dto/enrollment-invitation.dto';
export declare class EnrollmentsController {
    private readonly enrollmentsService;
    constructor(enrollmentsService: EnrollmentsService);
    enroll(req: any, dto: EnrollDirectDto): Promise<import("./enrollments.entity").Enrollment>;
    request(req: any, courseId: string, dto: RequestEnrollmentDto): Promise<import("./enrollmentRequest.entity").EnrollmentRequest>;
    listRequests(req: any): Promise<import("./enrollmentRequest.entity").EnrollmentRequest[]>;
    decide(req: any, id: string, decision: 'approve' | 'reject', responseMessage?: string): Promise<{
        request: import("./enrollmentRequest.entity").EnrollmentRequest;
        enrollment?: undefined;
    } | {
        request: import("./enrollmentRequest.entity").EnrollmentRequest;
        enrollment: import("./enrollments.entity").Enrollment;
    }>;
    invite(req: any, dto: InviteToCourseDto): Promise<import("./courseInvitation.entity").CourseInvitation>;
    accept(req: any, dto: AcceptInvitationDto): Promise<import("./enrollments.entity").Enrollment>;
    myCourses(req: any, q: MyCoursesQueryDto): Promise<import("./enrollments.entity").Enrollment[]>;
    updateStatus(req: any, courseId: string, dto: UpdateProgressDto): Promise<import("./enrollments.entity").Enrollment>;
    drop(req: any, courseId: string): Promise<import("./enrollments.entity").Enrollment>;
}
