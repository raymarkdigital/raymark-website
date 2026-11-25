/* Raymark Digital - enquiry form settings.
   DEFAULT: leave this file as it is. The form sends every enquiry to the email below
   using FormSubmit (needs a one-time activation click, see CONTACT-FORM-SETUP.md).
   OPTIONAL UPGRADE: fill in the three EmailJS values to use EmailJS instead.
   Public keys are safe here. NEVER put a Private Key, API secret or password in this file. */
window.RAYMARK_MAIL = {
  toEmail: 'contact.raymarkdigital@gmail.com',
  serviceId: 'YOUR_SERVICE_ID',
  templateId: 'YOUR_TEMPLATE_ID',
  publicKey: 'YOUR_PUBLIC_KEY'
};
