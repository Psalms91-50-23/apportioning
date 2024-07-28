'use client';
import { usePathname } from 'next/navigation';
import { NavButton } from './';

const Navigation = () => {
    const pathname = usePathname();
    const currentPath = pathname !== "/"; 

    const customStyles = {
        width: "2.8rem",
        height: "2.8rem",
    }

  return (
    <nav className='flex flex-row justify-start p-10 space-x-4 max-width w-full'>
       <NavButton page={""} label={"Home"} imageLocation={"/home.svg"} staticLocation={"/homeStatic.svg"}  isActive={pathname === "/"}/>
       <NavButton page={"backpayments"} label={"BackPayments"} imageLocation={"/pay.svg"} customStyle={true} staticLocation={"/payStatic.svg"}  isActive={pathname === "/backpayments"}/>
       <NavButton page={"pwc"} label={"PWC"} imageLocation={"/calculator.svg"} customStylez={customStyles} staticLocation={"/calculatorStatic.svg"}  isActive={pathname === "/pwc"}/>
       {currentPath  && (
        <NavButton page={""} label={"Back"} imageLocation={"/leftArrow.svg"} staticLocation={"/leftArrowStatic.svg"} customStylez={customStyles}/>
       )
       }
    </nav>
  );
};

export default Navigation;
