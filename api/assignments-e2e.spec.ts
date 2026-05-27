// #7519 закрепление и удаление закрепления за менеджером
// #7507 запрещено удаление закрепления другим менеджером

import { test, expect } from "@playwright/test";

// https://allure.itlabs.io/project/28/test-cases/7519?treeId=58
test("#7519 закрепление и удаление закрепления за менеджером", async ({
  request,
}) => {
  const clientPhone = "79000003334";
  const managerLogin = "elesmirnova";

  // Привязать клиента к менеджеру
  const createResponse = await request.post(
    "https://cc-my-client.stage.contact-center.itlabs.io/assignments/",
    {
      headers: {
        accept: "application/json",
        "Rosa-Api-Key": process.env.ROSA_API_KEY as string,
        "Content-Type": "application/json",
      },
      data: {
        client_phone: clientPhone,
        manager_login: managerLogin,
      },
    },
  );

  const createText = await createResponse.text();
  console.log("create status:", createResponse.status());
  console.log("create response:", createText);

  expect([201, 409]).toContain(createResponse.status());

  // Получить текущую привязку клиента
  const getResponse = await request.get(
    `https://cc-my-client.stage.contact-center.itlabs.io/assignments/${clientPhone}`,
    {
      headers: {
        accept: "application/json",
        "Rosa-Api-Key": process.env.ROSA_API_KEY as string,
      },
    },
  );

  const getStatus = getResponse.status();
  const getText = await getResponse.text();
  console.log("get status:", getStatus);
  console.log("get response:", getText);

  expect(getStatus).toBe(200);

  const body = JSON.parse(getText);
  expect(body.client_phone).toBe(clientPhone);
  expect(body.manager_login.toLowerCase()).toBe(managerLogin.toLowerCase());
  expect(body.is_active).toBe(true);
  expect(body.assigned_at).toBeTruthy();

  // Отвязать клиента от менеджера (только привязанный менеджер может отвязать)
  const deleteResponse = await request.delete(
    `https://cc-my-client.stage.contact-center.itlabs.io/assignments/${clientPhone}`,
    {
      params: {
        manager_login: managerLogin,
      },
      headers: {
        accept: "application/json",
        "Rosa-Api-Key": process.env.ROSA_API_KEY as string,
      },
    },
  );

  console.log("delete status:", deleteResponse.status());
  console.log("delete response:", await deleteResponse.text());
  expect(deleteResponse.status()).toBe(204);

  // проверить текущую привязку клиента
  const getAfterDeleteResponse = await request.get(
    `https://cc-my-client.stage.contact-center.itlabs.io/assignments/${clientPhone}`,
    {
      headers: {
        accept: "application/json",
        "Rosa-Api-Key": process.env.ROSA_API_KEY as string,
      },
    },
  );

  const getAfterDeleteStatus = getAfterDeleteResponse.status();
  const getAfterDeleteText = await getAfterDeleteResponse.text();
  console.log("get after delete status:", getAfterDeleteStatus);
  console.log("get after delete response:", getAfterDeleteText);

  expect(getAfterDeleteStatus).toBe(404);
  const errorBody = JSON.parse(getAfterDeleteText);
  expect(errorBody.detail).toBe("Привязка не найдена");
});

// https://allure.itlabs.io/project/28/test-cases/7507?treeId=58
test("#7507 запрещено удаление закрепления другим менеджером", async ({
  request,
}) => {
  const clientPhone = "79000003232";
  const managerLogin = "elesmirnova";
  const anotherManager = "mmalyutina";

  const createResponse = await request.post(
    "https://cc-my-client.stage.contact-center.itlabs.io/assignments/",
    {
      headers: {
        accept: "application/json",
        "Rosa-Api-Key": process.env.ROSA_API_KEY as string,
        "Content-Type": "application/json",
      },
      data: {
        client_phone: clientPhone,
        manager_login: managerLogin,
      },
    },
  );

  const createText = await createResponse.text();
  console.log("create status:", createResponse.status());
  console.log("create response:", createText);
  expect([201, 409]).toContain(createResponse.status());

  const getResponse = await request.get(
    `https://cc-my-client.stage.contact-center.itlabs.io/assignments/${clientPhone}`,
    {
      headers: {
        accept: "application/json",
        "Rosa-Api-Key": process.env.ROSA_API_KEY as string,
      },
    },
  );

  const getStatus = getResponse.status();
  const getText = await getResponse.text();
  console.log("get status:", getStatus);
  console.log("get response:", getText);

  expect(getStatus).toBe(200);

  const body = JSON.parse(getText);
  expect(body.client_phone).toBe(clientPhone);
  expect(body.manager_login.toLowerCase()).toBe(managerLogin.toLowerCase());
  expect(body.is_active).toBe(true);
  expect(body.assigned_at).toBeTruthy();

  const deleteResponse = await request.delete(
    `https://cc-my-client.stage.contact-center.itlabs.io/assignments/${clientPhone}`,
    {
      headers: {
        accept: "application/json",
        "Rosa-Api-Key": process.env.ROSA_API_KEY as string,
      },
      params: {
        manager_login: anotherManager,
      },
    },
  );

  const deleteStatus = deleteResponse.status();
  const deleteBody = await deleteResponse.json();

  console.log("delete status:", deleteStatus);
  console.log("delete response:", deleteBody);

  expect(deleteStatus).toBe(403);
  expect(deleteBody.detail).toBe(
    "Только привязанный менеджер может отвязать клиента",
  );
});
