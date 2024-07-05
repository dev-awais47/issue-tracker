import IssueStatusBadge from "@/app/components/IssueStatusBadge";
import prisma from "@/prisma/client";
import { Box, Button, Card, Flex, Grid, Heading } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import ReactMarkDown from "react-markdown";
import { Pencil2Icon } from "@radix-ui/react-icons";
import Link from "next/link";
import DeleteIssueButton from "./DeleteIssueButton";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import AssigneeSelect from "./AssigneeSelect";
import { cache } from "react";

interface Props {
  params: { id: string };
}

const fetchUser = cache((issueId: number) =>
  prisma.issue.findUnique({ where: { id: issueId } })
);

const IssueDetailPage = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);

  const issue = await fetchUser(parseInt(params.id));

  if (!issue) notFound();

  return (
    <Grid columns={{ initial: "1", sm: "5" }} gap="5">
      <Box className="md:col-span-4">
        <Heading>{issue.title}</Heading>
        <Flex gap="3" my="2">
          <IssueStatusBadge status={issue.status} />
          <p>{issue.createdAt.toDateString()}</p>
        </Flex>
        <Card className="prose max-w-full">
          <ReactMarkDown>{issue.description}</ReactMarkDown>
        </Card>
      </Box>
      {session && (
        <Box>
          <Flex direction="column" gap="4">
            <AssigneeSelect issue={issue} />
            <Button>
              <Pencil2Icon />
              <Link href={`/issues/${issue.id}/edit`}>Edit Issue</Link>
            </Button>
            <DeleteIssueButton issueId={issue.id} />
          </Flex>
        </Box>
      )}
    </Grid>
  );
};

export async function generateMetadata({ params }: Props) {
  const issue = await fetchUser(parseInt(params.id));

  return {
    title: issue?.title,
    description: "Details of issue " + issue?.id,
  };
}

export default IssueDetailPage;
