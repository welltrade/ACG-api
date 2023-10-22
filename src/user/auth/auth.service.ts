import { Injectable, ConflictException, HttpException } from '@nestjs/common';
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from "bcryptjs"
import * as jwt from "jsonwebtoken"
import { UserRole } from "@prisma/client";


interface SignupParams {
	userName: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	password: string;
	// userRole?: UserRole;
}

interface SigninParams {
	// userName: string;

	email: string;
	// phone: string;
	password: string;
}
@Injectable()
export class AuthService {

	constructor(private readonly prismaService: PrismaService) {}

	async signup({ userName, firstName, lastName, email, phone, password }: SignupParams,
		userRole: UserRole){
		const userExists = await this.prismaService.user.findUnique({
			where: {
				email,
			},
		});

		if(userExists){
			throw new ConflictException();
		}

		const hashedPassword = await bcrypt.hash(password, 10)

		const user = await this.prismaService.user.create({
			data: {
				userName,
				firstName,
				lastName,
				email,
				phone,
				password: hashedPassword,
				role: userRole,

			}
		})

		return this.generateJWT(userName, user.id)
	}

	async signin({email, password}:SigninParams){
		const user = await this.prismaService.user.findUnique({
			where: {
				email,
			},
		});

		if(!user){
			throw new HttpException("Invalid credentials", 400)
		}

		const hashedPassword = user.password;

		const isValidPassword = await bcrypt.compare(password, hashedPassword)

		if(!isValidPassword){
			throw new HttpException("Invalid credentials", 400)
		}

		return this.generateJWT(user.userName, user.id)
	}

	private generateJWT(name: string, id: number){

		return jwt.sign({
			name,
			id,

		}, process.env.JSON_TOKEN_KEY, {
			expiresIn: 43200
		})
	}

	generateProductKey(email: string, userRole: UserRole) {
		const string = `${email}-${userRole}-${process.env.PRODUCT_KEY_SECRET}`

		return bcrypt.hash(string, 10)
	}
}
