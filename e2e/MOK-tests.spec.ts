import { label, feature } from "allure-js-commons";
import {
  createAppeal,
  deleteAllPositions,
  createOrder,
} from "../helpers/commands";
import { AppealStartPage } from "../pages/appeal/AppealStartPage";
import { OrderCreatePage } from "../pages/order/OrderCreatePage";
import { test, expect } from "@playwright/test";

// test(
//   "#5301 Создание нового заказа, после закрытия старого заказа и возврата в поиск",
//   { tag: ["@regress"] },
//   async ({ page }) => {
//     label("tag", "regress");
//     feature("Auth");

//     const { page: page1, phoneNumber } = await createOrder(page, {
//       makeOrder: true,
//       searchText: "цемент",
//       quantity: 1,
//     });

//     await page1.route(
//       "**/api/sapApi/api/cerebro/v1/orders/**",
//       async (route) => {
//         const request = route.request();
//         const method = request.method();

//         if (method !== "PUT") {
//           await route.continue();
//           return;
//         }

//         let postData: any = request.postDataJSON?.() ?? undefined;

//         if (postData && typeof postData === "object") {
//           postData.orderStatus = "Полностью оплачен";

//           if (postData.payment && typeof postData.payment === "object") {
//             postData.payment.status = "Полностью оплачен";
//           }
//         }

//         const response = await route.fetch({
//           postData: postData ? JSON.stringify(postData) : undefined,
//           headers: {
//             ...request.headers(),
//             "content-type": "application/json",
//           },
//         });

//         const body = await response.json();

//         if (body && typeof body === "object") {
//           body.orderStatus = "Полностью оплачен";

//           if (body.payment && typeof body.payment === "object") {
//             body.payment.status = "Полностью оплачен";
//           }
//         }

//         await route.fulfill({
//           response,
//           json: body,
//         });
//       },
//     );

//     const appealStartPage = new AppealStartPage(page1);
//     const orderCreatePage = new OrderCreatePage(page1);

//     // await deleteAllPositions(page1);
//   },
// );
