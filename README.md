# DealDrop

A smart price tracking application that monitors product prices across e-commerce platforms and notifies you when prices drop below your target.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react)
![Supabase](https://img.shields.io/badge/Supabase-Enabled-green?style=flat-square&logo=supabase)

## Screenshot

![DealDrop Home](.github/screenShot/home.png)

## Features

- **Lightning Fast** - Extracts prices in seconds using Firecrawl, handling JavaScript and dynamic content
- **Always Reliable** - Works across all major e-commerce sites with built-in anti-bot protection
- **Smart Alerts** - Get email notifications instantly when prices drop below your target
- **Price History** - Visual charts to track price trends over time
- **Automated Monitoring** - Cron jobs automatically check prices at regular intervals
- **Secure Authentication** - User authentication powered by Supabase

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Web Scraping**: [Firecrawl](https://firecrawl.dev/)
- **Email Service**: [Resend](https://resend.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **UI Components**: [Radix UI](https://radix-ui.com/) + [Lucide Icons](https://lucide.dev/)

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Supabase account and project
- A Firecrawl API key
- A Resend API key for email notifications
- (Optional) A cron job service for automated price checks

## Installation

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
   
   Run the following SQL in your Supabase SQL Editor:

   ```sql
   -- Create product table
   create table product (
     id uuid default gen_random_uuid() primary key,
     user_id uuid references auth.users not null,
     url text not null,
     name text not null,
     current_price numeric not null,
     currency text default 'USD',
     image_url text,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null,
     updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
     unique(user_id, url)
   );

   -- Create price_history table
   create table price_history (
     id uuid default gen_random_uuid() primary key,
     product_id uuid references product(id) on delete cascade not null,
     price numeric not null,
     currency text default 'USD',
     checked_at timestamp with time zone default timezone('utc'::text, now()) not null
   );

   -- Enable Row Level Security on product table
   alter table product enable row level security;

   -- Create policies for product table
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

   -- Enable Row Level Security on price_history table
   alter table price_history enable row level security;

   -- Create policies for price_history table
   create policy "Users can view price history for their products"
     on price_history for select
     using (
       exists (
         select 1 from product
         where product.id = price_history.product_id
         and product.user_id = auth.uid()
       )
     );
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Sign In** - Create an account or sign in using Supabase authentication
2. **Add Product** - Paste any product URL from supported e-commerce sites
3. **Monitor** - DealDrop will automatically track price changes
4. **View History** - Check price history charts for each product
5. **Get Notified** - Receive email alerts when prices drop (via cron jobs)

## Automated Price Checking

The app includes a cron endpoint at `/api/cron/check-price` that automatically checks all tracked products and sends email alerts when prices drop.

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

The cron endpoint will:
- Check all products in the database
- Update current prices
- Record price changes in the history table
- Send email alerts when prices drop below previous prices

## Project Structure

```
dealdrop/
├── app/
│   ├── action.js              # Server actions (add/delete products, get data)
│   ├── page.jsx               # Home page
│   ├── layout.js              # Root layout
│   └── api/
│       ├── auth/
│       │   └── callback/      # Auth callback route
│       └── cron/
│           └── check-price/   # Price monitoring cron endpoint
├── components/
│   ├── AddProductForm.jsx     # Product URL input form
│   ├── AuthButton.jsx         # Authentication button
│   ├── Authmodel.js           # Auth modal component
│   ├── PriceChart.jsx         # Price history chart component
│   ├── ProductCard.jsx        # Product display card
│   └── ui/                    # Reusable UI components (shadcn/ui)
├── lib/
│   ├── email.js               # Email service (Resend integration)
│   ├── firecrawl.js           # Web scraping utilities (Firecrawl integration)
│   └── utils.js               # Helper functions
└── utils/
    └── supabase/              # Supabase client configurations
        ├── client.js          # Browser client
        ├── server.js          # Server client
        └── middleware.js      # Middleware client
```

## UI Components

The project uses [shadcn/ui](https://ui.shadcn.com/) components built with Radix UI and Tailwind CSS:
- Alert, Badge, Button, Card, Dialog, Input, Sonner (toast notifications)

## API Reference

### Server Actions

- `addProduct(formData)` - Add a new product to track
- `deleteProduct(productId)` - Remove a product from tracking
- `getProducts()` - Get all products for the current user
- `getPriceHistory(productId)` - Get price history for a specific product

### API Endpoints

- `POST /api/cron/check-price` - Cron endpoint for automated price checking
  - Requires `Authorization: Bearer YOUR_CRON_SECRET` header
  - Returns JSON with update statistics

## Troubleshooting

### Firecrawl API Errors

If you encounter errors with product scraping:

1. Verify your `FIRECRAWL_API_KEY` is set correctly in `.env.local`
2. Ensure the product URL is accessible and public
3. Check that the URL is a valid absolute URL (includes protocol: https://)
4. Review the Firecrawl API documentation for any service updates

### Database Connection Issues

1. Verify your Supabase credentials in `.env.local`
2. Ensure all database tables and policies are created correctly
3. Check that Row Level Security policies are properly configured

### Email Notifications Not Sending

1. Verify your `RESEND_API_KEY` is set correctly
2. Check that the Resend API key has sending permissions
3. Ensure email addresses in your database are valid

### Environment Variables Not Loading

1. Ensure `.env.local` is in the root directory
2. Restart your development server after changing environment variables
3. Verify variable names match exactly (case-sensitive)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Firecrawl](https://firecrawl.dev/) for reliable web scraping
- [Supabase](https://supabase.com/) for backend infrastructure
- [Vercel](https://vercel.com/) for hosting
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components

## Support

For support, email your-email@example.com or open an issue in the repository.
