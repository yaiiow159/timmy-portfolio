-- AlterTable
ALTER TABLE "Project" ADD COLUMN "projectType" TEXT NOT NULL DEFAULT 'personal';

-- AlterTable
ALTER TABLE "Project" ADD COLUMN "vcsType" TEXT NOT NULL DEFAULT 'github';

-- AlterTable
ALTER TABLE "Project" ADD COLUMN "platformType" TEXT NOT NULL DEFAULT 'web';
