import{JwtPayload} from 'jsonwebtoken';
import { jwtVerify, SignJWT } from 'jose';
const ACCESS_SECRET = new TextEncoder().encode(process.env.ACCESS_SECRET!);
const REFRESH_SECRET = new TextEncoder().encode(process.env.REFRESH_SECRET!);



interface TokenPayload extends JwtPayload{
   id:string|number,
   email:string
}

export async function GenerateToken(payload: TokenPayload) {
  const accessToken = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('40m')
    .sign(ACCESS_SECRET);

  const refreshToken = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(REFRESH_SECRET);

  return { accessToken, refreshToken };
}

export async function verifyAccessToken(token: string): Promise<TokenPayload | null> {
try{
    const { payload } = await jwtVerify(token, ACCESS_SECRET);
  return payload as TokenPayload;
}
catch(error:any){
 if (error.code === 'ERR_JWT_EXPIRED') {
      console.error('Access token expired');
    } else {
      console.error('Token verification failed:', error);
    }
    throw error; 
}
}

export async function verifyRefreshToken(token: string): Promise<TokenPayload> {
  const { payload } = await jwtVerify(token, REFRESH_SECRET);
  return payload as TokenPayload;
}