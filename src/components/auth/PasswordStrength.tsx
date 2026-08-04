
'use client';

import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
    password?: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
    const getStrength = (password: string | undefined) => {
        if (!password) return 0;
        let score = 0;
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        return score;
    };

    const strength = getStrength(password);
    const label = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strength];

    return (
        <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div className={cn(
                    "h-full rounded-full transition-all duration-300",
                    strength <= 1 && "w-[20%] bg-red-500",
                    strength === 2 && "w-[40%] bg-orange-500",
                    strength === 3 && "w-[60%] bg-yellow-500",
                    strength === 4 && "w-[80%] bg-lime-500",
                    strength >= 5 && "w-[100%] bg-green-500"
                )} />
            </div>
            <span className={cn(
                "text-xs font-medium",
                strength <= 1 && "text-red-500",
                strength === 2 && "text-orange-500",
                strength === 3 && "text-yellow-500",
                strength === 4 && "text-lime-500",
                strength >= 5 && "text-green-500"
            )}>
                {password && label}
            </span>
        </div>
    );
}
