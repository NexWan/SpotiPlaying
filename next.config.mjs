/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: '/api/db/userLoggedIn',
                headers: [
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: 'true'
                    }
                ]
            }
        ]
    }
};

export default nextConfig;
