// ============================================================
// AiRecommendations.tsx — Shows AI-powered sweet recommendations
//
// This component:
// 1. Detects current festival automatically (by date)
// 2. Gets current weather from a free weather API
// 3. Calls OUR backend → backend calls Claude AI
// 4. Shows 3 recommended sweets with reasons
// ============================================================

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Sun, CloudRain, Cloud, Thermometer, RefreshCw } from "lucide-react";
import { getAIRecommendations } from "@/api/index";

// Shape of one recommendation from AI
interface Recommendation {
    name: string;
    reason: string;
}

// Shape of the full AI response
interface AIResponse {
    recommendations: Recommendation[];
    message: string;
}

// ============================================================
// HELPER: Detect current Indian festival by date
// This runs on the frontend, no API needed
// ============================================================
const getCurrentFestival = (): string => {
    const now = new Date();
    const month = now.getMonth() + 1; // 1-12
    const day = now.getDate();

    // Check major Indian festivals by approximate dates
    if (month === 10 && day >= 15 && day <= 30) return "Diwali";
    if (month === 11 && day >= 1 && day <= 5)  return "Diwali week";
    if (month === 3 && day >= 1 && day <= 25)  return "Holi";
    if (month === 8 && day >= 10 && day <= 20) return "Raksha Bandhan";
    if (month === 8 && day >= 25 && day <= 31) return "Janmashtami";
    if (month === 10 && day >= 1 && day <= 10) return "Navratri";
    if (month === 1 && day >= 1 && day <= 15)  return "New Year and Makar Sankranti";
    if (month === 4 && day >= 13 && day <= 15) return "Baisakhi";
    if (month === 11 && day >= 5 && day <= 15) return "Chhath Puja";
    if (month === 12 && day >= 20 && day <= 31) return "Christmas and New Year";

    return "regular day";
};

// ============================================================
// HELPER: Get weather from free weather API
// Uses wttr.in which gives weather for any city
// ============================================================
const getWeather = async (): Promise<string> => {
    try {
        // Get simple weather description for Hisar
        const response = await fetch("https://wttr.in/Hisar?format=%C+%t", {
            signal: AbortSignal.timeout(5000) // 5 second timeout
        });
        const text = await response.text();
        return text.trim();
    } catch {
        // If weather API fails, use a seasonal fallback
        const month = new Date().getMonth() + 1;
        if (month >= 3 && month <= 6) return "hot sunny weather";
        if (month >= 7 && month <= 9) return "rainy monsoon weather";
        if (month >= 10 && month <= 11) return "pleasant autumn weather";
        return "cool winter weather";
    }
};

// ============================================================
// MAIN COMPONENT
// ============================================================
const AiRecommendations = () => {
    const [data, setData] = useState<AIResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [weatherInfo, setWeatherInfo] = useState("");
    const [festivalInfo, setFestivalInfo] = useState("");

    // Fetch recommendations when component loads
    const fetchRecommendations = async () => {
        setLoading(true);
        setError("");

        try {
            const weather = await getWeather();
            const festival = getCurrentFestival();

            setWeatherInfo(weather);
            setFestivalInfo(festival);

            // Call our backend → backend calls Claude AI
            const response = await getAIRecommendations(weather, festival);
            setData(response.data.data);
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : String(err);
            setError("AI is taking a short break. Please try again! " + errorMsg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecommendations();
    }, []);

    // ── LOADING STATE ──────────────────────────────────────────
    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-2xl mb-8"
                style={{
                    background: "linear-gradient(135deg, hsl(var(--primary)/0.08), hsl(var(--primary)/0.03))",
                    border: "1px solid hsl(var(--primary)/0.2)",
                    padding: "24px"
                }}
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ background: "hsl(var(--primary)/0.1)" }}>
                        <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                    </div>
                    <div>
                        <div className="h-4 w-48 rounded animate-pulse mb-2"
                            style={{ background: "hsl(var(--primary)/0.15)" }} />
                        <div className="h-3 w-32 rounded animate-pulse"
                            style={{ background: "hsl(var(--muted)/0.5)" }} />
                    </div>
                </div>
                <p className="font-body text-sm text-muted-foreground mt-3 ml-13">
                    🤖 AI is analyzing the weather and festival to find perfect sweets for you...
                </p>
            </motion.div>
        );
    }

    // ── ERROR STATE ────────────────────────────────────────────
    if (error) return null;

    if (!data) return null;

    // ── SUCCESS STATE ──────────────────────────────────────────
    return (
        <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl mb-8 overflow-hidden"
            style={{
                background: "linear-gradient(135deg, hsl(var(--primary)/0.06) 0%, hsl(var(--primary)/0.02) 100%)",
                border: "1px solid hsl(var(--primary)/0.2)"
            }}
        >
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between"
                style={{ borderBottom: "1px solid hsl(var(--primary)/0.1)" }}>
                <div className="flex items-center gap-3">
                    {/* Animated AI badge */}
                    <div className="w-9 h-9 rounded-full flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary)/0.7))" }}>
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <p className="font-display font-bold text-foreground text-sm">
                            AI Recommendations
                        </p>
                        <p className="font-body text-xs text-muted-foreground">
                            Powered by Claude AI • Personalized for you
                        </p>
                    </div>
                </div>

                {/* Context badges */}
                <div className="hidden sm:flex items-center gap-2">
                    <span className="flex items-center gap-1 font-body text-xs px-3 py-1 rounded-full"
                        style={{ background: "hsl(var(--primary)/0.1)", color: "hsl(var(--primary))" }}>
                        <Thermometer className="w-3 h-3" />
                        {weatherInfo.slice(0, 20)}
                    </span>
                    {festivalInfo !== "regular day" && (
                        <span className="font-body text-xs px-3 py-1 rounded-full"
                            style={{ background: "hsl(38 92% 90%)", color: "hsl(38 80% 40%)" }}>
                            🎉 {festivalInfo}
                        </span>
                    )}
                    <button
                        onClick={fetchRecommendations}
                        title="Refresh recommendations"
                        className="p-1.5 rounded-full hover:bg-primary/10 transition-colors"
                    >
                        <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                </div>
            </div>

            {/* AI Message */}
            <div className="px-6 py-3">
                <p className="font-body text-sm text-muted-foreground italic">
                    ✨ {data.message}
                </p>
            </div>

            {/* Recommendation Cards */}
            <div className="px-6 pb-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {data.recommendations.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="rounded-xl p-4 cursor-default"
                        style={{
                            background: "hsl(var(--card))",
                            border: "1px solid hsl(var(--primary)/0.12)",
                            boxShadow: "0 2px 8px hsl(var(--primary)/0.05)"
                        }}
                    >
                        {/* Rank badge */}
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary)/0.7))" }}>
                                {index + 1}
                            </span>
                            <p className="font-display font-bold text-foreground text-sm">
                                {item.name}
                            </p>
                        </div>
                        <p className="font-body text-xs text-muted-foreground leading-relaxed">
                            {item.reason}
                        </p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default AiRecommendations;
