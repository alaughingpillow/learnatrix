import { TestList } from "@/components/admin/TestList";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { UserResults } from "@/components/admin/UserResults";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Dashboard = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <Tabs defaultValue="tests" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="tests">Tests</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="users">User Results</TabsTrigger>
        </TabsList>
        <TabsContent value="tests" className="mt-0">
          <TestList />
        </TabsContent>
        <TabsContent value="categories" className="mt-0">
          <CategoryManager />
        </TabsContent>
        <TabsContent value="users" className="mt-0">
          <UserResults />
        </TabsContent>
      </Tabs>
    </div>
  );
};