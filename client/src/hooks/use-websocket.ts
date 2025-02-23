import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";

export function useWebSocket() {
  const socket = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    if (socket.current?.readyState === WebSocket.OPEN) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    socket.current = new WebSocket(wsUrl);

    socket.current.onopen = () => {
      console.log('WebSocket connected');
      reconnectAttempts.current = 0;
    };

    socket.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case 'connected':
            console.log("WebSocket connected");
            break;
          case 'match_created':
          case 'match_updated':
            // Invalidate and refetch matches query
            queryClient.invalidateQueries({ queryKey: ['/api/matches'] });
            // If we're on a specific match page, invalidate that query too
            if (data.match?.id) {
              queryClient.invalidateQueries({ 
                queryKey: [`/api/matches/${data.match.id}`]
              });
            }
            break;
          default:
            console.log('Unknown message type:', data.type);
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };

    socket.current.onclose = () => {
      console.log('WebSocket disconnected');

      // Implement reconnection with backoff
      if (reconnectAttempts.current < maxReconnectAttempts) {
        const timeout = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000);
        reconnectAttempts.current++;

        setTimeout(() => {
          console.log(`Attempting to reconnect (${reconnectAttempts.current}/${maxReconnectAttempts})`);
          connect();
        }, timeout);
      } else {
        toast({
          title: "Connection Lost",
          description: "Unable to maintain real-time connection. Please refresh the page.",
          variant: "destructive",
        });
      }
    };

    socket.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }, [queryClient, toast]);

  useEffect(() => {
    connect();
    return () => {
      if (socket.current) {
        socket.current.close();
      }
    };
  }, [connect]);

  return socket.current;
}