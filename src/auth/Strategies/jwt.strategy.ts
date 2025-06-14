import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

    constructor(private configService: ConfigService){
        const secret = configService.get("JWT_SECRET")
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: secret,
            ignoreExpiration: false
        })
    }
    validate(payload: any) {
        return {
            id: payload.sub,
            role: payload.role,
            email: payload.email
        }
    }
}