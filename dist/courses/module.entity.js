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
exports.Module = exports.LessonType = void 0;
const typeorm_1 = require("typeorm");
const courses_entity_1 = require("./courses.entity");
var LessonType;
(function (LessonType) {
    LessonType["VIDEO"] = "VIDEO";
    LessonType["DOCUMENT"] = "DOCUMENT";
    LessonType["QUIZ"] = "QUIZ";
    LessonType["ASSIGNMENT"] = "ASSIGNMENT";
})(LessonType || (exports.LessonType = LessonType = {}));
let Module = class Module {
    id;
    courseId;
    course;
    title;
    description;
    orderIndex;
    estimatedDuration;
    content;
    prerequisites;
    createdAt;
    updatedAt;
};
exports.Module = Module;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Module.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_course_modules_course_id'),
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Module.prototype, "courseId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => courses_entity_1.Course),
    (0, typeorm_1.JoinColumn)({ name: 'courseId' }),
    __metadata("design:type", courses_entity_1.Course)
], Module.prototype, "course", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Module.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Module.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Module.prototype, "orderIndex", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Module.prototype, "estimatedDuration", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], Module.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { array: true, default: '{}' }),
    __metadata("design:type", Array)
], Module.prototype, "prerequisites", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Module.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Module.prototype, "updatedAt", void 0);
exports.Module = Module = __decorate([
    (0, typeorm_1.Entity)('modules')
], Module);
//# sourceMappingURL=module.entity.js.map