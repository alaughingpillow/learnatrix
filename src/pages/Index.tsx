import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, Brain, Clock, Target, Award, ChartBar } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center py-20">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Master Your</span>
            <span className="block text-primary">SSC & UPSC Preparation</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Enhance your exam preparation with our AI-powered typing tests. Track your progress, improve your speed, and boost your confidence.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link to="/login">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-12 bg-white rounded-lg shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Why Choose Our Platform?
              </p>
            </div>

            <div className="mt-10">
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative p-6 bg-white ring-1 ring-gray-900/5 rounded-lg leading-none flex items-top justify-start space-x-6">
                    <div className="flex-shrink-0">
                      <Brain className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">AI-Powered Analysis</h3>
                      <p className="text-gray-500">
                        Get intelligent insights about your typing patterns and areas for improvement.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative p-6 bg-white ring-1 ring-gray-900/5 rounded-lg leading-none flex items-top justify-start space-x-6">
                    <div className="flex-shrink-0">
                      <Target className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Exam-Focused</h3>
                      <p className="text-gray-500">
                        Practice with content specifically curated for SSC and UPSC exams.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative p-6 bg-white ring-1 ring-gray-900/5 rounded-lg leading-none flex items-top justify-start space-x-6">
                    <div className="flex-shrink-0">
                      <ChartBar className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Progress Tracking</h3>
                      <p className="text-gray-500">
                        Monitor your improvement with detailed analytics and performance metrics.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="py-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <Clock className="h-8 w-8 text-primary mx-auto mb-4" />
              <div className="text-2xl font-bold text-gray-900">Fast Results</div>
              <p className="text-gray-500">Instant feedback on your performance</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <BookOpen className="h-8 w-8 text-primary mx-auto mb-4" />
              <div className="text-2xl font-bold text-gray-900">Rich Content</div>
              <p className="text-gray-500">Extensive practice material</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <Award className="h-8 w-8 text-primary mx-auto mb-4" />
              <div className="text-2xl font-bold text-gray-900">Achievements</div>
              <p className="text-gray-500">Track your milestones</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <Brain className="h-8 w-8 text-primary mx-auto mb-4" />
              <div className="text-2xl font-bold text-gray-900">Smart Learning</div>
              <p className="text-gray-500">AI-powered recommendations</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;