import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Enrollment, EnrollmentStatus } from './enrollments.entity';
import { EnrollmentRequest, RequestStatus } from './enrollmentRequest.entity';
import { CourseInvitation, InvitationStatus } from './courseInvitation.entity';

import { Course } from '../courses/courses.entity';
import { User } from '../users/users.entity';

import { RequestEnrollmentDto } from './dto/enrollment-request.dto';
import { InviteToCourseDto } from './dto/enrollment-invitation.dto';

@Injectable()
export class EnrollmentsService {
  private static readonly MAX_ACTIVE = 5;
  private static readonly APPROVAL_TTL_HOURS = 72;

  constructor(
    @InjectRepository(Enrollment) private readonly enrollmentRepo: Repository<Enrollment>,
    @InjectRepository(EnrollmentRequest) private readonly requestRepo: Repository<EnrollmentRequest>,
    @InjectRepository(CourseInvitation) private readonly inviteRepo: Repository<CourseInvitation>,
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  private expireIfNeeded(req: EnrollmentRequest): EnrollmentRequest {
    if (!req) return req;
    if (req.status !== RequestStatus.PENDING) return req;
    const deadline = new Date(req.requestedAt.getTime() + EnrollmentsService.APPROVAL_TTL_HOURS * 60 * 60 * 1000);
    if (new Date() > deadline) {
    req.status = RequestStatus.EXPIRED;
    }
    return req;
  }

  private async countActiveEnrollments(studentId: string): Promise<number> {
    return this.enrollmentRepo.count({ where: { studentId, status: EnrollmentStatus.ACTIVE } });
  }

  private async ensureActiveLimit(studentId: string) {
    const active = await this.countActiveEnrollments(studentId);
    if (active >= EnrollmentsService.MAX_ACTIVE) {
      throw new ForbiddenException('Active course limit reached (5).');
    }
  }

  async enrollDirect(studentId: string, courseId: string) {
    const course = await this.courseRepo.findOne({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Course not found');
    
    const policy = course.status;
    if (policy === 'DRAFT' || policy === 'ARCHIVED') {
      throw new ForbiddenException('Course is invite-only. Use an invitation code.');
    }
    
    await this.ensureActiveLimit(studentId);
    
    const enrollment = this.enrollmentRepo.create({
      studentId,
      courseId,
      status: EnrollmentStatus.ACTIVE,
      startedAt: new Date(),
    });
    try {
      return await this.enrollmentRepo.save(enrollment);
    } catch (e) {
      if (/unique/i.test(String(e?.message))) {
        throw new BadRequestException('Already enrolled.');
      }
      throw e;
    }
  }

  async requestEnrollment(studentId: string, courseId: string, dto: RequestEnrollmentDto) {
    const course = await this.courseRepo.findOne({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Course not found');
    
    await this.ensureActiveLimit(studentId);
    
    const req = this.requestRepo.create({
      userId: studentId,
      courseId,
      status: RequestStatus.PENDING,
      requestMessage: dto.requestMessage ?? '',
    });
    return this.requestRepo.save(req);
  }

  async listRequestsForInstructor(instructorId: string) {
    const courses = await this.courseRepo.find({ where: { instructorId } as any });
    const courseIds = courses.map(c => c.id);
    const reqs = await this.requestRepo.find({ where: { courseId: (courseIds as any) } as any, order: { requestedAt: 'DESC' } });
    return reqs.map(r => this.expireIfNeeded(r));
  }

  async decideRequest(instructorId: string, requestId: string, decision: 'approve' | 'reject', responseMessage?: string) {
    const req = await this.requestRepo.findOne({ where: { id: requestId } });
    if (!req) throw new NotFoundException('Request not found');
    
    const course = await this.courseRepo.findOne({ where: { id: req.courseId } });
    if (!course) throw new NotFoundException('Course not found');
    if (course.instructorId !== instructorId) throw new ForbiddenException('Not your course');
    
    this.expireIfNeeded(req);
    if (req.status === RequestStatus.EXPIRED) {
      await this.requestRepo.save(req);
      throw new BadRequestException('Request expired (72h)');
    }
    
    req.responseMessage = responseMessage ?? '';
    req.processedAt = new Date();
    req.processedBy = instructorId;
    
    if (decision === 'reject') {
      req.status = RequestStatus.REJECTED;
      await this.requestRepo.save(req);
      return { request: req };
    }
    
    await this.ensureActiveLimit(req.userId);
    
    req.status = RequestStatus.APPROVED;
    await this.requestRepo.save(req);
    
    const enrollment = this.enrollmentRepo.create({
      studentId: req.userId,
      courseId: req.courseId,
      status: EnrollmentStatus.ACTIVE,
      startedAt: new Date(),
    });
    return { request: req, enrollment: await this.enrollmentRepo.save(enrollment) };
  }

  async invite(instructorId: string, dto: InviteToCourseDto) {
    const course = await this.courseRepo.findOne({ where: { id: dto.courseId } });
    if (!course) throw new NotFoundException('Course not found');
    if (course.instructorId !== instructorId) throw new ForbiddenException('Not your course');
    
    const expiresAt = new Date(Date.now() + (dto.expiresInHours ?? 72) * 3600 * 1000);
    
    const inv = this.inviteRepo.create({
      courseId: dto.courseId,
      invitedBy: instructorId,
      inviteeEmail: dto.inviteeEmail.toLowerCase(),
      status: InvitationStatus.PENDING,
      expiresAt,
    });
    return this.inviteRepo.save(inv);
  }

  async acceptInvitation(userId: string, userEmail: string, code: string) {
    const inv = await this.inviteRepo.findOne({ where: { id: code } });
    if (!inv) throw new NotFoundException('Invitation not found');
    
    if (inv.status !== InvitationStatus.PENDING) throw new BadRequestException('Invitation not valid');
    if (new Date() > inv.expiresAt) {
      inv.status = InvitationStatus.EXPIRED;
      await this.inviteRepo.save(inv);
      throw new BadRequestException('Invitation expired');
    }
    
    if (inv.inviteeEmail.toLowerCase() !== userEmail.toLowerCase()) {
      throw new ForbiddenException('Invitation is for a different email');
    }
    
    await this.ensureActiveLimit(userId);
    
    const enrollment = this.enrollmentRepo.create({
      studentId: userId,
      courseId: inv.courseId,
      status: EnrollmentStatus.ACTIVE,
      startedAt: new Date(),
    });
    const saved = await this.enrollmentRepo.save(enrollment);
    
    inv.status = InvitationStatus.APPROVED;
    await this.inviteRepo.save(inv);
    
    return saved;
  }

  async myCourses(studentId: string, status?: EnrollmentStatus) {
    const where: any = { studentId };
    if (status) where.status = status;
    return this.enrollmentRepo.find({ where, order: { createdAt: 'DESC' } });
  }

  async updateStatus(studentId: string, courseId: string, status: EnrollmentStatus) {
    const enrollment = await this.enrollmentRepo.findOne({ where: { studentId, courseId } });
    if (!enrollment) throw new NotFoundException('Enrollment not found');
    
    if (status === EnrollmentStatus.COMPLETED) {
      enrollment.completedAt = new Date();
    }
    if (status === EnrollmentStatus.DROPPED) {
      enrollment.expiresAt = new Date();
    }
    
    enrollment.status = status;
    return this.enrollmentRepo.save(enrollment);
  }

  async drop(studentId: string, courseId: string) {
    return this.updateStatus(studentId, courseId, EnrollmentStatus.DROPPED);
  }

  async listStudentsForCourse(instructorId: string, courseId: string) {
    const course = await this.courseRepo.findOne({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Course not found');
    if (course.instructorId !== instructorId) throw new ForbiddenException('Not your course');
    
    return this.enrollmentRepo.find({ where: { courseId, status: EnrollmentStatus.ACTIVE } });
  }
}
