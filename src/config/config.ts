import secret from './secret';

const devConfig = {
    SERVER_URL: secret.SERVER_URL
}

const prodConfigs = {
    SERVER_URL: secret.SERVER_URL_PROD
}

export const configs = secret.STAGE === 'development'  ? devConfig : prodConfigs