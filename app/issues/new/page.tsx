"use client";
import { Button, Text, TextField } from "@radix-ui/themes";
import SimpleMDE from "react-simplemde-editor";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import "easymde/dist/easymde.min.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createIssueSchema } from "@/app/validationSchemas";
import { z } from "zod";

type issueForm = z.infer<typeof createIssueSchema>;

const NewIssuePage = () => {
  const router = useRouter();
  const { register, control, handleSubmit, formState: {errors} } = useForm<issueForm>({
    resolver: zodResolver(createIssueSchema)
  });
  const [error, setError] = useState();
  return (
    <form
      className="max-w-xl space-y-3"
      onSubmit={handleSubmit(async (data) => {
        try {
          await axios.post('/api/issues', data);
          router.push('/issues')
        } catch (error) {
          // setError("An unexpected error occurs");
        }
      })}
    >
      <TextField.Root placeholder="Title" size="3" {...register("title")} />
      { errors.title && <Text color="red" as="p">{errors.title.message}</Text> }
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <SimpleMDE placeholder="Description" {...field} />
        )}
        />
        { errors.description && <Text color="red" as="p">{errors.description.message}</Text> }
      <Button>Submit the Issue</Button>
    </form>
  );
};

export default NewIssuePage;
