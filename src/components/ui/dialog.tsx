import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface DialogProps {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    children?: React.ReactNode
}

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode
}

interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode
}

interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode
}

interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    children?: React.ReactNode
}

interface DialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
    children?: React.ReactNode
}

interface DialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode
    asChild?: boolean
}

const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 bg-black/80 animate-in fade-in-0">
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                {children}
            </div>
        </div>
    )
}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 animate-in fade-in-0 zoom-in-95 slide-in-from-left-1/2 slide-in-from-top-[48%] sm:rounded-lg",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        )
    }
)
DialogContent.displayName = "DialogContent"

const DialogHeader = ({ className, ...props }: DialogHeaderProps) => (
    <div
        className={cn(
            "flex flex-col space-y-1.5 text-center sm:text-left",
            className
        )}
        {...props}
    />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({ className, ...props }: DialogFooterProps) => (
    <div
        className={cn(
            "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
            className
        )}
        {...props}
    />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(
    ({ className, ...props }, ref) => (
        <h2
            ref={ref}
            className={cn(
                "text-lg font-semibold leading-none tracking-tight",
                className
            )}
            {...props}
        />
    )
)
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
    ({ className, ...props }, ref) => (
        <p
            ref={ref}
            className={cn("text-sm text-muted-foreground", className)}
            {...props}
        />
    )
)
DialogDescription.displayName = "DialogDescription"

const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
    ({ className, children, asChild = false, ...props }, ref) => {
        const Comp = asChild ? React.Fragment : "button"
        return (
            <Comp ref={ref} className={cn(className)} {...props}>
                {children}
            </Comp>
        )
    }
)
DialogTrigger.displayName = "DialogTrigger"

const DialogClose = ({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) => (
    <button
        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        onClick={() => onOpenChange?.(false)}
    >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
    </button>
)

export {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogClose,
} 