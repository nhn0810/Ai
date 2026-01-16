'use client';

import { useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Send, Image as ImageIcon, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

interface ChatInputProps {
    studyId: string;
    userId: string;
    onMessageSent?: () => void;
}

export default function ChatInput({ studyId, userId, onMessageSent }: ChatInputProps) {
    const [newMessage, setNewMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    const clearFile = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!newMessage.trim() && !selectedFile) || !userId) return;

        const content = newMessage.trim();
        let imageUrl = null;

        // Optimistic UI updates could happen here in parent, 
        // but for now we rely on the realtime subscription or local state refresh
        setNewMessage('');
        setIsUploading(true);

        try {
            if (selectedFile) {
                const fileExt = selectedFile.name.split('.').pop();
                const fileName = `${studyId}/${Date.now()}.${fileExt}`;
                
                const { error: uploadError } = await supabase.storage
                    .from('chat-images')
                    .upload(fileName, selectedFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('chat-images')
                    .getPublicUrl(fileName);
                
                imageUrl = publicUrl;
            }

            const { error: insertError } = await supabase
                .from('messages')
                .insert({ 
                    content: content || null, // Allow null if only image
                    study_id: Number(studyId), 
                    user_id: userId,
                    image_url: imageUrl
                });

            if (insertError) throw insertError;

            clearFile();
            onMessageSent?.();

        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("메시지 전송 실패");
            setNewMessage(content); // Restore message
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 max-w-[430px] w-full bg-white border-t">
            {previewUrl && (
                <div className="p-2 border-b flex items-start gap-2 bg-gray-50">
                    <div className="relative">
                        <img src={previewUrl} alt="Preview" className="h-20 rounded-md border" />
                        <button 
                            onClick={clearFile}
                            className="absolute -top-1 -right-1 bg-black text-white rounded-full p-0.5"
                        >
                            <X size={12} />
                        </button>
                    </div>
                </div>
            )}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 p-4">
                <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                />
                <Button 
                    type="button" 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                >
                    <ImageIcon className="h-5 w-5 text-gray-500" />
                </Button>
                
                <Input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="메시지 입력..."
                    className="flex-1"
                    disabled={isUploading}
                />
                
                <Button type="submit" size="icon" disabled={(!newMessage.trim() && !selectedFile) || isUploading}>
                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
            </form>
        </div>
    );
}
