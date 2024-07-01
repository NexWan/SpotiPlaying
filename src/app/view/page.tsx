'use client';

import React, { useEffect, useState } from 'react';
import { getTokenByUserId } from '../utils/spotify';
import View from '../home/view';

const PageView = () => {
    const [token, setToken] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            var url = new URL(window.location.href);
            var userId = url.searchParams.get("userId") || '';
            console.log(userId);
            const fetchedToken = await getTokenByUserId(userId);
            setToken(fetchedToken);
            console.log(fetchedToken); // Log the fetched token instead of the state variable
        };
        fetchData();
    }, []); // Removed token from dependency array

    return (
        <div>
            {token && <View pasedToken={token} />}
        </div>
    );
};

export default PageView;