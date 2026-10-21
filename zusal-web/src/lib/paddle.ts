type PaddleClient = {
  Environment: { set(value: "sandbox"): void };
  Initialize(options: { token: string }): void;
  Checkout: { open(options: { transactionId: string }): void };
};
declare global {
  interface Window {
    Paddle?: PaddleClient;
  }
}
let ready: Promise<PaddleClient> | undefined;
export async function openCheckout(transactionId: string) {
  if (!/^txn_[a-z0-9]+$/.test(transactionId))
    throw new Error("Invalid checkout transaction.");
  if (!ready)
    ready = new Promise<PaddleClient>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
      script.onload = () => {
        const paddle = window.Paddle;
        if (!paddle) {
          ready = undefined;
          reject(new Error("Checkout could not load."));
          return;
        }
        if (import.meta.env.PUBLIC_PADDLE_ENV !== "live")
          paddle.Environment.set("sandbox");
        paddle.Initialize({
          token: import.meta.env.PUBLIC_PADDLE_CLIENT_TOKEN,
        });
        resolve(paddle);
      };
      script.onerror = () => {
        ready = undefined;
        script.remove();
        reject(new Error("Checkout could not load. Please retry."));
      };
      document.head.append(script);
    });
  (await ready).Checkout.open({ transactionId });
}
