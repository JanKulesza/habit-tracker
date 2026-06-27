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
            <div className="flex justify-between items-center">
                <h2 className="font-medium">{title}</h2>
                <Icon className={iconColor ?? "text-primary"} />
            </div>
            <p className="text-2xl text-foreground font-medium">{text}</p>
            <p>{description}</p>
        </div>
    )
}
