import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '../Icon';
import { LoadingRing } from '../LoadingRing';
import { screen } from '../screenStyles';

export interface LoadingStepsProps {
    title: string;
    text: string;
    steps: string[];
    /** Time each step stays «in progress». */
    stepMs?: number;
    /** Pause after the last step is checked, before `onDone`. */
    endMs?: number;
    /** Glyph drawn inside the big ring; leave out for a bare ring. */
    icon?: string;
    onDone: () => void;
}

/** Waiting screen: big ring, short explanation and a checklist that ticks off one step at a time. */
export const LoadingSteps: React.FC<LoadingStepsProps> = ({ title, text, steps, stepMs = 1400, endMs = 500, icon, onDone }) => {
    const [done, setDone] = useState(0);
    const finish = useRef(onDone);
    finish.current = onDone;

    useEffect(() => {
        const timers = steps.map((_, i) => setTimeout(() => setDone(i + 1), (i + 1) * stepMs));
        const end = setTimeout(() => finish.current(), steps.length * stepMs + endMs);
        return () => [...timers, end].forEach(clearTimeout);
    }, [steps, stepMs, endMs]);

    return (
        <div role="status" aria-live="polite" style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center', textAlign: 'center', paddingTop: 48 }}>
            <div style={{ position: 'relative', width: 112, height: 112, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LoadingRing size={112} />
                {icon && (
                    <div style={{ ...screen.ico('var(--brand-fg)', 72), position: 'absolute' }}>
                        <Icon name={icon} size={36} />
                    </div>
                )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <h1 style={screen.h1}>{title}</h1>
                <p style={{ ...screen.p, maxWidth: 300 }}>{text}</p>
            </div>
            <div style={{ ...screen.card, width: '100%', textAlign: 'left', gap: 14 }}>
                {steps.map((label, i) => {
                    const state = i < done ? 'done' : i === done ? 'active' : 'todo';
                    return (
                        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: state === 'todo' ? 0.45 : 1, transition: 'opacity var(--dur-base)' }}>
                            {state === 'done' ? (
                                <Icon name="check_circle" filled style={{ color: 'var(--brand-fg)' }} />
                            ) : state === 'active' ? (
                                <LoadingRing size={24} />
                            ) : (
                                <Icon name="radio_button_unchecked" style={{ color: 'var(--text-muted)' }} />
                            )}
                            <span style={{ fontSize: 14, fontWeight: state === 'active' ? 700 : 500 }}>{label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
