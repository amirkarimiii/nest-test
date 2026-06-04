export default () => ({
    app: {
        name: process.env.APP_NAME,
        port: parseInt(process.env.APP_PORT ?? '3000',10)
    },
    swagger: {
        enabled: process.env.SWAGGER_ENABLED === 'true',
        path: process.env.SWAGGER_PATH || 'api',
        title: process.env.SWAGGER_TITLE || 'My API',
        description: process.env.SWAGGER_DESCRIPTION || 'API documentation',
        version: process.env.SWAGGER_VERSION || '1.0',
    },
});