import {serialize} from 'cookie';
export const createCookie =(name:string,value:string,maxAge:number)=>{
    serialize(name,value,{
        httpOnly:true,
        secure:process.env.NODE_ENV === 'production',
        path:'/',
        maxAge,
        sameSite:'strict'
    })
}