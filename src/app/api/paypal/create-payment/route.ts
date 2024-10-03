// app/api/paypal/create-payment/route.ts
import { NextResponse } from 'next/server';

const PAYPAL_API_URL = "https://api-m.sandbox.paypal.com/v1/payments/payment"; // Use sandbox for testing
const CLIENT_ID = 'Ae-2yKyLRiIAZ3jVjDzd1YS88yhj_YQHoUG_f9yptHZ2tJRbfTO-WEd31_aSjfNB_xIEAX3MKfnHn5OT'; // Your PayPal Client ID
const SECRET_KEY = 'EHB804GSkmBSKlVJk5se0Ghxtey7goYmpjcXdDGbsRdRAGt_E3TE5ru1WY-tf_2QMgl_goxRPleWxiWo'; // Your PayPal Secret Key

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();

    // Create a payment object for PayPal
    const paymentData = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      transactions: [{
        amount: {
          total: amount,
          currency: "USD", // Change currency as needed
        },
        description: "Donation",
      }],
      redirect_urls: {
        return_url: "http://localhost:3000/dashboard/payment/success", // Change to your success URL
        cancel_url: "http://localhost:3000/dashboard/payment/cancel", // Change to your cancel URL
      },
    };

    // Authenticate with PayPal API
    const auth = Buffer.from(`${CLIENT_ID}:${SECRET_KEY}`).toString('base64');

    const response = await fetch(PAYPAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
      },
      body: JSON.stringify(paymentData),
    });

    const data = await response.json();

    if (response.ok) {
      // Find approval URL and return it
      const approvalUrl = data.links.find((link: { rel: string; }) => link.rel === 'approval_url');
      return NextResponse.json({ approvalUrl: approvalUrl.href });
    } else {
      return NextResponse.json({ error: data.message }, { status: response.status });
    }
  } catch (error) {
    console.error('Error creating PayPal payment:', error);
    return NextResponse.json({ error: 'Error creating PayPal payment' }, { status: 500 });
  }
}