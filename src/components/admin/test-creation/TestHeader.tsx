import {
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface TestHeaderProps {
  testType: "typing" | "mcq";
}

export const TestHeader = ({ testType }: TestHeaderProps) => {
  return (
    <CardHeader>
      <CardTitle className="text-2xl font-bold">Create New Test</CardTitle>
      <CardDescription>
        Create a new {testType.toUpperCase()} test for students to practice
        with.
      </CardDescription>
    </CardHeader>
  );
};