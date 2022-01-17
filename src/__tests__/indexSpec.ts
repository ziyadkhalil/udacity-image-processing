import supertest from "supertest";

import app from "..";

const request = supertest(app);

it("File name is required", async () => {
  const res = await request.get("/api/images");
  expect(res.status).toBe(400);
  expect(res.text).toBe("File name is required");
});

it("Gets image if it exists", async () => {
  const res = await request.get("/api/images?fileName=fjord");
  expect(res.status).toBe(200);
});
