import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface TestCardProps {
  id: string;
  title: string;
  description: string;
  duration: number;
  test_type: "typing" | "mcq";
  test_categories?: {
    name: string;
  };
}

export const TestCard = ({ id, title, description, duration, test_categories, test_type }: TestCardProps) => {
  const durationInMinutes = Math.ceil(duration / 60);
  
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-purple-50 border-purple-100 hover:scale-[1.02]">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
              {title}
            </CardTitle>
            <CardDescription className="text-sm text-purple-500 mt-1 font-medium">
              {test_categories?.name || "General"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between">
          <div className="flex space-x-4 text-sm text-purple-600">
            <div className="flex items-center bg-purple-50 px-2 py-1 rounded-full">
              <Clock className="w-4 h-4 mr-1" />
              <span>{durationInMinutes} mins</span>
            </div>
          </div>
          <Button 
            asChild 
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Link to={`/test/${id}`}>Start Test</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};