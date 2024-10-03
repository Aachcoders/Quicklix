"use client";

import React, { useState } from 'react';

const PaymentPage: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handlePayment = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setErrorMessage('Please enter a valid amount.');
      return;
    }

    // Redirect to PayPal payment page
    const response = await fetch('/api/paypal/create-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    });

    const data = await response.json();

    if (response.ok) {
      // Redirect to PayPal approval URL
      window.location.href = data.approvalUrl;
    } else {
      setErrorMessage(data.error || 'An error occurred while creating the payment.');
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <h2 className="text-3xl font-bold text-center mb-4">Support Us</h2>
      <p className="text-center mb-6">Enter the amount you would like to donate:</p>
      
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
        className="border rounded p-2 w-full mb-4"
      />
      
      {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

      <button
        onClick={handlePayment}
        className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
      >
        Donate with PayPal
      </button>
    </div>
  );
};

export default PaymentPage;