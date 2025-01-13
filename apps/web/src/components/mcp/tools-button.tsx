'use client';

import * as React from 'react';
import { Wrench } from 'lucide-react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  ScrollArea,
  Badge,
  cn,
} from '@danky/ui';

interface Server {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  tools: Tool[];
}

interface Tool {
  id: string;
  name: string;
  description: string;
  icon?: React.ReactNode;
}

interface ToolsButtonProps {
  servers: Server[];
  onToolSelect: (serverId: string, toolId: string) => void;
  className?: string;
}

export function ToolsButton({ servers, onToolSelect, className }: ToolsButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedServer, setSelectedServer] = React.useState<Server | null>(null);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className={cn('absolute bottom-4 right-8', className)}>
          <Wrench className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{selectedServer ? selectedServer.name : 'Available Servers'}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="mt-4 h-[60vh]">
          <div className="space-y-4">
            {selectedServer ? (
              <div className="animate-in slide-in-from-right duration-200">
                <Button variant="ghost" className="mb-4" onClick={() => setSelectedServer(null)}>
                  ← Back to Servers
                </Button>
                {selectedServer.tools.map(tool => (
                  <div
                    key={tool.id}
                    className="hover:bg-accent flex cursor-pointer items-center space-x-4 rounded-lg border p-4 transition-colors"
                    onClick={() => {
                      onToolSelect(selectedServer.id, tool.id);
                      setIsOpen(false);
                      setSelectedServer(null);
                    }}
                  >
                    {tool.icon}
                    <div className="flex-1">
                      <h4 className="font-medium">{tool.name}</h4>
                      <p className="text-muted-foreground text-sm">{tool.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="animate-in slide-in-from-left duration-200">
                {servers.map(server => (
                  <div
                    key={server.id}
                    className="hover:bg-accent flex cursor-pointer items-center space-x-4 rounded-lg border p-4 transition-colors"
                    onClick={() => setSelectedServer(server)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{server.name}</h4>
                        <Badge
                          variant={
                            server.status === 'connected'
                              ? 'default'
                              : server.status === 'error'
                                ? 'destructive'
                                : 'secondary'
                          }
                        >
                          {server.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {server.tools.length} tools available
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
