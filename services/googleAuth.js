const { google } = require("googleapis");

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

const getOAuth2Client = (auth) => {
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
  const oauth2Client = getOAuth2Client(auth);
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

const getCalenderClient = (auth) => {
  return google.calendar({
    version: "v3",
    auth
  });
};

module.exports.createEvent = async (
  tokens,
  attendeeEmail,
  slotData,
  summary,
  description
) => {
  const auth = googleAuthConnection();
  auth.setCredentials(tokens);
  const calenderClient = getCalenderClient(auth);
  const { year, month, date, timeSlot } = slotData;
  const start = new Date(year, month - 1, date, timeSlot.start).toISOString();
  const end = new Date(year, month - 1, date, timeSlot.end).toISOString();
  const event = await calenderClient.events.insert({
    calendarId: "primary",
    requestBody: {
      attendees: [
        {
          email: attendeeEmail
        }
      ],
      creator: {
        self: true
      },
      organizer: {
        self: true
      },
      start: {
        dateTime: start,
        timeZone: "Asia/Kolkata"
      },
      end: {
        dateTime: end,
        timeZone: "Asia/Kolkata"
      },
      summary,
      description
    },
    sendUpdates: "all"
  });
  return event;
};
