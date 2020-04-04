const { google } = require("googleapis");

const {
  googleClientID,
  googleClientSecret,
  googleClientRedirect,
} = require("../config/keys");

const googleConfig = {
  clientId: googleClientID,
  clientSecret: googleClientSecret,
  redirect: googleClientRedirect,
};

const defaultScopes = [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/calendar",
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
    scope: defaultScopes,
  });
};

module.exports.urlGoogle = () => {
  const auth = googleAuthConnection();
  const url = getConnectionUrl(auth);
  return url;
};
