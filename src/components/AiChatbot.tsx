// ============================================================
// AiChatbot.tsx — Floating AI Chat Assistant for Saini Sweets
//
// Features:
// - Floating button in bottom-right corner
// - Click to open chat window
// - Customer types questions about sweets
// - AI responds with helpful suggestions from our menu
// - Smooth animations with framer-motion
// ============================================================

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, Bot } from "lucide-react";
import { sendChatMessage } from "@/api/index";

// Shape of one chat message
interface Message {
    id: string;
    role: "user" | "ai";
    text: string;
    timestamp: Date;
}

// Suggested questions for the user to click
const SUGGESTED_QUESTIONS = [
    "What sweets are good for Diwali? 🪔",
    "Suggest something cool for hot weather ☀️",
    "Best sweets for a birthday? 🎂",
    "What's your most popular item? ⭐",
];

const AiChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "ai",
            text: "Namaste! 🙏 I'm your Saini Sweets AI assistant. Ask me anything about our sweets — I can suggest items based on festivals, weather, or your mood!",
            timestamp: new Date()
        }
    ]);
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    // ── SEND MESSAGE ───────────────────────────────────────────
    const handleSend = async (text?: string) => {
        const messageText = text || inputText.trim();
        if (!messageText || isLoading) return;

        // Add user message to chat
        const userMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            text: messageText,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMsg]);
        setInputText("");
        setIsLoading(true);

        try {
            // Call our backend → Claude AI
            const response = await sendChatMessage(messageText);
            const aiReply = response.data.response;

            // Add AI response to chat
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "ai",
                text: aiReply,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch {
            // Add error message
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: "ai",
                text: "Sorry, I'm having trouble connecting right now. Please try again in a moment! 🙏",
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Enter key press
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* ── CHAT WINDOW ─────────────────────────────────── */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 20 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="fixed bottom-24 right-5 z-50 w-80 sm:w-96 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
                        style={{
                            height: "480px",
                            background: "hsl(var(--card))",
                            border: "1px solid hsl(var(--primary)/0.2)",
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 flex-shrink-0"
                            style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary)/0.8))" }}>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <p className="font-display font-bold text-white text-sm">
                                        Saini Sweets AI
                                    </p>
                                    <div className="flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-300" />
                                        <p className="font-body text-xs text-white/70">Online • Powered by Claude</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                            >
                                <X className="w-4 h-4 text-white" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                                >
                                    {/* Avatar */}
                                    {msg.role === "ai" && (
                                        <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-1"
                                            style={{ background: "hsl(var(--primary)/0.1)" }}>
                                            <Bot className="w-3.5 h-3.5 text-primary" />
                                        </div>
                                    )}

                                    {/* Bubble */}
                                    <div
                                        className={`max-w-[75%] rounded-2xl px-3 py-2 font-body text-xs leading-relaxed ${
                                            msg.role === "user"
                                                ? "rounded-tr-sm text-white"
                                                : "rounded-tl-sm text-foreground"
                                        }`}
                                        style={msg.role === "user"
                                            ? { background: "hsl(var(--primary))" }
                                            : { background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))" }
                                        }
                                    >
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}

                            {/* Loading dots */}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex gap-2"
                                >
                                    <div className="w-7 h-7 rounded-full flex items-center justify-center"
                                        style={{ background: "hsl(var(--primary)/0.1)" }}>
                                        <Bot className="w-3.5 h-3.5 text-primary" />
                                    </div>
                                    <div className="rounded-2xl rounded-tl-sm px-4 py-3"
                                        style={{ background: "hsl(var(--muted))" }}>
                                        <div className="flex gap-1">
                                            {[0, 1, 2].map(i => (
                                                <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce"
                                                    style={{ animationDelay: `${i * 150}ms` }} />
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Suggested questions — show only when just 1 message (welcome) */}
                        {messages.length === 1 && !isLoading && (
                            <div className="px-4 pb-2 flex flex-wrap gap-1.5 flex-shrink-0">
                                {SUGGESTED_QUESTIONS.map((q) => (
                                    <button
                                        key={q}
                                        onClick={() => handleSend(q)}
                                        className="font-body text-xs px-2.5 py-1.5 rounded-full border transition-all hover:border-primary hover:text-primary"
                                        style={{
                                            borderColor: "hsl(var(--border))",
                                            color: "hsl(var(--muted-foreground))",
                                            background: "hsl(var(--background))"
                                        }}
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input */}
                        <div className="px-4 py-3 flex-shrink-0"
                            style={{ borderTop: "1px solid hsl(var(--border))" }}>
                            <div className="flex items-center gap-2 rounded-xl px-3 py-2"
                                style={{ background: "hsl(var(--muted)/0.5)", border: "1px solid hsl(var(--border))" }}>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputText}
                                    onChange={e => setInputText(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask about sweets..."
                                    disabled={isLoading}
                                    className="flex-1 bg-transparent font-body text-xs text-foreground placeholder:text-muted-foreground outline-none"
                                />
                                <button
                                    onClick={() => handleSend()}
                                    disabled={!inputText.trim() || isLoading}
                                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                                    style={{ background: "hsl(var(--primary))" }}
                                >
                                    <Send className="w-3.5 h-3.5 text-white" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── FLOATING BUTTON ───────────────────────────────── */}
            <motion.button
                onClick={() => setIsOpen(prev => !prev)}
                className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary)/0.8))" }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={isOpen ? {} : { y: [0, -4, 0] }}
                transition={isOpen ? {} : { repeat: Infinity, duration: 2, repeatDelay: 3 }}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.15 }}>
                            <X className="w-6 h-6 text-white" />
                        </motion.div>
                    ) : (
                        <motion.div key="open"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.15 }}>
                            <MessageSquare className="w-6 h-6 text-white" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Tooltip label when closed */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="fixed bottom-7 right-20 z-40 font-body text-xs text-white px-3 py-1.5 rounded-full shadow pointer-events-none"
                        style={{ background: "hsl(var(--primary)/0.9)" }}
                    >
                        Ask AI 🤖
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AiChatbot;
