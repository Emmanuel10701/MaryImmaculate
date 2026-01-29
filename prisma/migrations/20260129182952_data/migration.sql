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
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PasswordReset_token_key`(`token`),
    INDEX `PasswordReset_userId_fkey`(`userId`),
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
CREATE TABLE `resources` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(400) NOT NULL,
    `subject` VARCHAR(100) NOT NULL,
    `teacher` VARCHAR(100) NOT NULL,
    `className` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,
    `category` VARCHAR(100) NOT NULL DEFAULT 'general',
    `type` VARCHAR(50) NOT NULL DEFAULT 'document',
    `files` JSON NOT NULL,
    `accessLevel` VARCHAR(20) NOT NULL DEFAULT 'student',
    `uploadedBy` VARCHAR(100) NOT NULL DEFAULT 'System',
    `downloads` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `resources_subject_idx`(`subject`),
    INDEX `resources_className_idx`(`className`),
    INDEX `resources_category_idx`(`category`),
    INDEX `resources_type_idx`(`type`),
    INDEX `resources_accessLevel_idx`(`accessLevel`),
    INDEX `resources_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CounselingEvent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `counselor` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `notes` TEXT NULL,
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
    `description` TEXT NULL,
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
    `excerpt` TEXT NULL,
    `fullContent` TEXT NULL,
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
    `department` VARCHAR(191) NULL,
    `education` TEXT NULL,
    `experience` TEXT NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `bio` TEXT NULL,
    `quote` TEXT NULL,
    `gender` VARCHAR(191) NULL DEFAULT 'male',
    `status` VARCHAR(191) NULL DEFAULT 'active',
    `joinDate` VARCHAR(191) NULL,
    `responsibilities` JSON NULL,
    `expertise` JSON NULL,
    `achievements` JSON NULL,
    `image` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `email_campaigns` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `recipients` TEXT NOT NULL,
    `recipientType` VARCHAR(191) NOT NULL DEFAULT 'all',
    `status` VARCHAR(191) NOT NULL DEFAULT 'draft',
    `sentAt` DATETIME(3) NULL,
    `sentCount` INTEGER NULL,
    `failedCount` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `attachments` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GalleryImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `category` ENUM('GENERAL', 'CLASSROOMS', 'LABORATORIES', 'DORMITORIES', 'DINING_HALL', 'SPORTS_FACILITIES', 'TEACHING', 'SCIENCE_LAB', 'COMPUTER_LAB', 'SPORTS_DAY', 'MUSIC_FESTIVAL', 'DRAMA_PERFORMANCE', 'ART_EXHIBITION', 'DEBATE_COMPETITION', 'SCIENCE_FAIR', 'ADMIN_OFFICES', 'STAFF', 'PRINCIPAL', 'BOARD', 'GRADUATION', 'AWARD_CEREMONY', 'PARENTS_DAY', 'OPEN_DAY', 'VISITORS', 'STUDENT_ACTIVITIES', 'CLUBS', 'COUNCIL', 'LEADERSHIP', 'OTHER') NOT NULL,
    `files` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SchoolInfo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `motto` TEXT NULL,
    `vision` TEXT NULL,
    `mission` TEXT NULL,
    `studentCount` INTEGER NOT NULL DEFAULT 0,
    `staffCount` INTEGER NOT NULL DEFAULT 0,
    `openDate` DATETIME(3) NOT NULL,
    `closeDate` DATETIME(3) NOT NULL,
    `subjects` JSON NOT NULL,
    `departments` JSON NOT NULL,
    `videoTour` TEXT NULL,
    `videoType` VARCHAR(20) NULL,
    `videoThumbnail` TEXT NULL,
    `feesDay` DOUBLE NULL,
    `feesBoarding` DOUBLE NULL,
    `admissionFee` DOUBLE NULL,
    `admissionOpenDate` DATETIME(3) NULL,
    `admissionCloseDate` DATETIME(3) NULL,
    `admissionRequirements` TEXT NULL,
    `admissionCapacity` INTEGER NULL,
    `admissionContactEmail` VARCHAR(255) NULL,
    `admissionContactPhone` VARCHAR(50) NULL,
    `admissionWebsite` VARCHAR(255) NULL,
    `admissionLocation` TEXT NULL,
    `admissionOfficeHours` TEXT NULL,
    `admissionDocumentsRequired` JSON NOT NULL,
    `form1ResultsTerm` VARCHAR(50) NULL,
    `form2ResultsTerm` VARCHAR(50) NULL,
    `form3ResultsTerm` VARCHAR(50) NULL,
    `form4ResultsTerm` VARCHAR(50) NULL,
    `mockExamsTerm` VARCHAR(50) NULL,
    `kcseTerm` VARCHAR(50) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `SchoolInfo_name_idx`(`name`),
    INDEX `SchoolInfo_admissionOpenDate_admissionCloseDate_idx`(`admissionOpenDate`, `admissionCloseDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SchoolDocument` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `curriculumPDF` TEXT NULL,
    `curriculumPdfName` VARCHAR(255) NULL,
    `curriculumPdfSize` INTEGER NULL,
    `curriculumPdfUploadDate` DATETIME(3) NULL,
    `curriculumDescription` TEXT NULL,
    `curriculumYear` INTEGER NULL,
    `curriculumTerm` VARCHAR(50) NULL,
    `feesBoardingDistributionPdf` TEXT NULL,
    `feesBoardingPdfName` VARCHAR(255) NULL,
    `feesBoardingPdfSize` INTEGER NULL,
    `feesBoardingPdfUploadDate` DATETIME(3) NULL,
    `feesBoardingDescription` TEXT NULL,
    `feesBoardingYear` INTEGER NULL,
    `feesBoardingTerm` VARCHAR(50) NULL,
    `admissionFeePdf` TEXT NULL,
    `admissionFeePdfName` VARCHAR(255) NULL,
    `admissionFeePdfSize` INTEGER NULL,
    `admissionFeePdfUploadDate` DATETIME(3) NULL,
    `admissionFeeDescription` TEXT NULL,
    `admissionFeeYear` INTEGER NULL,
    `admissionFeeTerm` VARCHAR(50) NULL,
    `feesBoardingDistributionJson` JSON NULL,
    `admissionFeeDistribution` JSON NULL,
    `form1ResultsPdf` TEXT NULL,
    `form1ResultsPdfName` VARCHAR(255) NULL,
    `form1ResultsPdfSize` INTEGER NULL,
    `form1ResultsDescription` TEXT NULL,
    `form1ResultsYear` INTEGER NULL,
    `form1ResultsTerm` VARCHAR(50) NULL,
    `form1ResultsUploadDate` DATETIME(3) NULL,
    `form2ResultsPdf` TEXT NULL,
    `form2ResultsPdfName` VARCHAR(255) NULL,
    `form2ResultsPdfSize` INTEGER NULL,
    `form2ResultsDescription` TEXT NULL,
    `form2ResultsYear` INTEGER NULL,
    `form2ResultsTerm` VARCHAR(50) NULL,
    `form2ResultsUploadDate` DATETIME(3) NULL,
    `form3ResultsPdf` TEXT NULL,
    `form3ResultsPdfName` VARCHAR(255) NULL,
    `form3ResultsPdfSize` INTEGER NULL,
    `form3ResultsDescription` TEXT NULL,
    `form3ResultsYear` INTEGER NULL,
    `form3ResultsTerm` VARCHAR(50) NULL,
    `form3ResultsUploadDate` DATETIME(3) NULL,
    `form4ResultsPdf` TEXT NULL,
    `form4ResultsPdfName` VARCHAR(255) NULL,
    `form4ResultsPdfSize` INTEGER NULL,
    `form4ResultsDescription` TEXT NULL,
    `form4ResultsYear` INTEGER NULL,
    `form4ResultsTerm` VARCHAR(50) NULL,
    `form4ResultsUploadDate` DATETIME(3) NULL,
    `mockExamsResultsPdf` TEXT NULL,
    `mockExamsPdfName` VARCHAR(255) NULL,
    `mockExamsPdfSize` INTEGER NULL,
    `mockExamsDescription` TEXT NULL,
    `mockExamsYear` INTEGER NULL,
    `mockExamsTerm` VARCHAR(50) NULL,
    `mockExamsUploadDate` DATETIME(3) NULL,
    `kcseResultsPdf` TEXT NULL,
    `kcsePdfName` VARCHAR(255) NULL,
    `kcsePdfSize` INTEGER NULL,
    `kcseDescription` TEXT NULL,
    `kcseYear` INTEGER NULL,
    `kcseTerm` VARCHAR(50) NULL,
    `kcseUploadDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `SchoolDocument_curriculumTerm_idx`(`curriculumTerm`),
    INDEX `SchoolDocument_feesBoardingTerm_idx`(`feesBoardingTerm`),
    INDEX `SchoolDocument_admissionFeeTerm_idx`(`admissionFeeTerm`),
    INDEX `SchoolDocument_curriculumYear_idx`(`curriculumYear`),
    INDEX `SchoolDocument_feesBoardingYear_idx`(`feesBoardingYear`),
    INDEX `SchoolDocument_admissionFeeYear_idx`(`admissionFeeYear`),
    INDEX `SchoolDocument_form1ResultsYear_idx`(`form1ResultsYear`),
    INDEX `SchoolDocument_form2ResultsYear_idx`(`form2ResultsYear`),
    INDEX `SchoolDocument_form3ResultsYear_idx`(`form3ResultsYear`),
    INDEX `SchoolDocument_form4ResultsYear_idx`(`form4ResultsYear`),
    INDEX `SchoolDocument_mockExamsYear_idx`(`mockExamsYear`),
    INDEX `SchoolDocument_kcseYear_idx`(`kcseYear`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdmissionApplication` (
    `id` VARCHAR(191) NOT NULL,
    `applicationNumber` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `middleName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `dateOfBirth` DATETIME(3) NOT NULL,
    `nationality` VARCHAR(191) NOT NULL,
    `county` VARCHAR(191) NOT NULL,
    `constituency` VARCHAR(191) NOT NULL,
    `ward` VARCHAR(191) NOT NULL,
    `village` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `alternativePhone` VARCHAR(191) NULL,
    `postalAddress` VARCHAR(191) NOT NULL,
    `postalCode` VARCHAR(191) NULL,
    `fatherName` VARCHAR(191) NULL,
    `fatherPhone` VARCHAR(191) NULL,
    `fatherEmail` VARCHAR(191) NULL,
    `fatherOccupation` VARCHAR(191) NULL,
    `motherName` VARCHAR(191) NULL,
    `motherPhone` VARCHAR(191) NULL,
    `motherEmail` VARCHAR(191) NULL,
    `motherOccupation` VARCHAR(191) NULL,
    `guardianName` VARCHAR(191) NULL,
    `guardianPhone` VARCHAR(191) NULL,
    `guardianEmail` VARCHAR(191) NULL,
    `guardianOccupation` VARCHAR(191) NULL,
    `previousSchool` VARCHAR(191) NOT NULL,
    `previousClass` VARCHAR(191) NOT NULL,
    `kcpeYear` INTEGER NULL,
    `kcpeIndex` VARCHAR(191) NULL,
    `kcpeMarks` INTEGER NULL,
    `meanGrade` VARCHAR(191) NULL,
    `medicalCondition` TEXT NULL,
    `allergies` TEXT NULL,
    `bloodGroup` VARCHAR(191) NULL,
    `sportsInterests` TEXT NULL,
    `clubsInterests` TEXT NULL,
    `talents` TEXT NULL,
    `status` VARCHAR(191) NULL DEFAULT 'PENDING',
    `decisionNotes` TEXT NULL,
    `admissionOfficer` VARCHAR(191) NULL,
    `decisionDate` DATETIME(3) NULL,
    `admissionDate` DATETIME(3) NULL,
    `assignedStream` VARCHAR(191) NULL,
    `reportingDate` DATETIME(3) NULL,
    `admissionLetterSent` BOOLEAN NULL DEFAULT false,
    `rejectionDate` DATETIME(3) NULL,
    `rejectionReason` VARCHAR(191) NULL,
    `alternativeSuggestions` VARCHAR(191) NULL,
    `waitlistPosition` INTEGER NULL,
    `waitlistNotes` TEXT NULL,
    `interviewDate` DATETIME(3) NULL,
    `interviewTime` VARCHAR(191) NULL,
    `interviewVenue` VARCHAR(191) NULL,
    `interviewNotes` TEXT NULL,
    `conditions` TEXT NULL,
    `conditionDeadline` DATETIME(3) NULL,
    `houseAssigned` VARCHAR(191) NULL,
    `admissionClass` VARCHAR(191) NULL,
    `admissionType` VARCHAR(191) NULL,
    `documentsVerified` BOOLEAN NULL DEFAULT false,
    `documentsNotes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `AdmissionApplication_applicationNumber_key`(`applicationNumber`),
    UNIQUE INDEX `AdmissionApplication_email_key`(`email`),
    INDEX `AdmissionApplication_applicationNumber_idx`(`applicationNumber`),
    INDEX `AdmissionApplication_email_idx`(`email`),
    INDEX `AdmissionApplication_phone_idx`(`phone`),
    INDEX `AdmissionApplication_status_idx`(`status`),
    INDEX `AdmissionApplication_createdAt_idx`(`createdAt`),
    INDEX `AdmissionApplication_decisionDate_idx`(`decisionDate`),
    INDEX `AdmissionApplication_county_idx`(`county`),
    INDEX `AdmissionApplication_kcpeMarks_idx`(`kcpeMarks`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CareerJob` (
    `id` VARCHAR(191) NOT NULL,
    `jobTitle` VARCHAR(191) NOT NULL,
    `department` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `jobDescription` TEXT NOT NULL,
    `requirements` TEXT NOT NULL,
    `experience` VARCHAR(191) NOT NULL,
    `qualifications` TEXT NOT NULL,
    `positionsAvailable` INTEGER NOT NULL DEFAULT 1,
    `jobType` VARCHAR(191) NOT NULL,
    `applicationDeadline` DATETIME(3) NOT NULL,
    `contactEmail` VARCHAR(191) NULL,
    `contactPhone` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `CareerJob_jobTitle_idx`(`jobTitle`),
    INDEX `CareerJob_department_idx`(`department`),
    INDEX `CareerJob_category_idx`(`category`),
    INDEX `CareerJob_jobType_idx`(`jobType`),
    INDEX `CareerJob_applicationDeadline_idx`(`applicationDeadline`),
    INDEX `CareerJob_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_bulk_uploads` (
    `id` VARCHAR(191) NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,
    `fileType` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `uploadedBy` VARCHAR(191) NOT NULL,
    `uploadDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `processedDate` DATETIME(3) NULL,
    `totalRows` INTEGER NOT NULL DEFAULT 0,
    `validRows` INTEGER NOT NULL DEFAULT 0,
    `skippedRows` INTEGER NOT NULL DEFAULT 0,
    `errorRows` INTEGER NOT NULL DEFAULT 0,
    `errorLog` JSON NULL,
    `metadata` JSON NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `students` (
    `id` VARCHAR(191) NOT NULL,
    `admissionNumber` VARCHAR(50) NOT NULL,
    `firstName` VARCHAR(100) NOT NULL,
    `middleName` VARCHAR(100) NULL,
    `lastName` VARCHAR(100) NOT NULL,
    `form` VARCHAR(20) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `stream` VARCHAR(50) NULL,
    `dateOfBirth` DATETIME(3) NULL,
    `gender` VARCHAR(20) NULL,
    `parentPhone` VARCHAR(20) NULL,
    `email` VARCHAR(100) NULL,
    `address` VARCHAR(255) NULL,
    `uploadBatchId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `students_admissionNumber_key`(`admissionNumber`),
    INDEX `students_admissionNumber_idx`(`admissionNumber`),
    INDEX `students_form_idx`(`form`),
    INDEX `students_uploadBatchId_idx`(`uploadBatchId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_stats` (
    `id` VARCHAR(191) NOT NULL DEFAULT 'global_stats',
    `totalStudents` INTEGER NOT NULL DEFAULT 0,
    `form1` INTEGER NOT NULL DEFAULT 0,
    `form2` INTEGER NOT NULL DEFAULT 0,
    `form3` INTEGER NOT NULL DEFAULT 0,
    `form4` INTEGER NOT NULL DEFAULT 0,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentSession` (
    `id` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `admissionNumber` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `token` TEXT NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `ipAddress` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `StudentSession_studentId_idx`(`studentId`),
    INDEX `StudentSession_token_idx`(`token`(191)),
    INDEX `StudentSession_expiresAt_idx`(`expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FeeBalance` (
    `id` VARCHAR(191) NOT NULL,
    `admissionNumber` VARCHAR(191) NOT NULL,
    `form` VARCHAR(191) NOT NULL,
    `term` VARCHAR(191) NOT NULL,
    `academicYear` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL DEFAULT 0,
    `amountPaid` DOUBLE NOT NULL DEFAULT 0,
    `balance` DOUBLE NOT NULL DEFAULT 0,
    `paymentStatus` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `dueDate` DATETIME(3) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `uploadBatchId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `FeeBalance_admissionNumber_idx`(`admissionNumber`),
    INDEX `FeeBalance_form_term_academicYear_idx`(`form`, `term`, `academicYear`),
    INDEX `FeeBalance_isActive_idx`(`isActive`),
    UNIQUE INDEX `FeeBalance_admissionNumber_form_term_academicYear_key`(`admissionNumber`, `form`, `term`, `academicYear`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fee_balance_uploads` (
    `id` VARCHAR(191) NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,
    `fileType` VARCHAR(191) NOT NULL,
    `uploadedBy` VARCHAR(191) NOT NULL,
    `uploadDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` VARCHAR(191) NOT NULL,
    `processedDate` DATETIME(3) NULL,
    `targetForm` VARCHAR(191) NOT NULL,
    `term` VARCHAR(191) NULL,
    `academicYear` VARCHAR(191) NULL,
    `uploadType` VARCHAR(191) NOT NULL,
    `totalRows` INTEGER NOT NULL,
    `validRows` INTEGER NOT NULL,
    `skippedRows` INTEGER NOT NULL,
    `errorRows` INTEGER NOT NULL,
    `errorLog` VARCHAR(191) NULL,
    `metadata` JSON NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `results_uploads` (
    `id` VARCHAR(191) NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,
    `fileType` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `uploadedBy` VARCHAR(191) NOT NULL,
    `uploadDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `processedDate` DATETIME(3) NULL,
    `totalRows` INTEGER NOT NULL DEFAULT 0,
    `validRows` INTEGER NOT NULL DEFAULT 0,
    `skippedRows` INTEGER NOT NULL DEFAULT 0,
    `errorRows` INTEGER NOT NULL DEFAULT 0,
    `errorLog` JSON NULL,
    `term` VARCHAR(191) NULL,
    `academicYear` VARCHAR(191) NULL,
    `uploadMode` VARCHAR(191) NULL DEFAULT 'create',
    `newRecords` INTEGER NULL DEFAULT 0,
    `updatedRecords` INTEGER NULL DEFAULT 0,
    `duplicateRecords` INTEGER NULL DEFAULT 0,
    `warningLog` JSON NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_results` (
    `id` VARCHAR(191) NOT NULL,
    `admissionNumber` VARCHAR(191) NOT NULL,
    `form` VARCHAR(191) NOT NULL,
    `term` VARCHAR(191) NULL,
    `academicYear` VARCHAR(191) NULL,
    `subjects` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `uploadBatchId` VARCHAR(191) NULL,

    INDEX `student_results_admissionNumber_idx`(`admissionNumber`),
    UNIQUE INDEX `student_results_admissionNumber_term_academicYear_key`(`admissionNumber`, `term`, `academicYear`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ResultsStats` (
    `id` VARCHAR(191) NOT NULL DEFAULT 'global_stats',
    `totalResults` INTEGER NOT NULL DEFAULT 0,
    `totalStudents` INTEGER NOT NULL DEFAULT 0,
    `averageScore` DOUBLE NOT NULL DEFAULT 0,
    `topScore` DOUBLE NOT NULL DEFAULT 0,
    `formDistribution` JSON NOT NULL,
    `termDistribution` JSON NOT NULL,
    `gradeDistribution` JSON NOT NULL,
    `subjectPerformance` JSON NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fee_balance_audit_logs` (
    `id` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `feeId` VARCHAR(191) NULL,
    `admissionNumber` VARCHAR(191) NOT NULL,
    `form` VARCHAR(191) NOT NULL,
    `term` VARCHAR(191) NOT NULL,
    `academicYear` VARCHAR(191) NOT NULL,
    `oldAmount` DOUBLE NULL,
    `oldAmountPaid` DOUBLE NULL,
    `newAmount` DOUBLE NULL,
    `newAmountPaid` DOUBLE NULL,
    `uploadBatchId` VARCHAR(191) NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `fee_balance_audit_logs_admissionNumber_idx`(`admissionNumber`),
    INDEX `fee_balance_audit_logs_uploadBatchId_idx`(`uploadBatchId`),
    INDEX `fee_balance_audit_logs_timestamp_idx`(`timestamp`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `batch_deletion_logs` (
    `id` VARCHAR(191) NOT NULL,
    `batchId` VARCHAR(191) NOT NULL,
    `entityType` VARCHAR(191) NOT NULL,
    `form` VARCHAR(191) NULL,
    `term` VARCHAR(191) NULL,
    `academicYear` VARCHAR(191) NULL,
    `deletedCount` INTEGER NOT NULL,
    `deletionReason` VARCHAR(191) NOT NULL,
    `deletedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `batch_deletion_logs_batchId_idx`(`batchId`),
    INDEX `batch_deletion_logs_entityType_idx`(`entityType`),
    INDEX `batch_deletion_logs_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `team_members` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `bio` TEXT NULL,
    `image` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `teamId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `teams` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PasswordReset` ADD CONSTRAINT `PasswordReset_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_uploadBatchId_fkey` FOREIGN KEY (`uploadBatchId`) REFERENCES `student_bulk_uploads`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeeBalance` ADD CONSTRAINT `FeeBalance_admissionNumber_fkey` FOREIGN KEY (`admissionNumber`) REFERENCES `students`(`admissionNumber`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeeBalance` ADD CONSTRAINT `FeeBalance_uploadBatchId_fkey` FOREIGN KEY (`uploadBatchId`) REFERENCES `fee_balance_uploads`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_results` ADD CONSTRAINT `student_results_admissionNumber_fkey` FOREIGN KEY (`admissionNumber`) REFERENCES `students`(`admissionNumber`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_results` ADD CONSTRAINT `student_results_uploadBatchId_fkey` FOREIGN KEY (`uploadBatchId`) REFERENCES `results_uploads`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team_members` ADD CONSTRAINT `team_members_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `teams`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
