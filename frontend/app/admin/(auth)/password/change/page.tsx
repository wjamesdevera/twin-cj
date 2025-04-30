import { Suspense } from "react";
import Form from "./form";

const page = () => {
  return (
    <>
      <Suspense>
        <Form />
      </Suspense>
    </>
  );
};

export default page;
