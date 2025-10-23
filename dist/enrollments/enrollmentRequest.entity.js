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
exports.EnrollmentRequest = exports.RequestStatus = void 0;
const typeorm_1 = require("typeorm");
const courses_entity_1 = require("../courses/courses.entity");
const users_entity_1 = require("../users/users.entity");
var RequestStatus;
(function (RequestStatus) {
    RequestStatus["PENDING"] = "PENDING";
    RequestStatus["APPROVED"] = "APPROVED";
    RequestStatus["REJECTED"] = "REJECTED";
    RequestStatus["EXPIRED"] = "EXPIRED";
})(RequestStatus || (exports.RequestStatus = RequestStatus = {}));
let EnrollmentRequest = class EnrollmentRequest {
    id;
    userId;
    user;
    courseId;
    course;
    status;
    requestMessage;
    responseMessage;
    requestedAt;
    processedAt;
    processedBy;
};
exports.EnrollmentRequest = EnrollmentRequest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], EnrollmentRequest.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)('idx_enrollment_request_user'),
    __metadata("design:type", String)
], EnrollmentRequest.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", users_entity_1.User)
], EnrollmentRequest.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)('idx_enrollment_request_course'),
    __metadata("design:type", String)
], EnrollmentRequest.prototype, "courseId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => courses_entity_1.Course, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'courseId' }),
    __metadata("design:type", courses_entity_1.Course)
], EnrollmentRequest.prototype, "course", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: RequestStatus,
        default: RequestStatus.PENDING
    }),
    __metadata("design:type", String)
], EnrollmentRequest.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], EnrollmentRequest.prototype, "requestMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], EnrollmentRequest.prototype, "responseMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], EnrollmentRequest.prototype, "requestedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], EnrollmentRequest.prototype, "processedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], EnrollmentRequest.prototype, "processedBy", void 0);
exports.EnrollmentRequest = EnrollmentRequest = __decorate([
    (0, typeorm_1.Entity)('enrollment_requests')
], EnrollmentRequest);
//# sourceMappingURL=enrollmentRequest.entity.js.map