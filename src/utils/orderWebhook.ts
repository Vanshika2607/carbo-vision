
export interface OrderData {
    user_name: string;
    user_email: string | null;
    user_phone: string;
    shipping_address: string;
    city: string;
    state: string;
    pincode: string;
    total_amount: number;
    items: any[];
    payment_method?: string;
    payment_status?: string;
    order_status?: string;
    payment_id?: string;
}

const GOOGLE_SHEET_ORDER_WEB_APP_URL =
    "https://script.google.com/macros/s/AKfycbwRw9UoocUrMz528g5ZdSLCHyYrot8MwzMs1uMHthFCiM9FCiJEb6mpWCzb445U7fZbqA/exec";

export const postOrderToGoogleSheet = async (orderData: OrderData): Promise<boolean> => {
    try {
        const response = await fetch(GOOGLE_SHEET_ORDER_WEB_APP_URL, {
            method: "POST",
            body: JSON.stringify(orderData),
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            },
        });

        return response.ok;
    } catch (error) {
        console.error("Error saving order to Google Sheets:", error);
        return false;
    }
};
