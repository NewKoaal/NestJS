import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnrollmentsController } from './enrollments.controller';
import { EnrollmentsService } from './enrollments.service';

import { Enrollment } from './enrollments.entity';
import { EnrollmentRequest } from './enrollmentRequest.entity';
import { CourseInvitation } from './courseInvitation.entity';
import { Course } from '../courses/courses.entity';
import { User } from '../users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Enrollment, EnrollmentRequest, CourseInvitation, Course, User]),],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
})
export class EnrollmentsModule {}
