import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerUserId } from '@/lib/server/auth';
import { extractPartInfoFromLCSCResponse } from "@/lib/helper/lcsc_api";
import { Prisma} from '@prisma/client'; 
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const ownerId = await getServerUserId();
        const orders = await prisma.order.findMany(
            {
                where: {
                    warehouse: {
                        id: id,
                        ownerId: ownerId
                    }
                }
            });
        return NextResponse.json({ orders });
    } catch (error) {
        console.error('GET /api/warehouse/orders error', error);
        return NextResponse.json({ error: 'Error fetching orders' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        let { warehouse, vendor, orderNum, lines } = body;
        if (!orderNum) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 404 });
        }

        const ownerId = await getServerUserId();
        if (!ownerId) {
            console.warn('POST /api/warehouses/'+warehouse+'/order: no ownerId (unauthorized)');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if ( warehouse == 0 ) {
            const userWarehouses = await prisma.warehouse.findMany({
                where: {
                    ownerId: ownerId,
                    canDemand: true,
                }
            });
            if (userWarehouses.length === 0) {
                console.warn('POST /api/warehouses/'+warehouse+'/order: user has no warehouses with canDemand=true - no point in adding orders to their warehouse');
                return NextResponse.json({ error: 'User has no warehouses with canDemand=true' }, { status: 403 });
            }
            // Assign to the first warehouse where the user has canDemand=true
            warehouse = userWarehouses[0].id;
        }

        const order = await prisma.order.upsert({
            where: {
                orderNum: orderNum,
                warehouseId: warehouse,
            },
            create: {
                orderNum: orderNum,
                warehouseId: warehouse,
                allReceived: false,
                Vendor: vendor
            },
            update: {}
        });

        lines.map((line) => {
            createLineItem(order, line);
        })
    } catch (error) {
        console.error('POST /api/warehouses error', error);
        return NextResponse.json({ error: 'Error creating warehouse' }, { status: 500 });
    }
        return NextResponse.json({ status: 'LineItems accepted' }, { status: 200 });
}

async function createLineItem(order, line: any) {
    const keys = Object.keys(line);
    const orderId = order.id
    const pn:string = line[keys[0]]
    try {
        const lineItem = {
            Order:  { connect: {
                orderNum: order.orderNum,
                id: order.id
            }},
            vendorPN:   line[keys[0]],
            manPN:      line[keys[1]],
            Manufacturer: line[keys[2]],
            customerNo:     line[keys[3]],
            Package:    String(line[keys[4]]),
            Description: line[keys[5]],
            RoHS:       line[keys[6]],
            Quantity:   line[keys[7]],
            UnitPrice:  line[keys[8]],
            totalPrice: line[keys[9]],
            leadTime:   line[keys[10]],
            LotNo:      line[keys[11]],
            Status:     line[keys[12]],
        }

        const create = await prisma.lineItems.upsert({
            where: {
                orderId_vendorPN: {
                    orderId: orderId,
                    vendorPN: pn
                }
            },
            update: lineItem,
            create: lineItem,
        });
        createUpdatePart(create.vendorPN,Number(create.Quantity))
        return create;
    } catch (error) {
        console.error('Error creating/updating line item:', error);
    }
    return null;
}

async function createUpdatePart(vendorPN: string, orderQty: number){
    try {
        const pcNumber = vendorPN;
        const partExists = await prisma.parts.findUnique({
            where: {
                productCode: pcNumber,
            }
        });
        if(partExists){
            const partUpdate = await prisma.parts.update({
                where: {
                    id: partExists.id,
                },
                data: {
                    onOrder: orderQty,
                }
        });
        if (partUpdate) {
            return NextResponse.json({ status: 200, body: partUpdate, message: "Part updated"});
        }
        else {
            return NextResponse.json({ status: 500, error: "Part not updated" });
        }
        } else {
            const LSCSPart = await fetch(
                    "https://wmsc.lcsc.com/ftps/wm/product/detail?productCode=" + pcNumber,
                    { cache: 'no-store' }
                ).then((response) => {
                    return response.json();
                }).catch((e: ErrorCallback | any) => {
                    console.error(e.message);
                });
            const partInfo = extractPartInfoFromLCSCResponse(LSCSPart);

            const partCreate = await prisma.parts.create({
                data: {
                title: partInfo.title,
                quantity: 0,
                onOrder: orderQty,
                productId: partInfo.productId,
                productCode: partInfo.productCode,
                productModel: partInfo.productModel,
                productDescription: partInfo.productDescription,
                parentCatalogName: partInfo.parentCatalogName,
                catalogName: partInfo.catalogName,
                brandName: partInfo.brandName,
                encapStandard: partInfo.encapStandard,
                productImages: partInfo.productImages,
                pdfLink: partInfo.pdfLink,
                productLink: partInfo.productLink,
                prices: partInfo.prices,
                voltage: partInfo.voltage,
                resistance: partInfo.resistance,
                power: partInfo.power,
                current: partInfo.current,
                tolerance: partInfo.tolerance,
                frequency: partInfo.frequency,
                capacitance: partInfo.capacitance,
                inductance: partInfo.inductance,
                },
            });
            const itemCount = await prisma.parts.aggregate({_count: true}); 
            const parentCatalogNamesRaw = await prisma.parts.groupBy({by: ['parentCatalogName']})
            const parentCatalogNames = parentCatalogNamesRaw.map(item => item.parentCatalogName);
            if (partCreate) {
                return NextResponse.json({ status: 200, body: partCreate, itemCount: itemCount._count, parentCatalogNames: parentCatalogNames, message: "Part created"});
            } else {
                return NextResponse.json({ status: 500, error: "Part not created" });
            }
        }
    // res.status(200).json(LSCSPart);
    } catch (error: ErrorCallback | any) {
        return NextResponse.json({ status: 500, error: error });

    // res.status(500).json({ message: e.message });
    }

}
