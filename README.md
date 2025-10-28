# Fantasy Football Assistant Manager Frontend

### Contributors: Eric, Noah, Temi, Zac

## Table of Contents

- [Project Overview](#project-overview)
- [Setup & Installation](#setup--installation)
- [Testing](#testing)

## Project Overview

This is the research project demo version of the frontend for our fantasy football assistant manager app. The repo for the backend can be found here:
https://github.com/EricNohara/Fantasy-Football-Assistant-Manager-Backend/  
The overall details of the project and the greater part of the project code can be found in the backend README. At this stage, the frontend serves only to test Stripe UI elements and the Stripe payment flow.

## Setup & Installation

The frontend and backend code can be downloaded from this repository and  
https://github.com/EricNohara/Fantasy-Football-Assistant-Manager-Backend/  
respectively. On downloading, navigate to each solution directory from the command line and enter "dotnet restore" to install all necessary packages. The backend will require your own API keys and accounts for Supabase, NFLVerse, OpenAI, and Stripe. The frontend will require your backend URl and Stripe publishable key. Create the file ".env.local" with body:  
```
{
"""Backend URL"""
NEXT_PUBLIC_API_URL=https:

"""stripe items"""
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

```
Fill in all empty fields with your backend URL and Stripe key. 

## Testing
Full application testing instructions are available on the backend README. In order to test the frontend, first follow these instructions to run the backend. Open the command line and navigate to the frontend solution directory. Enter "npm run dev", copy the URL displayed, then enter it into a browser with "/checkoutStripe" added to the end. This will bring you to a basic card payment interface. Enter the following card info:  
- number: 4111 1111 1111 1111
- expiration date: any future month/year
- CVC: 111
This is a fake credit card used for testing. Press "Pay $10" to initiate payment.
