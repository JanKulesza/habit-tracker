import { Checkbox } from "@/components/ui/checkbox"
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import Link from "next/link";
import { Controller, useFormContext } from "react-hook-form";

interface FormCheckBoxProps {
    name: string;
    label: string;
    description?: string;
    defaultChecked?: boolean;
    link?: string;
}

export function FormCheckBox(props: FormCheckBoxProps) {
    const { control } = useFormContext();
    return (
        <Controller
            name={props.name}
            control={control}
            render={({field, fieldState }) => (
                <FieldGroup>
                    <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                        <Checkbox
                            className="rounded-xl h-5 w-5"
                            defaultChecked={props.defaultChecked}
                            aria-invalid={fieldState.invalid}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            name={field.name}
                        />
                        <FieldContent className="mt-0.5">
                            <FieldLabel htmlFor={props.name}>
                                {props.label}
                            </FieldLabel>
                            {props.description && (
                                <FieldDescription>
                                    {props.description}
                                    {props.link && (
                                        <Link href={props.link} className="text-primary underline cursor-pointer ml-1">
                                            {props.link ? "Read more" : ""}
                                        </Link>
                                    )}
                                </FieldDescription>
                            )}
                            {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                        </FieldContent>
                    </Field>
                </FieldGroup>
            )
            } />
    )
}
