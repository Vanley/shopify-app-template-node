import { DeliveryMethod } from "@shopify/shopify-api";
import shops from "../prisma/database/shops.js";
import shopify from "../shopify.js";

async function uninstall(shop: string) {
  console.log("Event: Uninstall on shop", shop);

  await shops.updateShop({
    shop,
    isInstalled: false,
    uninstalledAt: new Date(),
    subscription: {
      update: {
        active: false,
      },
    },
  });

  // analytics.track({
  //   event: "uninstall",
  //   userId: shop,
  // });
}

export default async function addUninstallWebhookHandler() {
  console.log("Registering webhook for uninstall app");

  await shopify.api.webhooks.addHandlers({
    APP_UNINSTALLED: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: "/api/webhooks",
      callback: async (topic: string, shop: string) => {
        await uninstall(shop);
      },
    },
  });
}
