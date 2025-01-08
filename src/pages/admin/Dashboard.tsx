import { TestList } from "@/components/admin/TestList";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { UserResults } from "@/components/admin/UserResults";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Dashboard = () => {
  return (
    <div className="space-y-8">
      <Tabs defaultValue="tests" className="w-full">
        <TabsList>
          <TabsTrigger value="tests">Tests</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="users">User Results</TabsTrigger>
        </TabsList>
        <TabsContent value="tests">
          <TestList />
        </TabsContent>
        <TabsContent value="categories">
          <CategoryManager />
        </TabsContent>
        <TabsContent value="users">
          <UserResults />
        </TabsContent>
      </Tabs>
    </div>
  );
};