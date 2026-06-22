# 🤝 Helping Hands — Social Service & Donation Platform

A full-stack web application connecting volunteers, donors, and people in need through blood donation, food programs, clothes drives, and volunteer coordination.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| 3D | Three.js + @react-three/fiber |
| Animations | Framer Motion |
| Routing | React Router v6 |
| Backend | Node.js + Express |
| Payments | Razorpay (India) |
| Database | MongoDB (optional) |
| State/Toasts | react-hot-toast |

---

## 📁 Project Structure

```
helping-hands/
├── package.json                  ← Root dev runner
├── README.md
├── backend/
│   ├── package.json
│   ├── server.js                 ← Express server
│   ├── .env.example              ← Environment template
│   └── routes/
│       ├── payments.js           ← Razorpay integration
│       ├── volunteers.js         ← Volunteer registration
│       ├── donations.js          ← Donation recording
│       └── contact.js            ← Contact form
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx               ← Router + Dark mode
        ├── index.css             ← Global styles
        ├── hooks/
        │   └── usePayment.js     ← Razorpay hook
        ├── utils/
        │   └── api.js            ← Axios API client
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   ├── StatsCounter.jsx
        │   ├── Skeleton.jsx
        │   └── Toast.jsx
        └── pages/
            ├── Home.jsx          ← 3D Hero + Programs
            ├── Donate.jsx        ← Blood/Food/Clothes/Money
            ├── Volunteer.jsx     ← Registration form
            ├── Events.jsx        ← Event cards + filter
            ├── Gallery.jsx       ← Masonry + lightbox
            ├── Testimonials.jsx  ← Reviews
            ├── Contact.jsx       ← Form + FAQs
            ├── Dashboard.jsx     ← Donation history
            └── PaymentSuccess.jsx← Confetti + receipt
```

---

## ⚡ Quick Start

### 1. Install Dependencies

```bash
# From root directory
npm run install:all
```

Or manually:
```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```

### 2. Configure Environment

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/helping-hands
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX
FRONTEND_URL=http://localhost:5173
```

> **Note:** The app works in **demo mode** without Razorpay keys — payments are simulated.

### 3. Run Development Servers

```bash
# From root — starts both frontend + backend
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Health check:** http://localhost:5000/api/health

---

## 💳 Razorpay Setup (Test Mode)

1. Sign up at [razorpay.com](https://razorpay.com) (free)
2. Dashboard → Settings → API Keys → Generate Test Keys
3. Add `key_id` and `key_secret` to your `.env`
4. Use test card: `4111 1111 1111 1111`, any future date, any CVV

---

## 🌐 Pages

| Route | Page |
|---|---|
| `/` | Home (3D Hero, Programs, Stats) |
| `/donate` | Donation (Blood/Food/Clothes/Money) |
| `/volunteer` | Volunteer Registration |
| `/events` | Events with filters |
| `/gallery` | Photo gallery + lightbox |
| `/testimonials` | User stories |
| `/contact` | Contact form + FAQs |
| `/dashboard` | Donation history + achievements |
| `/payment-success` | Success page with confetti |

---

## 🔌 API Endpoints

```
GET  /api/health                  — Health check
POST /api/payments/create-order   — Create Razorpay order
POST /api/payments/verify         — Verify payment signature
GET  /api/payments/donations-stats— Platform stats
POST /api/volunteers/register     — Register volunteer
GET  /api/volunteers/count        — Volunteer count
POST /api/donations/record        — Record donation
GET  /api/donations/history       — Donation history
POST /api/contact/send            — Send contact message
```

---

## 🎨 Features

- ✅ **3D animated hero** with Three.js floating sphere
- ✅ **Particle background** canvas animation
- ✅ **Dark mode** (toggle + localStorage persistence)
- ✅ **Razorpay payment** with demo fallback
- ✅ **Multi-step donation flow** (select → details → pay)
- ✅ **Form validation** on all forms
- ✅ **Skeleton loaders** for loading states
- ✅ **Confetti animation** on payment success
- ✅ **Masonry gallery** with lightbox
- ✅ **Animated counters** on scroll
- ✅ **Toast notifications** 
- ✅ **Fully responsive** (mobile + tablet + desktop)
- ✅ **Framer Motion** animations throughout

---

## 🚀 Production Build

```bash
# Build frontend
cd frontend && npm run build

# The dist/ folder is ready for deployment to:
# - Vercel, Netlify, AWS S3, Firebase Hosting
```

---

## 📞 Support

Email: hello@helpinghands.org.in  
