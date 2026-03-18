// import { test, expect } from "@playwright/test";
// import { label, feature } from "allure-js-commons";

// test(
//   "Получить текст приветствия через GET /v1/crm/greeting",
//   { tag: ["@api", "@smoke"] },
//   async ({ page }) => {
//     label("tag", "api");
//     label("tag", "smoke");
//     feature("CRM API");

//     await page.goto("https://test.pas.sdvor.com/api/cerebro/swagger.html#/crm");

//     const result = await page.evaluate(async () => {
//       const res = await fetch(
//         "https://test.pas.sdvor.com/api/cerebro/v1/crm/greeting?phone=%2B79000000033&operator=elesmirnova",
//         {
//           method: "GET",
//           headers: {
//             accept: "application/json",
//             "x-app-client": "cerebro",
//             "x-token": "elesmirnova",
//           },
//           credentials: "include",
//         }
//       );

//       return {
//         status: res.status,
//         contentType: res.headers.get("content-type"),
//         text: await res.text(),
//       };
//     });

//     console.log("status:", result.status);
//     console.log("content-type:", result.contentType);
//     console.log("body:", result.text);

//     expect(result.status, `Response body: ${result.text}`).toBe(200);
//     expect(result.text, "Expected JSON, got HTML").not.toContain("<html");

//     const body = JSON.parse(result.text);
//     expect(body.apiVersion).toBeDefined();
//     expect(body.data).toBeDefined();
//     expect(body.data.message).toBeDefined();
//     expect(body.data.client).toBeDefined();
//     expect(body.data.operator).toBeDefined();
//   }
// );