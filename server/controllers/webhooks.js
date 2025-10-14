import { YooCheckout } from '@a2seven/yoo-checkout';

const checkout = new YooCheckout({ shopId: process.env.YOOKASSA_SHOP_ID, secretKey: process.env.YOOKASSA_SECRET_KEY});
try {
    const webHookList = await checkout.getWebHookList();
    console.log(webHookList)
} catch (error) {
     console.error(error);
}