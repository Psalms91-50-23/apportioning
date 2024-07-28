'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface NavButtonProps {
    page: string;
    label: string;
    icon?: IconDefinition;
    iconStatic?: IconDefinition;
    staticLocation?: string,
    imageLocation?: string;
    customStyle?: boolean;
    customStylez?: React.CSSProperties;
    isActive?: boolean; 
  }
  
const NavButton = ({page, label, icon, iconStatic, imageLocation, staticLocation, customStyle, customStylez, isActive }: NavButtonProps) => {
    const router = useRouter();
    const [onHover, setOnHover] = useState(false);
    const navigateToPage = (page: string) => {
        if(page){
            router.push(`/${page}`);
        }else if(label === "Home"){
            router.push(`/`);
        }
        else{
            router.back();
        }
    };

    const handleMouseEnter = () => {
        setOnHover(true);
      };
    
      const handleMouseLeave = () => {
        setOnHover(false);
      };

      const style = {
        width: "3.5rem",
        height: "3.5rem"
      }

  return (
    <div 
        className={`nav-button space-x-2 ${isActive && !onHover &&`active-underline`}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => navigateToPage(page)} >
            {icon && !iconStatic && (
            <p className={`px-6 ${onHover && `big-text`}`}>
                <FontAwesomeIcon icon={icon}/>
            </p>
            )
        }
        { onHover && imageLocation && (
            <img 
                src={imageLocation}
                className={`icon`}
                style={customStylez && !customStyle ? customStylez : !customStylez && customStyle ? style : undefined}
            />
        )
        }
        {!onHover && staticLocation && (
            <img 
                src={staticLocation}
                className={`icon`}
                style={customStylez && !customStyle ? customStylez : !customStylez && customStyle ? style : undefined}
            />
        )
        }
        <p className={`${onHover && `big-text`}`}>
            {label}
        </p>
        <span className='underline-rainbow'></span>
        <span className={`${isActive && !onHover &&`active-underline`}`}></span>
    </div>
  )
}

export default NavButton