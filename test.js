const server = require('./main');
const supertest = require("supertest");

afterAll((done) => {
    server.close(done());
});

test("Invalid request", async () => {
    await supertest(server).get("/api/posts")
        .expect(400)
        .then((response) => {
            expect(response.body.reason).toBe('Invalid request format.');
            expect(response.body.format).toBe('localhost:3000/api/check_iban/:iban');
        });
});