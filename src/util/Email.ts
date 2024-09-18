import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();
// Getting API Key and From address from Environmental variable

interface OptionsI {
  to: string;
  subject: string;
  text: string;
  html?: string;
  from?: string;
}
const Email = async (options: OptionsI) => {
  const {
    SENDGRID_API_KEY = "",
    SENDGRID_FROM_ADDRESS = "",
    SENDGRID_TO_ADDRESS,
  } = process.env;

  sgMail.setApiKey(SENDGRID_API_KEY);
  const message = {
    from: options.from || SENDGRID_FROM_ADDRESS,
    to: options.to || SENDGRID_TO_ADDRESS,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  try {
    const res = await sgMail.send(message);
    if (res) {
      return true;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};
export default Email;
