-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `emailVerified` DATETIME(3) NULL,
    `password` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `role` ENUM('TEACHER', 'PRINCIPAL', 'ADMIN') NOT NULL DEFAULT 'TEACHER',
    `image` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `verification_tokens` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `verification_tokens_token_key`(`token`),
    UNIQUE INDEX `verification_tokens_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PasswordReset` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiresAt` DATETIME(3) NOT NULL,
    `used` BOOLEAN NOT NULL DEFAULT false,
    `ipAddress` VARCHAR(191) NULL,

    UNIQUE INDEX `PasswordReset_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscribers` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `subscribers_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Assignment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `className` VARCHAR(191) NOT NULL,
    `teacher` VARCHAR(191) NOT NULL,
    `dueDate` DATETIME(3) NOT NULL,
    `dateAssigned` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `instructions` TEXT NULL,
    `assignmentFiles` JSON NOT NULL,
    `attachments` JSON NOT NULL,
    `priority` VARCHAR(191) NOT NULL,
    `estimatedTime` VARCHAR(191) NULL,
    `additionalWork` TEXT NULL,
    `teacherRemarks` TEXT NULL,
    `feedback` TEXT NULL,
    `learningObjectives` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CounselingEvent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `counselor` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `notes` VARCHAR(191) NULL,
    `date` DATETIME(3) NOT NULL,
    `time` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `priority` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Event` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `time` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `registration` BOOLEAN NOT NULL DEFAULT false,
    `attendees` VARCHAR(191) NOT NULL,
    `speaker` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `News` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `excerpt` VARCHAR(191) NOT NULL,
    `fullContent` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `author` VARCHAR(191) NOT NULL,
    `likes` INTEGER NOT NULL DEFAULT 0,
    `image` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Staff` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `position` VARCHAR(191) NULL,
    `department` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `bio` VARCHAR(191) NOT NULL,
    `responsibilities` JSON NOT NULL,
    `expertise` JSON NOT NULL,
    `achievements` JSON NOT NULL,
    `image` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EmailCampaign` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `recipients` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `sentAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GalleryImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `category` ENUM('SPORTS', 'ADMINISTRATION', 'STUDENT_COUNCIL', 'DRAMA', 'MUSIC', 'ART', 'OTHER') NOT NULL,
    `department` ENUM('SCIENCES', 'EXAMS', 'HUMANITIES', 'ARTS', 'OTHER') NOT NULL,
    `files` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Student` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `admissionNumber` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `form` VARCHAR(191) NOT NULL,
    `stream` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `dateOfBirth` DATETIME(3) NOT NULL,
    `enrollmentDate` DATETIME(3) NOT NULL,
    `kcpeMarks` INTEGER NULL,
    `previousSchool` VARCHAR(191) NULL,
    `parentName` VARCHAR(191) NOT NULL,
    `parentEmail` VARCHAR(191) NULL,
    `parentPhone` VARCHAR(191) NOT NULL,
    `emergencyContact` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `medicalInfo` VARCHAR(191) NULL,
    `hobbies` VARCHAR(191) NULL,
    `academicPerformance` VARCHAR(191) NOT NULL,
    `attendance` VARCHAR(191) NOT NULL,
    `disciplineRecord` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Active',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isClassPrefect` BOOLEAN NOT NULL DEFAULT false,
    `isClassAssistant` BOOLEAN NOT NULL DEFAULT false,
    `isBellRinger` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Student_admissionNumber_key`(`admissionNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_councils` (
    `id` VARCHAR(191) NOT NULL,
    `position` ENUM('President', 'DeputyPresident', 'SchoolCaptain', 'DeputyCaptain', 'AcademicsSecretary', 'SportsSecretary', 'EntertainmentSecretary', 'CleaningSecretary', 'MealsSecretary', 'BellRinger', 'DisciplineSecretary', 'HealthSecretary', 'LibrarySecretary', 'TransportSecretary', 'EnvironmentSecretary', 'SpiritualSecretary', 'TechnologySecretary', 'Assistant', 'ClassRepresentative', 'ClassAssistant') NOT NULL,
    `department` ENUM('Presidency', 'Academics', 'Sports', 'Entertainment', 'Cleaning', 'Meals', 'Discipline', 'Health', 'Library', 'Transport', 'Environment', 'Spiritual', 'Technology', 'General') NULL,
    `studentId` INTEGER NOT NULL,
    `form` VARCHAR(191) NULL,
    `stream` VARCHAR(191) NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NULL,
    `status` ENUM('Active', 'Inactive', 'Graduated') NOT NULL DEFAULT 'Active',
    `image` VARCHAR(191) NULL,
    `achievements` VARCHAR(191) NULL,
    `responsibilities` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `student_councils_studentId_position_department_form_stream_key`(`studentId`, `position`, `department`, `form`, `stream`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PromotionHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NOT NULL,
    `fromForm` VARCHAR(191) NOT NULL,
    `toForm` VARCHAR(191) NOT NULL,
    `fromStream` VARCHAR(191) NOT NULL,
    `toStream` VARCHAR(191) NOT NULL,
    `promotedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `promotedBy` VARCHAR(191) NOT NULL DEFAULT 'System',

    INDEX `PromotionHistory_studentId_idx`(`studentId`),
    INDEX `PromotionHistory_promotedAt_idx`(`promotedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SchoolInfo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `videoTour` VARCHAR(191) NULL,
    `videoType` VARCHAR(191) NULL,
    `studentCount` INTEGER NOT NULL,
    `staffCount` INTEGER NOT NULL,
    `feesBoarding` DOUBLE NOT NULL,
    `feesDay` DOUBLE NOT NULL,
    `feesDistribution` JSON NOT NULL,
    `openDate` DATETIME(3) NOT NULL,
    `closeDate` DATETIME(3) NOT NULL,
    `subjects` JSON NOT NULL,
    `departments` JSON NOT NULL,
    `curriculumPDF` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PasswordReset` ADD CONSTRAINT `PasswordReset_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_councils` ADD CONSTRAINT `student_councils_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PromotionHistory` ADD CONSTRAINT `PromotionHistory_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
