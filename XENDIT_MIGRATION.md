# Migrasi dari Midtrans ke Xendit

Dokumen ini menjelaskan langkah-langkah migrasi payment gateway dari Midtrans ke Xendit.

## 🔄 Perubahan Utama

### 1. Dependencies

- **Dihapus:** `midtrans-client`
- **Ditambahkan:** `xendit-node`

### 2. Environment Variables

**Sebelum (Midtrans):**

```env
MIDTRANS_SERVER_KEY="your_midtrans_server_key"
MIDTRANS_CLIENT_KEY="your_midtrans_client_key"
MIDTRANS_IS_PRODUCTION="false"
```

**Sekarang (Xendit):**

```env
XENDIT_API_KEY="xnd_development_your_api_key_here"
XENDIT_WEBHOOK_TOKEN="your_webhook_verification_token_here"
FRONTEND_URL="http://localhost:3000"
```

### 3. Database Schema

**Perubahan di Payment Model:**

```prisma
model Payment {
  // Sebelum:
  midtrans_order_id  String    @unique
  payment_type       String?

  // Sekarang:
  xendit_invoice_id  String    @unique
  payment_method     String?
}
```

### 4. API Response Changes

**Sebelum (Midtrans):**

```typescript
{
  snap_token: string;
  redirect_url: string;
  transaction_id: string;
}
```

**Sekarang (Xendit):**

```typescript
{
  invoice_url: string; // URL untuk pembayaran
  invoice_id: string; // Xendit Invoice ID
  transaction_id: string; // Internal transaction ID
}
```

## 📋 Langkah Instalasi

### 1. Update Dependencies

```bash
cd Backend
npm install xendit-node@^5.0.0
npm uninstall midtrans-client
```

### 2. Generate Prisma Client

Setelah mengubah schema, generate ulang Prisma client:

```bash
npx prisma generate
npx prisma db push
```

### 3. Setup Xendit Account

