import { TestList } from "@/components/admin/TestList";
import { CategoryManager } from "@/components/admin/CategoryManager";

export const Dashboard = () => {
  return (
    <div className="space-y-8">
      <TestList />
      <CategoryManager />
    </div>
  );
};