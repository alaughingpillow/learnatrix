import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { PlusCircle, Edit, Trash2, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "admin") {
        navigate("/");
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page.",
          variant: "destructive",
        });
      }
    };

    checkAdmin();
  }, [navigate, toast]);

  const { data: tests, isLoading, refetch } = useQuery({
    queryKey: ["admin-tests"],
    queryFn: async () => {
      console.log("Fetching admin tests...");
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
        console.error("Error fetching admin tests:", error);
        throw error;
      }

      console.log("Fetched admin tests:", data);
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("tests")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Test deleted successfully.",
      });
      refetch();
    } catch (error) {
      console.error("Error deleting test:", error);
      toast({
        title: "Error",
        description: "Failed to delete test. Please try again.",
        variant: "destructive",
      });
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("tests")
        .update({ published: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Test ${currentStatus ? "unpublished" : "published"} successfully.`,
      });
      refetch();
    } catch (error) {
      console.error("Error updating test status:", error);
      toast({
        title: "Error",
        description: "Failed to update test status. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Test Management</h1>
          <Button 
            onClick={() => navigate("/admin/tests/new")}
            className="bg-primary hover:bg-primary-600 transition-colors"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Test
          </Button>
        </div>

        {tests && tests.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Title</TableHead>
                  <TableHead className="font-semibold">Category</TableHead>
                  <TableHead className="font-semibold">Duration (mins)</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tests.map((test) => (
                  <TableRow key={test.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{test.title}</TableCell>
                    <TableCell>{test.test_categories?.name || "Uncategorized"}</TableCell>
                    <TableCell>{test.duration}</TableCell>
                    <TableCell>
                      <Button
                        variant={test.published ? "default" : "secondary"}
                        size="sm"
                        onClick={() => togglePublish(test.id, test.published)}
                        className={test.published ? "bg-green-500 hover:bg-green-600" : ""}
                      >
                        {test.published ? "Published" : "Draft"}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/test/${test.id}`)}
                          className="hover:bg-gray-100"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/admin/tests/edit/${test.id}`)}
                          className="hover:bg-gray-100"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(test.id)}
                          className="hover:bg-red-100 text-red-600"
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
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tests available</h3>
            <p className="text-gray-500 mb-4">Get started by creating your first test</p>
            <Button 
              onClick={() => navigate("/admin/tests/new")}
              className="bg-primary hover:bg-primary-600 transition-colors"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create First Test
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};