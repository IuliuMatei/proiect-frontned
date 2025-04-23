export const oktaConfig = {
    clientId: `0oanze0vpip2jLbH85d7`,
    issuer: `https://dev-46025252.okta.com`,
    redirectUri: 'http://localhost:3000/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true,
}