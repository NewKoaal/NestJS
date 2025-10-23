import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { Course } from '../courses/courses.entity';
import { User } from '../users/users.entity';

export enum RequestStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    EXPIRED = 'EXPIRED',
}

@Entity('enrollment_requests')
export class EnrollmentRequest {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: 'uuid' })
  @Index('idx_enrollment_request_user')
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Column({ type: 'uuid' })
  @Index('idx_enrollment_request_course')
  courseId: string;

  @ManyToOne(() => Course, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'courseId' })
  course?: Course;

  @Column({
    type: 'enum',
    enum: RequestStatus,
    default: RequestStatus.PENDING
  })
  status: string;

  @Column({ type: 'text' })
  requestMessage: string;

  @Column({ type: 'text' })
  responseMessage: string;

  @Column({ type: 'timestamptz' })
  requestedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  processedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  processedBy: string;
}