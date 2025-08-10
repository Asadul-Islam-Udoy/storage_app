import Sidebar from './Sidebar';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
   isOpen:boolean,
   setIsOpen:React.Dispatch<React.SetStateAction<boolean>>
}

const Layout = ({ children,isOpen,setIsOpen }: LayoutProps) => {
  return (
    <div className="flex">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <main className="flex-1 p-4 ">{children}</main>
    </div>
  );
};

export default Layout;
