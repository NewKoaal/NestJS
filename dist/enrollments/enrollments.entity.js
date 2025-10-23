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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enrollment = exports.EnrollmentStatus = void 0;
const typeorm_1 = require("typeorm");
const courses_entity_1 = require("../courses/courses.entity");
const users_entity_1 = require("../users/users.entity");
var EnrollmentStatus;
(function (EnrollmentStatus) {
    EnrollmentStatus["PENDING_APPROVAL"] = "PENDING APPROVAL";
    EnrollmentStatus["ACTIVE"] = "ACTIVE";
    EnrollmentStatus["COMPLETED"] = "COMPLETED";
    EnrollmentStatus["DROPPED"] = "DROPPED";
    EnrollmentStatus["SUSPENDED"] = "SUSPENDED";
})(EnrollmentStatus || (exports.EnrollmentStatus = EnrollmentStatus = {}));
let Enrollment = class Enrollment {
    id;
    studentId;
    student;
    courseId;
    course;
    teamId;
    status;
    startedAt;
    completedAt;
    expiresAt;
    createdAt;
    updatedAt;
};
exports.Enrollment = Enrollment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Enrollment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)('idx_enrollment_student'),
    __metadata("design:type", String)
], Enrollment.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'studentId' }),
    __metadata("design:type", users_entity_1.User)
], Enrollment.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)('idx_enrollment_course'),
    __metadata("design:type", String)
], Enrollment.prototype, "courseId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => courses_entity_1.Course),
    (0, typeorm_1.JoinColumn)({ name: 'courseId' }),
    __metadata("design:type", courses_entity_1.Course)
], Enrollment.prototype, "course", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Enrollment.prototype, "teamId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EnrollmentStatus,
        default: EnrollmentStatus.PENDING_APPROVAL
    }),
    __metadata("design:type", String)
], Enrollment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Enrollment.prototype, "startedAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Enrollment.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Enrollment.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Enrollment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Enrollment.prototype, "updatedAt", void 0);
exports.Enrollment = Enrollment = __decorate([
    (0, typeorm_1.Entity)('enrollments'),
    (0, typeorm_1.Unique)('uq_enrollment_student_course', ['studentId', 'courseId'])
], Enrollment);
//# sourceMappingURL=enrollments.entity.js.map