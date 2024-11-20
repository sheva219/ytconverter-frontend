'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Download, Loader2 } from 'lucide-react';

const formSchema = z.object({
  url: z.string().url('Please enter a valid YouTube URL'),
  format: z.enum(['mp3', 'mp4'], {
    required_error: 'Please select a format'
  })
});

export function Converter() {
  const [progress, setProgress] = useState(0);
  const [converting, setConverting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
      format: 'mp3'
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setConverting(true);
      setProgress(0);
      setDownloadUrl(null);

      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 429) {
          toast.error(
            `Rate limit exceeded. Please try again in ${Math.ceil(
              error.retryAfter / 60
            )} minutes.`
          );
        } else {
          throw new Error(error.error || 'Conversion failed');
        }
        return;
      }

      const data = await response.json();
      setDownloadUrl(data.downloadUrl);
      toast.success('Conversion completed successfully!');
    } catch (error) {
      toast.error('Failed to convert video. Please try again.');
    } finally {
      setConverting(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Convert Video</CardTitle>
        <CardDescription>
          Enter a YouTube URL and select your preferred format
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="https://www.youtube.com/watch?v=..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="format"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="mp3" id="mp3" />
                        <Label htmlFor="mp3">MP3 (Audio)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="mp4" id="mp4" />
                        <Label htmlFor="mp4">MP4 (Video)</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {converting && (
              <div className="space-y-2">
                {/* <Progress value={progress} /> */}
                <p className="text-sm text-muted-foreground text-center">
                  Converting... Please wait
                </p>
              </div>
            )}

            <div className="flex gap-4">
              <Button type="submit" className="w-full" disabled={converting}>
                {converting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Converting
                  </>
                ) : (
                  'Convert'
                )}
              </Button>

              {downloadUrl && (
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={() => window.open(downloadUrl, '_blank')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
