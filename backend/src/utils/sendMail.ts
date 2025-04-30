import { resend } from "../config/resend";
import config from "../config/config";

type Params = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

const getFromEmail = () =>
  config.environment === "development"
    ? "onboarding@resend.dev"
    : config.emailSender;

const getToEmail = (to: string) =>
  config.environment === "development" ? "delivered@resend.dev" : to;

export const sendMail = async ({ to, subject, text, html }: Params) =>
  await resend.emails.send({
    from: getFromEmail(),
    to: getToEmail(to),
    subject,
    text,
    html,
  });
