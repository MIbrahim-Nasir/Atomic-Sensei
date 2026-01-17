"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  BookOpen, 
  Youtube, 
  Lightbulb, 
  ListChecks, 
  ExternalLink,
  Link2,
  Loader2,
  Award
} from 'lucide-react';
import { toast } from 'sonner';
import { moduleContentService } from '@/services/moduleContent.service';
import { QuizDialog } from '@/components/quiz/QuizDialog';

// Update the interface to include details
export interface ModuleContent {
  _id: string;
  topic: string;
  title: string;
  description: string;
  details: string; // Add this field
  level: string;
  estimated_time: string;
  examples: string[];
  related_concepts: string[];
  other_resources: string[];
  youtube_links: {
    title: string;
    channel: string;
    description: string;
    url: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface ModuleContentDialogProps {
  isOpen: boolean;
  topic: string;
  onClose: () => void;
}

export function ModuleContentDialog({ isOpen, topic, onClose }: ModuleContentDialogProps) {
  const [content, setContent] = useState<ModuleContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      if (!isOpen || !topic) return;
      
      try {
        setLoading(true);
        // First try to get existing content
        let contentData = await moduleContentService.getContent(topic);
        
        // If not found, generate new content
        if (!contentData) {
          toast.info(`Generating content for "${topic}"...`);
          contentData = await moduleContentService.generateContent(topic);
          toast.success('Content generated successfully!');
        }
        
        setContent(contentData);
      } catch (error) {
        console.error('Error fetching content:', error);
        toast.error('Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [isOpen, topic]);

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {loading ? (
          <>
            <DialogHeader>
              <DialogTitle>Loading Content</DialogTitle>
            </DialogHeader>
            <div className="py-12 flex flex-col items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
              <p className="text-gray-600">
                {content ? 'Loading content...' : 'Generating detailed content...'}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                This may take a moment
              </p>
            </div>
          </>
        ) : content ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {content.title}
              </DialogTitle>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {content.level}
                </Badge>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  <Clock className="mr-1 h-3 w-3" />
                  {content.estimated_time}
                </Badge>
              </div>
            </DialogHeader>

            <div className="mt-4 space-y-8">
              {/* Overview Section */}
              <section className="space-y-4">
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">{content.description}</p>
                  
                  {/* Add details section */}
                  {content.details && (
                    <div className="mt-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Detailed Overview</h3>
                      <p className="text-gray-700 leading-relaxed">{content.details}</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2 text-amber-500" />
                    Related Concepts
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {content.related_concepts.map((concept, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-md">
                        <p className="text-gray-700">{concept}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
              
              <Separator />
              
              {/* Examples Section */}
              <section className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  <ListChecks className="h-5 w-5 mr-2 text-green-500" />
                  Practical Examples
                </h3>
                
                <div className="grid grid-cols-1 gap-4">
                  {content.examples.map((example, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-start">
                          <div className="bg-green-100 rounded-full p-2 mr-3 mt-1">
                            <span className="font-bold text-sm text-green-800">{index + 1}</span>
                          </div>
                          <p className="text-gray-700">{example}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
              
              <Separator />
              
              {/* Resources Section */}
              <section className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
                  Additional Resources
                </h3>
                
                <div className="grid grid-cols-1 gap-3">
                  {content.other_resources.map((resource, index) => (
                    <div key={index} className="flex items-start p-3 bg-gray-50 rounded-md">
                      <ExternalLink className="h-5 w-5 mr-3 text-blue-500 mt-0.5" />
                      <p className="text-gray-700">{resource}</p>
                    </div>
                  ))}
                </div>
              </section>
              
              <Separator />
              
              {/* Videos Section */}
              <section className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  <Youtube className="h-5 w-5 mr-2 text-red-500" />
                  Recommended Videos
                </h3>
                
                <div className="grid grid-cols-1 gap-4">
                  {content.youtube_links.map((video, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-gray-900">{video.title}</h4>
                            <Badge className="bg-red-100 text-red-800 border-none">
                              {video.channel}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">{video.description}</p>
                          <a 
                            href={video.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-blue-600 hover:text-blue-800"
                          >
                            <Link2 className="h-4 w-4 mr-1" />
                            Watch on YouTube
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Quiz Button */}
              {content && (
                <div className="flex justify-center mt-8">
                  <Button 
                    onClick={() => setIsQuizDialogOpen(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2"
                  >
                    <Award className="mr-2 h-5 w-5" />
                    Take Quiz
                  </Button>
                </div>
              )}
            </div>

            {/* Quiz Dialog */}
            {content && (
              <QuizDialog 
                isOpen={isQuizDialogOpen}
                topic={topic}
                onClose={() => setIsQuizDialogOpen(false)}
              />
            )}
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Error Loading Content</DialogTitle>
            </DialogHeader>
            <div className="py-12 text-center">
              <p className="text-gray-600">Failed to load content</p>
              <Button onClick={onClose} variant="outline" className="mt-4">
                Close
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}