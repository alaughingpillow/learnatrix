import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface TestCardProps {
  id: string;
  title: string;
  description: string;
  duration: number;
  participants: number;
  category: string;
}

export const TestCard = ({ id, title, description, duration, participants, category }: TestCardProps) => {
  // Convert seconds to minutes for display
  const durationInMinutes = Math.ceil(duration / 60);
  
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">{title}</CardTitle>
            <CardDescription className="text-sm text-gray-500 mt-1">
              {category}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex items-center justify-between">
          <div className="flex space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{durationInMinutes} mins</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>{participants}</span>
            </div>
          </div>
          <Button asChild>
            <Link to={`/test/${id}`}>Start Test</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};