"use client";
import { useParams } from "next/navigation";
import Form from "./form";
import s from "./page.module.scss";
const Page = () => {
  const { referenceCode } = useParams<{ referenceCode: string }>();
  return (
    <div className={s.main}>
      <Form referenceCode={referenceCode} />
    </div>
  );
};

export default Page;
