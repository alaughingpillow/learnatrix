import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CategoryManager } from "@/components/admin/CategoryManager";

export const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link to="/admin/create-test">
          <Button>Create New Test</Button>
        </Link>
      </div>

      <div className="grid gap-8">
        <CategoryManager />
      </div>
    </div>
  );
};