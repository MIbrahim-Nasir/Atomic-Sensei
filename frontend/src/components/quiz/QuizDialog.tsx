// filepath: c:\Users\ABDUL_RUB\Desktop\Projects\Web_dev\Atomic-Sensei\frontend\src\components\quiz\QuizDialog.tsx
"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Quiz, quizService } from '@/services/quiz.service';
import { toast } from 'sonner';
import { CheckCircle, XCircle, ArrowRight, Loader2, Award } from 'lucide-react';

interface QuizDialogProps {
  isOpen: boolean;
  topic: string;
  onClose: () => void;
}

export function QuizDialog({ isOpen, topic, onClose }: QuizDialogProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submittedAnswers, setSubmittedAnswers] = useState<boolean[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!isOpen || !topic) return;
      
      try {
        setLoading(true);
        // First try to get existing quiz
        let quizData = await quizService.getQuiz(topic);
        
        // If not found, generate new quiz
        if (!quizData) {
          toast.info(`Generating quiz for "${topic}"...`);
          quizData = await quizService.generateQuiz(topic);
          toast.success('Quiz generated successfully!');
        }
        
        setQuiz(quizData);
        // Initialize the submitted answers array with false values
        setSubmittedAnswers(new Array(quizData.questions.length).fill(false));
      } catch (error) {
        console.error('Error fetching quiz:', error);
        toast.error('Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [isOpen, topic]);

  const handleClose = () => {
    if (!loading) {
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setSubmittedAnswers([]);
      setShowExplanation(false);
      setScore(0);
      setQuizCompleted(false);
      onClose();
    }
  };

  const handleOptionSelect = (option: string) => {
    if (!submittedAnswers[currentQuestionIndex]) {
      setSelectedOption(option);
    }
  };

  const handleSubmitAnswer = () => {
    if (!quiz || selectedOption === null) return;
    
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correct_answer;
    
    // Update submitted answers
    const updatedSubmittedAnswers = [...submittedAnswers];
    updatedSubmittedAnswers[currentQuestionIndex] = true;
    setSubmittedAnswers(updatedSubmittedAnswers);
    
    // Update score if correct
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    // Show explanation
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (!quiz) return;
    
    setShowExplanation(false);
    setSelectedOption(null);
    
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const getOptionClassName = (option: string) => {
    if (!submittedAnswers[currentQuestionIndex]) {
      return selectedOption === option 
        ? "border-blue-400 bg-blue-50" 
        : "border-gray-200 hover:border-gray-300";
    }
    
    const currentQuestion = quiz?.questions[currentQuestionIndex];
    if (option === currentQuestion?.correct_answer) {
      return "border-green-400 bg-green-50";
    }
    
    if (option === selectedOption && option !== currentQuestion?.correct_answer) {
      return "border-red-400 bg-red-50";
    }
    
    return "border-gray-200 opacity-60";
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {loading ? (
          <>
            <DialogHeader>
              <DialogTitle>Loading Quiz</DialogTitle>
            </DialogHeader>
            <div className="py-12 flex flex-col items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
              <p className="text-gray-600">
                Preparing your quiz...
              </p>
              <p className="text-gray-400 text-sm mt-2">
                This may take a moment
              </p>
            </div>
          </>
        ) : quiz ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {quiz.title}
              </DialogTitle>
              <p className="text-gray-600 mt-2">{quiz.description}</p>
            </DialogHeader>

            {quizCompleted ? (
              // Quiz Results
              <div className="py-8 space-y-6">
                <div className="flex flex-col items-center justify-center">
                  <Award className="h-20 w-20 text-amber-500 mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Quiz Completed!
                  </h2>
                  <p className="text-gray-600 mb-4">
                    You scored {score} out of {quiz.questions.length} questions correctly.
                  </p>
                  <div className="bg-blue-50 rounded-full py-2 px-6 text-blue-800 font-bold text-xl">
                    {Math.round((score / quiz.questions.length) * 100)}%
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 mt-6">
                  {quiz.questions.map((q, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="bg-gray-50 p-4 border-b">
                          <div className="flex items-start">
                            <div className="mr-3 mt-1">
                              {submittedAnswers[index] && (
                                q.correct_answer === 
                                (index === currentQuestionIndex ? selectedOption : null) ? (
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-red-600" />
                                )
                              )}
                            </div>
                            <p className="font-medium text-gray-900">
                              {index + 1}. {q.question}
                            </p>
                          </div>
                        </div>
                        <div className="p-4">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Correct answer:</span> {q.correct_answer}
                          </p>
                          <p className="text-sm text-gray-600 mt-2">
                            <span className="font-medium">Explanation:</span> {q.explanation}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-center mt-6">
                  <Button onClick={handleClose} className="px-6">
                    Close Quiz
                  </Button>
                </div>
              </div>
            ) : (
              // Quiz Questions
              <div className="py-4 space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">
                    Question {currentQuestionIndex + 1} of {quiz.questions.length}
                  </span>
                  <span className="text-sm font-medium text-blue-600">
                    Score: {score}/{quiz.questions.length}
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
                  ></div>
                </div>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      {quiz.questions[currentQuestionIndex].question}
                    </h3>

                    <RadioGroup 
                      value={selectedOption || ""} 
                      className="space-y-3"
                    >
                      {quiz.questions[currentQuestionIndex].options.map((option, optionIndex) => (
                        <div 
                          key={optionIndex} 
                          className={`border rounded-md p-4 cursor-pointer transition-colors ${getOptionClassName(option)}`}
                          onClick={() => handleOptionSelect(option)}
                        >
                          <div className="flex items-start">
                            <RadioGroupItem 
                              value={option} 
                              id={`option-${optionIndex}`} 
                              className="mt-1"
                              disabled={submittedAnswers[currentQuestionIndex]}
                            />
                            <Label 
                              htmlFor={`option-${optionIndex}`} 
                              className="ml-3 flex-1 cursor-pointer"
                            >
                              {option}
                            </Label>

                            {submittedAnswers[currentQuestionIndex] && (
                              option === quiz.questions[currentQuestionIndex].correct_answer ? (
                                <CheckCircle className="h-5 w-5 text-green-600 ml-2" />
                              ) : (
                                option === selectedOption && (
                                  <XCircle className="h-5 w-5 text-red-600 ml-2" />
                                )
                              )
                            )}
                          </div>
                        </div>
                      ))}
                    </RadioGroup>

                    {showExplanation && (
                      <div className="mt-6 p-4 bg-blue-50 rounded-md">
                        <p className="text-gray-800 font-medium mb-2">Explanation:</p>
                        <p className="text-gray-700">{quiz.questions[currentQuestionIndex].explanation}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="flex justify-end space-x-3">
                  {!submittedAnswers[currentQuestionIndex] ? (
                    <Button 
                      onClick={handleSubmitAnswer}
                      disabled={selectedOption === null}
                      className="px-6"
                    >
                      Submit Answer
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleNextQuestion}
                      className="px-6"
                    >
                      {currentQuestionIndex < quiz.questions.length - 1 ? (
                        <>
                          Next Question
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      ) : (
                        'View Results'
                      )}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Error Loading Quiz</DialogTitle>
            </DialogHeader>
            <div className="py-12 text-center">
              <p className="text-gray-600">Failed to load quiz</p>
              <Button onClick={handleClose} variant="outline" className="mt-4">
                Close
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}