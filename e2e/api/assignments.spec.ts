// закрепить клиента за менеджером
// нельзя закрепить клиента, который уже закреплен за другим менеджером
// Получить текущую привязку клиента

import { test, expect } from "@playwright/test";

//  POST закрепить клиента за менеджером

function generateClientPhone(): string {
  const randomPart = Array.from({ length: 9 }, () =>
    Math.floor(Math.random() * 10),
  ).join("");
  return `79${randomPart}`;
}

test("POST /assignments/ - create assignment", async ({ request }) => {
  const clientPhone = generateClientPhone();
  const response = await request.post(
    "https://cc-my-client.stage.contact-center.itlabs.io/assignments/",
    {
      headers: {
        accept: "application/json",
        "Rosa-Api-Key": process.env.ROSA_API_KEY as string,
        "Content-Type": "application/json",
      },
      data: {
        client_phone: clientPhone,
        manager_login: "elesmirnova",
      },
    },
  );

  const responseText = await response.text();

  console.log("status:", response.status());
  console.log("response:", responseText);

  expect(response.status()).toBe(201);
});

// POST нельзя закрепить клиента, который уже закреплен за другим менеджером
test("POST /assignments/ - duplicate assignment returns 409", async ({
  request,
}) => {
  const response = await request.post(
    "https://cc-my-client.stage.contact-center.itlabs.io/assignments/",
    {
      headers: {
        accept: "application/json",
        "Rosa-Api-Key": process.env.ROSA_API_KEY as string,
        "Content-Type": "application/json",
      },
      data: {
        client_phone: "79000003333",
        manager_login: "mmalyutina",
      },
    },
  );

  const responseText = await response.text();

  console.log("status:", response.status());
  console.log("response:", responseText);

  expect(response.status()).toBe(409);
});

// Получить текущую привязку клиента
test("GET full url /assignments/{phone}", async ({ request }) => {
  const clientPhone = generateClientPhone();
  const managerLogin = "elesmirnova";

  const getResponse = await request.get(
    `https://cc-my-client.stage.contact-center.itlabs.io/assignments/${clientPhone}`,
    {
      headers: {
        accept: "application/json",
        "Rosa-Api-Key": process.env.ROSA_API_KEY as string,
      },
    },
  );

  const status = getResponse.status();
  const contentType = getResponse.headers()["content-type"];
  const responseText = await getResponse.text();

  console.log("status:", status);
  console.log("content-type:", contentType);
  console.log("response text:", responseText);

  expect(status).toBe(200);

  const body = JSON.parse(responseText);

  expect(body.client_phone).toBe(clientPhone);
  expect(body.manager_login).toBe(managerLogin);
  expect(body.is_active).toBe(true);
});
