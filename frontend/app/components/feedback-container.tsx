"use client";
import useSWR from "swr";
import s from "./feedback-container.module.scss";
import FeedbackCard from "./feedbackCard";
import { getFeedbacks } from "../lib/api";
import { Loading } from "./loading";

type Feedback = {
  id: number;
  text: string;
  name: string;
};

const Feedbacks = () => {
  const { data, isLoading } = useSWR("feedback", getFeedbacks);

  const feedbacks = data?.data?.feedbacks || [];
  return isLoading ? (
    <Loading />
  ) : (
    <div className={s.container}>
      <div className={s.wrapper}>
        {feedbacks.map((feedback: Feedback) => (
          <FeedbackCard
            key={feedback.id}
            text={feedback.text}
            author={feedback.name}
          />
        ))}
      </div>
    </div>
  );
};

export default Feedbacks;
