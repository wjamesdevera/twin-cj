"use client";

import { useRouter } from "next/navigation";
import useSWRMutation from "swr/mutation";
import { createCabin } from "@/app/lib/api";
import CabinForm from "./form";

export default function CreateCabin() {
  const router = useRouter();

  const { trigger, isMutating } = useSWRMutation(
    "create cabin",
    (key, { arg }: { arg: FormData }) => createCabin(arg),
    {
      onSuccess: () => {
        router.push("/admin/cabins");
      },
    }
  );

  return <CabinForm trigger={trigger} isMutating={isMutating} />;
}
