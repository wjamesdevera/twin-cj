import { z } from "zod";
import { feedbackSchema } from "../schemas/feedback.schema";
import { prisma } from "../config/db";
import appAssert from "../utils/appAssert";
import { INTERNAL_SERVER_ERROR, NOT_FOUND } from "../constants/http";
import { idSchema } from "../schemas/auth.schema";

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
      where: {
        statusId: 2,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        status: true,
      },
      take: limit,
    });
  } else {
    feedbacks = await prisma.feedback.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        status: true,
      },
    });
  }

  return feedbacks;
};

export const updateFeedbackStatus = async (id: number, statusId: number) => {
  const feedbackStatus = await prisma.feedbackStatus.findUnique({
    where: {
      id: statusId,
    },
  });

  appAssert(feedbackStatus, NOT_FOUND, "Status id not found");

  const updatedFeedback = await prisma.feedback.update({
    where: {
      id,
    },
    data: {
      statusId: feedbackStatus.id,
    },
  });

  appAssert(
    updateFeedbackStatus,
    INTERNAL_SERVER_ERROR,
    "Failed to update status"
  );

  return updatedFeedback;
};
