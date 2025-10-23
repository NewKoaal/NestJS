export declare enum UserRole {
    STUDENT = "STUDENT",
    INSTRUCTOR = "INSTRUCTOR",
    ADMIN = "ADMIN"
}
export declare class User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    profileData: {
        metadata?: any;
    };
    emailVerified: boolean;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
