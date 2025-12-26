# 🛍️ DealDrop

A smart price tracking application that monitors product prices across e-commerce platforms and notifies you when prices drop below your target.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react)
![Supabase](https://img.shields.io/badge/Supabase-Enabled-green?style=flat-square&logo=supabase)

## 📸 Screenshot

![DealDrop Home](.github/screenShot/home.png)

## ✨ Features

- **Lightning Fast** - Extracts prices in seconds using Firecrawl, handling JavaScript and dynamic content
- **Always Reliable** - Works across all major e-commerce sites with built-in anti-bot protection
- **Smart Alerts** - Get email notifications instantly when prices drop below your target
- **Price History** - Visual charts to track price trends over time
- **Automated Monitoring** - Cron jobs automatically check prices at regular intervals
- **Secure Authentication** - User authentication powered by Supabase

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Web Scraping**: [Firecrawl](https://firecrawl.dev/)
- **Email Service**: [Resend](https://resend.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **UI Components**: [Radix UI](https://radix-ui.com/) + [Lucide Icons](https://lucide.dev/)

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Supabase account and project
- A Firecrawl API key
- A Resend API key for email notifications
- (Optional) A cron job service for automated price checks

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/dealdrop.git
   cd dealdrop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # Firecrawl
   FIRECRAWL_API_KEY=your_firecrawl_api_key

   # Resend (Email)
   RESEND_API_KEY=your_resend_api_key

   # Cron Secret (for automated price checks)
   CRON_SECRET=your_secure_random_string
   ```

4. **Set up Supabase Database**
   
   Create the following table in your Supabase project:
   ```sql
   create table product (
     id uuid default gen_random_uuid() primary key,
     user_id uuid references auth.users not null,
     url text not null,
     product_name text not null,
     current_price numeric not null,
     target_price numeric,
     image_url text,
     price_history jsonb default '[]'::jsonb,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null,
     updated_at timestamp with time zone default timezone('utc'::text, now()) not null
   );

   -- Enable Row Level Security
   alter table product enable row level security;

   -- Create policies
   create policy "Users can view their own products"
     on product for select
     using (auth.uid() = user_id);

   create policy "Users can insert their own products"
     on product for insert
     with check (auth.uid() = user_id);

   create policy "Users can update their own products"
     on product for update
     using (auth.uid() = user_id);

   create policy "Users can delete their own products"
     on product for delete
     using (auth.uid() = user_id);
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📱 Usage

1. **Sign In** - Create an account or sign in using Supabase authentication
2. **Add Product** - Paste any product URL from supported e-commerce sites
3. **Set Target Price** - (Optional) Set a target price for alerts
4. **Monitor** - DealDrop will automatically track price changes
5. **Get Notified** - Receive email alerts when prices drop below your target

## 🔄 Automated Price Checking

The app includes a cron endpoint at `/api/cron/check-price` that automatically checks all tracked products.

**To set up automated checks:**

1. Use a cron service like [Vercel Cron](https://vercel.com/docs/cron-jobs), [EasyCron](https://easycron.com/), or [cron-job.org](https://cron-job.org/)

2. Configure a POST request to:
   ```
   https://your-domain.com/api/cron/check-price
   ```

3. Add the authorization header:
   ```
   Authorization: Bearer YOUR_CRON_SECRET
   ```

4. Set your desired schedule (e.g., every 6 hours)

## 📁 Project Structure

```
dealdrop/
├── app/
│   ├── action.js              # Server actions
│   ├── page.jsx               # Home page
│   ├── layout.js              # Root layout
│   └── api/
│       ├── auth/
│       │   └── callback/      # Auth callback
│       └── cron/
│           └── check-price/   # Price monitoring cron
├── components/
│   ├── AddProductForm.jsx     # Product URL input form
│   ├── AuthButton.jsx         # Authentication button
│   ├── Authmodel.js           # Auth modal
│   ├── PriceChart.jsx         # Price history chart
│   ├── ProductCard.jsx        # Product display card
│   └── ui/                    # Reusable UI components
├── lib/
│   ├── email.js               # Email service
│   ├── firecrawl.js           # Web scraping utilities
│   └── utils.js               # Helper functions
└── utils/
    └── supabase/              # Supabase client configs
```

## 🎨 UI Components

The project uses [shadcn/ui](https://ui.shadcn.com/) components built with Radix UI and Tailwind CSS:
- Alert, Badge, Button, Card, Dialog, Input, Sonner (toast notifications)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Firecrawl](https://firecrawl.dev/) for reliable web scraping
- [Supabase](https://supabase.com/) for backend infrastructure
- [Vercel](https://vercel.com/) for hosting
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components

## 📧 Support

For support, email your-email@example.com or open an issue in the repository.
