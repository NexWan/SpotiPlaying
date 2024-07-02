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
            <img src='http://localhost:3000/api/svg?userId=31yzahwadeqrj7t3znaogbz63vjm' alt='Spotify SVG'/>
            }
        </>
    );
};

export default PageView;