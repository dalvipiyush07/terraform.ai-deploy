# Paytm Payment Gateway Integration Guide

## Backend Code (Add to server.js)

```javascript
const PaytmChecksum = require('paytmchecksum');
const axios = require('axios');

// Paytm Config
const PAYTM = {
  mid: process.env.PAYTM_MID,
  key: process.env.PAYTM_MERCHANT_KEY,
  website: process.env.PAYTM_WEBSITE || 'WEBSTAGING',
  baseUrl: process.env.PAYTM_MODE === 'PROD' 
    ? 'https://securegw.paytm.in' 
    : 'https://securegw-stage.paytm.in'
};

// 1. Initiate Transaction (Get Token)
app.post('/api/paytm/initiate', authMiddleware, async (req, res) => {
  try {
    const { plan } = req.body;
    const user = await findUser({ id: req.userId });
    
    const amounts = {
      MONTHLY: '99.00',
      SIXMONTHS: '499.00',
      YEARLY: '999.00'
    };
    
    const orderId = `ORD${Date.now()}`;
    
    const paytmParams = {
      body: {
        requestType: 'Payment',
        mid: PAYTM.mid,
        websiteName: PAYTM.website,
        orderId: orderId,
        callbackUrl: `${process.env.BACKEND_URL}/api/paytm/callback`,
        txnAmount: {
          value: amounts[plan],
          currency: 'INR'
        },
        userInfo: {
          custId: `USER${req.userId}`
        }
      }
    };
    
    const checksum = await PaytmChecksum.generateSignature(
      JSON.stringify(paytmParams.body),
      PAYTM.key
    );
    
    paytmParams.head = { signature: checksum };
    
    // Call Paytm API
    const response = await axios.post(
      `${PAYTM.baseUrl}/theia/api/v1/initiateTransaction?mid=${PAYTM.mid}&orderId=${orderId}`,
      paytmParams,
      { headers: { 'Content-Type': 'application/json' } }
    );
    
    if (response.data.body.resultInfo.resultStatus === 'S') {
      // Save payment info
      const payments = await readDB('payments') || [];
      payments.push({
        orderId,
        userId: req.userId,
        plan,
        amount: amounts[plan],
        status: 'PENDING',
        createdAt: new Date().toISOString()
      });
      await writeDB('payments', payments);
      
      res.json({
        success: true,
        token: response.data.body.txnToken,
        orderId: orderId,
        amount: amounts[plan],
        mid: PAYTM.mid
      });
    } else {
      res.status(400).json({ error: 'Transaction initiation failed' });
    }
  } catch (err) {
    console.error('Paytm Error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Payment failed' });
  }
});

// 2. Payment Callback
app.post('/api/paytm/callback', async (req, res) => {
  try {
    const paytmChecksum = req.body.CHECKSUMHASH;
    delete req.body.CHECKSUMHASH;
    
    const isVerified = PaytmChecksum.verifySignature(
      req.body,
      PAYTM.key,
      paytmChecksum
    );
    
    if (isVerified && req.body.STATUS === 'TXN_SUCCESS') {
      const orderId = req.body.ORDERID;
      
      // Get payment
      const payments = await readDB('payments') || [];
      const paymentIndex = payments.findIndex(p => p.orderId === orderId);
      
      if (paymentIndex !== -1) {
        const payment = payments[paymentIndex];
        
        // Update payment status
        payments[paymentIndex].status = 'SUCCESS';
        payments[paymentIndex].txnId = req.body.TXNID;
        await writeDB('payments', payments);
        
        // Upgrade user
        const users = await readDB('users');
        const userIndex = users.findIndex(u => u.id === payment.userId);
        
        if (userIndex !== -1) {
          const now = new Date();
          let expiryDate;
          
          if (payment.plan === 'MONTHLY') {
            expiryDate = new Date(now.setMonth(now.getMonth() + 1));
          } else if (payment.plan === 'SIXMONTHS') {
            expiryDate = new Date(now.setMonth(now.getMonth() + 6));
          } else if (payment.plan === 'YEARLY') {
            expiryDate = new Date(now.setFullYear(now.getFullYear() + 1));
          }
          
          users[userIndex].plan = payment.plan;
          users[userIndex].planExpiry = expiryDate.toISOString();
          await writeDB('users', users);
          
          console.log(`✅ Payment Success: User ${payment.userId} upgraded to ${payment.plan}`);
        }
      }
      
      res.redirect(`${process.env.FRONTEND_URL}?payment=success&plan=${payments[paymentIndex].plan}`);
    } else {
      res.redirect(`${process.env.FRONTEND_URL}?payment=failed`);
    }
  } catch (err) {
    console.error('Callback Error:', err);
    res.redirect(`${process.env.FRONTEND_URL}?payment=error`);
  }
});

// 3. Check Payment Status
app.post('/api/paytm/status', authMiddleware, async (req, res) => {
  try {
    const { orderId } = req.body;
    
    const paytmParams = {
      body: {
        mid: PAYTM.mid,
        orderId: orderId
      }
    };
    
    const checksum = await PaytmChecksum.generateSignature(
      JSON.stringify(paytmParams.body),
      PAYTM.key
    );
    
    paytmParams.head = { signature: checksum };
    
    const response = await axios.post(
      `${PAYTM.baseUrl}/v3/order/status`,
      paytmParams,
      { headers: { 'Content-Type': 'application/json' } }
    );
    
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Status check failed' });
  }
});
```

