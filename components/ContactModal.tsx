"use client";

import { useState, useEffect } from "react";
import { X, Mail, Copy, Check } from "lucide-react";
import { CONTACT_EMAIL } from "@/lib/globals";

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
    const [mailtoClicked, setMailtoClicked] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleClose = () => {
        onClose();
        setMailtoClicked(false);
        setCopied(false);
    };

    const handleMailtoClick = () => {
        setTimeout(() => {
            setMailtoClicked(true);
        }, 50);
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(CONTACT_EMAIL ? CONTACT_EMAIL : "Error loading email address.");
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch (err) {
            console.error("Failed to copy email address:", err);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                handleClose();
            }
        };

        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
            onClick={(e) => {
                if (e.target === e.currentTarget) handleClose();
            }}
        >
            <div className="relative w-full max-w-md rounded-2xl bg-surface-card p-6 shadow-2xl border border-accent-subtle animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-accent-subtle">
                    <h2 id="contact-modal-title" className="text-heading text-lg text-foreground">
                        Contact Us
                    </h2>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="p-1.5 rounded-full text-text-secondary hover:text-accent hover:bg-background-secondary transition-colors cursor-pointer"
                        aria-label="Close modal"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="py-2">
                    {!mailtoClicked ? (
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="w-12 h-12 rounded-full bg-accent-subtle flex items-center justify-center text-accent">
                                <Mail className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-body text-foreground font-medium">
                                    Have a story, question, or feedback?
                                </p>
                                <p className="text-meta text-text-secondary mt-1">
                                    Reach out to our editorial team directly via email.
                                </p>
                            </div>
                            <a
                                href={`mailto:${CONTACT_EMAIL}`}
                                onClick={handleMailtoClick}
                                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-accent hover:bg-accent-dark text-white font-medium shadow-sm transition-colors cursor-pointer mt-2"
                            >
                                <Mail className="h-4 w-4" />
                                Send an Email
                            </a>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3 text-center py-2 animate-in fade-in duration-200">
                            <div className="w-12 h-12 rounded-full bg-accent-subtle flex items-center justify-center text-accent mb-1">
                                {copied ? <Check className="h-6 w-6 text-green-500" /> : <Mail className="h-6 w-6" />}
                            </div>

                            <p className="text-body text-foreground">
                                If your email client doesn&apos;t open, please copy our email address manually
                            </p>

                            <div
                                onClick={handleCopy}
                                className="w-full mt-2 p-3 rounded-xl bg-background-secondary/60 hover:bg-background-secondary border border-accent-subtle/60 flex items-center justify-between cursor-pointer group transition-colors"
                                title="Click to copy email address"
                            >
                                <span className="text-xs font-mono text-foreground select-all break-all text-left">
                                    {CONTACT_EMAIL}
                                </span>
                                <span className="text-xs text-accent font-medium flex items-center gap-1 shrink-0 ml-2">
                                    {copied ? (
                                        <>
                                            <Check className="h-3.5 w-3.5 text-green-500" />
                                            <span className="text-green-500">Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                                            <span>Copy</span>
                                        </>
                                    )}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
