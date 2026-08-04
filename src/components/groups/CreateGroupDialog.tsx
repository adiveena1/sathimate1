'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { CreateGroupForm } from './CreateGroupForm';

interface CreateGroupDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateGroupDialog({
    open,
    onOpenChange,
}: CreateGroupDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[625px] max-h-screen overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create a New Group</DialogTitle>
                    <DialogDescription>
                        Set the destination, dates, and vibe for your trip. Your group will
                        be public for others to join.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <CreateGroupForm onSuccess={() => onOpenChange(false)} />
                </div>
            </DialogContent>
        </Dialog>
    );
}