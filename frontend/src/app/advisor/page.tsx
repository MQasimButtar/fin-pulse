'use client';

import React, { useEffect, useState, useRef } from 'react';
import { financeService } from '@/services/financeService';
import api from '@/lib/api';
import { TransactionResponse, BudgetResponse } from '@/types/finance';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Lightbulb,
  ArrowRight,
  Send,
  User,
  Bot,
  Zap,
  DollarSign,
  PieChart,
  History
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface Insight {
  type: 'positive' | 'warning' | 'tip';
  title: string;
  description: string;
  icon: any;
  action?: () => void;
  actionLabel?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AdvisorPage() {
  const router = useRouter();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [budgets, setBudgets] = useState<BudgetResponse[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<Insight[]>([]);
  
  // Chat State
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: "Hello! I'm your dedicated Finance AI. I've analyzed your account data. You can ask me about your spending trends, budget status, or for advice on how to improve your savings. What's on your mind?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [txData, budgetData, assetData] = await Promise.all([
          financeService.getTransactions(),
          financeService.getBudgets(),
          api.get('/assets').then(res => res.data)
        ]);
        setTransactions(txData);
        setBudgets(budgetData);
        setAssets(assetData);
        generateInsights(txData, budgetData, assetData);
      } catch (error) {
        console.error('Error fetching advisor data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const generateInsights = (txs: TransactionResponse[], bgs: BudgetResponse[], asts: any[]) => {
    const newInsights: Insight[] = [];
    
    const expenses = txs.filter(t => t.type === 'expense');
    const income = txs.filter(t => t.type === 'income');
    const totalExpenses = expenses.reduce((acc, t) => acc + t.amount, 0);
    const totalIncome = income.reduce((acc, t) => acc + t.amount, 0);
    const netSavings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

    // 1. Savings Rate Insight
    if (savingsRate > 25) {
      newInsights.push({
        type: 'positive',
        title: 'Wealth Builder Status',
        description: `Your savings rate is ${savingsRate.toFixed(1)}%. You are in the top tier of financial discipline. Consider moving excess cash into your investment portfolio.`,
        icon: TrendingUp,
        actionLabel: 'Invest Now',
        action: () => router.push('/portfolio')
      });
    } else if (savingsRate < 10 && totalIncome > 0) {
      newInsights.push({
        type: 'warning',
        title: 'Savings Squeeze',
        description: `You're only saving ${savingsRate.toFixed(1)}% of your income. Standard advice suggests aiming for 20%. Let's look at your biggest expense categories.`,
        icon: AlertTriangle,
        actionLabel: 'Review Spending',
        action: () => router.push('/transactions')
      });
    }

    // 2. Emergency Fund Analysis
    const monthlyExpenseAvg = totalExpenses / (txs.length > 0 ? Math.max(1, new Set(txs.map(t => new Date(t.date).getMonth())).size) : 1);
    const estimatedCash = netSavings; 
    const monthsCovered = monthlyExpenseAvg > 0 ? estimatedCash / monthlyExpenseAvg : 0;

    if (monthsCovered < 3 && totalExpenses > 0) {
      newInsights.push({
        type: 'tip',
        title: 'Build Safety Net',
        description: `Your current liquid savings cover about ${monthsCovered.toFixed(1)} months of expenses. Financial security starts with a 6-month emergency fund ($${(monthlyExpenseAvg * 6).toLocaleString()}).`,
        icon: Zap,
        actionLabel: 'Set Goal'
      });
    }

    // 3. Category Deep Dive
    const categoryTotals: any = {};
    expenses.forEach(e => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });
    const topCategory = Object.entries(categoryTotals).sort((a: any, b: any) => b[1] - a[1])[0];
    
    if (topCategory && (topCategory[1] as number) > totalExpenses * 0.4) {
      newInsights.push({
        type: 'warning',
        title: `High ${topCategory[0]} Spending`,
        description: `${topCategory[0]} accounts for ${((topCategory[1] as number) / totalExpenses * 100).toFixed(0)}% of your total expenses. Look for ways to optimize this category.`,
        icon: PieChart,
        actionLabel: 'Analyze Category'
      });
    }

    // 4. Investment Check
    const totalInv = asts.reduce((acc, a) => acc + (a.total_value || 0), 0);
    if (totalInv > 0) {
      const topAsset = [...asts].sort((a, b) => (b.total_value || 0) - (a.total_value || 0))[0];
      const concentration = (topAsset.total_value / totalInv) * 100;
      if (concentration > 50) {
        newInsights.push({
          type: 'tip',
          title: 'Portfolio Concentration',
          description: `Your ${topAsset.symbol} holding represents ${concentration.toFixed(0)}% of your investments. Diversifying could reduce your risk profile.`,
          icon: DollarSign,
          actionLabel: 'Manage Risk',
          action: () => router.push('/portfolio')
        });
      }
    }

    setInsights(newInsights);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp: new Date() }]);
    setIsTyping(true);

    // Advanced Simulated AI Logic
    setTimeout(() => {
      const query = userMessage.toLowerCase();
      let response = "";
      
      const expenses = transactions.filter(t => t.type === 'expense');
      const income = transactions.filter(t => t.type === 'income');
      const totalExp = expenses.reduce((acc, t) => acc + t.amount, 0);
      const totalInc = income.reduce((acc, t) => acc + t.amount, 0);
      const net = totalInc - totalExp;
      const rate = totalInc > 0 ? (net / totalInc) * 100 : 0;

      // 1. Check for "Rules" or "How to" (General Advice)
      if (query.includes('rule') || query.includes('how to') || query.includes('principle') || query.includes('guide')) {
        if (query.includes('save') || query.includes('budget')) {
          response = "The gold standard is the **50/30/20 Rule**: 50% of income for Needs (rent, food), 30% for Wants (entertainment), and 20% for Savings/Debt. Currently, you are saving " + rate.toFixed(1) + "%, which is " + (rate >= 20 ? "excellent!" : "something we can improve.");
        } else if (query.includes('invest')) {
          response = "For investing, follow the **Low-Cost Index Fund** principle. Don't try to beat the market; own the market. Also, ensure you have a 6-month emergency fund before moving heavily into stocks.";
        } else {
          response = "A great starting rule is the **'Pay Yourself First'** principle: set aside your savings target the moment you get paid, then live on what's left. Don't wait until the end of the month!";
        }
      }
      // 2. Check for Stats (Data Analysis)
      else if (query.includes('how much') || query.includes('spent') || query.includes('total') || query.includes('summary')) {
        response = `Total Spending: $${totalExp.toLocaleString()}. Total Income: $${totalInc.toLocaleString()}. Net Flow: $${net.toLocaleString()}. `;
        const topCat = Object.entries(expenses.reduce((acc: any, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
          return acc;
        }, {})).sort((a: any, b: any) => b[1] - a[1])[0];
        if (topCat) response += `Your heaviest category is ${topCat[0]} at $${(topCat[1] as number).toLocaleString()}.`;
      }
      // 3. Check for specific concepts
      else if (query.includes('emergency') || query.includes('safety net')) {
        const monthlyAvg = totalExp / (transactions.length > 0 ? Math.max(1, new Set(transactions.map(t => new Date(t.date).getMonth())).size) : 1);
        response = `An emergency fund should cover 3-6 months of expenses. Based on your $${monthlyAvg.toFixed(0)} monthly average, you should aim for a safety net of $${(monthlyAvg * 6).toLocaleString()}.`;
      }
      else if (query.includes('save') || query.includes('savings') || query.includes('rate')) {
        response = `Your current savings rate is ${rate.toFixed(1)}%. You've saved $${net.toLocaleString()} from a total income of $${totalInc.toLocaleString()}. ${rate > 20 ? "You're beating the 20% benchmark!" : "Try to reach the 20% mark for long-term security."}`;
      }
      else if (query.includes('invest') || query.includes('stock') || query.includes('crypto')) {
        const invTotal = assets.reduce((acc, a) => acc + (a.total_value || 0), 0);
        response = `Your portfolio is worth $${invTotal.toLocaleString()}. You have ${assets.length} assets. ${assets.length < 5 ? "Consider diversifying into more sectors." : "Your diversification looks reasonable."}`;
      }
      else {
        response = "I can help with specific financial questions. Try asking: 'What is the 50/30/20 rule?', 'What is my emergency fund goal?', or 'Show me my spending summary'.";
      }

      setMessages(prev => [...prev, { role: 'assistant', content: response, timestamp: new Date() }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
        
        {/* Left Section: Context & Insights (8 cols) */}
        <div className="lg:col-span-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="bg-zinc-950 p-4 rounded-3xl shadow-2xl shadow-zinc-200">
                <Sparkles className="text-white h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-zinc-950 tracking-tight">Financial Advisor</h1>
                <p className="text-zinc-500 mt-1 font-medium">Strategic intelligence for your personal economy.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="px-4 py-2 bg-zinc-100 rounded-2xl text-xs font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                <History size={14} />
                Live Analysis
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              [1, 2, 3, 4].map(i => (
                <div key={i} className="h-44 bg-zinc-50 rounded-3xl border border-zinc-100 animate-pulse" />
              ))
            ) : (
              insights.map((insight, idx) => (
                <div 
                  key={idx} 
                  className={cn(
                    "p-8 rounded-[2rem] border-2 transition-all group relative overflow-hidden",
                    insight.type === 'positive' && "bg-green-50/20 border-green-100 hover:border-green-200",
                    insight.type === 'warning' && "bg-red-50/20 border-red-100 hover:border-red-200",
                    insight.type === 'tip' && "bg-zinc-50/30 border-zinc-200 hover:border-zinc-300"
                  )}
                >
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm",
                    insight.type === 'positive' && "bg-white text-green-600",
                    insight.type === 'warning' && "bg-white text-red-600",
                    insight.type === 'tip' && "bg-zinc-950 text-white"
                  )}>
                    <insight.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 mb-2">{insight.title}</h3>
                  <p className="text-zinc-600 text-sm leading-relaxed mb-6">{insight.description}</p>
                  
                  {insight.actionLabel && (
                    <button 
                      onClick={insight.action}
                      className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-950 group-hover:gap-3 transition-all"
                    >
                      {insight.actionLabel}
                      <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Advice Banner */}
          <div className="bg-zinc-950 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-zinc-400 border border-white/10">
                  Pro Feature
                </div>
                <h2 className="text-3xl font-bold">Optimize your tax strategy</h2>
                <p className="text-zinc-400 leading-relaxed">Our advanced models suggest you could save up to $1,400 annually by reallocating your dividends into a tax-advantaged account.</p>
                <button className="bg-white text-zinc-950 px-8 py-3 rounded-2xl font-bold text-sm hover:scale-105 transition-transform">
                  View Tax Report
                </button>
              </div>
              <div className="w-48 h-48 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full blur-3xl opacity-20 absolute -right-10 -top-10" />
            </div>
          </div>
        </div>

        {/* Right Section: AI Chat (4 cols) */}
        <div className="lg:col-span-4 flex flex-col h-[700px] sticky top-8">
          <div className="flex flex-col h-full bg-white rounded-[2.5rem] border-2 border-zinc-100 shadow-2xl shadow-zinc-200/50 overflow-hidden">
            {/* Chat Header */}
            <div className="p-6 bg-zinc-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                  <Bot size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Finance Expert</h2>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">System Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-50/30 scroll-smooth"
            >
              {messages.map((msg, idx) => (
                <div key={idx} className={cn(
                  "flex flex-col gap-2 max-w-[85%]",
                  msg.role === 'user' ? "ml-auto items-end" : "items-start"
                )}>
                  <div className={cn(
                    "px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                    msg.role === 'assistant' 
                      ? "bg-white border border-zinc-100 text-zinc-800" 
                      : "bg-zinc-950 text-white"
                  )}>
                    {msg.content}
                  </div>
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-start gap-3">
                  <div className="bg-white border border-zinc-100 px-4 py-3 rounded-2xl shadow-sm">
                    <div className="flex gap-1.5">
                      <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-duration:0.8s]" />
                      <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-6 border-t border-zinc-100 bg-white">
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Ask about spending or advice..."
                  className="w-full pl-5 pr-14 py-4 bg-zinc-100 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-zinc-950 focus:bg-white transition-all outline-none"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isTyping}
                />
                <button 
                  type="submit"
                  disabled={isTyping || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-zinc-950 text-white rounded-xl disabled:opacity-30 transition-all hover:scale-105 active:scale-95 shadow-lg"
                >
                  <Send size={20} />
                </button>
              </div>
              <p className="mt-4 text-[10px] text-center text-zinc-400 font-bold uppercase tracking-widest">
                AI can make mistakes. Verify important data.
              </p>
            </form>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
