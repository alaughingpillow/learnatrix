import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export const TestList = () => {
  const { toast } = useToast();

  const { data: tests, refetch } = useQuery({
    queryKey: ["admin-tests"],
    queryFn: async () => {
      console.log("Fetching all tests for admin...");
      const { data, error } = await supabase
        .from("tests")
        .select(`
          *,
          test_categories (
            name
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching tests:", error);
        throw error;
      }

      console.log("Fetched tests:", data);
      return data;
    },
  });

  const handlePublishToggle = async (testId: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from("tests")
        .update({ published: !currentState })
        .eq("id", testId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Test ${currentState ? "unpublished" : "published"} successfully`,
      });
      refetch();
    } catch (error) {
      console.error("Error toggling test publish state:", error);
      toast({
        title: "Error",
        description: "Failed to update test status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTest = async (testId: string) => {
    if (!window.confirm("Are you sure you want to delete this test?")) return;

    try {
      const { error } = await supabase
        .from("tests")
        .delete()
        .eq("id", testId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Test deleted successfully",
      });
      refetch();
    } catch (error) {
      console.error("Error deleting test:", error);
      toast({
        title: "Error",
        description: "Failed to delete test",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tests</h2>
        <Link to="/admin/tests/new">
          <Button>Create New Test</Button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tests?.map((test) => (
              <TableRow key={test.id}>
                <TableCell>{test.title}</TableCell>
                <TableCell>{test.test_categories?.name}</TableCell>
                <TableCell className="capitalize">{test.test_type}</TableCell>
                <TableCell>
                  <Switch
                    checked={test.published}
                    onCheckedChange={() => handlePublishToggle(test.id, test.published)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Link to={`/admin/tests/edit/${test.id}`}>
                      <Button variant="outline" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteTest(test.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};