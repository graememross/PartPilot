-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "orderNum" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "allReceived" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LineItems" (
    "id" TEXT NOT NULL,
    "vendorPN" TEXT NOT NULL,
    "manPN" TEXT NOT NULL,
    "Manufacturer" TEXT NOT NULL,
    "customerNo" TEXT NOT NULL,
    "Package" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "RoHS" TEXT NOT NULL,
    "Quantity" TEXT NOT NULL,
    "UnitPrice" TEXT NOT NULL,
    "totalPrice" TEXT NOT NULL,
    "leadTime" TEXT NOT NULL,
    "LotNo" TEXT NOT NULL,
    "Status" TEXT NOT NULL,
    "orderId" TEXT,
    "received" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "LineItems_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNum_key" ON "Order"("orderNum");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineItems" ADD CONSTRAINT "LineItems_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
