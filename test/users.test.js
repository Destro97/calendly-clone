const request = require("supertest");
const app = require("../server");
const should = require("chai").should();
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJnb29nbGVfdG9rZW5zIjp7ImFjY2Vzc190b2tlbiI6InlhMjkuYTBBZTRsdkMxcGtjbl91RkZDYmJHdXRrYVJIUDExaERwc3E1WHdCeV9xb2lvcDNHSkNKTUQ0S3lJdFhDREpBTm5Yc2tCeTg0NU0tZXNwSVhYZ3Q4UzFIVTRzNXNzdTUyOUYzdTJSRWZubzZQeTc4NkMtQ1UxTXhnSW5pQkducDdSOHlhV3l3UHgzS1NxaDdMUTVTZHRkalBOUG5vZDJmb0d6bm9zIiwicmVmcmVzaF90b2tlbiI6IjEvLzBnVGZWNS1YdEhQN0pDZ1lJQVJBQUdCQVNOZ0YtTDlJcnRvNGdxRDczNk5nRGpHOG9SYTgzcVlXMnlpd3BmcFo4TGdvLWpMVEtKYkVsalVWc1RKS2RvTld2cjdVbHRtNV9DZyIsInNjb3BlIjoib3BlbmlkIGh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL2F1dGgvY2FsZW5kYXIgaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vYXV0aC91c2VyaW5mby5lbWFpbCBodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9hdXRoL3VzZXJpbmZvLnByb2ZpbGUiLCJ0b2tlbl90eXBlIjoiQmVhcmVyIiwiaWRfdG9rZW4iOiJleUpoYkdjaU9pSlNVekkxTmlJc0ltdHBaQ0k2SWpJMU4yWTJZVFU0TWpoa01XVTBZVE5oTm1Fd00yWmpaREZoTWpRMk1XUmlPVFU1TTJVMk1qUWlMQ0owZVhBaU9pSktWMVFpZlEuZXlKcGMzTWlPaUpvZEhSd2N6b3ZMMkZqWTI5MWJuUnpMbWR2YjJkc1pTNWpiMjBpTENKaGVuQWlPaUkwTnprM09EYzROemsyTlRJdGJtTTJNekp3YW1kblkydzFhbVF4WVRoeU5HcG9Nemt5WVROcU1uSmpNelV1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKaGRXUWlPaUkwTnprM09EYzROemsyTlRJdGJtTTJNekp3YW1kblkydzFhbVF4WVRoeU5HcG9Nemt5WVROcU1uSmpNelV1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKemRXSWlPaUl4TURnMk5qUTROemN5TmpJME1qSXdOemd4TXpRaUxDSmxiV0ZwYkNJNklubGpiMjlzT1RkQVoyMWhhV3d1WTI5dElpd2laVzFoYVd4ZmRtVnlhV1pwWldRaU9uUnlkV1VzSW1GMFgyaGhjMmdpT2lKQ01FaFhZMFZhYUd0S2JqUXRMVk5LT1dKTVRGWkJJaXdpYm1GdFpTSTZJbGxoYzJnZ1RXRnVaMnhoSWl3aWNHbGpkSFZ5WlNJNkltaDBkSEJ6T2k4dmJHZzJMbWR2YjJkc1pYVnpaWEpqYjI1MFpXNTBMbU52YlM4dExXbExWSHBpUTFOR1IyTXZRVUZCUVVGQlFVRkJRVWt2UVVGQlFVRkJRVUZCUVVFdlFVRkxWMHBLVUZaR1dURkpTRk5NYXpCU01tcHljbUpoV0c5bGNFTm9SbmhQVVM5ek9UWXRZeTl3YUc5MGJ5NXFjR2NpTENKbmFYWmxibDl1WVcxbElqb2lXV0Z6YUNJc0ltWmhiV2xzZVY5dVlXMWxJam9pVFdGdVoyeGhJaXdpYkc5allXeGxJam9pWlc0aUxDSnBZWFFpT2pFMU9EWXhPREl4TWpZc0ltVjRjQ0k2TVRVNE5qRTROVGN5Tm4wLlp1WkNxQTRLMUdYVV9wMzJKd1hqN3labHN1emxpSUJ5ZnU1bWJFRjRTcTlOc1VXclZZdW4zekl1MnJTX0Riek9WN293Ulg1emEzcXBkejlZTmo5QmpFc3ZsdmRONWJlTEZqQ21PbW5nMmV5aGQ5WjB0QktUdWhyTDBnSklUcUVuWkhlcFNkbTFpS1Bxd1VhZ2J5dU45dnBOYnFObEJ4TXJBZWxzSGVjR3NXS20yYnQ0Zzd4b0k4c0xaOWJnZHRIMXpYbkt3bnMtSktxWXNCMVE2RDJ5Wkx2V2I3d0dQM1VMTFlvNnRSWnVPUi0tZzZQZS1wT2NCMmlYRmx0bEJDbHhQZ0VEdF94c081X2c1akxJOUJFeWNycURYZXJBbEJLLWFncUE1YUQ0eW5TSE9KVklDdUlQUnlranFlRnp2OEZzNTdma21iU1NjY1R6OGFERml4WE1pdyIsImV4cGlyeV9kYXRlIjoxNTg2MTg1NzI0MjU3fSwidXNlciI6eyJpZCI6IjVlODhlOTRjYjE0YTAxMjQ1YTQ4ZGU3NiJ9LCJpYXQiOjE1ODYxODIxMjUsImV4cCI6MTU4NjU0MjEyNX0.N3MHGjUs8D5NRb7nPGgXExGlw2MrgXQ1Mt-YPNEU4nI";
const invalid_token = "thisIsAnInvalidToken";

