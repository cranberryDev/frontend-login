
export const msalConfig = {
    auth: {
      clientId: process.env.REACT_APP_clientId,
      authority: process.env.REACT_APP_authority, // This is a URL (e.g. https://login.microsoftonline.com/{your tenant ID})
      redirectUri: process.env.REACT_APP_redirectUri,
      postLogoutRedirectUri: process.env.REACT_APP_postLogoutRedirectUri,
      // redirectUri: "http://localhost:3000",
      // postLogoutRedirectUri: "http://localhost:3000",
    },
    cache: {
      cacheLocation: "sessionStorage", // This configures where your cache will be stored
      storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    }
  };
  
  // Add scopes here for ID token to be used at Microsoft identity platform endpoints.
  export const loginRequest = {
   scopes: ["openid",process.env.REACT_APP_scopeapi]
  };
  
  // Add the endpoints here for Microsoft Graph API services you'd like to use.
  export const graphConfig = {
      graphMeEndpoint: "Enter_the_Graph_Endpoint_Here/v1.0/me"
  };