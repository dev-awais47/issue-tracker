"use client";
import ErrorMessage from "@/app/components/ErrorMessage";
import { createIssueSchema } from "@/app/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextField } from "@radix-ui/themes";
import axios from "axios";
import "easymde/dist/easymde.min.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import SimpleMDE from "react-simplemde-editor";
import { z } from "zod";

type IssueForm = z.infer<typeof createIssueSchema>;

const NewIssuePage = () => {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IssueForm>({
    resolver: zodResolver(createIssueSchema),
  });

  const [error, setError] = useState<string | undefined>();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await axios.post("/api/issues", data);
      router.push("/issues");
    } catch (error) {
      setError("An unexpected error occurred.");
    }
  });

  return (
    <form className="max-w-xl space-y-3" onSubmit={onSubmit}>
      <TextField.Root placeholder="Title" size="3" {...register("title")} />
      <ErrorMessage>{errors.title?.message}</ErrorMessage>

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <SimpleMDE placeholder="Description" {...field} />
        )}
      />
      <ErrorMessage>{errors.description?.message}</ErrorMessage>

      <Button type="submit">Submit the Issue</Button>

      {error && <ErrorMessage>{error}</ErrorMessage>}
    </form>
  );
};

export default NewIssuePage;
