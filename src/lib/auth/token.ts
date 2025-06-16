import jwt,{JwtPayload} from 'jsonwebtoken';

const ACCESS_SCERET = process.env.ACCESS_SECRET!;
const REFRESH_SCERET = process.env.REFRESH_SECRET!;

interface TokenPayload extends JwtPayload{
   id:string|number,
   email:string
}
export function GenerateToken(payload:TokenPayload){
   const accessToken =  jwt.sign(payload,ACCESS_SCERET,{expiresIn:'15m'})
   const refreshToken =  jwt.sign(payload,REFRESH_SCERET,{expiresIn:'7d'})
   return {accessToken,refreshToken}
}

export function verifyAccessToken(token:string){
   return jwt.verify(token,ACCESS_SCERET)
}


export function verifyRefreshToken(token:string){
   return jwt.verify(token,REFRESH_SCERET)
}