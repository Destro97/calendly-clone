const express = require("express");
const router = express.Router();

router.use("/auth", require("./api/auth"));
router.use("/users", require("./api/users"));
router.use("/slots", require("./api/slots"));

router.get("/", (req, res) => {
  const routesJson = {
    "/auth/google": {
      Security: "Public",
      "HTTP Method": "GET",
      Usage:
        "To be used to perform Authentication before using Protected Routes.",
      Response: "A url to perform login through Google OAuth 2.0."
    },
    "/auth/google/callback": {
      Security: "Public",
      "HTTP Method": "GET",
      Usage:
        "Should not be used directly. Only present to serve as a Callback Function after successful Google Authentication.",
      Response:
        "A JWT which is to be passed as the 'Authorization' Header for hitting Protected Routes."
    },
    "/auth/logout": {
      Security: "Protected",
      "HTTP Method": "GET",
      Usage:
        "To logout the currently logged in user which is determined by the token present in 'Authorization' Header.",
      Response: "Returns 'success' as 'true' if logout was successfull.",
      Params: {
        Headers: {
          Authorization: {
            Required: true,
            Type: "JWT",
            Description:
              "The 'token' returned in the response after successful user Login via Google OAuth."
          }
        }
      }
    },
    "/users": {
      Security: "Public",
      "HTTP Method": "GET",
      Usage: "To fetch a list of registered users inside the database.",
      Response: "Returns 'users' as a list of registered users"
    },
    "/slots": {
      Security: "Protected",
      "HTTP Method": "POST",
      Usage: "To store a logged in user's available slot(s) for a given day.",
      Response:
        "Returns the stored 'slot' entry if storing it was successfull.",
      Params: {
        Headers: {
          Authorization: {
            Required: true,
            Type: "JWT",
            Description:
              "The 'token' returned in the response after successful user Login via Google OAuth."
          }
        }
      },
      RequestBody: {
        month: {
          Required: true,
          Type: "Number",
          Description: "Denotes the month of the slot."
        },
        date: {
          Required: true,
          Type: "Number",
          Description: "Denotes the date of month of the slot."
        },
        start: {
          Required: true,
          Type: "Number",
          Description:
            "Denotes the starting hour of 1 hour time slots on the specified date of month of the slot."
        },
        end: {
          Required: true,
          Type: "Number",
          Description:
            "Denotes the ending hour of 1 hour time slots on the specified date of month of the slot."
        }
      }
    },
    "/users/{user_id}/slots": {
      Security: "Protected",
      "HTTP Method": "GET",
      Usage: "To fetch the stored slots of a user represented by 'user_id'.",
      Response:
        "Returns 'slots' as a list of slot entries of stored slots of a user represented by 'user_id'.",
      Params: {
        Headers: {
          Authorization: {
            Required: true,
            Type: "JWT",
            Description:
              "The 'token' returned in the response after successful user Login via Google OAuth."
          }
        },
        Path: {
          user_id: {
            Required: true,
            Type: "String",
            Description:
              "Identifier to indicate which user's stored slots are needed to be retrieved. Can be inferred from 'id' key in Response of '/users' GET."
          }
        },
        Query: {
          month: {
            Required: false,
            Type: "Number",
            Description:
              "Without this 'month' parameter, the API only returns 'months' in which user with 'user_id' has a stored slot. With this parameter, the API returns the slots of any requested month that user with id 'user_id' has stored."
          }
        }
      }
    },
    "/users/{user_id}/slots/{slot_id}/book": {
      Security: "Protected",
      "HTTP Method": "POST",
      Usage:
        "To book a stored slot of user with id 'user_id' by the currently logged in user which is determined by the token present in 'Authorization' Header.",
      Response:
        "Returns 'success' as 'true' if booking the specified slot was successfull.",
      Params: {
        Headers: {
          Authorization: {
            Required: true,
            Type: "JWT",
            Description:
              "The 'token' returned in the response after successful user Login via Google OAuth."
          }
        },
        Path: {
          user_id: {
            Required: true,
            Type: "String",
            Description:
              "Identifier to indicate which user's stored slots are needed to be retrieved. Can be inferred from 'id' key in Response of '/users' GET."
          },
          slot_id: {
            Required: true,
            Type: "String",
            Description:
              "Identifier to indicate which stored slot of user with id 'user_id' is being requested to be booked. Can be inferred from 'id' key in Response of '/users/{user_id}/slots' GET."
          }
        },
        Query: {
          time_slot: {
            Required: true,
            Type: "String",
            Description:
              "Identifier to indicate which time slot of slot with id 'slot_id' for user with id 'user_id' is being requested to be booked. Can be inferred from 'id' key in the key 'time_slots' in the Response of '/users/{user_id}/slots' GET."
          }
        }
      },
      RequestBody: {
        summary: {
          Required: true,
          Type: "String",
          Description:
            "Denotes the title of the calender event shown on Google Calender."
        },
        description: {
          Required: true,
          Type: "String",
          Description:
            "Denotes the description displayed in Card of the calender event displayed on Google Calender."
        }
      }
    }
  };
  res.json({
    message: "These are the available routes.",
    payload: routesJson
  });
});

module.exports = router;
