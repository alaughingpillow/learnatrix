import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import { UserResult } from "./types";

interface UserResultsTableProps {
  userResults: UserResult[];
  onAnalyze: (userId: string) => void;
}

export const UserResultsTable = ({ userResults, onAnalyze }: UserResultsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Tests Taken</TableHead>
          <TableHead>Average Accuracy</TableHead>
          <TableHead>Average WPM</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {userResults?.map((user) => {
          const avgAccuracy = user.results.length
            ? user.results.reduce((acc, curr) => acc + curr.accuracy, 0) /
              user.results.length
            : 0;
          const avgWpm = user.results.length
            ? user.results.reduce((acc, curr) => acc + curr.wpm, 0) /
              user.results.length
            : 0;

          return (
            <TableRow key={user.profile.id}>
              <TableCell>
                <div className="font-medium">{user.profile.username}</div>
              </TableCell>
              <TableCell>{user.results.length}</TableCell>
              <TableCell>{avgAccuracy.toFixed(2)}%</TableCell>
              <TableCell>{avgWpm.toFixed(2)}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAnalyze(user.profile.id)}
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Analyze
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};