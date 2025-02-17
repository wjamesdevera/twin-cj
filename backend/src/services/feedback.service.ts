import config from "../config/config";
import { getFeedbackEmailTemplate } from "../utils/emailTemplates";
import { sendMail } from "../utils/sendMail";

interface sendFeedbackParams {
  fullName: string;
  email: string;
  inquiryType: string;
  contactNumber: string;
  message: string;
}

export const sendFeedback = async (data: sendFeedbackParams) => {
  const feedbackReceiver = config.feedbackReceiver;
  await sendMail({
    to: feedbackReceiver,
    ...getFeedbackEmailTemplate(data),
  });
};
