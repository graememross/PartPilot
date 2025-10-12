/*
  Warnings:

  - The `leadTime` column on the `LineItems` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `LotNo` column on the `LineItems` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `Quantity` on the `LineItems` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `UnitPrice` on the `LineItems` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `totalPrice` on the `LineItems` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "LineItems" DROP COLUMN "Quantity",
ADD COLUMN     "Quantity" INTEGER NOT NULL,
DROP COLUMN "UnitPrice",
ADD COLUMN     "UnitPrice" DECIMAL(65,30) NOT NULL,
DROP COLUMN "totalPrice",
ADD COLUMN     "totalPrice" DECIMAL(65,30) NOT NULL,
DROP COLUMN "leadTime",
ADD COLUMN     "leadTime" INTEGER,
DROP COLUMN "LotNo",
ADD COLUMN     "LotNo" INTEGER;
