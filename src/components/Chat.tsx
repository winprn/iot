import { Send } from 'lucide-react';
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from './ui/chat/chat-bubble';
import { ChatInput } from './ui/chat/chat-input';
import { ChatMessageList } from './ui/chat/chat-message-list';
import {
  ExpandableChat,
  ExpandableChatBody,
  ExpandableChatFooter,
  ExpandableChatHeader,
} from './ui/chat/expandable-chat';
import { Button } from './ui/button';
import { useRef, useState } from 'react';
import { GEMINI_API_KEY, THINKSPEAK_API_KEY } from '@/lib/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';

type Message = {
  message: string;
  type: 'sent' | 'received';
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const msgRef = useRef<HTMLTextAreaElement>(null);

  const sensorLogs = useQuery({
    queryKey: ['sensorLogs'],
    queryFn: async () => {
      const response = await fetch(
        `https://api.thingspeak.com/channels/2788103/feeds.json?api_key=${THINKSPEAK_API_KEY}`
      );

      const data = await response.json();
      data.feeds.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();

        return -(dateA - dateB);
      });

      return data;
    },
    refetchInterval: 5000,
  });

  const handleSendMessage = async () => {
    console.log('Message sent');
    const msg = msgRef.current?.value || '';
    setMessages([...messages, { message: msg, type: 'sent' }]);
    msgRef.current!.value = '';

    const info = sensorLogs.data.feeds.map((feed) => {
      return {
        text: `Temperature: ${Number.parseFloat(feed.field1).toFixed(
          1
        )}*C, Humidity: ${Number.parseFloat(feed.field2).toFixed(
          1
        )}%, Date: ${new Date(feed.created_at).toLocaleString()}`,
      };
    });

    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: 'Respond naturally to the message based on its context. If it is a question related to the provided data, combine the data to answer it. If the message is a greeting, expression of appreciation, or something unrelated, respond appropriately in a conversational manner.',
                },
                ...info,
                {
                  text: `Message: ${msg}`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!resp.ok) {
      console.error('Failed to send message', resp.status);
      return;
    }

    const data = await resp.json();
    const answer = data.candidates[0].content.parts[0].text;
    setMessages((prev) => [...prev, { message: answer, type: 'received' }]);
  };

  return (
    <ExpandableChat size='lg' position='bottom-right'>
      <ExpandableChatHeader className='flex-col text-center justify-center'>
        <h1 className='text-xl font-semibold'>Chat with our AI ✨</h1>
        <p>Ask any question for our AI to answer</p>
      </ExpandableChatHeader>
      <ExpandableChatBody>
        <ChatMessageList>
          {messages.map((msg, idx) => (
            <ChatBubble key={idx} variant={msg.type}>
              <ChatBubbleAvatar />
              <ChatBubbleMessage>{msg.message}</ChatBubbleMessage>
            </ChatBubble>
          ))}
        </ChatMessageList>
      </ExpandableChatBody>
      <ExpandableChatFooter className='flex flex-col gap-2'>
        <ChatInput ref={msgRef} />
        <Button
          type='submit'
          size='icon'
          onClick={handleSendMessage}
          className='bg-[#308BF3] text-white'
        >
          <Send className='size-4' />
        </Button>
      </ExpandableChatFooter>
    </ExpandableChat>
  );
}
