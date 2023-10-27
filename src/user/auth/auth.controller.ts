import { Controller, Post, Body, Param, ParseEnumPipe, UnauthorizedException, Get } from '@nestjs/common';
import { AuthService } from "./auth.service";
import { SignupDto, SigninDto, GenerateProductKeyDto } from "./dtos/auth.dto";
import { UserRole } from "@prisma/client";
import * as bcrypt from "bcryptjs"
import { User, UserInfo } from "../decorators/user.decorator";

@Controller('auth')
export class AuthController {

	constructor(private readonly authService: AuthService){}

	@Post('/signup/:userRole')
	async signup(@Body() body: SignupDto, @Param('userRole', new ParseEnumPipe(UserRole)) userRole: UserRole){

		if(userRole !== UserRole.BUYER){
			if(!body.productKey){
				throw new UnauthorizedException()
			}

			const validProductKey = `${body.email}-${userRole}-${process.env.PRODUCT_KEY_SECRET}`;

			const isValidProductKey = await bcrypt.compare(validProductKey, body.productKey);

			if(!isValidProductKey){
				throw new UnauthorizedException()
			}
		}

		return this.authService.signup(body, userRole)
	}

	@Post('/signin')
	signin(@Body() body:SigninDto){
		return this.authService.signin(body)
	}

	@Post("/key")
	generateProductKey(@Body() {userRole, email}:GenerateProductKeyDto){
		return this.authService.generateProductKey(email, userRole)
	}

	@Get("/me")
	me(@User() user: UserInfo){
		return user;
	}
}
