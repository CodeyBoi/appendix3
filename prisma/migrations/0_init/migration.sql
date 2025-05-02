-- CreateTable
CREATE TABLE `Account` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(191) NULL,

    UNIQUE INDEX `Account_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `sessionToken` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Session_sessionToken_key`(`sessionToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `emailVerified` DATETIME(3) NULL,
    `image` VARCHAR(191) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VerificationToken` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `VerificationToken_token_key`(`token`),
    UNIQUE INDEX `VerificationToken_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VerifiedToken` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `VerifiedToken_token_key`(`token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Corps` (
    `id` VARCHAR(191) NOT NULL,
    `number` INTEGER NULL,
    `bNumber` INTEGER NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `nickName` VARCHAR(191) NULL,
    `pronouns` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `userId` VARCHAR(191) NOT NULL,
    `colorScheme` VARCHAR(191) NOT NULL DEFAULT 'light',
    `language` VARCHAR(191) NOT NULL DEFAULT 'sv',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Corps_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Role_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Permission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Permission_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CorpsInstrument` (
    `corpsId` VARCHAR(191) NOT NULL,
    `instrumentId` INTEGER NOT NULL,
    `isMainInstrument` BOOLEAN NOT NULL,

    UNIQUE INDEX `CorpsInstrument_corpsId_instrumentId_key`(`corpsId`, `instrumentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CorpsFoodPrefs` (
    `corpsId` VARCHAR(191) NOT NULL,
    `vegetarian` BOOLEAN NOT NULL DEFAULT false,
    `vegan` BOOLEAN NOT NULL DEFAULT false,
    `glutenFree` BOOLEAN NOT NULL DEFAULT false,
    `lactoseFree` BOOLEAN NOT NULL DEFAULT false,
    `other` TEXT NOT NULL DEFAULT '',

    PRIMARY KEY (`corpsId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Instrument` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `sectionId` INTEGER NULL,

    UNIQUE INDEX `Instrument_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Gig` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `date` DATE NOT NULL,
    `meetup` VARCHAR(191) NOT NULL DEFAULT '',
    `start` VARCHAR(191) NOT NULL DEFAULT '',
    `end` VARCHAR(191) NOT NULL DEFAULT '',
    `location` VARCHAR(191) NOT NULL DEFAULT '',
    `signupStart` DATETIME(3) NULL,
    `signupEnd` DATETIME(3) NULL,
    `description` TEXT NOT NULL DEFAULT '',
    `englishDescription` TEXT NOT NULL DEFAULT '',
    `publicDescription` TEXT NOT NULL DEFAULT '',
    `typeId` INTEGER NOT NULL,
    `points` INTEGER NOT NULL,
    `countsPositively` BOOLEAN NOT NULL DEFAULT false,
    `isPublic` BOOLEAN NOT NULL DEFAULT false,
    `checkbox1` VARCHAR(191) NOT NULL DEFAULT '',
    `checkbox2` VARCHAR(191) NOT NULL DEFAULT '',
    `price` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Gig_date_idx`(`date` DESC),
    INDEX `Gig_countsPositively_idx`(`countsPositively`),
    INDEX `Gig_isPublic_idx`(`isPublic`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GigType` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `GigType_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GigSignup` (
    `corpsId` VARCHAR(191) NOT NULL,
    `gigId` VARCHAR(191) NOT NULL,
    `signupStatusId` INTEGER NOT NULL,
    `instrumentId` INTEGER NOT NULL,
    `attended` BOOLEAN NOT NULL DEFAULT false,
    `checkbox1` BOOLEAN NOT NULL DEFAULT false,
    `checkbox2` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `GigSignup_attended_idx`(`attended`),
    INDEX `GigSignup_signupStatusId_idx`(`signupStatusId`),
    UNIQUE INDEX `GigSignup_corpsId_gigId_key`(`corpsId`, `gigId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GigSignupStatus` (
    `id` INTEGER NOT NULL,
    `value` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `GigSignupStatus_value_key`(`value`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HiddenGig` (
    `corpsId` VARCHAR(191) NOT NULL,
    `gigId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `HiddenGig_corpsId_gigId_key`(`corpsId`, `gigId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rehearsal` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `date` DATE NOT NULL,
    `countsPositively` BOOLEAN NOT NULL DEFAULT false,
    `typeId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CorpsRehearsal` (
    `corpsId` VARCHAR(191) NOT NULL,
    `rehearsalId` VARCHAR(191) NOT NULL,

    INDEX `CorpsRehearsal_corpsId_idx`(`corpsId`),
    INDEX `CorpsRehearsal_rehearsalId_idx`(`rehearsalId`),
    UNIQUE INDEX `CorpsRehearsal_corpsId_rehearsalId_key`(`corpsId`, `rehearsalId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RehearsalType` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `RehearsalType_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Song` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `author` VARCHAR(191) NOT NULL,
    `melody` VARCHAR(191) NOT NULL,
    `lyrics` TEXT NOT NULL DEFAULT '',
    `createdByCorpsId` VARCHAR(191) NULL,
    `views` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Song_title_key`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Quote` (
    `id` VARCHAR(191) NOT NULL,
    `quote` TEXT NOT NULL DEFAULT '',
    `location` VARCHAR(191) NOT NULL DEFAULT '',
    `saidByCorpsId` VARCHAR(191) NOT NULL,
    `writtenByCorpsId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Section` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `corpsId` VARCHAR(191) NULL,

    UNIQUE INDEX `Section_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KillerCorps` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `corpsId` VARCHAR(191) NOT NULL,
    `word` VARCHAR(191) NOT NULL,
    `wordEnglish` VARCHAR(191) NOT NULL,
    `gameId` VARCHAR(191) NOT NULL,
    `targetId` INTEGER NULL,
    `timeOfDeath` DATETIME(3) NULL,
    `killedById` INTEGER NULL,

    UNIQUE INDEX `KillerCorps_corpsId_gameId_key`(`corpsId`, `gameId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KillerGame` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `start` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `end` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `KillerGame_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StreckItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StreckTransaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `item` VARCHAR(191) NOT NULL,
    `pricePer` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,
    `note` VARCHAR(191) NOT NULL DEFAULT '',
    `verificationNumber` VARCHAR(191) NULL,
    `corpsId` VARCHAR(191) NOT NULL,
    `streckListId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StreckList` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdById` VARCHAR(191) NOT NULL,
    `time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Nickname` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nickname` VARCHAR(191) NOT NULL,
    `forId` VARCHAR(191) NOT NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CorpsToRole` (
    `A` VARCHAR(191) NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CorpsToRole_AB_unique`(`A`, `B`),
    INDEX `_CorpsToRole_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CorpsToPermission` (
    `A` VARCHAR(191) NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CorpsToPermission_AB_unique`(`A`, `B`),
    INDEX `_CorpsToPermission_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PermissionToRole` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PermissionToRole_AB_unique`(`A`, `B`),
    INDEX `_PermissionToRole_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Corps` ADD CONSTRAINT `Corps_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CorpsInstrument` ADD CONSTRAINT `CorpsInstrument_corpsId_fkey` FOREIGN KEY (`corpsId`) REFERENCES `Corps`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CorpsInstrument` ADD CONSTRAINT `CorpsInstrument_instrumentId_fkey` FOREIGN KEY (`instrumentId`) REFERENCES `Instrument`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CorpsFoodPrefs` ADD CONSTRAINT `CorpsFoodPrefs_corpsId_fkey` FOREIGN KEY (`corpsId`) REFERENCES `Corps`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Instrument` ADD CONSTRAINT `Instrument_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Gig` ADD CONSTRAINT `Gig_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `GigType`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GigSignup` ADD CONSTRAINT `GigSignup_corpsId_fkey` FOREIGN KEY (`corpsId`) REFERENCES `Corps`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GigSignup` ADD CONSTRAINT `GigSignup_gigId_fkey` FOREIGN KEY (`gigId`) REFERENCES `Gig`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GigSignup` ADD CONSTRAINT `GigSignup_instrumentId_fkey` FOREIGN KEY (`instrumentId`) REFERENCES `Instrument`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GigSignup` ADD CONSTRAINT `GigSignup_signupStatusId_fkey` FOREIGN KEY (`signupStatusId`) REFERENCES `GigSignupStatus`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HiddenGig` ADD CONSTRAINT `HiddenGig_corpsId_fkey` FOREIGN KEY (`corpsId`) REFERENCES `Corps`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HiddenGig` ADD CONSTRAINT `HiddenGig_gigId_fkey` FOREIGN KEY (`gigId`) REFERENCES `Gig`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rehearsal` ADD CONSTRAINT `Rehearsal_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `RehearsalType`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CorpsRehearsal` ADD CONSTRAINT `CorpsRehearsal_corpsId_fkey` FOREIGN KEY (`corpsId`) REFERENCES `Corps`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CorpsRehearsal` ADD CONSTRAINT `CorpsRehearsal_rehearsalId_fkey` FOREIGN KEY (`rehearsalId`) REFERENCES `Rehearsal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Song` ADD CONSTRAINT `Song_createdByCorpsId_fkey` FOREIGN KEY (`createdByCorpsId`) REFERENCES `Corps`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quote` ADD CONSTRAINT `Quote_saidByCorpsId_fkey` FOREIGN KEY (`saidByCorpsId`) REFERENCES `Corps`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quote` ADD CONSTRAINT `Quote_writtenByCorpsId_fkey` FOREIGN KEY (`writtenByCorpsId`) REFERENCES `Corps`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Section` ADD CONSTRAINT `Section_corpsId_fkey` FOREIGN KEY (`corpsId`) REFERENCES `Corps`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KillerCorps` ADD CONSTRAINT `KillerCorps_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `KillerGame`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KillerCorps` ADD CONSTRAINT `KillerCorps_corpsId_fkey` FOREIGN KEY (`corpsId`) REFERENCES `Corps`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KillerCorps` ADD CONSTRAINT `KillerCorps_killedById_fkey` FOREIGN KEY (`killedById`) REFERENCES `KillerCorps`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KillerCorps` ADD CONSTRAINT `KillerCorps_targetId_fkey` FOREIGN KEY (`targetId`) REFERENCES `KillerCorps`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StreckTransaction` ADD CONSTRAINT `StreckTransaction_streckListId_fkey` FOREIGN KEY (`streckListId`) REFERENCES `StreckList`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StreckTransaction` ADD CONSTRAINT `StreckTransaction_corpsId_fkey` FOREIGN KEY (`corpsId`) REFERENCES `Corps`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StreckList` ADD CONSTRAINT `StreckList_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `Corps`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Nickname` ADD CONSTRAINT `Nickname_forId_fkey` FOREIGN KEY (`forId`) REFERENCES `Corps`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Nickname` ADD CONSTRAINT `Nickname_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `Corps`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CorpsToRole` ADD CONSTRAINT `_CorpsToRole_A_fkey` FOREIGN KEY (`A`) REFERENCES `Corps`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CorpsToRole` ADD CONSTRAINT `_CorpsToRole_B_fkey` FOREIGN KEY (`B`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CorpsToPermission` ADD CONSTRAINT `_CorpsToPermission_A_fkey` FOREIGN KEY (`A`) REFERENCES `Corps`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CorpsToPermission` ADD CONSTRAINT `_CorpsToPermission_B_fkey` FOREIGN KEY (`B`) REFERENCES `Permission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PermissionToRole` ADD CONSTRAINT `_PermissionToRole_A_fkey` FOREIGN KEY (`A`) REFERENCES `Permission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PermissionToRole` ADD CONSTRAINT `_PermissionToRole_B_fkey` FOREIGN KEY (`B`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