// These test cases have been written to work using the DEV environment Database.

describe("GET /users", function () {
  it("respond with json containing a list of all users", function (done) {
    request(app)
      .get("/users")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect((res) => {
        if (res.status === 200) res.body.should.have.property("users");
        else if (res.status === 404)
          res.body.error.toLowerCase().should.equal("no users found");
        else throw new Error("Invalid status code");
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
});

describe("GET /users/:user_id/slots", function () {
  it("respond with json containing error: 'No token found'", function (done) {
    request(app)
      .get("/users/5e88e94cb14a01245a48de76/slots")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(401)
      .expect((res) => {
        res.body.error.toLowerCase().should.equal("no token found");
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
});

describe("GET /users/:user_id/slots", function () {
  it("respond with json containing error: invalid token", function (done) {
    request(app)
      .get("/users/5e88e94cb14a01245a48de76/slots")
      .set("Authorization", invalid_token)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(401)
      .expect((res) => {
        res.body.error.toLowerCase().should.equal("invalid token");
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
});

describe("GET /users/:user_id/slots", function () {
  it("respond with json containing error: 'resource not found' because invalid format of mongo objectId", function (done) {
    request(app)
      .get("/users/invalid_user_id/slots")
      .set("Authorization", token)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400)
      .expect((res) => {
        res.body.error.toLowerCase().should.equal("resource not found");
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
});

describe("GET /users/:user_id/slots", function () {
  it("respond with json containing error: 'user not found' because non existent mongo objectId", function (done) {
    request(app)
      .get("/users/5e88e94cb14a01245a48de77/slots")
      .set("Authorization", token)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400)
      .expect((res) => {
        res.body.error.toLowerCase().should.equal("user not found");
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
});

describe("GET /users/:user_id/slots", function () {
  it("respond with json containing error: 'No available slots for specified user' because non existent slots for specified user", function (done) {
    request(app)
      .get("/users/5e89d9744134ab094d203f20/slots")
      .set("Authorization", token)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(404)
      .expect((res) => {
        res.body.error
          .toLowerCase()
          .should.equal("no available slots for specified user");
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
});

describe("GET /users/:user_id/slots", function () {
  it("respond with json containing a list of months of users stored slots", function (done) {
    request(app)
      .get("/users/5e88e94cb14a01245a48de76/slots")
      .set("Authorization", token)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        if (!("months" in res.body))
          throw new Error("'months' key not found in response");
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
});

describe("GET /users/:user_id/slots", function () {
  it("respond with json containing error: 'invalid month'", function (done) {
    request(app)
      .get("/users/5e88e94cb14a01245a48de76/slots?month=13")
      .set("Authorization", token)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400)
      .expect((res) => {
        res.body.error.toLowerCase().should.equal("invalid month");
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
});

describe("GET /users/:user_id/slots", function () {
  it("respond with json containing error: 'No available slots for specified month'", function (done) {
    request(app)
      .get("/users/5e88e94cb14a01245a48de76/slots?month=10")
      .set("Authorization", token)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(404)
      .expect((res) => {
        res.body.error
          .toLowerCase()
          .should.equal("no available slots for specified month");
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
});

describe("GET /users/:user_id/slots", function () {
  it("respond with json containing 'slots' for specified month for specified user", function (done) {
    request(app)
      .get("/users/5e88e94cb14a01245a48de76/slots?month=12")
      .set("Authorization", token)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        res.body.should.have.property("slots");
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
});

describe("POST /slots", function () {
  it("respond with json containing error: 'no token found'", function (done) {
    const data = {
      month: 5,
      date: 20,
      start: 14,
      end: 18
    };
    request(app)
      .post("/slots")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send(data)
      .expect("Content-Type", /json/)
      .expect(401)
      .expect((res) => {
        res.body.error.toLowerCase().should.equal("no token found");
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
});

describe("POST /slots", function () {
  it("respond with json containing error: 'Invalid Token'", function (done) {
    const data = {
      month: 5,
      date: 20,
      start: 14,
      end: 18
    };
    request(app)
      .post("/slots")
      .set("Authorization", invalid_token)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send(data)
      .expect("Content-Type", /json/)
      .expect(401)
      .expect((res) => {
        res.body.error.toLowerCase().should.equal("invalid token");
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
});

describe("POST /slots", function () {
  it("respond with json containing error: 'Month is required'", function (done) {
    const data = {
      date: 20,
      start: 14,
      end: 18
    };
    request(app)
      .post("/slots")
      .set("Authorization", token)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send(data)
      .expect("Content-Type", /json/)
      .expect(400)
      .expect((res) => {
        res.body.error.should.equal("Month is required");
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
});

describe("POST /slots", function () {
  it("respond with json containing error: 'Date is required'", function (done) {
    const data = {
      month: 5,
      start: 14,
      end: 18
    };
    request(app)
      .post("/slots")
      .set("Authorization", token)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send(data)
      .expect("Content-Type", /json/)
      .expect(400)
      .expect((res) => {
        res.body.error.should.equal("Date is required");
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
});

describe("POST /slots", function () {
  it("respond with json containing error: 'Start time of slot(s) is required'", function (done) {
    const data = {
      month: 5,
      date: 20,
      end: 18
    };
    request(app)
      .post("/slots")
      .set("Authorization", token)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send(data)
      .expect("Content-Type", /json/)
      .expect(400)
      .expect((res) => {
        res.body.error.should.equal("Start time of slot(s) is required");
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
});

describe("POST /slots", function () {
  it("respond with json containing error: 'End time of slot(s) is required'", function (done) {
    const data = {
      month: 5,
      date: 20,
      start: 14
    };
    request(app)
      .post("/slots")
      .set("Authorization", token)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send(data)
      .expect("Content-Type", /json/)
      .expect(400)
      .expect((res) => {
        res.body.error.should.equal("End time of slot(s) is required");
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
});

describe("POST /slots", function () {
  it("respond with json containing error: 'Invalid Month'", function (done) {
    const data = {
      month: 15,
      date: 20,
      start: 14,
      end: 18
    };
    request(app)
      .post("/slots")
      .set("Authorization", token)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send(data)
      .expect("Content-Type", /json/)
      .expect(400)
      .expect((res) => {
        res.body.error.should.equal("Invalid Month");
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
});

describe("POST /slots", function () {
  it("respond with json containing error: 'Invalid Date'", function (done) {
    const data = {
      month: 5,
      date: 35,
      start: 14,
      end: 18
    };
    request(app)
      .post("/slots")
      .set("Authorization", token)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send(data)
      .expect("Content-Type", /json/)
      .expect(400)
      .expect((res) => {
        res.body.error.should.equal("Invalid Date");
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
});

describe("POST /slots", function () {
  it("respond with json containing error: 'Invalid Time Slot Range'", function (done) {
    const data = {
      month: 5,
      date: 20,
      start: 14,
      end: 12
    };
    request(app)
      .post("/slots")
      .set("Authorization", token)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send(data)
      .expect("Content-Type", /json/)
      .expect(400)
      .expect((res) => {
        res.body.error.should.equal("Invalid Time Slot Range");
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
});

describe("POST /slots", function () {
  it("respond with json containing 'slot' as the stored slot for authenticated user", function (done) {
    const data = {
      month: 5,
      date: 20,
      start: 14,
      end: 18
    };
    request(app)
      .post("/slots")
      .set("Authorization", token)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send(data)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        res.body.should.have.property("slot");
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
});
