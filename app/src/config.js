const config = {
    apiPath: 'http://localhost:3001',
    googleClientId: '523418450925-9t6nhpap53hsqmsjle8kh524sdqijkk9.apps.googleusercontent.com',
    headers: () => {
        return {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        };
    },
};

export default config;