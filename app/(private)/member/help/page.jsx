"use client";

import React from "react";
import { 
    HelpCircle, 
    ArrowRight, 
    Rocket, 
    PiggyBank, 
    HandCoins, 
    FileText, 
    ShieldCheck, 
    UserCircle,
    Mail,
    MessageCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export default function MemberHelpCenter() {
    const primaryColor = "#236c2e";

    const quickLinks = [
        { title: "Getting Started", icon: Rocket, desc: "New here? Learn the basics of your portal." },
        { title: "Savings Guide", icon: PiggyBank, desc: "How to manage your deposits and interest." },
        { title: "Loan Application", icon: HandCoins, desc: "Step-by-step guide to applying for credit." },
        { title: "Statements", icon: FileText, desc: "How to download your financial reports." }
    ];

    const faqs = [
        {
            q: "How do I activate my account?",
            a: "Once registered by an Admin, you will receive an invitation email. Click the link to set your password. You can then log in using your Member Number."
        },
        {
            q: "How do I apply for a loan?",
            a: "Navigate to the Loans section, select a product, and enter your amount. If your savings don't fully cover the loan, you'll need to invite other members to guarantee you."
        },
        {
            q: "What is the 'Amendment' status on my loan?",
            a: "This means the SACCO Admin has reviewed your request and suggested a different amount or term. You can accept these new terms to proceed or cancel the application."
        },
        {
            q: "How long does it take for my payment to reflect?",
            a: "To ensure accurate reconciliation with the SACCO's bank records, payment balances are typically updated by the end of the day. You can check your dashboard in the evening to see your new balance."
        },
        {
            q: "Can I use my savings as collateral?",
            a: "Yes! Most saving products in Sprout can be used to self-guarantee your own loan, depending on the SACCO's specific rules."
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 space-y-8 mx-auto">
            {/* Hero Section */}
            <div className="text-center space-y-4 py-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#236c2e]/10 text-[#236c2e] text-xs font-semibold uppercase tracking-wider">
                    <HelpCircle className="w-4 h-4" />
                    Support Center
                </div>
                <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                    How can we help you grow?
                </h1>
                <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                    Everything you need to know about managing your savings and loans with Sprout SACCO.
                </p>
            </div>

            {/* Quick Link Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickLinks.map((link, idx) => (
                    <Card key={idx} className="hover:border-[#236c2e] transition-all hover:shadow-md cursor-pointer group">
                        <CardHeader className="space-y-4">
                            <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-[#236c2e] group-hover:bg-[#236c2e] group-hover:text-white transition-colors">
                                <link.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">{link.title}</CardTitle>
                                <CardDescription className="text-xs leading-relaxed">{link.desc}</CardDescription>
                            </div>
                        </CardHeader>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* FAQs Section */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                        <ShieldCheck className="w-6 h-6 text-[#236c2e]" />
                        Frequently Asked Questions
                    </h2>
                    <Card>
                        <CardContent className="pt-6">
                            <Accordion type="single" collapsible className="w-full">
                                {faqs.map((faq, idx) => (
                                    <AccordionItem key={idx} value={`item-${idx}`}>
                                        <AccordionTrigger className="text-left font-semibold text-slate-800 hover:text-[#236c2e]">
                                            {faq.q}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-slate-600 leading-relaxed">
                                            {faq.a}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                </div>

                {/* Contact Sidebar */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                        <MessageCircle className="w-6 h-6 text-[#236c2e]" />
                        Contact Us
                    </h2>
                    <Card className="bg-[#236c2e] text-white border-none shadow-lg">
                        <CardHeader>
                            <CardTitle>Still have questions?</CardTitle>
                            <CardDescription className="text-white/80">
                                Our support team is here to help you with any issues.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-white/10 rounded text-center sm:text-left">
                                <Mail className="w-5 h-5 flex-shrink-0" />
                                <div className="text-sm">
                                    <p className="font-semibold">Email Support</p>
                                    <p className="opacity-80 text-xs">support@sproutsacco.com</p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-white/10 rounded text-center sm:text-left">
                                <UserCircle className="w-5 h-5 flex-shrink-0" />
                                <div className="text-sm">
                                    <p className="font-semibold">Admin Office</p>
                                    <p className="opacity-80 text-xs">Visit us during business hours</p>
                                </div>
                            </div>

                            <Button className="w-full bg-white text-[#236c2e] hover:bg-slate-100 font-semibold mt-4">
                                Open a Support Ticket
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
