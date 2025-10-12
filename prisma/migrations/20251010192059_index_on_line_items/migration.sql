/*
  Warnings:

  - A unique constraint covering the columns `[vendorPN,orderId]` on the table `LineItems` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LineItems_vendorPN_orderId_key" ON "LineItems"("vendorPN", "orderId");
