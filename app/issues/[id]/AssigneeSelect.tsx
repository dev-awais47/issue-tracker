"use client";
import { Issue, User } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@/app/components";

const AssigneeSelect = ({ issue }: { issue: Issue }) => {
  const {
    data: users,
    error,
    isLoading,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => axios.get("/api/users").then((res) => res.data),
    staleTime: 60 * 1000,
    retry: 3,
  });

  if (isLoading) return <Skeleton />;
  if (error) return null;

  const handleValueChange = (userId: string) => {
    const assignedToUserId = userId === "UNASSIGNED" ? null : userId;
    axios.patch("/api/issues/" + issue.id, {
      assignedToUserId,
    });
  };

  return (
    <Select.Root
      defaultValue={issue.assignedToUserId || "UNASSIGNED"}
      onValueChange={handleValueChange}
    >
      <Select.Trigger placeholder="Users..." />
      <Select.Content>
        <Select.Group>
          <Select.Label>Suggestions</Select.Label>
          <Select.Item value="UNASSIGNED">Unassinged</Select.Item>
          {users?.map((user) => (
            <Select.Item key={user.id} value={user.id}>
              {user.name}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
};

export default AssigneeSelect;
