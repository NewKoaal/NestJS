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
exports.CourseInvitation = exports.InvitationStatus = void 0;
const typeorm_1 = require("typeorm");
const courses_entity_1 = require("../courses/courses.entity");
const users_entity_1 = require("../users/users.entity");
var InvitationStatus;
(function (InvitationStatus) {
    InvitationStatus["PENDING"] = "PENDING";
    InvitationStatus["APPROVED"] = "APPROVED";
    InvitationStatus["EXPIRED"] = "EXPIRED";
})(InvitationStatus || (exports.InvitationStatus = InvitationStatus = {}));
let CourseInvitation = class CourseInvitation {
    id;
    courseId;
    course;
    invitedBy;
    user;
    inviteeEmail;
    status;
    expiresAt;
    createdAt;
};
exports.CourseInvitation = CourseInvitation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], CourseInvitation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], CourseInvitation.prototype, "courseId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => courses_entity_1.Course, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'courseId' }),
    __metadata("design:type", courses_entity_1.Course)
], CourseInvitation.prototype, "course", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], CourseInvitation.prototype, "invitedBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'invitedBy' }),
    __metadata("design:type", users_entity_1.User)
], CourseInvitation.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CourseInvitation.prototype, "inviteeEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: InvitationStatus,
        default: InvitationStatus.PENDING
    }),
    __metadata("design:type", String)
], CourseInvitation.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], CourseInvitation.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], CourseInvitation.prototype, "createdAt", void 0);
exports.CourseInvitation = CourseInvitation = __decorate([
    (0, typeorm_1.Entity)('course_invitations')
], CourseInvitation);
//# sourceMappingURL=courseInvitation.entity.js.map