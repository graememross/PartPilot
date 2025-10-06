import {NextRequest, NextResponse} from "next/server";
import {hash} from 'bcrypt'
import {z} from "zod"
import prisma from "@/lib/prisma";

const UserSchema = z.object({
	name: z.string().optional(),
	email: z.string().email(),
	password: z.string()
})

export async function POST(req: NextRequest) {
	try {
		const parsedBody = await req.json()

		const validationResult = UserSchema.safeParse(parsedBody)
		if (!validationResult.success) return NextResponse
			.json({error: "Invalid user creation payload"}, {status: 400})

		const hashedPassword = await hash(validationResult.data.password, 10)

		const user = await prisma.user.create({
			data: {
				...validationResult.data,
				password: hashedPassword
			}
		})
		updateStoresEtc(user)

		return NextResponse.json(user)
	} catch (e) {
		if(e.code === "P2002") {
			// Unique constraint error --> Email already exists
			return NextResponse.json({error: "Email already registered"}, {status: 400})
		}
		return NextResponse.json({error: "Error while creating a new user"}, {status: 400})
	}
}

export async function updateStoresEtc(user){
	// Now create a default set of warehouses to look for components to satisfy a BOM
	const foundStore = await prisma.store.findFirst({
		where: {
			ownerId: user.id
		},
	})
	if ( ! foundStore ){
		await prisma.store.create({
			data: {
				name: "Bin 1",
				description: "Default Storage bin created to hold all your parts",
				ownerId: user.id,
			}
		})
	}
	const warehouses = [
		{
			name: user.name + "'s default search location",
			description: "Default Warehouse holding all your local parts",
			canDemand: true
		},
		{
			name: "LSCS",
			description: "LSCS Default search location for all orders and info",
			canDemand: false,
			url: "https://wmsc.lcsc.com/wmsc/product/detail"
		}
	];

	for (const warehouse of warehouses) {
		const existing = await prisma.warehouse.findFirst({
			where: {
				name: warehouse.name,
				ownerId: user.id
			}
		});
		if (!existing) {
			const res = await prisma.warehouse.create({ data:
				{
					...warehouse,
					ownerId: user.id,
				}});
			console.log(res)
		}
	}
}

