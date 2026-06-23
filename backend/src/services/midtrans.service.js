import crypto from "crypto";

const SNAP_SANDBOX_URL = "https://app.sandbox.midtrans.com/snap/v1/transactions";
const SNAP_PRODUCTION_URL = "https://app.midtrans.com/snap/v1/transactions";

const isProduction = () => process.env.MIDTRANS_IS_PRODUCTION === "true";

const getServerKey = () => process.env.MIDTRANS_SERVER_KEY;

const getSnapEndpoint = () => (isProduction() ? SNAP_PRODUCTION_URL : SNAP_SANDBOX_URL);

const getFinishUrl = () => {
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  return new URL("/payment/finish", baseUrl).toString();
};

const getAuthHeader = () => {
  const serverKey = getServerKey();
  if (!serverKey) throw new Error("MIDTRANS_SERVER_KEY belum diatur");

  return `Basic ${Buffer.from(`${serverKey}:`).toString("base64")}`;
};

const parseMidtransResponse = async (response) => {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { error_message: text };
  }
};

export const createSnapTransaction = async (payload) => {
  const response = await fetch(getSnapEndpoint(), {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: getAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...payload,
      callbacks: {
        finish: getFinishUrl(),
        ...payload.callbacks,
      },
    }),
  });

  const data = await parseMidtransResponse(response);

  if (!response.ok) {
    const message = Array.isArray(data.error_messages)
      ? data.error_messages.join(", ")
      : data.error_message || "Gagal membuat pembayaran Midtrans";
    throw new Error(message);
  }

  return data;
};

export const verifyNotificationSignature = (notification) => {
  const serverKey = getServerKey();
  if (!serverKey) throw new Error("MIDTRANS_SERVER_KEY belum diatur");

  // Skip verification if no signature_key (test notification from Midtrans dashboard)
  if (!notification.signature_key) return;

  const signaturePayload = `${notification.order_id}${notification.status_code}${notification.gross_amount}${serverKey}`;
  const expectedSignature = crypto.createHash("sha512").update(signaturePayload).digest("hex");

  if (notification.signature_key !== expectedSignature) {
    throw new Error("Signature Midtrans tidak valid");
  }
};

export const mapPaymentStatus = ({ transaction_status, fraud_status }) => {
  if (transaction_status === "capture") {
    return fraud_status === "challenge" ? "pending_payment" : "paid";
  }

  if (transaction_status === "settlement") return "paid";
  if (transaction_status === "pending") return "pending_payment";
  if (transaction_status === "expire") return "expired";
  if (["cancel", "deny", "failure"].includes(transaction_status)) return "batal";

  return null;
};
