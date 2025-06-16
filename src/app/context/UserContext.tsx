"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface LoginInfo {
  id?:number;
  username?: string;
  email?: string;
  role?: string;
  token:{
    access_token:string,
    refresh_token:string
  }
}

interface UserContextType {
  userInfo: LoginInfo | null;
  setUserInfo: React.Dispatch<React.SetStateAction<LoginInfo | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<LoginInfo | null>(null);
  
  useEffect(()=>{
    const storedUser = localStorage.getItem("userInfo");
    if(storedUser){
        setUserInfo(JSON.parse(storedUser))
    }
  },[]);

  useEffect(()=>{
    if(userInfo){
        localStorage.setItem("userInfo",JSON.stringify(userInfo))
    }
    // else{
    //     localStorage.removeItem("userInfo")
    // }
  },[userInfo]);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
