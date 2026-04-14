import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome" />
            
            {/* Ensure fonts used in Figma are loaded */}
            <style dangerouslySetInnerHTML={{__html: `
                @import url('https://fonts.googleapis.com/css2?family=Amiko:wght@400;600;700&family=DM+Serif+Display:ital@0;1&family=Poppins:ital,wght@0,400;0,700;1,400&display=swap');
            `}} />

            <div className="w-full min-h-screen relative bg-white overflow-x-hidden flex justify-center items-center">
                <div className="w-[2014px] h-[1127px] relative shrink-0">
                    <div className="w-[2423px] h-[927px] left-[-205px] top-[-176px] absolute rounded-full blur-[100px]" style={{ background: 'radial-gradient(ellipse 50% 50% at 50% 50%, #FF6A00 0%, rgba(0, 0, 0, 0.90) 100%)' }} />
                    <div className="w-[2627px] h-[1019px] left-[-307px] top-[-587px] absolute bg-orange-500 rounded-full blur-[100px]" />
                    <div className="w-[1307px] h-[570px] left-[353px] top-[-398px] absolute bg-orange-50/50 rounded-full blur-[100px]" />
                
                <img className="w-28 h-28 left-[953px] top-[26px] absolute rounded-full" src="https://placehold.co/107x107" alt="Logo" />
                
                <div className="left-[762px] top-[167px] absolute text-center justify-start text-white text-4xl font-normal font-['Amiko'] leading-10 [text-shadow:_3px_7px_4px_rgb(0_0_0_/_0.25)]">
                    COLLEGE OF COMPUTING <br />  STUDIES
                </div>
                
                <div className="left-[500px] top-[564px] absolute text-center justify-start text-white text-4xl font-normal font-['DM_Serif_Display'] underline leading-10">Dangal ng Bayan</div>
                
                <div className="w-96 h-0 left-[785px] top-[144px] absolute outline outline-1 outline-offset-[-0.50px] outline-white"></div>
                
                <div className="w-[481px] h-9 left-[766px] top-[1090px] absolute bg-black/20 rounded-tl-[40px] rounded-tr-[40px] shadow-[3px_8px_4px_0px_rgba(0,0,0,0.25)]" />
                
                <div className="left-[141px] top-[499px] absolute text-center justify-start text-white text-9xl font-bold font-['Poppins'] leading-10">Welcome.</div>
                
                <div className="w-[724px] h-28 left-[141px] top-[612px] absolute justify-start">
                    <span className="text-white text-2xl font-normal font-['DM_Serif_Display'] leading-6">This platform provides a simple and secure way to manage and  access student information, supporting efficiency, accuracy, and the spirit of </span>
                    <span className="text-white text-2xl font-normal font-['DM_Serif_Display'] underline leading-6">Dangal ng Bayan.</span>
                </div>
                
                {/* LOGIN Button mapped to inertia route login */}
                <Link href={route('login')}>
                    <div className="w-80 h-24 left-[851px] top-[960px] absolute bg-[radial-gradient(ellipse_50.00%_3.27%_at_50.00%_50.00%,_rgba(228.03,_112.28,_29.60,_0.11)_0%,_rgba(126.03,_62.06,_16.36,_0.11)_100%)] rounded-[45px] shadow-[inset_-2.693333387374878px_2.693333387374878px_2.693333387374878px_0px_rgba(255,255,255,0.41)] shadow-[inset_2.693333387374878px_-2.693333387374878px_2.693333387374878px_0px_rgba(149,73,19,0.41)] backdrop-blur-md cursor-pointer hover:opacity-90 transition-opacity z-10" />
                    <div className="left-[945px] top-[996px] absolute justify-start text-orange-500 text-4xl font-bold font-['Poppins'] leading-6 pointer-events-none z-20">LOGIN</div>
                </Link>

                <img className="w-14 h-20 left-[111px] top-[41px] absolute" src="https://placehold.co/60x78" alt="Hamburger Menu" />
                <img className="w-14 h-20 left-[1842px] top-[41px] absolute" src="https://placehold.co/60x78" alt="Search Icon" />
                </div>
            </div>
        </>
    );
}
