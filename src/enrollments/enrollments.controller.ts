import { Body, Controller, Get, Param, Patch, Post, Query, Req, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';

import { MyCoursesQueryDto, UpdateProgressDto } from './dto/enrollment.dto';
import { EnrollDirectDto, RequestEnrollmentDto } from './dto/enrollment-request.dto';
import { InviteToCourseDto, AcceptInvitationDto } from './dto/enrollment-invitation.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post('enroll')
  async enroll(@Req() req, @Body() dto: EnrollDirectDto) {
    return this.enrollmentsService.enrollDirect(req.user.id, dto.courseId);
  }

  @Post('request/:courseId')
  async request(@Req() req, @Param('courseId', new ParseUUIDPipe()) courseId: string, @Body() dto: RequestEnrollmentDto) {
    const userId = req.user.id;
    return this.enrollmentsService.requestEnrollment(userId, courseId, dto);
  }

  @Get('requests')
  async listRequests(@Req() req) {
    const instructorId = req.user.id;
    return this.enrollmentsService.listRequestsForInstructor(instructorId);
  }

  @Patch('requests/:id')
  async decide(@Req() req, @Param('id', new ParseUUIDPipe()) id: string, @Query('decision') decision: 'approve' | 'reject', @Body('responseMessage') responseMessage?: string) {
    const instructorId = req.user.id;
    return this.enrollmentsService.decideRequest(instructorId, id, decision, responseMessage);
  }

  @Post('invite')
  async invite(@Req() req, @Body() dto: InviteToCourseDto) {
    const instructorId = req.user.id;
    return this.enrollmentsService.invite(instructorId, dto);
  }

  @Post('accept-invitation')
  async accept(@Req() req, @Body() dto: AcceptInvitationDto) {
    const userId = req.user.id;
    const email = req.user.email;
    return this.enrollmentsService.acceptInvitation(userId, email, dto.code);
  }

  @Get('my-courses')
  async myCourses(@Req() req, @Query() q: MyCoursesQueryDto) {
    const userId = req.user.id;
    return this.enrollmentsService.myCourses(userId, q.status);
  }

  @Patch(':courseId/status')
  async updateStatus(@Req() req, @Param('courseId') courseId: string, @Body() dto: UpdateProgressDto) {
    const userId = req.user.id;
    return this.enrollmentsService.updateStatus(userId, courseId, dto.status);
  }

  @Post(':courseId/drop')
  async drop(@Req() req, @Param('courseId') courseId: string) {
    const userId = req.user.id;
    return this.enrollmentsService.drop(userId, courseId);
  }
}
