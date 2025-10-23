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
exports.CoursesController = void 0;
const common_1 = require("@nestjs/common");
const courses_service_1 = require("./courses.service");
const course_dto_1 = require("./dto/course.dto");
const module_dto_1 = require("./dto/module.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let CoursesController = class CoursesController {
    coursesService;
    constructor(coursesService) {
        this.coursesService = coursesService;
    }
    list(filter) {
        return this.coursesService.listCourses(filter);
    }
    createCourse(dto) {
        return this.coursesService.createCourse(dto);
    }
    getOneCourse(id) {
        return this.coursesService.getCourse(id);
    }
    updateCourse(id, dto) {
        return this.coursesService.updateCourse(id, dto);
    }
    removeCourse(id) {
        return this.coursesService.softDeleteCourse(id);
    }
    publish(id) {
        return this.coursesService.publishCourse(id);
    }
    archive(id) {
        return this.coursesService.archiveCourse(id);
    }
    addModule(courseId, dto) {
        return this.coursesService.addModule(courseId, dto);
    }
    listModules(courseId) {
        return this.coursesService.listModules(courseId);
    }
    updateModule(courseId, moduleId, dto) {
        return this.coursesService.updateModule(courseId, moduleId, dto);
    }
    deleteModule(courseId, moduleId) {
        return this.coursesService.deleteModule(courseId, moduleId);
    }
    reorderModules(courseId, dto) {
        return this.coursesService.reorderModules(courseId, dto);
    }
};
exports.CoursesController = CoursesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [course_dto_1.FilterCoursesDto]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [course_dto_1.CreateCourseDto]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "createCourse", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "getOneCourse", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, course_dto_1.UpdateCourseDto]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "updateCourse", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "removeCourse", null);
__decorate([
    (0, common_1.Post)(':id/publish'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "publish", null);
__decorate([
    (0, common_1.Post)(':id/archive'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "archive", null);
__decorate([
    (0, common_1.Post)(':id/modules'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, module_dto_1.CreateModuleDto]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "addModule", null);
__decorate([
    (0, common_1.Get)(':id/modules'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "listModules", null);
__decorate([
    (0, common_1.Patch)(':id/modules/:moduleId'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('moduleId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, module_dto_1.UpdateModuleDto]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "updateModule", null);
__decorate([
    (0, common_1.Delete)(':id/modules/:moduleId'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('moduleId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "deleteModule", null);
__decorate([
    (0, common_1.Post)(':id/modules/:moduleId/reorder'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, module_dto_1.ReorderModulesDto]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "reorderModules", null);
exports.CoursesController = CoursesController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('courses'),
    __metadata("design:paramtypes", [courses_service_1.CoursesService])
], CoursesController);
//# sourceMappingURL=courses.controller.js.map