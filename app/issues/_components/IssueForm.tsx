"use client";
import ErrorMessage from "@/app/components/ErrorMessage";
import { IssueSchema } from "@/app/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Issue } from "@prisma/client";
import { Button, Spinner, TextField } from "@radix-ui/themes";
import axios from "axios";
import "easymde/dist/easymde.min.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import SimpleMDE from "react-simplemde-editor";
import { z } from "zod";

type IssueFormData = z.infer<typeof IssueSchema>;

interface Props {
  issue?: Issue;
}

const IssueForm = ({ issue }: Props) => {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IssueFormData>({
    resolver: zodResolver(IssueSchema),
  });

  const [error, setError] = useState<string | undefined>();
  const [isSubmitting, setSubmitting] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      if (issue) await axios.patch("/api/issues/" + issue.id, data);
      else await axios.post("/api/issues", data);
      router.push("/issues");
      router.refresh();
    } catch (error) {
      setSubmitting(false);
      setError("An unexpected error occurred.");
    }
  });

  return (
    <form className="max-w-xl space-y-3" onSubmit={onSubmit}>
      <TextField.Root
        defaultValue={issue?.title}
        placeholder="Title"
        size="3"
        {...register("title")}
      />
      <ErrorMessage>{errors.title?.message}</ErrorMessage>

      <Controller
        name="description"
        control={control}
        defaultValue={issue?.description}
        render={({ field }) => (
          <SimpleMDE placeholder="Description" {...field} />
        )}
      />
      <ErrorMessage>{errors.description?.message}</ErrorMessage>

      <Button type="submit" disabled={isSubmitting}>
        {" "}
        {issue ? "Update Issue" : "Submit New Issue"}{" "}
        {isSubmitting && <Spinner />}
      </Button>

      {error && <ErrorMessage>{error}</ErrorMessage>}
    </form>
  );
};

export default IssueForm;
