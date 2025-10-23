"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var EnrollmentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrollmentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const enrollments_entity_1 = require("./enrollments.entity");
const enrollmentRequest_entity_1 = require("./enrollmentRequest.entity");
const courseInvitation_entity_1 = require("./courseInvitation.entity");
const courses_entity_1 = require("../courses/courses.entity");
const users_entity_1 = require("../users/users.entity");
let EnrollmentsService = class EnrollmentsService {
    static { EnrollmentsService_1 = this; }
    enrollmentRepo;
    requestRepo;
    inviteRepo;
    courseRepo;
    userRepo;
    static MAX_ACTIVE = 5;
    static APPROVAL_TTL_HOURS = 72;
    constructor(enrollmentRepo, requestRepo, inviteRepo, courseRepo, userRepo) {
        this.enrollmentRepo = enrollmentRepo;
        this.requestRepo = requestRepo;
        this.inviteRepo = inviteRepo;
        this.courseRepo = courseRepo;
        this.userRepo = userRepo;
    }
    expireIfNeeded(req) {
        if (!req)
            return req;
        if (req.status !== enrollmentRequest_entity_1.RequestStatus.PENDING)
            return req;
        const deadline = new Date(req.requestedAt.getTime() + EnrollmentsService_1.APPROVAL_TTL_HOURS * 60 * 60 * 1000);
        if (new Date() > deadline) {
            req.status = enrollmentRequest_entity_1.RequestStatus.EXPIRED;
        }
        return req;
    }
    async countActiveEnrollments(studentId) {
        return this.enrollmentRepo.count({ where: { studentId, status: enrollments_entity_1.EnrollmentStatus.ACTIVE } });
    }
    async ensureActiveLimit(studentId) {
        const active = await this.countActiveEnrollments(studentId);
        if (active >= EnrollmentsService_1.MAX_ACTIVE) {
            throw new common_1.ForbiddenException('Active course limit reached (5).');
        }
    }
    async enrollDirect(studentId, courseId) {
        const course = await this.courseRepo.findOne({ where: { id: courseId } });
        if (!course)
            throw new common_1.NotFoundException('Course not found');
        const policy = course.status;
        if (policy === 'DRAFT' || policy === 'ARCHIVED') {
            throw new common_1.ForbiddenException('Course is invite-only. Use an invitation code.');
        }
        await this.ensureActiveLimit(studentId);
        const enrollment = this.enrollmentRepo.create({
            studentId,
            courseId,
            status: enrollments_entity_1.EnrollmentStatus.ACTIVE,
            startedAt: new Date(),
        });
        try {
            return await this.enrollmentRepo.save(enrollment);
        }
        catch (e) {
            if (/unique/i.test(String(e?.message))) {
                throw new common_1.BadRequestException('Already enrolled.');
            }
            throw e;
        }
    }
    async requestEnrollment(studentId, courseId, dto) {
        const course = await this.courseRepo.findOne({ where: { id: courseId } });
        if (!course)
            throw new common_1.NotFoundException('Course not found');
        await this.ensureActiveLimit(studentId);
        const req = this.requestRepo.create({
            userId: studentId,
            courseId,
            status: enrollmentRequest_entity_1.RequestStatus.PENDING,
            requestMessage: dto.requestMessage ?? '',
        });
        return this.requestRepo.save(req);
    }
    async listRequestsForInstructor(instructorId) {
        const courses = await this.courseRepo.find({ where: { instructorId } });
        const courseIds = courses.map(c => c.id);
        const reqs = await this.requestRepo.find({ where: { courseId: courseIds }, order: { requestedAt: 'DESC' } });
        return reqs.map(r => this.expireIfNeeded(r));
    }
    async decideRequest(instructorId, requestId, decision, responseMessage) {
        const req = await this.requestRepo.findOne({ where: { id: requestId } });
        if (!req)
            throw new common_1.NotFoundException('Request not found');
        const course = await this.courseRepo.findOne({ where: { id: req.courseId } });
        if (!course)
            throw new common_1.NotFoundException('Course not found');
        if (course.instructorId !== instructorId)
            throw new common_1.ForbiddenException('Not your course');
        this.expireIfNeeded(req);
        if (req.status === enrollmentRequest_entity_1.RequestStatus.EXPIRED) {
            await this.requestRepo.save(req);
            throw new common_1.BadRequestException('Request expired (72h)');
        }
        req.responseMessage = responseMessage ?? '';
        req.processedAt = new Date();
        req.processedBy = instructorId;
        if (decision === 'reject') {
            req.status = enrollmentRequest_entity_1.RequestStatus.REJECTED;
            await this.requestRepo.save(req);
            return { request: req };
        }
        await this.ensureActiveLimit(req.userId);
        req.status = enrollmentRequest_entity_1.RequestStatus.APPROVED;
        await this.requestRepo.save(req);
        const enrollment = this.enrollmentRepo.create({
            studentId: req.userId,
            courseId: req.courseId,
            status: enrollments_entity_1.EnrollmentStatus.ACTIVE,
            startedAt: new Date(),
        });
        return { request: req, enrollment: await this.enrollmentRepo.save(enrollment) };
    }
    async invite(instructorId, dto) {
        const course = await this.courseRepo.findOne({ where: { id: dto.courseId } });
        if (!course)
            throw new common_1.NotFoundException('Course not found');
        if (course.instructorId !== instructorId)
            throw new common_1.ForbiddenException('Not your course');
        const expiresAt = new Date(Date.now() + (dto.expiresInHours ?? 72) * 3600 * 1000);
        const inv = this.inviteRepo.create({
            courseId: dto.courseId,
            invitedBy: instructorId,
            inviteeEmail: dto.inviteeEmail.toLowerCase(),
            status: courseInvitation_entity_1.InvitationStatus.PENDING,
            expiresAt,
        });
        return this.inviteRepo.save(inv);
    }
    async acceptInvitation(userId, userEmail, code) {
        const inv = await this.inviteRepo.findOne({ where: { id: code } });
        if (!inv)
            throw new common_1.NotFoundException('Invitation not found');
        if (inv.status !== courseInvitation_entity_1.InvitationStatus.PENDING)
            throw new common_1.BadRequestException('Invitation not valid');
        if (new Date() > inv.expiresAt) {
            inv.status = courseInvitation_entity_1.InvitationStatus.EXPIRED;
            await this.inviteRepo.save(inv);
            throw new common_1.BadRequestException('Invitation expired');
        }
        if (inv.inviteeEmail.toLowerCase() !== userEmail.toLowerCase()) {
            throw new common_1.ForbiddenException('Invitation is for a different email');
        }
        await this.ensureActiveLimit(userId);
        const enrollment = this.enrollmentRepo.create({
            studentId: userId,
            courseId: inv.courseId,
            status: enrollments_entity_1.EnrollmentStatus.ACTIVE,
            startedAt: new Date(),
        });
        const saved = await this.enrollmentRepo.save(enrollment);
        inv.status = courseInvitation_entity_1.InvitationStatus.APPROVED;
        await this.inviteRepo.save(inv);
        return saved;
    }
    async myCourses(studentId, status) {
        const where = { studentId };
        if (status)
            where.status = status;
        return this.enrollmentRepo.find({ where, order: { createdAt: 'DESC' } });
    }
    async updateStatus(studentId, courseId, status) {
        const enrollment = await this.enrollmentRepo.findOne({ where: { studentId, courseId } });
        if (!enrollment)
            throw new common_1.NotFoundException('Enrollment not found');
        if (status === enrollments_entity_1.EnrollmentStatus.COMPLETED) {
            enrollment.completedAt = new Date();
        }
        if (status === enrollments_entity_1.EnrollmentStatus.DROPPED) {
            enrollment.expiresAt = new Date();
        }
        enrollment.status = status;
        return this.enrollmentRepo.save(enrollment);
    }
    async drop(studentId, courseId) {
        return this.updateStatus(studentId, courseId, enrollments_entity_1.EnrollmentStatus.DROPPED);
    }
    async listStudentsForCourse(instructorId, courseId) {
        const course = await this.courseRepo.findOne({ where: { id: courseId } });
        if (!course)
            throw new common_1.NotFoundException('Course not found');
        if (course.instructorId !== instructorId)
            throw new common_1.ForbiddenException('Not your course');
        return this.enrollmentRepo.find({ where: { courseId, status: enrollments_entity_1.EnrollmentStatus.ACTIVE } });
    }
};
exports.EnrollmentsService = EnrollmentsService;
exports.EnrollmentsService = EnrollmentsService = EnrollmentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(enrollments_entity_1.Enrollment)),
    __param(1, (0, typeorm_1.InjectRepository)(enrollmentRequest_entity_1.EnrollmentRequest)),
    __param(2, (0, typeorm_1.InjectRepository)(courseInvitation_entity_1.CourseInvitation)),
    __param(3, (0, typeorm_1.InjectRepository)(courses_entity_1.Course)),
    __param(4, (0, typeorm_1.InjectRepository)(users_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], EnrollmentsService);
//# sourceMappingURL=enrollments.service.js.map