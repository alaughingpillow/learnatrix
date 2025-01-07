import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Trash2, Plus } from "lucide-react";

export const CategoryManager = () => {
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      console.log("Fetching categories...");
      const { data, error } = await supabase
        .from("test_categories")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }

      console.log("Fetched categories:", data);
      return data;
    },
  });

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("test_categories")
        .insert([newCategory]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Category added successfully",
      });

      setNewCategory({ name: "", description: "" });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    } catch (error) {
      console.error("Error adding category:", error);
      toast({
        title: "Error",
        description: "Failed to add category",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from("test_categories")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Category deleted successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["categories"] });
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Manage Categories</h2>
        <div className="grid gap-4">
          <div>
            <Input
              placeholder="Category Name"
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory({ ...newCategory, name: e.target.value })
              }
            />
          </div>
          <div>
            <Textarea
              placeholder="Category Description (optional)"
              value={newCategory.description}
              onChange={(e) =>
                setNewCategory({ ...newCategory, description: e.target.value })
              }
            />
          </div>
          <Button onClick={handleAddCategory} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Existing Categories</h3>
        {isLoading ? (
          <p>Loading categories...</p>
        ) : (
          <div className="grid gap-4">
            {categories?.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-4 bg-secondary rounded-lg"
              >
                <div>
                  <h4 className="font-medium">{category.name}</h4>
                  {category.description && (
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  )}
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteCategory(category.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};