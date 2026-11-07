/* Site settings — the only file you need to edit before launch.
   Leave a value empty ("") and the site falls back to something sensible. */
window.SITE = {
  // Link to the payment / registration form (Grow, Cardcom, Google Form...).
  // Empty → the "register" buttons scroll to the price block.
  registerUrl: "https://www.easyform.co.il/?formId=9c36dffb-ffd8-f111-ad46-d4f5ef253abe",

  // Link for "יש שאלות?" (a Google Form, WhatsApp link, Calendly...).
  // Empty → the button stays visible and scrolls to the price block until a link is set.
  questionsUrl: "https://www.lnet.co.il/contact-us",

  // Shows "תצוגת דוגמה" on the portal login screen (the portal filled with example
  // content). Set to false before sending the portal to participants.
  portalDemoLink: true,

  // Shahar's LinkedIn profile. Empty → the link is hidden.
  linkedinUrl: "",

  // Intro: plays assets/video/intro.mp4 if it exists, otherwise the drawn intro.
  // Shown once per browser session. Set to false to switch it off.
  intro: true,
  introVideo: "assets/video/intro.mp4"
};
