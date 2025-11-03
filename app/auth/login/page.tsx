'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import LoginForm from '@/components/forms/LoginForm';


export default function LoginPage() {

    useEffect(() => {
        localStorage.removeItem('role');
    }, []);

    return (

        <>

            <div className="flex min-h-full h-screen">
                <div className="flex flex-1 flex-col justify-center py-0 px-6 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                    <div className="mx-auto w-full max-w-sm lg:w-96">
                        <div className="">
                            <LoginForm />
                        </div>
                    </div>
                </div>

                <div className="relative hidden w-0 flex-1 lg:block">
                    <div className="absolute inset-0 h-full w-full">
                        <Image src="/smartphone.jpg" alt="" fill className="object-cover" style={{ objectFit: 'cover' }} />
                    </div>
                </div>
            </div>
        </>

    );
}


