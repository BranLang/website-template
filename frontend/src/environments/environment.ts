declare const process: any;
const env: any = (typeof process !== 'undefined' && process?.env) ? process.env : {};

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  defaultSiteSlug: 'just-eurookna',

};
