/*
  Warnings:

  - You are about to drop the column `signedUrl` on the `File` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "File_signedUrl_key";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "signedUrl";
