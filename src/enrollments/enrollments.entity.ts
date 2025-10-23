import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Course } from '../courses/courses.entity';
import { User } from '../users/users.entity';

export enum EnrollmentStatus {
    PENDING_APPROVAL = 'PENDING APPROVAL',
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
    DROPPED = 'DROPPED',
    SUSPENDED = 'SUSPENDED',
}

@Entity('enrollments')
@Unique('uq_enrollment_student_course', ['studentId', 'courseId'])
export class Enrollment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: 'uuid' })
  @Index('idx_enrollment_student')
  studentId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'studentId' })
  student?: User;

  @Column({ type: 'uuid' })
  @Index('idx_enrollment_course')
  courseId: string;

  @ManyToOne(() => Course)
  @JoinColumn({ name: 'courseId' })
  course?: Course;

  @Column({ type: 'uuid', nullable: true })
  teamId: string;

  @Column({
    type: 'enum',
    enum: EnrollmentStatus,
    default: EnrollmentStatus.PENDING_APPROVAL
  })
  status: string;

  @Column()
  startedAt: Date;

  @Column()
  completedAt: Date;

  @Column()
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
