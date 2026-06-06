export default () => ({
    app: {
        name: process.env.APP_NAME,
        port: Number(process.env.APP_PORT) || 3000,
        env: process.env.NODE_ENV
    },
    database: {
        url: process.env.DATABASE_URL,
    },
    security: {
        apiKey: process.env.API_KEY,
        internalServiceToken: process.env.INTERNAL_SERVICE_TOKEN,
    },
    swagger: {
        enabled: process.env.SWAGGER_ENABLED === 'true',
        path: process.env.SWAGGER_PATH,
        title: process.env.SWAGGER_TITLE,
        description: process.env.SWAGGER_DESCRIPTION,
        version: process.env.SWAGGER_VERSION,
    },
});