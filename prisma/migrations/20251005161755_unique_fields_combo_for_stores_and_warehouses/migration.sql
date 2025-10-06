/*
  Warnings:

  - A unique constraint covering the columns `[name,ownerId]` on the table `Store` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,ownerId]` on the table `Warehouse` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Store_name_ownerId_key" ON "Store"("name", "ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Warehouse_name_ownerId_key" ON "Warehouse"("name", "ownerId");
