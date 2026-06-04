import {validateEnv} from "./env.validation";

const env = validateEnv();

export default () => ({
    app: {
        name: env.APP_NAME,
        port: env.APP_PORT
    },
    swagger: {
        enabled: env.SWAGGER_ENABLED,
        path: env.SWAGGER_PATH,
        title: env.SWAGGER_TITLE,
        description: env.SWAGGER_DESCRIPTION,
        version: env.SWAGGER_VERSION,
    },
});