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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrollmentsController = void 0;
const common_1 = require("@nestjs/common");
const enrollments_service_1 = require("./enrollments.service");
const enrollment_dto_1 = require("./dto/enrollment.dto");
const enrollment_request_dto_1 = require("./dto/enrollment-request.dto");
const enrollment_invitation_dto_1 = require("./dto/enrollment-invitation.dto");
let EnrollmentsController = class EnrollmentsController {
    enrollmentsService;
    constructor(enrollmentsService) {
        this.enrollmentsService = enrollmentsService;
    }
    async enroll(req, dto) {
        return this.enrollmentsService.enrollDirect(req.user.id, dto.courseId);
    }
    async request(req, courseId, dto) {
        const userId = req.user.id;
        return this.enrollmentsService.requestEnrollment(userId, courseId, dto);
    }
    async listRequests(req) {
        const instructorId = req.user.id;
        return this.enrollmentsService.listRequestsForInstructor(instructorId);
    }
    async decide(req, id, decision, responseMessage) {
        const instructorId = req.user.id;
        return this.enrollmentsService.decideRequest(instructorId, id, decision, responseMessage);
    }
    async invite(req, dto) {
        const instructorId = req.user.id;
        return this.enrollmentsService.invite(instructorId, dto);
    }
    async accept(req, dto) {
        const userId = req.user.id;
        const email = req.user.email;
        return this.enrollmentsService.acceptInvitation(userId, email, dto.code);
    }
    async myCourses(req, q) {
        const userId = req.user.id;
        return this.enrollmentsService.myCourses(userId, q.status);
    }
    async updateStatus(req, courseId, dto) {
        const userId = req.user.id;
        return this.enrollmentsService.updateStatus(userId, courseId, dto.status);
    }
    async drop(req, courseId) {
        const userId = req.user.id;
        return this.enrollmentsService.drop(userId, courseId);
    }
};
exports.EnrollmentsController = EnrollmentsController;
__decorate([
    (0, common_1.Post)('enroll'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, enrollment_request_dto_1.EnrollDirectDto]),
    __metadata("design:returntype", Promise)
], EnrollmentsController.prototype, "enroll", null);
__decorate([
    (0, common_1.Post)('request/:courseId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('courseId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, enrollment_request_dto_1.RequestEnrollmentDto]),
    __metadata("design:returntype", Promise)
], EnrollmentsController.prototype, "request", null);
__decorate([
    (0, common_1.Get)('requests'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EnrollmentsController.prototype, "listRequests", null);
__decorate([
    (0, common_1.Patch)('requests/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Query)('decision')),
    __param(3, (0, common_1.Body)('responseMessage')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], EnrollmentsController.prototype, "decide", null);
__decorate([
    (0, common_1.Post)('invite'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, enrollment_invitation_dto_1.InviteToCourseDto]),
    __metadata("design:returntype", Promise)
], EnrollmentsController.prototype, "invite", null);
__decorate([
    (0, common_1.Post)('accept-invitation'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, enrollment_invitation_dto_1.AcceptInvitationDto]),
    __metadata("design:returntype", Promise)
], EnrollmentsController.prototype, "accept", null);
__decorate([
    (0, common_1.Get)('my-courses'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, enrollment_dto_1.MyCoursesQueryDto]),
    __metadata("design:returntype", Promise)
], EnrollmentsController.prototype, "myCourses", null);
__decorate([
    (0, common_1.Patch)(':courseId/status'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('courseId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, enrollment_dto_1.UpdateProgressDto]),
    __metadata("design:returntype", Promise)
], EnrollmentsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(':courseId/drop'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], EnrollmentsController.prototype, "drop", null);
exports.EnrollmentsController = EnrollmentsController = __decorate([
    (0, common_1.Controller)('enrollments'),
    __metadata("design:paramtypes", [enrollments_service_1.EnrollmentsService])
], EnrollmentsController);
//# sourceMappingURL=enrollments.controller.js.map