1. Daftar akun di [Xendit Dashboard](https://dashboard.xendit.co/)
2. Dapatkan API Key dari menu **Settings > Developers > API Keys**
3. Generate Webhook Token untuk verifikasi callback
4. Copy API Key dan Webhook Token ke file `.env`

### 4. Update Environment Variables

Buat atau update file `.env`:

```env
# Xendit Configuration
XENDIT_API_KEY="xnd_development_your_actual_api_key"
XENDIT_WEBHOOK_TOKEN="your_actual_webhook_token"
FRONTEND_URL="http://localhost:3000"
```

**Catatan:**

- API Key development dimulai dengan `xnd_development_`
- API Key production dimulai dengan `xnd_production_`

### 5. Setup Webhook di Xendit Dashboard

1. Login ke [Xendit Dashboard](https://dashboard.xendit.co/)
2. Pergi ke **Settings > Webhooks**
3. Tambah webhook URL: `https://your-domain.com/api/payment/webhook`
4. Pilih event: **Invoice Paid**
5. Set verification token (sama dengan `XENDIT_WEBHOOK_TOKEN` di `.env`)

## 🔧 Testing

### Test Koneksi Xendit

```bash
# Endpoint untuk test konfigurasi
GET /api/payment/test-config
```

Response sukses:

```json
{
  "success": true,
  "message": "Xendit configuration test completed",
  "data": {
    "configured": true,
    "environment": "development",
    "api_key_prefix": "xnd_development...",
    "validation": "API Key format is valid"
  }
}
```

### Test Create Invoice

```bash
POST /api/payment/test-invoice
Content-Type: application/json

{
  "amount": 50000,
  "customer_name": "Test Customer",
  "customer_email": "test@example.com",
  "customer_phone": "+628123456789"
}
```

Response sukses:

```json
{
  "success": true,
  "message": "Test invoice created successfully",
  "data": {
    "external_id": "TEST-ORDER-1234567890",
    "invoice_id": "inv_123abc...",
    "invoice_url": "https://checkout.xendit.co/web/inv_123abc...",
    "message": "Test invoice created successfully. Use invoice_url for payment."
  }
}
```

## 🔄 Alur Pembayaran Baru

### 1. Create Payment

**Request:**

```bash
POST /api/payment/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "checkout_id": "your_checkout_id"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Payment created successfully",
  "data": {
    "invoice_url": "https://checkout.xendit.co/web/inv_xxx",
    "invoice_id": "inv_xxx",
    "transaction_id": "payment_record_id"
  }
}
```

### 2. Redirect User

Frontend harus redirect user ke `invoice_url` untuk melakukan pembayaran.

```typescript
// Frontend code example
const response = await createPayment(checkoutId);
window.location.href = response.data.invoice_url;
```

### 3. Webhook Callback

Setelah pembayaran selesai, Xendit akan mengirim callback ke webhook endpoint:

```
POST /api/payment/webhook
x-callback-token: your_webhook_token
```

Payload yang diterima:

```json
{
  "id": "inv_123abc",
  "external_id": "ORDER-checkout123-1234567890",
  "status": "PAID",
  "amount": 150000,
  "paid_amount": 150000,
  "paid_at": "2024-01-01T10:00:00.000Z",
  "payment_method": "BANK_TRANSFER",
  "payment_channel": "BCA",
  "payer_email": "customer@example.com"
}
```

### 4. Order Status Update

Setelah webhook diterima:

- Payment status → `paid`
- Checkout status → `paid`
- Order status → `processed`
- Cart items → cleared
- Product stock → dikurangi

## 🆚 Perbedaan dengan Midtrans

| Aspek                    | Midtrans                   | Xendit                 |
| ------------------------ | -------------------------- | ---------------------- |
| **Integration**          | Snap Popup                 | Invoice URL Redirect   |
| **Client Library**       | midtrans-client            | xendit-node            |
| **Payment UI**           | Embedded popup             | External checkout page |
| **Webhook Verification** | SHA512 signature           | Callback token         |
| **Payment Status**       | capture/settlement/pending | PAID/PENDING/EXPIRED   |
| **Frontend Integration** | Snap.js script             | Direct URL redirect    |

## 📱 Frontend Migration

Frontend juga perlu diupdate untuk menggunakan Xendit:

### Sebelum (Midtrans):

```typescript
// Load Snap.js
<script src="https://app.sandbox.midtrans.com/snap/snap.js"></script>;

// Open payment popup
window.snap.pay(snapToken);
```

### Sekarang (Xendit):

```typescript
// No script needed, just redirect
window.location.href = invoiceUrl;
```

## ⚠️ Migration Checklist

- [ ] Update `package.json` (install xendit-node, uninstall midtrans-client)
- [ ] Update Prisma schema (midtrans_order_id → xendit_invoice_id)
- [ ] Update `.env` file dengan Xendit credentials
- [ ] Run `npx prisma generate` dan `npx prisma db push`
- [ ] Update payment service logic
- [ ] Update payment types/interfaces
- [ ] Setup webhook di Xendit Dashboard
- [ ] Test payment flow (create, webhook, status)
- [ ] Update frontend integration
- [ ] Remove Midtrans script dari frontend
- [ ] Update dokumentasi

## 🐛 Troubleshooting

### Error: "XENDIT_API_KEY is not configured"

**Solusi:** Pastikan file `.env` berisi `XENDIT_API_KEY` yang valid.

### Error: "Invalid callback token"

**Solusi:**

1. Set `XENDIT_WEBHOOK_TOKEN` di `.env`
2. Set token yang sama di Xendit Dashboard webhook settings
3. Restart server setelah update `.env`

### Payment tidak update status

**Solusi:**

1. Cek webhook URL sudah terdaftar di Xendit Dashboard
2. Pastikan webhook URL bisa diakses public (gunakan ngrok untuk local testing)
3. Cek logs di Xendit Dashboard > Webhooks > Logs

### Testing di Local

Untuk test webhook di local development:

1. Install ngrok: `npm install -g ngrok`
2. Run ngrok: `ngrok http 8686`
3. Copy HTTPS URL dari ngrok
4. Set webhook URL di Xendit: `https://your-ngrok-url.ngrok.io/api/payment/webhook`

## 📚 Resources

- [Xendit API Documentation](https://developers.xendit.co/api-reference/)
- [Xendit Invoice API](https://developers.xendit.co/api-reference/#create-invoice)
- [Xendit Webhook Guide](https://developers.xendit.co/api-reference/#invoice-callback)
- [Xendit Node.js SDK](https://github.com/xendit/xendit-node)

## 💡 Best Practices

1. **Gunakan environment variables** untuk semua credentials
2. **Verifikasi webhook signature** di production
3. **Log semua payment notifications** untuk audit trail
4. **Handle semua payment status** (PAID, EXPIRED, PENDING)
5. **Set proper timeout** untuk invoice (default: 24 jam)
6. **Test payment flow** di sandbox sebelum production
7. **Monitor webhook logs** di Xendit Dashboard

## 🔒 Security

1. Jangan commit file `.env` ke Git
2. Gunakan HTTPS untuk webhook URL di production
3. Validasi callback token di webhook endpoint
4. Simpan webhook verification token dengan aman
5. Rotate API key secara berkala
6. Monitor suspicious payment activities

---

**Migrasi berhasil!** 🎉
