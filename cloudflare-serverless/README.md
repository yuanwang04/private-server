# Cloudflare Access & Serverless

## Overview
This solution provides a highly scalable and secure approach by leveraging Cloudflare's edge network. A registered domain is placed behind Cloudflare Access, ensuring that only authenticated users can access the underlying services. 

## Architecture
1. **Cloudflare Domain:** Required to route traffic.
2. **Cloudflare Access:** Acts as an identity-aware proxy. You can define a list of allowed emails or use SSO providers. It is free for up to 50 users.
3. **Serverless Compute:** Traffic is forwarded to a serverless backend. Options include:
   - Cloudflare Workers
   - AWS Lambda
   - GCP CloudRun
4. **Database:** The serverless worker interacts with a managed database, such as Supabase (which offers a generous free tier).

## Setup Instructions
1. **Domain Registration:** Ensure your domain's DNS is managed by Cloudflare.
2. **Configure Zero Trust:** Go to the Cloudflare Zero Trust dashboard and create an Application for your domain (e.g., `app.yourdomain.com`). Define policies to allow specific users.
3. **Deploy Worker:** Deploy your logic to your chosen serverless provider. For Cloudflare Workers, you can use the `wrangler` CLI.
4. **Database Integration:** Provide your worker with the necessary connection strings/secrets to communicate with Supabase.

## Agent Deployment Skills
*(Deployment scripts and tools will be placed in the `/skills` directory to automate the creation of Cloudflare Access policies and Worker deployments).*
