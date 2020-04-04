const { google } = require("googleapis");

const User = require("../models/User");
const {
  googleClientID,
  googleClientSecret,
  googleClientRedirect
} = require("../config/keys");

const googleConfig = {
  clientId: googleClientID,
  clientSecret: googleClientSecret,
  redirect: googleClientRedirect
};

const defaultScopes = [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/calendar"
];

const googleAuthConnection = () => {
  return new google.auth.OAuth2(
    googleConfig.clientId,
    googleConfig.clientSecret,
    googleConfig.redirect
  );
};

const getConnectionUrl = (auth) => {
  return auth.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: defaultScopes
  });
};

module.exports.urlGoogle = () => {
  const auth = googleAuthConnection();
  const url = getConnectionUrl(auth);
  return url;
};

const getOAuth2Api = (auth) => {
  return google.oauth2({
    version: "v1",
    auth
  });
};

module.exports.getGoogleAccountFromCode = async (code) => {
  const auth = googleAuthConnection();
  const data = await auth.getToken(code);
  const tokens = data.tokens;
  auth.setCredentials(tokens);
  const oauth2Client = getOAuth2Api(auth);
  const me = await oauth2Client.userinfo.get({
    auth
  });
  try {
    const user = {
      email: me.data.email,
      handle: me.data.email,
      avatar: me.data.picture,
      googleID: me.data.id
    };
    return {
      googleTokens: tokens,
      user
    };
  } catch (error) {
    console.error(`Error occured ${error}`);
    return { error };
  }
};
