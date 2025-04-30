"use client";
import { nameSchema } from "@/app/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert, Button, TextField } from "@mui/material";
import s from "./form.module.scss";
import useSWRMutation from "swr/mutation";
import { sendFeedbacks } from "@/app/lib/api";
import { useRouter } from "next/navigation";
import { CheckIcon } from "lucide-react";

export const feedbackSchema = z.object({
  referenceCode: z.string(),
  name: nameSchema,
  feedback: z
    .string()
    .max(200, "Feedback should not exceed 200 characters")
    .refine((val) => val.trim().length > 0, "Description cannot be just spaces")
    .optional(),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

const Form = ({ referenceCode }: { referenceCode: string }) => {
  const router = useRouter();
  const { trigger, isMutating } = useSWRMutation(
    "submit",
    (key, { arg }: { arg: FeedbackFormData }) => sendFeedbacks(arg)
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      referenceCode,
    },
  });

  const onSubmit = async (data: FeedbackFormData) => {
    console.log(data);
    await trigger(data);
    router.replace("/");
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={s.container}>
      {isMutating && (
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
          Feedback sent
        </Alert>
      )}
      <div className={s.wrapper}>
        <div className={s.titleContainer}>
          <h2 className={s.titleText}>We Value Your Feedback!</h2>
          <p className={s.titleSubText}>
            Please take a moment to share your experience with us. Your feedback
            helps us improve!
          </p>
        </div>
        <TextField
          {...register("name")}
          label="Full name"
          error={errors.name !== undefined}
          helperText={errors.name?.message}
        />
        <TextField
          aria-label="minimum height"
          minRows={3}
          multiline
          label="Feedback"
          {...register("feedback")}
          error={errors.feedback !== undefined}
          helperText={errors.feedback?.message}
        />
        <Button
          variant="outlined"
          type="submit"
          sx={{
            color: "var(--color-sand-500)",
            borderColor: "var(--color-sand-500)",
          }}
          disabled={isMutating}
        >
          Submit
        </Button>
      </div>
    </form>
  );
};

export default Form;
