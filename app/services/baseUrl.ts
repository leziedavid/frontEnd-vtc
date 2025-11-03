// baseUrl.ts
// const BASE_URL_DEV = 'http://localhost:4000/api/v1';
// const BASE_URL_DEV = 'http://109.199.107.23:4000/api/v1';
// const BASE_URL_PROD = 'https://api.covoitivoire.com/api/v1';
// export const getBaseUrl = (): string => {
//     return BASE_URL_DEV;
// };

// baseUrl.ts

// On récupère la variable d'environnement ou on met une valeur par défaut
// const BASE_URL = process.env.NEXT_PUBLIC_SERVEUR_URL || 'http://localhost:4000/api/v1';
const BASE_URL = process.env.NEXT_PUBLIC_SERVEUR_URL || 'https://api.peoogo.com/api/v1';

export const getBaseUrl = (): string => {
    return BASE_URL;
};


