# Raymark Digital - Contact form setup

## Why you saw "our enquiry form is not connected yet"
The website is a static site (HTML, CSS, JavaScript) with no server or backend. The form needs an email delivery service, and the earlier version only worked after you entered EmailJS keys in `email-config.js`. Those keys were still the placeholders `YOUR_SERVICE_ID`, `YOUR_TEMPLATE_ID` and `YOUR_PUBLIC_KEY`, so the form correctly refused to send and said so, instead of pretending it had worked.

## What was changed
The form now has a built-in delivery route that needs NO keys: it sends every enquiry to **contact.raymarkdigital@gmail.com** through the free FormSubmit service. The EmailJS route is still available as an optional upgrade (Part B).

Every email contains: Customer Name, Customer Email (used as Reply-To), Phone Number, Company, Service, Subject, Message, Submission Date and Time (IST) and the page it came from.

The green "Thank you" message appears only when the delivery service confirms the email was accepted. Anything else (activation pending, network problem, server error, bad reply) shows the red error message with your phone and email.

## Part A - One-time activation (required, about 2 minutes)
FormSubmit will not deliver to a new Gmail address until you confirm that you own it. This is a one-time step.

1. Upload the website to your live hosting (the form does not work when the files are opened directly from your computer).
2. Open your live website, fill in the Get In Touch form with test details and press Send. The first attempt shows the red error message. That is expected.
3. Open the Gmail inbox of contact.raymarkdigital@gmail.com. You will receive an email from FormSubmit (check Spam). Click **Activate Form**.
4. Go back to your website and send the form again. You should see the green "Thank you" message and a new email "New enquiry: ..." in your Gmail.

If the activation email does not arrive, wait a few minutes and try the form once more, and check Spam and Promotions.

Optional: after activation, FormSubmit can give you a private alias to use instead of your email address in `email-config.js` (`toEmail`), so the address is not visible in the website code.

## Part B - Optional upgrade to EmailJS (more control, your own Gmail connection)
1. Sign up at https://www.emailjs.com and connect contact.raymarkdigital@gmail.com under Email Services. Copy the **Service ID**.
2. Create an Email Template with: To Email `contact.raymarkdigital@gmail.com` (typed in, not a variable), From Name `Raymark Digital Website`, Reply To `{{customer_email}}`, Subject `New enquiry: {{subject}} ({{customer_name}})` and this content:

```
Customer Name: {{customer_name}}
Customer Email: {{customer_email}}
Phone Number: {{phone}}
Company: {{company}}
Service: {{service}}
Subject: {{subject}}

Message:
{{message}}

Submitted: {{submitted_at}}
Page: {{page_url}}
```
3. Copy the **Template ID** and your **Public Key** (Account > General).
4. Put the three values in `email-config.js`. Once all three are filled in, the website uses EmailJS automatically.
5. Never put a Private Key or password in the website files.

## Troubleshooting
Open the browser console (F12) after a failed send. The line starting "Enquiry send failed:" gives the reason. A line mentioning "activation" means Part A step 3 is still needed.

## Notes
- Free services have monthly limits. For high volume, consider a paid plan or a small server function with Resend (this needs a secret API key kept on a server, which a static site cannot hold).
- The form includes a hidden spam trap, a 30-second wait between sends and a 15-second timeout.
