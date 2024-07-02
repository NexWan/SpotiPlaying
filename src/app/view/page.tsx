'use client';

import React, { useEffect, useState, useRef } from 'react';
import { getTokenByUserId, validateTokenView } from '../utils/spotify';
import View from '../home/view';

const PageView = () => {
    const [token, setToken] = useState('');
    const contentRef = useRef<HTMLDivElement | null>(null); // Ref for the dynamic content
    const [viewBox, setViewBox] = useState('0 0 288 800'); // Initial viewBox state

    useEffect(() => {
        const fetchData = async () => {
            var url = new URL(window.location.href);
            var userId = url.searchParams.get("userId") || '';
            console.log(userId);
            var data = await getTokenByUserId(userId);
            var fetchedToken = data.auth;
            var fetchedRefresh = data.refresh;
            var token = await validateTokenView(fetchedToken, fetchedRefresh);
            setToken(token);
        };
        fetchData();
    }, []);
    useEffect(() => {
        if (contentRef.current) {
            const resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    const { height } = entry.contentRect;
                    setViewBox(`0 0 288 ${height}`); 
                }
            });
            const currentRef = contentRef.current; 
            resizeObserver.observe(currentRef);
    
            return () => {
                if (currentRef) {
                    resizeObserver.unobserve(currentRef);
                }
            };
        }
    }, [token]); 

    return (
        <>
            {token &&  
            <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} style={{ width: '288px', height: 'fit-content' }}>
                <foreignObject x="0" y="0" width="100%" height="100%">
                    <div ref={contentRef} className=' w-fit h-fit'> {/* Attach ref to the dynamic content */}
                        <View pasedToken={token} />
                    </div>
                </foreignObject>
            </svg>}
        </>
    );
};

export default PageView;