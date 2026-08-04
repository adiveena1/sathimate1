
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { CreatePlanForm } from './CreatePlanForm';

interface CreatePlanModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreatePlanModal({ open, onOpenChange }: CreatePlanModalProps) {
    const handleSuccess = () => {
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Create a New Travel Plan</DialogTitle>
                    <DialogDescription>
                        Set the destination, dates, and vibe for your trip. Your plan will be public for others to see and request to join.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <CreatePlanForm onSuccess={handleSuccess} />
                </div>
            </DialogContent>
        </Dialog>
    );
}