## Frontend Code (Update PricingPage.tsx)

```typescript
const handleUpgrade = async () => {
  setShowPayment(true);
};

// In payment section, replace the verify button code:
<button
  onClick={async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Step 1: Initiate transaction
      const response = await fetch('http://localhost:5000/api/paytm/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ plan: plans[selectedPlan].apiPlan })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Step 2: Redirect to Paytm
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://securegw-stage.paytm.in/theia/api/v1/showPaymentPage?mid=' + data.mid + '&orderId=' + data.orderId;
        
        const tokenInput = document.createElement('input');
        tokenInput.type = 'hidden';
        tokenInput.name = 'txnToken';
        tokenInput.value = data.token;
        form.appendChild(tokenInput);
        
        document.body.appendChild(form);
        form.submit();
      } else {
        alert('Payment initiation failed');
      }
    } catch (err) {
      alert('Payment failed. Please try again.');
    }
  }}
  className="w-full py-4 rounded-xl font-bold text-lg text-white transition-all duration-200 hover:scale-105"
  style={{ backgroundColor: '#FF9900', boxShadow: '0 4px 16px rgba(255, 153, 0, 0.4)' }}
>
  Pay with Paytm
</button>
```

## Handle Payment Response (Add to App.tsx)

```typescript
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const paymentStatus = params.get('payment');
  const plan = params.get('plan');
  
  if (paymentStatus === 'success') {
    alert(`Payment successful! Your ${plan} plan is now active.`);
    window.location.href = '/';
  } else if (paymentStatus === 'failed') {
    alert('Payment failed. Please try again.');
    window.location.href = '/';
  }
}, []);
```

## Testing

**Test Mode:**
- Use staging credentials from Paytm Dashboard
- Test Card: 4111111111111111
- CVV: 123
- OTP: 489871

**Production:**
1. Get production credentials from Paytm Dashboard
2. Update .env: `PAYTM_MODE=PROD`
3. Update website: `PAYTM_WEBSITE=DEFAULT`
4. SSL certificate mandatory

## Flow

```
User clicks "Upgrade Plan"
    ↓
Frontend calls /api/paytm/initiate
    ↓
Backend gets txnToken from Paytm
    ↓
Frontend redirects to Paytm payment page
    ↓
User completes payment (UPI/Card/Wallet)
    ↓
Paytm calls /api/paytm/callback
    ↓
Backend verifies & upgrades user
    ↓
User redirected back with success message
```
