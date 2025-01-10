import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  title: string;
  description: string;
  className?: string;
  onClick?: () => void;
}

export function ToolCard({
  title,
  description,
  className,
  onClick,
}: ToolCardProps) {
  return (
    <Card
      className={cn(
        "hover:bg-accent/50 cursor-pointer transition-colors",
        className
      )}
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}