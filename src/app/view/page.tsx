'use client';

import React, { useEffect, useState } from 'react';
import { getTokenByUserId, validateTokenView } from '../utils/spotify';
import View from '../home/view';

const PageView = () => {
    const [token, setToken] = useState('');

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
    }, []); // Removed token from dependency array

    return (
        <div>
            {token && <View pasedToken={token} />}
        </div>
    );
};

export default PageView;