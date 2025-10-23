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
exports.Course = exports.Difficulty = exports.Status = void 0;
const typeorm_1 = require("typeorm");
const users_entity_1 = require("../users/users.entity");
const module_entity_1 = require("./module.entity");
var Status;
(function (Status) {
    Status["DRAFT"] = "DRAFT";
    Status["PUBLISHED"] = "PUBLISHED";
    Status["ARCHIVED"] = "ARCHIVED";
})(Status || (exports.Status = Status = {}));
var Difficulty;
(function (Difficulty) {
    Difficulty["BEGINNER"] = "BEGINNER";
    Difficulty["INTERMEDIATE"] = "INTERMEDIATE";
    Difficulty["ADVANCED"] = "ADVANCED";
})(Difficulty || (exports.Difficulty = Difficulty = {}));
let Course = class Course {
    id;
    title;
    description;
    instructorId;
    instructor;
    status;
    metadata;
    settings;
    publishedAt;
    createdAt;
    updatedAt;
    modules;
};
exports.Course = Course;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Course.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_courses_title_tsearch'),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Course.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Course.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_courses_instructor'),
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Course.prototype, "instructorId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'instructorId' }),
    __metadata("design:type", users_entity_1.User)
], Course.prototype, "instructor", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_courses_status'),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: Status,
        default: Status.DRAFT
    }),
    __metadata("design:type", String)
], Course.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], Course.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], Course.prototype, "settings", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Course.prototype, "publishedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Course.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Course.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => module_entity_1.Module, (m) => m.course, { cascade: true }),
    __metadata("design:type", Array)
], Course.prototype, "modules", void 0);
exports.Course = Course = __decorate([
    (0, typeorm_1.Entity)('courses')
], Course);
//# sourceMappingURL=courses.entity.js.map