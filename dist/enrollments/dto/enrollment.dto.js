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
exports.UpdateProgressDto = exports.MyCoursesQueryDto = void 0;
const class_validator_1 = require("class-validator");
const enrollments_entity_1 = require("../enrollments.entity");
class MyCoursesQueryDto {
    status;
}
exports.MyCoursesQueryDto = MyCoursesQueryDto;
__decorate([
    (0, class_validator_1.IsEnum)(enrollments_entity_1.EnrollmentStatus, { each: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], MyCoursesQueryDto.prototype, "status", void 0);
class UpdateProgressDto {
    status;
}
exports.UpdateProgressDto = UpdateProgressDto;
__decorate([
    (0, class_validator_1.IsEnum)(enrollments_entity_1.EnrollmentStatus),
    __metadata("design:type", String)
], UpdateProgressDto.prototype, "status", void 0);
//# sourceMappingURL=enrollment.dto.js.map