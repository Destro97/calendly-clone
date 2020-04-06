const request = require("supertest");
const app = require("../server");
const should = require("chai").should();
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJnb29nbGVfdG9rZW5zIjp7ImFjY2Vzc190b2tlbiI6InlhMjkuYTBBZTRsdkMwbl9xcFJlc3FESFBXTnZaQy1BQ281UWs3VFBYc01WZWRqSUNaMmVuV3JVeDZnSUl5aXA3TDYtVTh2SzNlTnVhX2N3bzM2YUF1Yzc1R1Y4dG5BamhlTkgzaDhGYnhFMXVEZ3ZVSnMxVDh1MV84TWItQm5iU05udS0zVThnLVh6cy1hSHVMNHcxamxaZ0EzRzhxd0ktUEM5RTU5TjRNIiwicmVmcmVzaF90b2tlbiI6IjEvLzBnV1g0Tm40cmphWExDZ1lJQVJBQUdCQVNOd0YtTDlJcldWNHNHdGVhMnAxaWlLSWdpRkVMQjYwNXNWUkV6UHlzall6Q3AtblZPckkxb1RDX1QzTTVrQTdXV2VwNTVlVmNVZlkiLCJzY29wZSI6Im9wZW5pZCBodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9hdXRoL3VzZXJpbmZvLnByb2ZpbGUgaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vYXV0aC9jYWxlbmRhciBodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9hdXRoL3VzZXJpbmZvLmVtYWlsIiwidG9rZW5fdHlwZSI6IkJlYXJlciIsImlkX3Rva2VuIjoiZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNklqSTFOMlkyWVRVNE1qaGtNV1UwWVROaE5tRXdNMlpqWkRGaE1qUTJNV1JpT1RVNU0yVTJNalFpTENKMGVYQWlPaUpLVjFRaWZRLmV5SnBjM01pT2lKb2RIUndjem92TDJGalkyOTFiblJ6TG1kdmIyZHNaUzVqYjIwaUxDSmhlbkFpT2lJME56azNPRGM0TnprMk5USXRibU0yTXpKd2FtZG5ZMncxYW1ReFlUaHlOR3BvTXpreVlUTnFNbkpqTXpVdVlYQndjeTVuYjI5bmJHVjFjMlZ5WTI5dWRHVnVkQzVqYjIwaUxDSmhkV1FpT2lJME56azNPRGM0TnprMk5USXRibU0yTXpKd2FtZG5ZMncxYW1ReFlUaHlOR3BvTXpreVlUTnFNbkpqTXpVdVlYQndjeTVuYjI5bmJHVjFjMlZ5WTI5dWRHVnVkQzVqYjIwaUxDSnpkV0lpT2lJeE1ESXdNalU1TkRRMk16STFOelk0TXpVd05qY2lMQ0psYldGcGJDSTZJbmxoYzJndWJXRnVaMnhoTXpjNFFHZHRZV2xzTG1OdmJTSXNJbVZ0WVdsc1gzWmxjbWxtYVdWa0lqcDBjblZsTENKaGRGOW9ZWE5vSWpvaWNHSkdSMnhQUlVrM2NsQlROSEJCWDBWTk4zVjZVU0lzSW01aGJXVWlPaUpaWVhOb0lFMWhibWRzWVNJc0luQnBZM1IxY21VaU9pSm9kSFJ3Y3pvdkwyeG9OUzVuYjI5bmJHVjFjMlZ5WTI5dWRHVnVkQzVqYjIwdkxWZEtVMUoyWW05dFNHaHJMMEZCUVVGQlFVRkJRVUZKTDBGQlFVRkJRVUZCUVVGQkwwRkJTMWRLU2sxeVZrY3dVVzVpV2tablIxOVBjREpEWXpabWRrWlljRTVEYW1jdmN6azJMV012Y0dodmRHOHVhbkJuSWl3aVoybDJaVzVmYm1GdFpTSTZJbGxoYzJnaUxDSm1ZVzFwYkhsZmJtRnRaU0k2SWsxaGJtZHNZU0lzSW14dlkyRnNaU0k2SW1WdUlpd2lhV0YwSWpveE5UZzJNVGd5TVRnMExDSmxlSEFpT2pFMU9EWXhPRFUzT0RSOS5aQW5XLW92WDg5MzFrYVU0VElGd1pEN3kwTmdBZjBrU0NzaW5XS1NSMjZWallmNTNRbDR6MkRIaEUxYzBkVUdqWnhOMm1LX0ZuLUhabFEySm5uQ2VrZnNHbUdRQ2ZoR2JFUTg3WEFsdGdBMjFpUllnOTFhZ3ZMY3YwbEZCSW5HSHhfalFoZWtxb2M1d1Ffb2hkaHZFMDhEbTZ6aVF3czRPcUlHQVdYX2hGUXpzU1VhY05vQ21fTi1ybHVkWjdMQkQxTV90alFJTnZpTmc0WFBTNHV4ajJpUDZsZVNCVFJOTlBYS1h4MGdVQUNHM0VJdmJRdUxUZlM5UlJzNnN3QVhBUVpyUElTUHFkZzY3Vk11WHZ2WDNJV2g3a3hEVlN5MXN1T2tvYU84dVlfbDlsbjlSWkpyWkRDS2FEY0xocXJxNjlBSlhZSEpNRDF5bnphbHpoNTNrTGciLCJleHBpcnlfZGF0ZSI6MTU4NjE4NTc4MjI3NX0sInVzZXIiOnsiaWQiOiI1ZTg5ZDk3NDQxMzRhYjA5NGQyMDNmMjAifSwiaWF0IjoxNTg2MTgyMTgzLCJleHAiOjE1ODY1NDIxODN9.Cr_WacodFyUpNK9S6G5FYjJyFOzHPuqlfrSsu1vqzdE";
const invalid_token = "thisIsAnInvalidToken";

// These test cases have been written to work using the DEV environment Database.

describe("GET /auth/google", function () {
  it("respond with json containing 'url' for performing Login/Authentication using Google OAuth2.0", function (done) {
    request(app)
      .get("/auth/google")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        res.body.should.have.property("url");
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
});

describe("GET /auth/logout", function () {
  it("respond with json containing error: token not present", function (done) {
    request(app)
      .get("/auth/logout")
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

describe("GET /auth/logout", function () {
  it("respond with json containing error: invalid token", function (done) {
    request(app)
      .get("/auth/logout")
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

describe("GET /auth/logout", function () {
  it("respond with json containing 'success' if the logout request was successful", function (done) {
    request(app)
      .get("/auth/logout")
      .set("Authorization", token)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        res.body.should.have.property("success");
        res.body.success.should.equal(true);
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
});
