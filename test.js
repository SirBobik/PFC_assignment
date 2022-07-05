const server = require('./main');
const supertest = require("supertest");

afterAll((done) => {
    server.close(done());
});

test("Invalid request", async () => {
    await supertest(server).get("/api/check_iban")
        .expect(400)
        .then((response) => {
            expect(response.body.result).toBe('BAD REQUEST');
            expect(response.body.reason).toBe('Invalid request format');
            expect(response.body.format).toBe('localhost:3000/api/check_iban/:iban');
        });
});

test("Too short IBAN", async () => {
    await supertest(server).get("/api/check_iban/SE873101234")
        .expect(200)
        .then((response) => {
            expect(response.body.result).toBe('IBAN NOT OK');
            expect(response.body.reason).toBe('IBAN size must be between 16 and 34 characters');
        });
});

test("Too long IBAN", async () => {
    await supertest(server).get("/api/check_iban/SE8712341234123412341234123412341234")
        .expect(200)
        .then((response) => {
            expect(response.body.result).toBe('IBAN NOT OK');
            expect(response.body.reason).toBe('IBAN size must be between 16 and 34 characters');
        });
});

test("Country code isn't valid", async () => {
    await supertest(server).get("/api/check_iban/1SE8730000000010123456789")
        .expect(200)
        .then((response) => {
            expect(response.body.result).toBe('IBAN NOT OK');
            expect(response.body.reason).toBe('First two characters are supposed to be a country code');
        });
});

test("Format check fails", async () => {
    await supertest(server).get("/api/check_iban/BR15000000000000-10932840814P2")
        .expect(200)
        .then((response) => {
            expect(response.body.result).toBe('IBAN NOT OK');
            expect(response.body.reason).toBe('Format NOT OK or country code does not exist');
        });
});

test("Simple successful case", async () => {
    await supertest(server).get("/api/check_iban/BR1500000000000010932840814P2")
        .expect(200)
        .then((response) => {
            expect(response.body.result).toBe('IBAN OK');
        });
});

test("Successful case for low case characters used", async () => {
    await supertest(server).get("/api/check_iban/MU43bomm0101123456789101000MUR")
        .expect(200)
        .then((response) => {
            expect(response.body.result).toBe('IBAN OK');
        });
});
