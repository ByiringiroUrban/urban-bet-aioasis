
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertTriangle, ChevronRight, RefreshCcw, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: number;
  text: string;
  options: {
    value: string;
    label: string;
    score: number;
  }[];
}

const questions: Question[] = [
  {
    id: 1,
    text: "How often do you find yourself spending more time gambling than initially planned?",
    options: [
      { value: "never", label: "Never", score: 0 },
      { value: "sometimes", label: "Sometimes", score: 1 },
      { value: "often", label: "Often", score: 2 },
      { value: "always", label: "Almost Always", score: 3 },
    ],
  },
  {
    id: 2,
    text: "Have you ever gambled to recover money you've previously lost?",
    options: [
      { value: "never", label: "Never", score: 0 },
      { value: "sometimes", label: "Sometimes", score: 1 },
      { value: "often", label: "Often", score: 2 },
      { value: "always", label: "Almost Always", score: 3 },
    ],
  },
  {
    id: 3,
    text: "Do you feel restless or irritable when trying to cut down on gambling?",
    options: [
      { value: "never", label: "Never", score: 0 },
      { value: "sometimes", label: "Sometimes", score: 1 },
      { value: "often", label: "Often", score: 2 },
      { value: "always", label: "Almost Always", score: 3 },
    ],
  },
  {
    id: 4,
    text: "Have you ever borrowed money or sold anything to finance gambling?",
    options: [
      { value: "never", label: "Never", score: 0 },
      { value: "sometimes", label: "Sometimes", score: 1 },
      { value: "often", label: "Often", score: 2 },
      { value: "always", label: "Almost Always", score: 3 },
    ],
  },
  {
    id: 5,
    text: "Has gambling ever caused problems in your relationships or daily responsibilities?",
    options: [
      { value: "never", label: "Never", score: 0 },
      { value: "sometimes", label: "Sometimes", score: 1 },
      { value: "often", label: "Often", score: 2 },
      { value: "always", label: "Almost Always", score: 3 },
    ],
  },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ResponsibleGamblingQuiz = ({ open, onOpenChange }: Props) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: value }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      calculateResults();
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  const calculateResults = () => {
    setShowResults(true);
    const totalScore = questions.reduce((acc, question) => {
      const answer = answers[question.id - 1];
      const option = question.options.find((opt) => opt.value === answer);
      return acc + (option?.score || 0);
    }, 0);

    const maxScore = questions.length * 3;
    const percentage = (totalScore / maxScore) * 100;

    if (percentage > 50) {
      toast({
        title: "Important Notice",
        description: "Based on your responses, we recommend speaking with our responsible gambling team.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-bet-primary" />
            Responsible Gambling Self-Assessment
          </DialogTitle>
          <DialogDescription>
            This quiz will help you understand your gambling habits better.
            Answer honestly for the most accurate assessment.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {!showResults ? (
            <div className="space-y-6">
              <div className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {questions.length}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  {questions[currentQuestion].text}
                </h3>

                <RadioGroup
                  value={answers[currentQuestion]}
                  onValueChange={handleAnswer}
                  className="space-y-3"
                >
                  {questions[currentQuestion].options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value}>{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={nextQuestion}
                  disabled={!answers[currentQuestion]}
                  className="flex items-center gap-2"
                >
                  {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="rounded-lg bg-bet-primary/10 p-6 text-center">
                <h3 className="text-xl font-semibold mb-4">Assessment Complete</h3>
                <p className="text-muted-foreground">
                  Thank you for completing the self-assessment. If you have any concerns
                  about your gambling habits, we encourage you to:
                </p>
                <ul className="mt-4 space-y-2 text-left">
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-bet-primary" />
                    Set deposit limits
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-bet-primary" />
                    Take a break using our self-exclusion tools
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-bet-primary" />
                    Contact our support team for guidance
                  </li>
                </ul>
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={resetQuiz}
                  className="flex items-center gap-2"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Take Quiz Again
                </Button>
                <Button onClick={() => onOpenChange(false)}>Close</Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
