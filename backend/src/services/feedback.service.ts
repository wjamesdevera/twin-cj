import { z } from "zod";
import { feedbackSchema } from "../schemas/feedback.schema";
import { prisma } from "../config/db";
import appAssert from "../utils/appAssert";
import { INTERNAL_SERVER_ERROR } from "../constants/http";

type FeedbackData = z.infer<typeof feedbackSchema>;
export const sendFeedback = async (data: FeedbackData) => {
  const feedback = await prisma.feedback.create({
    data: {
      name: data.name,
      text: data.feedback || "",
    },
  });

  appAssert(feedback, INTERNAL_SERVER_ERROR, "Error sending feedback");

  return feedback;
};

export const getFeedbacks = async (limit?: number) => {
  let feedbacks: any[] = [];
  if (limit) {
    feedbacks = await prisma.feedback.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });
  } else {
    feedbacks = await prisma.feedback.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  return feedbacks;
};
