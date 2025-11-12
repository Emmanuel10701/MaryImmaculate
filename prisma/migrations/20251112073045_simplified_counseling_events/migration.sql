-- AlterTable
ALTER TABLE `Assignment` MODIFY `description` TEXT NOT NULL,
    MODIFY `instructions` TEXT NULL,
    MODIFY `additionalWork` TEXT NULL,
    MODIFY `teacherRemarks` TEXT NULL,
    MODIFY `feedback` TEXT NULL;

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
