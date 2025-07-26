export const sendSms = async (
  recipient: string | string[],
  message: string
): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const senderId = process.env.TEXT_LK_SENDER_ID;
    const apiToken = process.env.TEXT_LK_API_TOKEN;

    if (!senderId || !apiToken) {
      throw new Error("Missing TEXT_LK_SENDER_ID or TEXT_LK_API_TOKEN");
    }

    const recipients = Array.isArray(recipient)
      ? recipient.join(",")
      : recipient;

    const url = `https://app.text.lk/api/http/sms/send?recipient=${recipients}&sender_id=${senderId}&message=${encodeURIComponent(
      message
    )}&api_token=${apiToken}`;

    // console.log("Sending SMS to:", recipients);
    // console.log("Message:", message);
    // console.log("API URL:", url);
    // console.log("Sender ID:", senderId);
    // console.log("Token:", apiToken?.slice(0, 4) + "***");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    } else {
      return {
        success: false,
        error: data?.message || "Failed to send SMS",
        data,
      };
    }
  } catch (error: any) {
    console.error("Error sending SMS:", error.message);
    return { success: false, error: error.message };
  }
};
