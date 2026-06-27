import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent } from "react";

interface InfoBoxProps {
    title: string;
    text: string,
    description: string,
    Icon: ForwardRefExoticComponent<Omit<LucideProps, "ref">>,
    iconColor?: string
}

export default function InfoBox({ title, text, description, Icon, iconColor }: InfoBoxProps) {
    return (
        <div className="space-y-2 border rounded-lg p-6 text-sm text-muted-foreground">
            <p className="flex justify-between">
                <span className="font-medium">{title}</span>
                <Icon className={iconColor ?? "text-primary"} />
            </p>
            <p className="text-xl text-foreground font-medium">{text}</p>
            <p>{description}</p>
        </div>
    )
}
