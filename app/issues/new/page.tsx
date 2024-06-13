'use client';
import { Button, TextField } from "@radix-ui/themes";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

const NewIssuePage = () => {
  return (
    <div className="max-w-xl space-y-3" >
      <TextField.Root placeholder="Title" size="3" />
      <SimpleMDE placeholder="Description" />
      <Button>Submit the Issue</Button>
    </div>
  );
};

export default NewIssuePage;
